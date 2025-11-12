// src/components/KBGenerator/ControlPanel.jsx
import React, { useRef } from "react";
import { Box, Button, Card, CardContent, Alert } from "@mui/material";
import { CloudUpload, Visibility, PlayArrow } from "@mui/icons-material";

export default function ControlPanel({
  jsonData,
  onFileUpload,
  onStartProcessing,
  onPreviewOpen,
  isProcessing,
}) {
  const fileInputRef = useRef(null);

  return (
    <Card
      sx={{
        mb: 3,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            type="file"
            accept=".json"
            onChange={onFileUpload}
            ref={fileInputRef}
            style={{ display: "none" }}
          />

          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              backgroundColor: "rgba(255,255,255,0.2)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
            }}
          >
            Upload JSON
          </Button>

          {jsonData && (
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              onClick={onPreviewOpen}
              sx={{
                color: "white",
                borderColor: "white",
              }}
            >
              Preview Data
            </Button>
          )}

          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={onStartProcessing}
            disabled={!jsonData || isProcessing}
            sx={{
              backgroundColor: "#4caf50",
              "&:hover": { backgroundColor: "#45a049" },
              "&:disabled": { backgroundColor: "rgba(255,255,255,0.3)" },
            }}
          >
            {isProcessing ? "Processing..." : "Start Processing"}
          </Button>
        </Box>

        {jsonData && (
          <Alert
            severity="success"
            sx={{ mt: 2, backgroundColor: "rgba(255,255,255,0.9)" }}
          >
            ✅ Data loaded: {jsonData.length} cases ready for processing
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
