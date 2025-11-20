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

  await searchClient.uploadDocuments(docsWithVectors).catch((err) => {
    console.error("❌ Error uploading documents:", err);
    throw err;
  });

  console.log("✅ Successfully uploaded all documents to Azure AI Search!");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
