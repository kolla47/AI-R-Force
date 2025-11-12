// src/components/KBGenerator/ResultsPanel.jsx
import React from "react";
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Box,
} from "@mui/material";
import { Article, Speed } from "@mui/icons-material";

export default function ResultsPanel({ kbArticles, onOpenKB }) {
  return (
    <Paper sx={{ p: 2, height: "95%", overflow: "auto" }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Article /> Generated KB Articles
      </Typography>

      {kbArticles.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
          <Typography>
            No KB articles generated yet. Start processing to see results.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {kbArticles.map((kb) => (
            <Grid size={12} key={kb.id}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 4,
                    backgroundColor: "#f8f9fa",
                  },
                }}
                onClick={() => onOpenKB(kb)}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "#1976d2" }}
                    >
                      {kb.title}
                    </Typography>
                    <Chip
                      label={`${kb.caseCount} cases`}
                      size="small"
                      color="primary"
                      icon={<Speed />}
                    />
                  </Box>

                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}
                  >
                    {kb.tags.slice(0, 3).map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    Click to view detailed resolution guide and procedures
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
}
