import { Box, Grid } from "@mui/material";
import { useState } from "react";
import ArticlesSection from "../Components/KBSuggestion/ArticleSection";
import CaseForm from "../Components/KBSuggestion/CaseForm";
import { AzureOpenAI } from "openai";
import { SearchClient, AzureKeyCredential } from "@azure/search-documents";
import ConsoleLog from "../Components/Common/ConsoleLog";

// Azure Search Configuration
const searchClient = new SearchClient(
  process.env.REACT_APP_AZURE_SEARCH_ENDPOINT,
  process.env.REACT_APP_AZURE_SEARCH_INDEX,
  new AzureKeyCredential(process.env.REACT_APP_AZURE_SEARCH_KEY)
);

// Embedding Client Configuration
const embedClient = new AzureOpenAI({
  apiKey: process.env.REACT_APP_AZURE_EMBEDDING_API_KEY,
  endpoint: process.env.REACT_APP_AZURE_EMBEDDING_ENDPOINT,
  apiVersion: "2024-04-01-preview",
  deployment: process.env.REACT_APP_AZURE_EMBEDDING_DEPLOYMENT,
  dangerouslyAllowBrowser: true,
});

// Generation Client Configuration
const genClient = new AzureOpenAI({
  apiKey: process.env.REACT_APP_AZURE_GENERATION_API_KEY,
  endpoint: process.env.REACT_APP_AZURE_GENERATION_ENDPOINT,
  apiVersion: "2024-04-01-preview",
  deployment: process.env.REACT_APP_AZURE_GENERATION_DEPLOYMENT,
  dangerouslyAllowBrowser: true,
});

// System prompt with few-shot examples for better AI response quality
// const systemPromptNBS = `You are an assistant for airline agents. Given input in the format: subject##description##(RelevantKB in Markdown), analyze the user's context and the KB, then respond with the next best action the agent should take. Keep responses concise, practical, and based on the KB. Respond with only the recommended action, nothing else. Suggest additional info only if needed.`;
// System prompts for AI processing
const SYSTEM_PROMPTS = {
  STEP_BY_STEP: `You are an AI assistant helping airline agents resolve customer issues. 
    Analyze the customer context and relevant KB article, then provide clear step-by-step guidance 
    for the agent to follow.
    
    Input format: subject##description##(RelevantKB in Markdown)
    
    Your response should be practical, actionable steps in plain text format without any 
    markdown, bullets, or numbering. Focus on what the agent should do and say to resolve 
    the customer's specific situation effectively.`,
};
// Function to generate AI response with dynamic temperature
async function generateText(prompt) {
  const response = await genClient.chat.completions.create({
    messages: [
      { role: "system", content: SYSTEM_PROMPTS.STEP_BY_STEP },
      { role: "user", content: prompt },
    ],
    max_tokens: 4096,
    temperature: 0.7,
    top_p: 1,
    model: "gpt-4o-mini",
  });

  if (response?.error && response.status !== "200") {
    throw response.error;
  }

  return response.choices[0].message.content;
}

// Function to generate embedding vector for input text
async function getEmbedding(text) {
  const result = await embedClient.embeddings.create({
    input: text,
    model: "text-embedding-3-small",
  });
  return result.data[0].embedding;
}

// Hybrid search: combining vector similarity and keyword search
async function searchKnowledgeBase(vector, searchText = "", top = 5) {
  const query =
    typeof searchText === "string" && searchText.trim() !== ""
      ? searchText
      : "*";

  const response = await searchClient.search(query, {
    vector: {
      value: vector,
      kNearestNeighborsCount: top,
      fields: "vector",
    },
    select: ["id", "title", "tags", "status", "KB"],
    top,
  });

  const results = [];
  for await (const result of response.results) {
    results.push({
      ...result.document,
      score: result.score,
      snippet: result.document.KB
        ? result.document.KB.replace(/[#[\]()]/g, "").slice(0, 150) + "..."
        : "",
    });
  }

  return results;
}

// Utility function to add logs with optional delay

// Main component
export default function KBSuggestionPage() {
  const [logs, setLogs] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = async (setLogs, message, delay = 0) => {
    setLogs((prev) => [...prev, message]);
    if (delay > 0) await new Promise((res) => setTimeout(res, delay));
  };

  // Handler for case submission
  const handleCaseSubmit = async (formData) => {
    setLogs([]);
    setArticles([]);
    setLoading(true);

    const { title, description } = formData;
    const queryText = `${title} ${description}`.trim();

    try {
      // Section: Initialization
      await addLog(setLogs, "=== Section: Initialization ===");
      await addLog(setLogs, "🚀 Initializing case analysis...", 800);
      await addLog(setLogs, `📝 Processing case: "${title}"`, 600);

      // Section: Embedding
      await addLog(setLogs, "=== Section: Embedding ===");
      await addLog(setLogs, "🧠 Generating semantic embedding...");
      const embedding = await getEmbedding(queryText);
      await addLog(
        setLogs,
        `✅ Embedding generated. Dimension: ${embedding.length}`
      );
      await addLog(
        setLogs,
        `🔍 Preview: [${embedding
          .slice(0, 4)
          .map((v) => v.toFixed(4))
          .join(", ")}...]`,
        500
      );

      // Section: Search
      await addLog(setLogs, "=== Section: Search ===");
      await addLog(setLogs, "🌐 Performing hybrid search in knowledge base...");
      const results = await searchKnowledgeBase(embedding, queryText, 3);
      await addLog(setLogs, "⏳ Awaiting search results...", 800);

      if (results.length === 0) {
        await addLog(setLogs, "📭 No relevant articles found.");
      } else {
        await addLog(setLogs, `🎯 Found ${results.length} matching articles!`);
        results.forEach((article, idx) =>
          addLog(
            setLogs,
            `📄 [${idx + 1}] "${article.title}" (Score: ${article.score.toFixed(
              3
            )})`
          )
        );
      }

      setArticles(results);

      const relevantArticle = results[0];
      if (relevantArticle) {
        // Section: Analysis
        await addLog(setLogs, "=== Section: Analysis ===");
        await addLog(setLogs, `📖 Most relevant: "${relevantArticle.title}"`);
        await addLog(setLogs, "🤖 Generating next best action...", 600);

        const userPrompt = `${title}##${description}##${relevantArticle.KB}`;
        const nextAction = await generateText(userPrompt);
        await addLog(setLogs, "=== Section: AI Guidance ===");

        await addLog(setLogs, `${nextAction}`, 800);
      }
    } catch (error) {
      console.error("Error in KB suggestion flow:", error);
      await addLog(setLogs, `💥 Error: ${error.message}`);
      setArticles([]);
    } finally {
      await addLog(setLogs, "✅ Case analysis complete.");
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 64px)",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Grid container spacing={2} sx={{ p: 2, height: "100%" }}>
        {/* Left: Form + Articles */}
        <Grid size={7}>
          <CaseForm onSubmit={handleCaseSubmit} loading={loading} />
          <ArticlesSection articles={articles} loading={loading} />
        </Grid>

        {/* Right: Console Logs */}
        <Grid size={5}>
          <ConsoleLog logs={logs} loading={loading} />
        </Grid>
      </Grid>
    </Box>
  );
}
