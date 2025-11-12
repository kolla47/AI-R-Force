import { Paper, Typography, Divider } from "@mui/material";
export default function ConsoleLog({ logs, loading }) {
  const parsedSections = [];
  let currentSection = { title: "📝 Logs", entries: [] };

  logs.forEach((log) => {
    const sectionMatch = log.match(/^=== Section: (.+) ===$/);
    if (sectionMatch) {
      if (currentSection.entries.length > 0) {
        parsedSections.push(currentSection);
      }
      currentSection = { title: `📝 ${sectionMatch[1]}`, entries: [] };
    } else {
      currentSection.entries.push(log);
    }
  });

  if (currentSection.entries.length > 0) {
    parsedSections.push(currentSection);
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 3,
        backgroundColor: "#1e1e1e",
        minHeight: "35%",
        color: "#00ff00",
        fontFamily: "Courier New, monospace",
        fontSize: "0.9rem",
        lineHeight: 1.6,
        overflowY: "auto",
        boxShadow: "0 4px 12px rgba(0, 255, 0, 0.1)",
        border: "1px solid #00ff0030",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          color: "#00ff00",
          mb: 1.5,
          fontWeight: "bold",
          textShadow: "0 0 5px #00ff00",
        }}
      >
        🖥️ SYSTEM LOGS
      </Typography>

      {parsedSections.map((section, sIdx) => (
        <div key={sIdx}>
          <Divider sx={{ borderColor: "#00ff0030", my: 1 }} />
          <Typography
            variant="subtitle2"
            sx={{
              color: "#00ff00",
              fontWeight: "bold",
              mb: 1,
              textShadow: "0 0 3px #00ff00",
            }}
          >
            {section.title}
          </Typography>
          {section.entries.map((log, idx) => (
            <Typography
              key={`${sIdx}-${idx}`}
              variant="body2"
              sx={{
                opacity:
                  sIdx === parsedSections.length - 1 &&
                  idx === section.entries.length - 1 &&
                  loading
                    ? 0.8
                    : 1,
                animation:
                  sIdx === parsedSections.length - 1 &&
                  idx === section.entries.length - 1 &&
                  loading
                    ? "pulse 1.5s infinite"
                    : "none",
              }}
            >
              {sIdx === parsedSections.length - 1 &&
              idx === section.entries.length - 1 &&
              loading
                ? "▶️"
                : "⚡"}{" "}
              {log}
            </Typography>
          ))}
        </div>
      ))}

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.6;
          }
        }
      `}</style>
    </Paper>
  );
}
