// src/components/ClaimProcessor/ControlPanel.jsx
import React, { useRef } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { CloudUpload, PlayArrow } from "@mui/icons-material";

export default function ControlPanel({
  onFileChange,
  onProcessClaims,
  isProcessing,
  receipts,
}) {
  const fileInputRef = useRef(null);

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          1. Upload Receipts
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={onFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={() => fileInputRef.current?.click()}
          >
            Select Images
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrow />}
            onClick={onProcessClaims}
            disabled={isProcessing || receipts.length === 0}
          >
            {isProcessing ? "Processing..." : "Process Claims"}
          </Button>
        </Box>
        {receipts.length > 0 && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            {receipts.length} receipt(s) selected.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
