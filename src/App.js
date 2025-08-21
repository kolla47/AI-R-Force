import { Box } from "@mui/material";
import { useState } from "react";
import KBSuggestionPage from "./Pages/KBSuggestion";
import Navbar from "./Components/Common/Navbar";
import KBGeneration from "./Pages/KBGeneration";
import Dashboard from "./Pages/Dashboard";

export default function App() {
  const [currentPage, setCurrentPage] = useState("Dashboard");

  const handlePageChange = (event, newValue) => {
    setCurrentPage(newValue);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "KBSuggestion":
        return <KBSuggestionPage />;
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
      <Navbar currentPage={currentPage} onPageChange={handlePageChange} />
      {<Box sx={{ mt: 8 }}>{renderPage()}</Box>}
    </Box>
  );
}
