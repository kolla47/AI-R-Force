import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ReactMarkdown from "react-markdown";

export default function ArticleCard({ article, index }) {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.2 }}
        whileHover={{ y: -4 }}
      >
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            boxShadow: hovered ? 6 : 3,
            transition: "all 0.3s ease",
            border: hovered ? "1px solid #1976d2" : "1px solid transparent",
            overflow: "hidden",
            bgcolor: "background.paper",
            cursor: "pointer",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleOpen}
        >
          <CardContent sx={{ flexGrow: 1, pb: 2 }}>
            {/* Title */}
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="600"
              color="text.primary"
              component="div"
            >
              {article.title}
            </Typography>

            {/* Tags */}
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} mb={2}>
              {article.tags.slice(0, 3).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    fontSize: "0.75rem",
                    height: "24px",
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                  }}
                />
              ))}
            </Stack>

            {/* Search Score Badge */}
            <Box
              sx={{
                display: "inline-block",
                px: 1.5,
                py: 0.5,
                bgcolor: "warning.lighter",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "warning.light",
                textAlign: "center",
              }}
            >
              <Typography
                variant="caption"
                color="warning.dark"
                fontWeight="bold"
              >
                Relevance: {article.score}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Popup for Markdown Content */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {article.title}
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <ReactMarkdown>{article.KB || ""}</ReactMarkdown>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
