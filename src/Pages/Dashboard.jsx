import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  SupportAgent,
  AutoAwesome,
  Storage,
  CheckCircle,
} from "@mui/icons-material";

export default function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Team Name & Tagline */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: "center", marginBottom: "40px" }}
      >
        <Typography variant="h2" fontWeight="bold" color="primary" gutterBottom>
          AI-R Force
        </Typography>
        <Typography variant="h5" color="text.secondary" fontWeight="500">
          SmartKB: AI-Powered Knowledge Automation for Airline Support
        </Typography>
      </motion.div>

      {/* Main Flow: Problem → Solution → How It Works */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Problem Card */}
        <motion.div variants={itemVariants}>
          <Card
            sx={{
              mb: 4,
              borderRadius: 4,
              bgcolor: "#fef6f6",
              border: "1px solid #ffd7d7",
              boxShadow: 3,
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: "error.main", mr: 2 }}>
                  <SupportAgent />
                </Avatar>
                <Typography variant="h5" fontWeight="bold">
                  The Problem
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                Airline customer service agents waste valuable time manually
                searching through hundreds of resolved cases or outdated
                knowledge base articles to resolve recurring issues — leading to
                slow responses, inconsistent resolutions, and low customer
                satisfaction.
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        {/* Solution Overview */}
        <motion.div variants={itemVariants}>
          <Card
            sx={{
              mb: 4,
              borderRadius: 4,
              bgcolor: "#f0f8ff",
              border: "1px solid #b3d9ff",
              boxShadow: 3,
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: "info.main", mr: 2 }}>
                  <AutoAwesome />
                </Avatar>
                <Typography variant="h5" fontWeight="bold">
                  Our Solution: SmartKB
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                An end-to-end AI system that:
              </Typography>
              <Box component="ul" sx={{ pl: 3, mt: 1, mb: 2 }}>
                <Typography
                  component="li"
                  variant="body1"
                  color="text.secondary"
                >
                  <strong>Auto-generates</strong> structured KB articles from
                  clusters of resolved cases
                </Typography>
                <Typography
                  component="li"
                  variant="body1"
                  color="text.secondary"
                >
                  <strong>Surfaces</strong> the most relevant KBs in real-time
                  when new cases arrive
                </Typography>
                <Typography
                  component="li"
                  variant="body1"
                  color="text.secondary"
                >
                  <strong>Guides agents</strong> with AI-generated, step-by-step
                  resolution instructions
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                <strong>Result:</strong> Faster resolutions, consistent quality,
                and less agent burnout.
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        {/* How It Works - 2-Part Flow */}
        <Grid container spacing={4}>
          {/* Part 1: Auto KB Generation */}
          <Grid size={6}>
            <motion.div variants={itemVariants}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  border: "1px solid #c8e6c9",
                  bgcolor: "#f8fff8",
                  boxShadow: 3,
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>1</Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      Auto-KB Generator
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Clustering:</strong> Historical resolved cases are
                    embedded and clustered using Sentence-BERT + HDBSCAN.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Benchmarking:</strong> Clusters are evaluated
                    against frequency, effort, and recurrence thresholds.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Generation:</strong> Valid clusters trigger GPT to
                    draft structured KB articles in seconds.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <em>
                      Drafts go to SMEs for approval — ensuring quality and
                      compliance.
                    </em>
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Part 2: Agent Assistant */}
          <Grid size={6}>
            <motion.div variants={itemVariants}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  border: "1px solid #bbdefb",
                  bgcolor: "#f0f8ff",
                  boxShadow: 3,
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: "info.main", mr: 2 }}>2</Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      AI Agent Assistant
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Vector Search:</strong> Approved KBs are embedded
                    and indexed in Azure AI Search.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Hybrid Retrieval:</strong> New customer queries
                    trigger semantic + keyword search to fetch top 3 KBs.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Smart Guidance:</strong> The top KB + user input is
                    sent to GPT to generate a personalized, step-by-step
                    resolution guide.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <em>
                      Agents resolve cases faster — with consistency and
                      confidence.
                    </em>
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Tech Stack */}
        <motion.div variants={itemVariants} style={{ marginTop: "40px" }}>
          <Card
            sx={{
              borderRadius: 4,
              border: "1px solid #e0e0e0",
              bgcolor: "#fafafa",
              boxShadow: 2,
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
                  <Storage />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  Tech Stack
                </Typography>
              </Box>
              <Box
                component="ul"
                sx={{
                  pl: 3,
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                  gap: 1,
                }}
              >
                {[
                  "Azure OpenAI (GPT-4, Ada-002)",
                  "Azure AI Search (Vector + Keyword Hybrid)",
                  "Sentence-BERT / BERTopic (Clustering)",
                  "HDBSCAN / UMAP (Unsupervised Learning)",
                  "React + MUI (Dashboard)",
                  "Python (FastAPI, scikit-learn, langchain)",
                ].map((tech, i) => (
                  <Typography key={i} component="li" variant="body2">
                    {tech}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Impact */}
        <motion.div variants={itemVariants} style={{ marginTop: "40px" }}>
          <Card
            sx={{
              borderRadius: 4,
              border: "1px solid #dcedc8",
              bgcolor: "#f9fde9",
              boxShadow: 3,
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: "success.dark", mr: 2 }}>
                  <CheckCircle />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  Impact & Benefits
                </Typography>
              </Box>
              <Box component="ul" sx={{ pl: 3 }}>
                {[
                  "Reduces KB creation time from hours → seconds",
                  "Cuts average case resolution time by up to 40%",
                  "Improves agent consistency and reduces training burden",
                  "Scales support knowledge automatically as new issues emerge",
                  "Enterprise-ready with audit trails, PII redaction, and approval workflows",
                ].map((item, i) => (
                  <Typography
                    key={i}
                    component="li"
                    variant="body1"
                    color="text.secondary"
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{ textAlign: "center", marginTop: "60px" }}
      >
        <Typography variant="body2" color="text.secondary">
          Built with ❤️ by AI-R Force | Hackathon 2024
        </Typography>
      </motion.div>
    </Container>
  );
}
