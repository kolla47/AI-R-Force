import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

// Get current directory for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load index structure from JSON file
const indexStructPath = join(__dirname, '../SupportData/kb-index-struc.json');
const indexStructure = JSON.parse(readFileSync(indexStructPath, 'utf-8'));

export default async function createIndexRest() {
  const searchEndpoint = process.env.REACT_APP_AZURE_SEARCH_ENDPOINT;
  const searchKey = process.env.REACT_APP_AZURE_SEARCH_KEY;
  const indexName = process.env.REACT_APP_AZURE_SEARCH_INDEX || 'ai-r-kb-index';

  if (!searchEndpoint || !searchKey) {
    console.error('❌ Error: Missing required environment variables.');
    console.error('   Please ensure REACT_APP_AZURE_SEARCH_ENDPOINT and REACT_APP_AZURE_SEARCH_KEY are set in .env');
    process.exit(1);
  }

  const url = `${searchEndpoint}/indexes/${indexName}?api-version=2024-07-01`;
  
  // Use the index structure from the JSON file
  const payload = {
    name: indexStructure.name,
    fields: indexStructure.fields,
    vectorSearch: indexStructure.vectorSearch,
    corsOptions: indexStructure.corsOptions,
  };

  console.log(`🔧 Creating index: ${payload.name}`);
  console.log(`📍 Endpoint: ${searchEndpoint}`);

  const response = await fetch(url.trim(), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "api-key": searchKey,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("❌ Error creating index:", data);
    process.exit(1);
  } else {
    console.log("✅ Index created successfully!");
    console.log(`   Name: ${payload.name}`);
    console.log(`   Fields: ${payload.fields.length}`);
  }
}

createIndexRest();
