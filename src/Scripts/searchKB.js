import { AzureOpenAI } from "openai";
import { SearchClient, AzureKeyCredential } from "@azure/search-documents";

// Azure Configuration
const endpoint = "https://ai-r-foundry.cognitiveservices.azure.com/";
const searchEndpoint = "https://ai-r-search.search.windows.net";
const indexName = "kb-index";
const apiKey =
  "";
const searchKey = "";
const deployment = "text-embedding-3-small"; // or your actual deployment name
const apiVersion = "2024-04-01-preview";
const embeddingModel = "text-embedding-3-large"; // must match training

// Initialize clients
const openaiClient = new AzureOpenAI({
  endpoint,
  apiKey,
  deployment,
  apiVersion,
});

const searchClient = new SearchClient(
  searchEndpoint,
  indexName,
  new AzureKeyCredential(searchKey)
);

export async function searchKnowledgeBase(title, description, top = 3) {
  try {
    // Combine title and description into one query
    const queryText = `${title.trim()}. ${description.trim()}`;
    console.log("🔍 Searching for:", queryText);

    // Step 1: Generate embedding for the query
    const response = await openaiClient.embeddings.create({
      input: [queryText],
      model: embeddingModel,
    });

    const queryVector = response.data[0].embedding;
    console.log("✅ Generated query embedding");

    // Step 2: Perform vector + keyword hybrid search
    const searchResults = await searchClient.search({
      search: queryText, // keyword search
      vector: {
        value: queryVector,
        k: top,
        fields: "vector", // field name in your index
      },
      select: ["id", "title", "tags", "status", "KB"], // return only needed fields
      top,
    });

    const results = [];
    for await (const result of searchResults.results) {
      results.push({
        id: result.document.id,
        title: result.document.title,
        tags: result.document.tags,
        score: result.score, // relevance score
        KB: result.document.KB,
      });
    }

    console.log(`🎯 Found ${results.length} matches`);
    return results;
  } catch (err) {
    console.error("❌ Search failed:", err);
    throw new Error("Failed to search knowledge base: " + err.message);
  }
}
