import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Collapse,
  IconButton,
  Divider,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Psychology as PsychologyIcon,
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";

const AIGuidanceSection = ({ nbs, loading }) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (nbs && nbs.trim() !== "" && !expanded) {
      setExpanded(true);
    }
  }, [nbs, expanded]);

  if (!nbs || nbs.trim() === "") {
    return null;
  }

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={{
        mb: 2,
        boxShadow: 3,
        border: "2px solid #e3f2fd",
        borderRadius: 2,
        backgroundColor: "#f8f9ff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          backgroundColor: "#e3f2fd",
          cursor: "pointer",
        }}
        onClick={handleToggle}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PsychologyIcon sx={{ color: "#1976d2", fontSize: 24 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#1976d2",
            }}
          >
            AI Guidance
          </Typography>
        </Box>
        <IconButton size="small" sx={{ color: "#1976d2" }}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              "& h1, & h2, & h3, & h4, & h5, & h6": {
                color: "#1976d2",
                marginTop: 2,
                marginBottom: 1,
              },
              "& h1": { fontSize: "1.5rem" },
              "& h2": { fontSize: "1.3rem" },
              "& h3": { fontSize: "1.1rem" },
              "& p": {
                marginBottom: 1,
                lineHeight: 1.6,
              },
              "& ul, & ol": {
                paddingLeft: 3,
                marginBottom: 2,
              },
              "& li": {
                marginBottom: 0.5,
              },
              "& strong": {
                color: "#1976d2",
                fontWeight: 600,
              },
              "& code": {
                backgroundColor: "#f5f5f5",
                padding: "2px 4px",
                borderRadius: 1,
                fontSize: "0.9em",
              },
              "& pre": {
                backgroundColor: "#f5f5f5",
                padding: 2,
                borderRadius: 1,
                overflow: "auto",
              },
            }}
          >
            <ReactMarkdown>{nbs}</ReactMarkdown>
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default AIGuidanceSection;
