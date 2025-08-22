import { AppBar, Tab, Tabs, Toolbar, Typography, Switch, FormControlLabel, Box } from "@mui/material";

export default function Navbar({ currentPage, onPageChange, isAdminMode, onToggleMode }) {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#1976d2", zIndex: 1300 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AI-R-Force
        </Typography>
        
        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={isAdminMode}
                onChange={onToggleMode}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'white',
                  },
                  '& .MuiSwitch-switchBase': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                  },
                  '& .MuiSwitch-track': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: 'white', fontSize: '0.875rem' }}>
                Admin Mode ON/OFF
              </Typography>
            }
            labelPlacement="start"
            sx={{ 
              '& .MuiFormControlLabel-label': { 
                color: 'white',
                fontSize: '0.875rem'
              } 
            }}
          />
        </Box>

        {isAdminMode && (
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
        )}
      </Toolbar>
    </AppBar>
  );
}
