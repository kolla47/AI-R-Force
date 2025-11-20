# SmartKB - AI-Powered Airline Support Knowledge Base

## Project Overview

SmartKB is a React-based airline customer service AI assistant with three core features:
1. **KB Generation** - Auto-generates knowledge base articles from clustered resolved cases
2. **KB Suggestion** - Real-time case resolution guidance using Azure AI Search + GPT
3. **Claim Processor** - Vision-based expense claim validation against policy

**Tech Stack**: React 19, Material-UI, Azure OpenAI (GPT-4o-mini, text-embedding-3-small), Azure AI Search (hybrid vector+keyword)

## Architecture Patterns

### Page-Based State Management
- No global state manager (Redux/Context) - all state lives in page components (`src/Pages/`)
- Pages own AI client initialization and orchestration logic
- Child components in `src/Components/` are purely presentational with callback props
- Admin mode toggle in `App.js` controls page routing (non-admin users see only KB Suggestion)

### Azure OpenAI Client Pattern
```javascript
// Repeated pattern across KBGeneration.jsx, KBSuggestion.jsx, ClaimProcessor.jsx
const client = new AzureOpenAI({
  apiKey: process.env.REACT_APP_AZURE_<SERVICE>_API_KEY,
  endpoint: process.env.REACT_APP_AZURE_<SERVICE>_ENDPOINT,
  apiVersion: "2024-04-01-preview",
  deployment: process.env.REACT_APP_AZURE_<SERVICE>_DEPLOYMENT,
  dangerouslyAllowBrowser: true,  // Required for client-side Azure SDK
});
```

**Environment Variables Required**:
- `REACT_APP_AZURE_GENERATION_API_KEY/ENDPOINT/DEPLOYMENT` (GPT-4o-mini for text generation)
- `REACT_APP_AZURE_EMBEDDING_API_KEY/ENDPOINT/DEPLOYMENT` (text-embedding-3-small for vectors)
- `REACT_APP_AZURE_SEARCH_ENDPOINT/INDEX/KEY` (Azure AI Search)

### System Prompt Conventions
System prompts stored as constants in page files (see `SYSTEM_PROMPTS` objects):
- **KB Generation**: Categorizes cases → generates KB articles in JSON format
- **KB Suggestion**: Evaluates KB relevance → generates step-by-step agent guidance
- **Claim Processor**: Analyzes receipt images against policy → returns structured JSON

**Critical**: All AI responses expect **strict JSON serialization** - use `parseAIResponse()` utility to strip markdown code fences.

## Key Workflows

### Development
```bash
npm install              # Install dependencies
npm start               # Dev server on localhost:3000
npm test                # Jest/React Testing Library
npm run build           # Production build
```

### KB Generation Flow (KBGeneration.jsx)
1. Load historical cases from `src/SupportData/Case.json` (structure: `case_data`, `resolution_note`, `compensations`, `activities`)
2. Sanitize via `sanitizeData()` - extracts core fields for AI processing
3. AI categorizes cases into clusters (e.g., "Denied Boarding", "Flight Delay")
4. Filter clusters by threshold (default: 5+ cases per cluster)
5. Generate KB article per cluster using GPT (returns JSON: `id`, `title`, `tags`, `KB` markdown)
6. Display results with preview/download capabilities

### KB Suggestion Flow (KBSuggestion.jsx)
1. Agent enters case subject + description
2. Generate embedding via `getEmbedding()` (text-embedding-3-small)
3. Hybrid search in Azure AI Search: vector similarity + keyword match (top 5 results)
4. Display top 3 KB articles as cards
5. Select KB → GPT generates contextual guidance using format: `subject%%description%%(KB markdown)%%guidanceRules`
6. **Guidance Rules** from `src/guidanceDisplayRules.jsx` injected into prompt to enforce step numbering

### Claim Processor Flow (ClaimProcessor.jsx)
1. Load policy from `public/SupportData/policy.txt` on mount
2. Upload receipt images (converted to base64 via `fileToDataURL()`)
3. Send to GPT-4o-mini **with vision**: `[{type: "text", text: policy}, {type: "image_url", image_url: {url: dataUrl}}]`
4. AI returns JSON: `summary`, `totalRequested`, `totalApproved`, `validClaims[]`, `invalidClaims[]`
5. **Critical**: Prompt explicitly forbids math expressions in JSON (e.g., `"totalRequested": 683.46 + 596.13` is invalid)

## Data Structures

### Case Input Format (`src/SupportData/Case.json`)
```json
{
  "case_data": {
    "caseid": "DB001",
    "title": "Denied Boarding due to Overbooking",
    "description": "Customer was denied boarding...",
    "flight_number": "AI202",
    "departure": "DEL",
    "arrival": "BLR"
  },
  "resolution_note": "Customer was denied boarding...",
  "compensations": [{"type": "Meal Voucher", "details": "INR 500"}],
  "activities": [{"type": "note", "description": "..."}]
}
```

### KB Article Output Format
```json
{
  "id": "kb-001",
  "title": "Flight Delays – All Routes",
  "tags": ["flight delay", "compensation"],
  "status": "draft",
  "KB": "# Flight Delays...\n\n## Quick Reference\n..."
}
```

## Component Organization

### Common Pattern: ControlPanel + ResultsPanel + Dialog
- **ControlPanel**: User inputs (forms, file uploads, threshold sliders)
- **ResultsPanel**: AI output display (KB articles, guidance, claim results)
- **Dialog**: Modal overlays for previews (DataPreviewDialog, KBDialog)
- **ConsoleLog**: Debug console showing AI processing logs (add via `setLogs()`)

### MUI Conventions
- All styling uses `sx` prop (no CSS modules or styled-components)
- Framer Motion for Dashboard animations only
- `react-markdown` with `remark-gfm` for KB article rendering

## Debugging & Logging

### Console Log Pattern
```javascript
const [logs, setLogs] = useState([]);
const addLog = async (message, delay = 50) => {
  setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay));
};
// Render: <ConsoleLog logs={logs} />
```
Used in all three main pages to show step-by-step AI processing flow to users.

### Common Gotchas
1. **React 18 Strict Mode** causes double renders - use `useRef` to prevent duplicate API calls (see `ClaimProcessor.jsx` policy fetch)
2. **Azure SDK Browser Warning** - `dangerouslyAllowBrowser: true` is intentional for demo (not production-safe)
3. **JSON Parsing**: Always strip markdown fences with `replace(/```json\n?/g, "").replace(/```\n?/g, "")`
4. **Admin Mode**: Non-admin users locked to KB Suggestion page - check `isAdminMode` before allowing navigation

## Scripts Folder (Initial Setup Only)

The `src/Scripts/` directory contains one-time setup utilities - **not used during normal application runtime**:

### `createIndex.js` - Azure AI Search Index Creation
Run once to create the vector search index with proper schema:
```javascript
// Creates index with:
// - Text fields: id, title, tags, status, KB
// - Vector field: 1536 dimensions (text-embedding-3-small)
// - HNSW algorithm: cosine similarity
node src/Scripts/createIndex.js
```

### `generate-and-upload.js` - Initial KB Population
Seeds Azure AI Search with starter KB articles:
1. Loads hardcoded KB documents (flight delays, cancellations, refunds, etc.)
2. Generates embeddings using Azure OpenAI `text-embedding-3-small`
3. Uploads documents with vectors to the search index

**Run after creating index**: `node src/Scripts/generate-and-upload.js`

### Legacy POC Scripts (Not Used)
- `AI-Search-Scripts.js` - Early search testing, superseded by `KBSuggestion.jsx`
- `searchKB.js` - Standalone search POC, functionality moved to page components

**Important**: After initial setup, all search/embedding operations happen in page components (`KBSuggestion.jsx`, `KBGeneration.jsx`).

## File Naming & Structure
- Pages: PascalCase (e.g., `KBSuggestion.jsx`)
- Components: Nested by feature (`Components/KBGenerator/ControlPanel.jsx`)
- Scripts: kebab-case for utilities (`AI-Search-Scripts.js`)
- Support data: `src/SupportData/` for client-accessible JSON, `public/SupportData/` for static assets

## Testing Considerations
- Mock Azure OpenAI client for unit tests (avoid `dangerouslyAllowBrowser` errors)
- Test files co-located with components (`App.test.js`, `setupTests.js`)
- `reportWebVitals.js` enabled for performance monitoring

## Extension Points
- Replace client-side Azure SDK calls with backend API routes for production
- Add authentication layer to protect admin mode (currently client-side toggle)
- Implement SME approval workflow for generated KB articles (mentioned in README, not yet built)
- Multi-language support using Azure Translator (mentioned in README)
