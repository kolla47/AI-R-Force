import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
  Button,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Reusable KB Article Dialog Component
 * Displays KB article content in a modal dialog with metadata
 * 
 * @param {boolean} open - Controls dialog visibility
 * @param {Object} article - KB article object
 * @param {string} article.id - Article ID
 * @param {string} article.title - Article title
 * @param {string} article.KB - Article content in Markdown
 * @param {Array<string>} article.tags - Array of tags
 * @param {string} article.status - Article status (optional)
 * @param {number} article.caseCount - Number of cases (optional)
 * @param {Function} onClose - Callback when dialog is closed
 */
export default function KBArticleDialog({ open, article, onClose }) {
  if (!article) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { height: "80vh" } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">{article.title}</Typography>
        <IconButton onClick={onClose} aria-label="close">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box>
          {/* Metadata Section */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {article.id && `Article ID: ${article.id}`}
              {article.caseCount && ` | Cases: ${article.caseCount}`}
              {article.status && ` | Status: ${article.status}`}
            </Typography>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                {article.tags.map((tag, index) => (
                  <Chip
                    key={`${tag}-${index}`}
                    label={tag}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Article Content */}
          <Box
            sx={{
              "& h1, & h2, & h3, & h4, & h5, & h6": {
                color: "#1976d2",
                marginTop: 2,
                marginBottom: 1,
              },
              "& p": {
                marginBottom: 1,
              },
              "& ul, & ol": {
                paddingLeft: 3,
                marginBottom: 1,
              },
              "& code": {
                backgroundColor: "#f5f5f5",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "0.9em",
              },
              "& pre": {
                backgroundColor: "#f5f5f5",
                padding: 2,
                borderRadius: 1,
                overflow: "auto",
              },
              "& table": {
                borderCollapse: "collapse",
                width: "100%",
                marginBottom: 2,
              },
              "& th, & td": {
                border: "1px solid #ddd",
                padding: 1,
                textAlign: "left",
              },
              "& th": {
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
              },
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.KB || ""}
            </ReactMarkdown>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
