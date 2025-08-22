import { Box } from "@mui/material";
import { useState } from "react";
import KBSuggestionPage from "./Pages/KBSuggestion";
import Navbar from "./Components/Common/Navbar";
import KBGeneration from "./Pages/KBGeneration";
import Dashboard from "./Pages/Dashboard";

export default function App() {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handlePageChange = (event, newValue) => {
    if (!isAdminMode && newValue !== "KBSuggestion") {
      return;
    }
    setCurrentPage(newValue);
  };

  const toggleMode = () => {
    setIsAdminMode(!isAdminMode);
    if (!isAdminMode) {
      setCurrentPage("KBSuggestion");
    }
  };

  const renderPage = () => {
    if (!isAdminMode) {
      return <KBSuggestionPage isAdminMode={isAdminMode} />;
    }

    switch (currentPage) {
      case "KBSuggestion":
        return <KBSuggestionPage isAdminMode={isAdminMode} />;
      case "KBGeneration":
        return <KBGeneration />;
      case "Dashboard":
        return <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Navbar 
        currentPage={currentPage} 
        onPageChange={handlePageChange} 
        isAdminMode={isAdminMode}
        onToggleMode={toggleMode}
      />
      {<Box sx={{ mt: 8 }}>{renderPage()}</Box>}
    </Box>
  );
}
