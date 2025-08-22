import { Box, Grid, LinearProgress, Typography, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import ArticlesSection from "../Components/KBSuggestion/ArticleSection";
import CaseForm from "../Components/KBSuggestion/CaseForm";
import AIGuidanceSection from "../Components/KBSuggestion/AIGuidanceSection";
import { AzureOpenAI } from "openai";
import { SearchClient, AzureKeyCredential } from "@azure/search-documents";
import ConsoleLog from "../Components/Common/ConsoleLog";
import guidanceRules from "../guidanceDisplayRules";

const searchClient = new SearchClient(
  process.env.REACT_APP_AZURE_SEARCH_ENDPOINT,
  process.env.REACT_APP_AZURE_SEARCH_INDEX,
  new AzureKeyCredential(process.env.REACT_APP_AZURE_SEARCH_KEY)
);

const embedClient = new AzureOpenAI({
  apiKey: process.env.REACT_APP_AZURE_EMBEDDING_API_KEY,
  endpoint: process.env.REACT_APP_AZURE_EMBEDDING_ENDPOINT,
  apiVersion: "2024-04-01-preview",
  deployment: process.env.REACT_APP_AZURE_EMBEDDING_DEPLOYMENT,
  dangerouslyAllowBrowser: true,
});

const genClient = new AzureOpenAI({
  apiKey: process.env.REACT_APP_AZURE_GENERATION_API_KEY,
  endpoint: process.env.REACT_APP_AZURE_GENERATION_ENDPOINT,
  apiVersion: "2024-04-01-preview",
  deployment: process.env.REACT_APP_AZURE_GENERATION_DEPLOYMENT,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPTS = {
  STEP_BY_STEP: `You are an AI assistant helping airline agents resolve customer issues. 
    Analyze the provided case (subject and description) alongside the retrieved KB article. 
    Your task is to determine whether the KB article is relevant to the case.
    Do NOT include any statement like "Guidance for Agent" 

    Input format: subject%%description%%(RelevantKB in Markdown)%%specific rules(optional)(must be followed, overrides existing)

    If the KB article IS relevant:
      - Provide clear, practical guidance for the agent based on the KB article.
      - Keep it conversational and action-oriented.
      - Do NOT include any statement like "The article is relevant".

    If the KB article IS NOT relevant:
      - Clearly state: "The retrieved KB article does not appear relevant to this case."
      - Briefly explain why (e.g., mismatch in issue type, passenger status, flight condition).
      - Do not fabricate steps from irrelevant information.

    Always respond with only the guidance in markdown format — nothing else.`,
};

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

async function getEmbedding(text) {
  const result = await embedClient.embeddings.create({
    input: text,
    model: "text-embedding-3-small",
  });
  return result.data[0].embedding;
}

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

export default function KBSuggestionPage({ isAdminMode = true }) {
  const [logs, setLogs] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nbs, setNbs] = useState("");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [hasQueryParams, setHasQueryParams] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const addLog = async (setLogs, message, delay = 0) => {
    setLogs((prev) => [...prev, message]);
    if (delay > 0) await new Promise((res) => setTimeout(res, delay));
  };

  const updateProgress = (step, progressValue) => {
    setCurrentStep(step);
    setProgress(progressValue);
  };

  const animateProgress = (startValue, endValue, duration) => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = startValue + (endValue - startValue) * progress;
      setProgress(Math.round(currentValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  const handleCaseSubmit = async (formData) => {
    setLogs([]);
    setArticles([]);
    setNbs("");
    setLoading(true);
    setProgress(0);
    setCurrentStep("");

    const { title, description } = formData;
    const queryText = `${title} ${description}`.trim();

    try {
      if (isAdminMode) {
        await addLog(setLogs, "=== Section: Initialization ===");
        await addLog(setLogs, "🚀 Initializing case analysis...", 800);
        await addLog(setLogs, `📝 Processing case: "${title}"`, 600);
      } else {
        updateProgress("Initializing case analysis...", 5);
        animateProgress(5, 15, 800);
        await new Promise((res) => setTimeout(res, 800));
      }

      if (isAdminMode) {
        await addLog(setLogs, "=== Section: Embedding ===");
        await addLog(setLogs, "🧠 Generating semantic embedding...");
      } else {
        updateProgress("Generating semantic embedding...", 15);
        animateProgress(15, 25, 1000);
      }

      const embedding = await getEmbedding(queryText);

      if (isAdminMode) {
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
      } else {
        updateProgress("Searching knowledge base...", 25);
        animateProgress(25, 35, 800);
      }

      if (isAdminMode) {
        await addLog(setLogs, "=== Section: Search ===");
        await addLog(
          setLogs,
          "🌐 Performing hybrid search in knowledge base..."
        );
        await addLog(setLogs, "⏳ Awaiting search results...", 800);
      } else {
        updateProgress("Analyzing results...", 35);
        animateProgress(35, 60, 800);
        await new Promise((res) => setTimeout(res, 800));
      }

      const results = await searchKnowledgeBase(embedding, queryText, 3);

      if (isAdminMode) {
        if (results.length === 0) {
          await addLog(setLogs, "📭 No relevant articles found.");
        } else {
          await addLog(
            setLogs,
            `🎯 Found ${results.length} matching articles!`
          );
          results.forEach((article, idx) =>
            addLog(
              setLogs,
              `📄 [${idx + 1}] "${
                article.title
              }" (Score: ${article.score.toFixed(3)})`
            )
          );
        }
      } else {
        updateProgress("Generating AI Guidance", 60);
        animateProgress(60, 85, 1200);
      }

      setArticles(results);

      const relevantArticle = results[0];
      if (relevantArticle) {
        if (isAdminMode) {
          await addLog(setLogs, "=== Section: Analysis ===");
          await addLog(setLogs, `📖 Most relevant: "${relevantArticle.title}"`);
          await addLog(setLogs, "🤖 Generating next best action...", 600);
        } else {
          updateProgress("Finalizing recommendations...", 85);
          animateProgress(85, 100, 600);
          await new Promise((res) => setTimeout(res, 600));
        }

        const userPrompt = `${title}%%${description}%%${relevantArticle.KB}%%${guidanceRules}`;
        const nextAction = await generateText(userPrompt);
        setNbs(nextAction);

        if (isAdminMode) {
          await addLog(setLogs, "=== Section: AI Guidance ===");
          await addLog(
            setLogs,
            "✅ AI guidance generated and displayed above!",
            400
          );
        } else {
          updateProgress("Complete!", 100);
          await new Promise((res) => setTimeout(res, 400));
        }
      }
    } catch (error) {
      console.error("Error in KB suggestion flow:", error);
      if (isAdminMode) {
        await addLog(setLogs, `💥 Error: ${error.message}`);
      } else {
        updateProgress("Error occurred", 0);
      }
      setArticles([]);
    } finally {
      if (isAdminMode) {
        await addLog(setLogs, "✅ Case analysis complete.");
      }
      setLoading(false);
    }
  };

  // Check for query parameters on component mount
  useEffect(() => {
    const title = searchParams.get("title");
    const description = searchParams.get("description");
    console.log("Query Params:", title, description);
    if (title && description) {
      setHasQueryParams(true);
      // Automatically submit the form with query params
      handleCaseSubmit({ title, description });
    } else {
      setHasQueryParams(false);
    }
  }, [location.search]);

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
        <Grid size={7}>
          {/* Only render CaseForm if there are no query params */}
          {!hasQueryParams && (
            <CaseForm onSubmit={handleCaseSubmit} loading={loading} />
          )}

          {!isAdminMode && loading && (
            <Paper sx={{ p: 3, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Processing Your Request
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {currentStep}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
                {progress}%
              </Typography>
            </Paper>
          )}

          <ArticlesSection articles={articles} loading={loading} />
        </Grid>

        <Grid size={5}>
          <AIGuidanceSection nbs={nbs} loading={loading} />
          {isAdminMode && <ConsoleLog logs={logs} loading={loading} />}
        </Grid>
      </Grid>
    </Box>
  );
}
