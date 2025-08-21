// src/components/KBGenerator/DataPreviewDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Paper,
} from "@mui/material";

export default function DataPreviewDialog({ open, jsonData, onClose }) {
  if (!jsonData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Data Preview</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Total Cases: {jsonData.length}
        </Typography>
        <Paper
          sx={{
            p: 2,
            backgroundColor: "#f5f5f5",
            maxHeight: 400,
            overflow: "auto",
          }}
        >
          <pre style={{ fontSize: "0.8rem", margin: 0 }}>
            {JSON.stringify(jsonData.slice(0, 5), null, 2)}
          </pre>
          {jsonData.length > 5 && (
            <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
              ... and {jsonData.length - 5} more cases
            </Typography>
          )}
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
