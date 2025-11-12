// src/pages/KBGeneratorPage.jsx
import React, { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import ControlPanel from "../Components/KBGenerator/ControlPanel";
import ResultsPanel from "../Components/KBGenerator/ResultsPanel";
import DataPreviewDialog from "../Components/KBGenerator/DataPreviewDialog";
import KBDialog from "../Components/KBGenerator/KBDialog";
import { AzureOpenAI } from "openai";
import ConsoleLog from "../Components/Common/ConsoleLog";

// ========================================================================================
// CONFIGURATION & CONSTANTS
// ========================================================================================

const AI_CONFIG = {
  MODEL: "gpt-4o-mini",
  MAX_TOKENS: 4096,
  TEMPERATURE: 0.7,
  TOP_P: 1,
  API_VERSION: "2024-04-01-preview",
};

const PROCESSING_DELAYS = {
  STANDARD: 800,
  EXTENDED: 1000,
  LONG: 1200,
};

const DEFAULT_THRESHOLD = 5;

// System prompts for AI processing
const SYSTEM_PROMPTS = {
  CATEGORIZATION: `You are an AI model trained to analyze resolved airline customer service cases. 
    You will receive a list of case objects in JSON format. Each case contains details such as ID, title, 
    description, flight, route, resolution, compensations, and activities. Your task is to categorize these 
    cases based on the nature of the issue (e.g., Denied Boarding, Staff Behavior, Billing Issue, Flight Delay).
    
    Return a serialized list of JSON objects, each containing:
    - categoryId: a short unique identifier for the category (e.g., 'DB', 'SB', 'IB', 'FD')
    - categoryName: a descriptive name for the category (e.g., 'Denied Boarding', 'Staff Behavior')
    - caseIds: an array of case IDs that belong to this category
    
    If no categorization is possible, return an empty string. Your response must be strictly 
    serialized JSON format and contain only the categorized output.`,

  KB_GENERATION: `You are an AI model creating practical resolution guides for airline customer service agents. 
    Analyze the provided resolved cases and create a step-by-step guide for handling similar future cases.
    
    Structure your guide with:
    - **Issue Overview**: Brief problem description
    - **Common Scenarios**: Situations from provided cases + 2-3 additional realistic scenarios with solutions
    - **Resolution Steps**: Clear actions based on successful case resolutions
    - **Compensation Guide**: Typical offers from resolved cases
    - **Communication Scripts**: Effective phrases from successful resolutions
    - **Escalation Rules**: When to escalate based on case patterns
    - **Examples**: Brief case examples showing successful outcomes
    
    Extract specific patterns from provided cases, then expand with industry-standard scenarios and edge case solutions.
    
    Return serialized JSON with: id, title, tags, status ('draft'), caseCount, clusterId, KB (Markdown content).`,
};

// ========================================================================================
// AZURE OPENAI CLIENT CONFIGURATION
// ========================================================================================

const azureOpenAIClient = new AzureOpenAI({
  apiKey: process.env.REACT_APP_AZURE_GENERATION_API_KEY,
  endpoint: process.env.REACT_APP_AZURE_GENERATION_ENDPOINT,
  apiVersion: AI_CONFIG.API_VERSION,
  deployment: process.env.REACT_APP_AZURE_GENERATION_DEPLOYMENT,
  dangerouslyAllowBrowser: true,
});

// ========================================================================================
// UTILITY FUNCTIONS
// ========================================================================================

/**
 * Parse AI response and handle potential formatting issues
 */
function parseAIResponse(aiResponseString) {
  try {
    const cleanedString = aiResponseString
      .replace("```json", "")
      .replace("```", "")
      .trim();

    return JSON.parse(cleanedString);
  } catch (error) {
    console.error("Error parsing AI response:", error.message);
    return [];
  }
}

/**
 * Add log message with optional delay for demo effect
 */
const addLogMessage = async (setLogs, message, delay = 0) => {
  setLogs((previousLogs) => [...previousLogs, message]);
  if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * Sanitize raw case data for AI processing
 */
export function sanitizeData(caseList) {
  return caseList.map((caseItem) => {
    const caseData = caseItem.case_data || {};
    const resolution = caseItem.resolution_note || "";
    const compensations = caseItem.compensations || [];
    const activities = caseItem.activities || [];

    return {
      id: caseData.caseid,
      title: caseData.title,
      description: caseData.description,
      flight: caseData.flight_number,
      route: `${caseData.departure} to ${caseData.arrival}`,
      resolution: resolution,
      compensations: compensations.map(
        (compensation) => `${compensation.type},${compensation.details}`
      ),
      activities: activities.map((activity) => activity.description),
    };
  });
}

// ========================================================================================
// AI GENERATION FUNCTIONS
// ========================================================================================

/**
 * Generate categories using Azure OpenAI
 */
async function generateCategories(prompt) {
  const response = await azureOpenAIClient.chat.completions.create({
    messages: [
      { role: "system", content: SYSTEM_PROMPTS.CATEGORIZATION },
      { role: "user", content: prompt },
    ],
    max_tokens: AI_CONFIG.MAX_TOKENS,
    temperature: AI_CONFIG.TEMPERATURE,
    top_p: AI_CONFIG.TOP_P,
    model: AI_CONFIG.MODEL,
  });

  if (response?.error && response.status !== "200") {
    throw response.error;
  }
  return response.choices[0].message.content;
}

/**
 * Generate KB articles using Azure OpenAI
 */
async function generateKBArticles(prompt) {
  const response = await azureOpenAIClient.chat.completions.create({
    messages: [
      { role: "system", content: SYSTEM_PROMPTS.KB_GENERATION },
      { role: "user", content: prompt },
    ],
    max_tokens: AI_CONFIG.MAX_TOKENS,
    temperature: AI_CONFIG.TEMPERATURE,
    top_p: AI_CONFIG.TOP_P,
    model: AI_CONFIG.MODEL,
  });

  if (response?.error && response.status !== "200") {
    throw response.error;
  }
  return response.choices[0].message.content;
}

// ========================================================================================
// MAIN COMPONENT
// ========================================================================================

export default function KBGeneratorPage() {
  // State management
  const [jsonData, setJsonData] = useState(null);
  const [threshold] = useState(DEFAULT_THRESHOLD);
  const [logs, setLogs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [kbArticles, setKbArticles] = useState([]);
  const [selectedKB, setSelectedKB] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // ========================================================================================
  // CORE PROCESSING FUNCTIONS
  // ========================================================================================

  /**
   * Handle file upload and JSON parsing
   */
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setJsonData(data);
        } catch (error) {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  /**
   * Generate KB articles from clustered data
   */
  const processKBGeneration = async (clusters) => {
    await addLogMessage(setLogs, "=== Section: KB Article Generation ===");
    await addLogMessage(
      setLogs,
      "Initializing KB generation process...",
      PROCESSING_DELAYS.STANDARD
    );

    // Remove generatedKBArticles array, use state directly
    await addLogMessage(
      setLogs,
      `Checking clusters which meet the threshold (${threshold} cases minimum)`,
      PROCESSING_DELAYS.EXTENDED
    );

    for (let i = 0; i < clusters.length; i++) {
      const cluster = clusters[i];
      await addLogMessage(
        setLogs,
        `Processing cluster ${i + 1}/${clusters.length}: ${
          cluster.categoryName
        } (${cluster.caseIds.length} cases)`,
        PROCESSING_DELAYS.STANDARD
      );

      if (cluster.caseIds.length >= threshold) {
        await addLogMessage(
          setLogs,
          `✅ Cluster "${cluster.categoryName}" qualifies for KB generation`,
          PROCESSING_DELAYS.STANDARD
        );

        await addLogMessage(
          setLogs,
          `Generating KB article for: ${cluster.categoryName}...`,
          PROCESSING_DELAYS.LONG
        );

        // Extract cases for current cluster
        const relevantCases = jsonData.filter((caseItem) =>
          cluster.caseIds.includes(caseItem.id)
        );

        const clusterPayload = {
          categoryName: cluster.categoryName,
          categoryId: cluster.categoryId,
          cases: relevantCases,
        };

        const kbJsonResponse = await generateKBArticles(
          JSON.stringify(clusterPayload)
        );
        await addLogMessage(
          setLogs,
          `KB article for ${cluster.categoryName} generated successfully`,
          PROCESSING_DELAYS.EXTENDED
        );

        const parsedKBData = parseAIResponse(kbJsonResponse);

        // Enrich with additional metadata
        parsedKBData.caseCount = cluster.caseIds.length;

        // Update state immediately
        setKbArticles((prev) => [...prev, parsedKBData]);

        addLogMessage(
          setLogs,
          `✅ KB article "${cluster.categoryName}" added to knowledge base`
        );
      } else {
        await addLogMessage(
          setLogs,
          `⚠️ Cluster "${cluster.categoryName}" below threshold (${cluster.caseIds.length} < ${threshold}) - skipping`,
          PROCESSING_DELAYS.STANDARD
        );
      }
    }

    addLogMessage(setLogs, "=== Section: Process Complete ===");
    addLogMessage(setLogs, `Successfully generated KB articles`);
  };

  /**
   * Main processing pipeline
   */
  const startProcessing = async () => {
    if (!jsonData) {
      alert("Please upload or load sample data first");
      return;
    }

    setIsProcessing(true);
    setLogs([]);
    setKbArticles([]);

    // Data preprocessing phase
    addLogMessage(setLogs, "=== Section: Data Preprocessing ===");
    await addLogMessage(
      setLogs,
      "Sanitizing and preparing data...",
      PROCESSING_DELAYS.STANDARD
    );

    const sanitizedData = sanitizeData(jsonData);
    setJsonData(sanitizedData);

    await addLogMessage(
      setLogs,
      `Sanitized data ready with ${sanitizedData.length} cases.`,
      PROCESSING_DELAYS.STANDARD
    );

    // Clustering analysis phase
    addLogMessage(setLogs, "=== Section: Clustering Analysis ===");
    await addLogMessage(
      setLogs,
      "Starting clustering analysis...",
      PROCESSING_DELAYS.EXTENDED
    );

    try {
      const serializedData = JSON.stringify(sanitizedData);
      const categoriesResponse = await generateCategories(serializedData);
      const parsedCategories = parseAIResponse(categoriesResponse);

      await addLogMessage(
        setLogs,
        `Categories Detected: ${JSON.stringify(parsedCategories)}`,
        PROCESSING_DELAYS.STANDARD
      );

      // Display discovered categories
      for (const category of parsedCategories) {
        const caseList = category.caseIds.join(", ");
        await addLogMessage(
          setLogs,
          `📁 ${category.categoryName} (${category.categoryId}): ${caseList}`,
          PROCESSING_DELAYS.EXTENDED
        );
      }

      console.log("Starting KB Generation with clusters:", parsedCategories);
      await processKBGeneration(parsedCategories);
    } catch (error) {
      await addLogMessage(
        setLogs,
        `Error generating KB: ${error.message}`,
        PROCESSING_DELAYS.EXTENDED
      );
      return;
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Open KB article dialog
   */
  const openKBDialog = (kbArticle) => {
    setSelectedKB(kbArticle);
    setDialogOpen(true);
  };

  // ========================================================================================
  // RENDER
  // ========================================================================================

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "85vh" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1976d2" }}
      >
        🤖 AI-Powered KB Article Generator
      </Typography>

      {/* Control Panel */}
      <ControlPanel
        jsonData={jsonData}
        onFileUpload={handleFileUpload}
        onStartProcessing={startProcessing}
        onPreviewOpen={() => setPreviewOpen(true)}
        isProcessing={isProcessing}
      />

      {/* Main Content Grid */}
      <Grid container spacing={3} sx={{ mt: 2, height: "65vh" }}>
        <Grid size={5}>
          <ConsoleLog logs={logs} loading={isProcessing} />
        </Grid>
        <Grid size={7}>
          <ResultsPanel kbArticles={kbArticles} onOpenKB={openKBDialog} />
        </Grid>
      </Grid>

      {/* Dialogs */}
      <KBDialog
        open={dialogOpen}
        kb={selectedKB}
        onClose={() => setDialogOpen(false)}
      />
      <DataPreviewDialog
        open={previewOpen}
        jsonData={jsonData}
        onClose={() => setPreviewOpen(false)}
      />
    </Box>
  );
}
