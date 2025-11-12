import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, Grid, Typography } from "@mui/material";
import ConsoleLog from "../Components/Common/ConsoleLog";
import ControlPanel from "../Components/ClaimProcessor/ControlPanel";
import ResultsPanel from "../Components/ClaimProcessor/ResultsPanel";
import PolicyPanel from "../Components/ClaimProcessor/PolicyPanel";
import { AzureOpenAI } from "openai";

// AI Client Configuration
const genClient = new AzureOpenAI({
  apiKey: process.env.REACT_APP_AZURE_GENERATION_API_KEY,
  endpoint: process.env.REACT_APP_AZURE_GENERATION_ENDPOINT,
  apiVersion: "2024-04-01-preview",
  deployment: process.env.REACT_APP_AZURE_GENERATION_DEPLOYMENT,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = `You are an AI assistant that processes expense claims for an airline based on receipts and a reimbursement policy. Your task is to analyze the user-provided receipt images and the given policy to determine which items are eligible for reimbursement.

Your response MUST be a single, clean JSON object and nothing else. Do not include any text before or after the JSON object. 

CRITICAL: All numeric values MUST be actual numbers, NOT mathematical expressions. Calculate all totals before returning them.
- CORRECT: "totalRequested": 1279.59
- INCORRECT: "totalRequested": 683.46 + 596.13

The JSON object should have the following structure:
{
  "summary": "A brief, one-sentence summary of the claim analysis.",
  "totalRequested": 1279.59,
  "totalApproved": 157.89,
  "validClaims": [
    {
      "item": "<string, name of the item>",
      "price": 22.50,
      "reason": "<string, a brief explanation of why this claim is valid based on the policy>"
    }
  ],
  "invalidClaims": [
    {
      "item": "<string, name of the item>",
      "price": 45.00,
      "reason": "<string, a brief explanation of why this claim is invalid based on the policy>"
    }
  ]
}
`;

export default function ClaimProcessor() {
  const [logs, setLogs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [policy, setPolicy] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [results, setResults] = useState(null);
  
  // Use ref to prevent duplicate fetches in React 18 Strict Mode
  const hasFetchedPolicy = useRef(false);

  const addLog = useCallback(async (message, delay = 50) => {
    setLogs((prevLogs) => [...prevLogs, `[${new Date().toLocaleTimeString()}] ${message}`]);
    if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
  }, []);

  useEffect(() => {
    const fetchPolicy = async () => {
      // Prevent duplicate fetches
      if (hasFetchedPolicy.current) return;
      hasFetchedPolicy.current = true;

      await addLog("Fetching reimbursement policy...", 0);
      try {
        const response = await fetch("/SupportData/policy.txt");
        const text = await response.text();
        setPolicy(text);
        await addLog("Policy loaded successfully.");
      } catch (error) {
        await addLog(`Error loading policy: ${error.message}`);
      }
    };
    fetchPolicy();
  }, [addLog]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    addLog(`Selected ${files.length} receipt(s).`, 0);
    setReceipts(files);
  };

  const fileToDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleProcessClaims = async () => {
    if (receipts.length === 0) {
      addLog("No receipts selected. Please upload files to process.", 0);
      alert("Please upload at least one receipt image.");
      return;
    }

    setIsProcessing(true);
    setResults(null);
    setLogs([]);
    await addLog("=== Claim Processing Started ===", 500);

    try {
      await addLog(`Reading ${receipts.length} receipt image(s)...`, 500);
      const imagePromises = receipts.map(fileToDataURL);
      const base64Images = await Promise.all(imagePromises);
      await addLog("Successfully converted images to base64.", 800);

      const content = [
        { type: "text", text: policy },
        ...base64Images.map((dataUrl) => ({
          type: "image_url",
          image_url: { url: dataUrl },
        })),
      ];

      await addLog("Sending data to AI model for analysis...", 1000);
      const response = await genClient.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: content },
        ],
        max_tokens: 4096,
        model: "gpt-4o-mini",
      });

      await addLog("AI analysis complete. Parsing results...", 800);
      const rawResult = response.choices[0].message.content;
      
      // More robust JSON extraction and parsing
      let cleanedResult = rawResult.trim();
      
      // Remove markdown code blocks if present
      cleanedResult = cleanedResult.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      
      // Try to find JSON object in the response
      const jsonMatch = cleanedResult.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON object found in AI response");
      }
      
      let jsonResult;
      try {
        // First, try to evaluate any math expressions in the JSON
        let jsonString = jsonMatch[0];
        
        // Replace mathematical expressions with their evaluated results
        // Match patterns like: "field": number + number + number
        jsonString = jsonString.replace(
          /("(?:totalRequested|totalApproved)":\s*)([0-9+\-*\/.\s]+)(?=,|\})/g,
          (match, prefix, expression) => {
            try {
              // Safely evaluate the mathematical expression
              const result = expression.split('+').map(n => parseFloat(n.trim())).reduce((a, b) => a + b, 0);
              return `${prefix}${result.toFixed(2)}`;
            } catch {
              return match; // If evaluation fails, keep original
            }
          }
        );
        
        jsonResult = JSON.parse(jsonString);
      } catch (parseError) {
        await addLog(`Raw AI response: ${cleanedResult.substring(0, 300)}...`);
        throw new Error(`Failed to parse JSON: ${parseError.message}`);
      }
      
      // Validate the structure
      if (!jsonResult.summary || !jsonResult.validClaims || !jsonResult.invalidClaims) {
        throw new Error("AI response missing required fields (summary, validClaims, or invalidClaims)");
      }
      
      // Ensure numeric fields are numbers
      jsonResult.totalRequested = parseFloat(jsonResult.totalRequested) || 0;
      jsonResult.totalApproved = parseFloat(jsonResult.totalApproved) || 0;
      
      setResults(jsonResult);
      await addLog("=== Claim Processing Finished ===");
    } catch (error) {
      const errorMessage = `An error occurred: ${error.message}`;
      await addLog(errorMessage);
      console.error(errorMessage);
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "85vh" }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
        🤖 AI Claim Processor
      </Typography>

      <Grid container spacing={3} sx={{ height: "100%" }}>
        <Grid size={7}>
          <ControlPanel
            onFileChange={handleFileChange}
            onProcessClaims={handleProcessClaims}
            isProcessing={isProcessing}
            receipts={receipts}
          />
          <ResultsPanel results={results} loading={isProcessing} />
        </Grid>

        <Grid size={5}>
          <ConsoleLog logs={logs} loading={isProcessing} />
          <PolicyPanel policy={policy} />
        </Grid>
      </Grid>
    </Box>
  );
}