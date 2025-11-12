// src/components/ClaimProcessor/PolicyPanel.jsx
import React from "react";
import { Paper, Typography, Box, Divider } from "@mui/material";

export default function PolicyPanel({ policy }) {
  // Parse the policy text into structured sections
  const parsePolicyText = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    const sections = [];
    let currentSection = null;
    let currentItems = [];

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      
      // Detect section headers (lines starting with ##)
      if (trimmedLine.startsWith('##')) {
        if (currentSection) {
          currentSection.items = currentItems;
          sections.push(currentSection);
        }
        currentSection = {
          title: trimmedLine.replace('##', '').trim(),
          items: []
        };
        currentItems = [];
      } 
      // Detect bullet points
      else if (trimmedLine.startsWith('-')) {
        currentItems.push({
          type: 'bullet',
          text: trimmedLine.substring(1).trim()
        });
      }
      // Regular text
      else if (trimmedLine.length > 0 && !trimmedLine.startsWith('#')) {
        currentItems.push({
          type: 'text',
          text: trimmedLine
        });
      }
    });

    // Add the last section
    if (currentSection) {
      currentSection.items = currentItems;
      sections.push(currentSection);
    }

    return sections;
  };

  const sections = parsePolicyText(policy);

  return (
    <Paper 
      elevation={2}
      sx={{ 
        p: 2.5, 
        mt: 2, 
        maxHeight: '400px', 
        overflow: 'auto',
        backgroundColor: '#fafafa'
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600, 
          color: '#1976d2',
          mb: 2
        }}
      >
        📋 Reimbursement Policy
      </Typography>
      
      <Divider sx={{ mb: 2 }} />

      {!policy ? (
        <Typography color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
          Loading policy...
        </Typography>
      ) : (
        <Box>
          {sections?.map((section, idx) => (
            <Box key={idx} sx={{ mb: 2.5 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: '#424242',
                  mb: 1,
                  fontSize: '0.95rem',
                  borderLeft: '3px solid #1976d2',
                  pl: 1.5,
                  py: 0.3,
                  backgroundColor: '#e3f2fd',
                }}
              >
                {section.title}
              </Typography>

              <Box sx={{ pl: 1.5 }}>
                {section.items.map((item, itemIdx) => (
                  <Box key={itemIdx}>
                    {item.type === 'bullet' ? (
                      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 0.5 }}>
                        <Box
                          sx={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            backgroundColor: "#1976d2",
                            mt: 0.7,
                            mr: 1.2,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#555",
                            lineHeight: 1.5,
                            fontSize: '0.85rem',
                          }}
                        >
                          {item.text}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#666",
                          lineHeight: 1.6,
                          fontSize: '0.85rem',
                          mb: 0.5,
                        }}
                      >
                        {item.text}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}