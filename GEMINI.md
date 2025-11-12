# Project: AI-R Force (SmartKB)

## Project Overview

This is a React-based web application called "SmartKB" designed to assist airline customer service agents. The application has three main features:

1.  **KB Article Generation:** It analyzes clusters of resolved customer service cases and uses AI to automatically generate structured knowledge base (KB) articles.
2.  **KB Article Suggestion:** When a new customer case is entered, it uses AI-powered search to find and suggest the most relevant KB articles, and provides step-by-step guidance for the agent.
3.  **AI Claim Processor:** It automates the processing of reimbursement claims by analyzing receipt images against a defined policy.

The project uses a combination of technologies, including:

*   **Frontend:** React, Material-UI
*   **AI:** Azure OpenAI (GPT-4, GPT-4o with Vision), Azure AI Search (Vector + Keyword Hybrid)
*   **Backend (inferred):** JS

## Building and Running

### Prerequisites

*   Node.js and npm
*   An Azure account with access to OpenAI and AI Search services.
*   A `.env` file with the following environment variables:
    *   `REACT_APP_AZURE_GENERATION_API_KEY`
    *   `REACT_APP_AZURE_GENERATION_ENDPOINT`
    *   `REACT_APP_AZURE_GENERATION_DEPLOYMENT`
    *   `REACT_APP_AZURE_SEARCH_ENDPOINT`
    *   `REACT_APP_AZURE_SEARCH_INDEX`
    *   `REACT_APP_AZURE_SEARCH_KEY`
    *   `REACT_APP_AZURE_EMBEDDING_API_KEY`
    *   `REACT_APP_AZURE_EMBEDDING_ENDPOINT`
    *   `REACT_APP_AZURE_EMBEDDING_DEPLOYMENT`

### Installation

```bash
npm install
```

### Running the application

```bash
npm start
```

This will start the development server and open the application in your default browser at `http://localhost:3000`.

### Building for production

```bash
npm run build
```

This will create a `build` directory with the production-ready files.

### Running tests

```bash
npm test
```

## Development Conventions

*   The project follows the standard React project structure created by `create-react-app`.
*   Components are organized into `src/Components` and pages are in `src/Pages`.
*   The UI is built using Material-UI.
*   The application state is managed within individual components using React hooks (`useState`).
*   The AI-related logic is encapsulated in the page components (`KBGeneration.jsx`, `KBSuggestion.jsx`, and `ClaimProcessor.jsx`).