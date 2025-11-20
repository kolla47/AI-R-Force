import { AzureOpenAI } from "openai";
import { SearchClient, AzureKeyCredential } from "@azure/search-documents";
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

// Get current directory for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load KB documents from JSON file
const kbDataPath = join(__dirname, '../SupportData/KB.json');
const documents = JSON.parse(readFileSync(kbDataPath, 'utf-8'));

// Helper function to verify documents in index
async function verifyDocumentsInIndex(searchClient, expectedCount, maxRetries = 3, delayMs = 2000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔍 Verification attempt ${attempt}/${maxRetries}...`);
      
      const searchResults = await searchClient.search("*", {
        select: ["id"],
        top: 100,
        includeTotalCount: true
      });

      const actualCount = searchResults.count;
      console.log(`   Found ${actualCount}/${expectedCount} documents in index`);

      if (actualCount >= expectedCount) {
        console.log('✅ Verification successful! All documents are in the index.');
        return true;
      }

      if (attempt < maxRetries) {
        console.log(`   ⏳ Waiting ${delayMs/1000}s for indexing to complete...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    } catch (error) {
      console.error(`   ⚠️ Verification attempt ${attempt} failed:`, error.message);
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  return false;
}

async function main() {
  // Validate environment variables
  const embeddingApiKey = process.env.REACT_APP_AZURE_EMBEDDING_API_KEY;
  const embeddingEndpoint = process.env.REACT_APP_AZURE_EMBEDDING_ENDPOINT;
  const embeddingDeployment = process.env.REACT_APP_AZURE_EMBEDDING_DEPLOYMENT;
  const searchEndpoint = process.env.REACT_APP_AZURE_SEARCH_ENDPOINT;
  const searchKey = process.env.REACT_APP_AZURE_SEARCH_KEY;
  const searchIndex = process.env.REACT_APP_AZURE_SEARCH_INDEX || 'ai-r-kb-index';

  if (!embeddingApiKey || !embeddingEndpoint || !embeddingDeployment) {
    console.error('❌ Error: Missing Azure OpenAI embedding environment variables.');
    console.error('   Please ensure the following are set in .env:');
    console.error('   - REACT_APP_AZURE_EMBEDDING_API_KEY');
    console.error('   - REACT_APP_AZURE_EMBEDDING_ENDPOINT');
    console.error('   - REACT_APP_AZURE_EMBEDDING_DEPLOYMENT');
    process.exit(1);
  }

  if (!searchEndpoint || !searchKey) {
    console.error('❌ Error: Missing Azure AI Search environment variables.');
    console.error('   Please ensure the following are set in .env:');
    console.error('   - REACT_APP_AZURE_SEARCH_ENDPOINT');
    console.error('   - REACT_APP_AZURE_SEARCH_KEY');
    process.exit(1);
  }

  console.log('📁 Loaded', documents.length, 'KB documents from KB.json');
  console.log('🔧 Using embedding deployment:', embeddingDeployment);
  console.log('🔧 Using search index:', searchIndex);

  // 1. Initialize Azure OpenAI Embeddings Client
  const openaiClient = new AzureOpenAI({
    endpoint: embeddingEndpoint,
    apiKey: embeddingApiKey,
    deployment: embeddingDeployment,
    apiVersion: "2024-02-01",
  });

  // 2. Initialize Azure AI Search Client
  const searchClient = new SearchClient(
    searchEndpoint,
    searchIndex,
    new AzureKeyCredential(searchKey)
  );

  // 3. Generate embeddings
  console.log("🔤 Generating embeddings...");

  const textsToEmbed = documents.map((doc) => doc.KB); // Use KB content for embedding

  const result = await openaiClient.embeddings.create({
    input: textsToEmbed,
    model: embeddingDeployment,
  });

  if (!result.data || result.data.length === 0) {
    throw new Error("No embeddings returned from Azure OpenAI.");
  }

  // Assign vectors to documents
  const docsWithVectors = documents.map((doc, i) => ({
    ...doc,
    vector: result.data[i].embedding, // assign generated vector
  }));

  console.log(`✅ Generated ${docsWithVectors.length} embeddings.`);

  // 4. Upload to Azure AI Search
  console.log("⬆️ Uploading to Azure AI Search...");

  const uploadResult = await searchClient.uploadDocuments(docsWithVectors);
  
  // Check upload result details
  console.log(`📊 Upload Results:
  - Total documents: ${uploadResult.results.length}
  - Succeeded: ${uploadResult.results.filter(r => r.succeeded).length}
  - Failed: ${uploadResult.results.filter(r => !r.succeeded).length}`);

  // Show any failures
  const failures = uploadResult.results.filter(r => !r.succeeded);
  if (failures.length > 0) {
    console.error("❌ Failed documents:");
    failures.forEach(failure => {
      console.error(`   - ${failure.key}: ${failure.errorMessage}`);
    });
    throw new Error(`${failures.length} documents failed to upload`);
  }

  console.log("✅ Upload operation completed successfully!");

  // 5. Verify documents are in the index with retry logic
  console.log("\n🔎 Verifying documents in index...");
  const verified = await verifyDocumentsInIndex(searchClient, documents.length);

  if (!verified) {
    console.error("\n❌ Verification failed: Documents not found in index after multiple attempts.");
    console.error("   Possible issues:");
    console.error("   - Indexing is taking longer than expected");
    console.error("   - Documents were uploaded to wrong index");
    console.error("   - Index configuration issue");
    console.error("\n   Please check Azure Portal manually or wait a few more minutes and run verify-index.js");
    process.exit(1);
  }

  console.log("\n🎉 Success! All documents uploaded and verified in Azure AI Search!");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
