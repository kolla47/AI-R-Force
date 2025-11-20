# Setup Scripts - Usage Guide

## Prerequisites

1. **Environment Variables Setup**
   
   Ensure your `.env` file in the root directory contains all required variables:
   
   ```bash
   # Azure OpenAI Configuration for Generation
   REACT_APP_AZURE_GENERATION_API_KEY=your-generation-api-key
   REACT_APP_AZURE_GENERATION_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
   REACT_APP_AZURE_GENERATION_DEPLOYMENT=gpt-4o-mini
   
   # Azure OpenAI Configuration for Embeddings
   REACT_APP_AZURE_EMBEDDING_API_KEY=your-embedding-api-key
   REACT_APP_AZURE_EMBEDDING_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
   REACT_APP_AZURE_EMBEDDING_DEPLOYMENT=text-embedding-3-small
   
   # Azure AI Search Configuration
   REACT_APP_AZURE_SEARCH_ENDPOINT=https://your-search-service.search.windows.net
   REACT_APP_AZURE_SEARCH_INDEX=ai-r-kb-index
   REACT_APP_AZURE_SEARCH_KEY=your-search-admin-key
   ```

2. **Install Dependencies**
   
   ```bash
   npm install
   ```

## Running the Setup Scripts

### Step 1: Create the Azure AI Search Index

This creates the vector search index with the proper schema.

```bash
node src/Scripts/createIndex.js
```

**What it does:**
- Reads index schema from `src/SupportData/kb-index-struc.json`
- Creates the index in Azure AI Search
- Configures vector search with HNSW algorithm

**Expected Output:**
```
🔧 Creating index: ai-r-kb-index
📍 Endpoint: https://your-search.search.windows.net
✅ Index created successfully!
   Name: ai-r-kb-index
   Fields: 6
```

### Step 2: Generate Embeddings and Upload KB Documents

This generates embeddings for all KB articles and uploads them to Azure AI Search with automatic verification.

```bash
node src/Scripts/generate-and-upload.js
```

**What it does:**
- Reads KB documents from `src/SupportData/KB.json`
- Generates embeddings using Azure OpenAI `text-embedding-3-small`
- Uploads documents with vectors to Azure AI Search
- **Automatically verifies** documents are in the index (up to 3 retry attempts)

**Expected Output:**
```
📁 Loaded 12 KB documents from KB.json
🔧 Using embedding deployment: text-embedding-3-small
🔧 Using search index: ai-r-kb-index
🔤 Generating embeddings...
✅ Generated 12 embeddings.
⬆️ Uploading to Azure AI Search...
📊 Upload Results:
  - Total documents: 12
  - Succeeded: 12
  - Failed: 0
✅ Upload operation completed successfully!

🔎 Verifying documents in index...
🔍 Verification attempt 1/3...
   Found 12/12 documents in index
✅ Verification successful! All documents are in the index.

🎉 Success! All documents uploaded and verified in Azure AI Search!
```

**Retry Logic:**
The script automatically verifies documents are indexed and retries up to 3 times with 2-second delays if they're not immediately available (indexing can take a few seconds).

## Troubleshooting

### Error: Missing environment variables
```
❌ Error: Missing Azure OpenAI embedding environment variables.
   Please ensure the following are set in .env:
   - REACT_APP_AZURE_EMBEDDING_API_KEY
   - REACT_APP_AZURE_EMBEDDING_ENDPOINT
   - REACT_APP_AZURE_EMBEDDING_DEPLOYMENT
```

**Solution:** Check that your `.env` file exists in the root directory and contains all required variables.

### Error: Cannot find module
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'dotenv'
```

**Solution:** Run `npm install` to install all dependencies.

### Error: Index already exists
```
❌ Error creating index: { error: { code: 'ResourceAlreadyExists' } }
```

**Solution:** The index already exists. You can either:
- Delete the existing index in Azure Portal and run the script again
- Skip this step and proceed to generate-and-upload.js

## Notes

- Run `createIndex.js` only **once** during initial setup
- Run `generate-and-upload.js` whenever you want to update KB articles in the search index
- Both scripts validate environment variables before running
- The scripts use ES modules (`import` syntax), enabled by `"type": "module"` in package.json
