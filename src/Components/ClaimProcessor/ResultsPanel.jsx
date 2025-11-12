// src/components/ClaimProcessor/ResultsPanel.jsx
import React from "react";
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { CheckCircleOutline, HighlightOff } from "@mui/icons-material";

export default function ResultsPanel({ results, loading }) {
  if (loading) {
    return (
      <Paper
        sx={{
          p: 3,
          mt: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Analyzing claims...</Typography>
      </Paper>
    );
  }

  if (!results) {
    return (
      <Paper sx={{ p: 3, mt: 2, textAlign: "center" }}>
        <Typography variant="h6">Analysis Results</Typography>
        <Typography color="text.secondary">
          Upload receipts and click "Process Claims" to see the AI analysis.
        </Typography>
      </Paper>
    );
  }

  const { summary, totalRequested, totalApproved, validClaims, invalidClaims } = results;

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        Claim Analysis Complete
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        {summary}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-around", mb: 3 }}>
        <Chip
          label={`Total Requested: $${totalRequested.toFixed(2)}`}
          color="warning"
          sx={{ fontSize: "1rem", p: 2 }}
        />
        <Chip
          label={`Total Approved: $${totalApproved.toFixed(2)}`}
          color="success"
          sx={{ fontSize: "1rem", p: 2 }}
        />
      </Box>

      <Typography variant="h6" gutterBottom>Valid Claims</Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {validClaims.map((claim, index) => (
              <TableRow key={index}>
                <TableCell>{claim.item}</TableCell>
                <TableCell align="right">${claim.price.toFixed(2)}</TableCell>
                <TableCell>{claim.reason}</TableCell>
                <TableCell align="center">
                  <CheckCircleOutline color="success" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom>Invalid Claims</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invalidClaims.map((claim, index) => (
              <TableRow key={index}>
                <TableCell>{claim.item}</TableCell>
                <TableCell align="right">${claim.price.toFixed(2)}</TableCell>
                <TableCell>{claim.reason}</TableCell>
                <TableCell align="center">
                  <HighlightOff color="error" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
