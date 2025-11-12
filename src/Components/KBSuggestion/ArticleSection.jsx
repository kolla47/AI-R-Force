import { Box, Grid, Typography } from "@mui/material";
import ArticleCard from "./ArticleCard";

export default function ArticlesSection({ articles }) {
  if (articles.length === 0) return null;

  return (
    <Box sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Knowledge Base Articles
      </Typography>
      <Grid container spacing={2}>
        {articles.map((article, index) => (
          <Grid size={6} key={article.id}>
            <ArticleCard key={article.id} article={article} index={index} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
