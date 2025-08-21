import { AppBar, Tab, Tabs, Toolbar, Typography } from "@mui/material";

export default function Navbar({ currentPage, onPageChange }) {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#1976d2", zIndex: 1300 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AI-R-Force
        </Typography>
        <Tabs
          value={currentPage}
          onChange={onPageChange}
          sx={{
            "& .MuiTab-root": {
              color: "rgba(255, 255, 255, 0.7)",
              "&.Mui-selected": { color: "white" },
            },
            "& .MuiTabs-indicator": { backgroundColor: "white" },
          }}
        >
          <Tab label="Dashboard" value="Dashboard" />
          <Tab label="KB Generation" value="KBGeneration" />
          <Tab label="KB Suggestion" value="KBSuggestion" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}
