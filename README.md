# ForgeAI – Industrial Knowledge Intelligence Platform

An AI-powered knowledge management platform for steel plants that transforms industrial documents into an intelligent conversational assistant using Retrieval-Augmented Generation (RAG), semantic search, and an interactive Knowledge Graph.

---

## Problem Statement

Industrial plants store thousands of Standard Operating Procedures (SOPs), maintenance manuals, inspection reports, safety guidelines, and operational documents.

Finding the right information quickly is difficult because:

- Knowledge is scattered across multiple PDFs.
- Engineers spend significant time searching documents.
- Information is difficult to connect across different manuals.
- Critical maintenance knowledge is often hidden inside lengthy reports.

ForgeAI addresses these challenges by converting documents into a searchable knowledge base with an AI Copilot capable of answering engineering questions with source-backed responses.

---

# Features

## Authentication

- JWT Authentication (access token + refresh token)
- Secure Login / User Registration
- Token refresh mechanism — automatic 401 recovery
- Protected Routes
- Session persistence across page reloads

---

## Document Management

- Upload PDF documents (plus PNG, JPEG — auto-converted to PDF)
- File validation — size limit (50 MB), MIME type, extension checks
- Store document metadata
- Delete uploaded documents with confirmation dialog
- List uploaded documents

Supported document types include:

- SOP
- Maintenance Manuals
- Incident Reports
- Inspection Reports
- Safety Policies
- Work Orders

---

## Intelligent Document Processing

Every uploaded document (PDF, PNG, JPEG) is automatically processed.

Pipeline:

Upload (PDF / PNG / JPEG)

↓

File Validation (size, MIME, extension)

↓

Image → PDF Conversion (for PNG/JPEG)

↓

Text Extraction — 3-Tier Fallback:

  Tier 1: Native PDF text (PyMuPDF)

  Tier 2: Improved Tesseract OCR (preprocessing + smart PSM)

  Tier 3: LLM Vision Analysis (Gemini Flash via OpenRouter)

↓

Semantic Chunking

↓

Embeddings (BAAI/bge-small-en-v1.5)

↓

Vector Database (ChromaDB)

### OCR Improvements
- Image preprocessing: contrast enhancement, sharpening, binarization
- Smart PSM selection: detects sparse diagrams (P&IDs) vs dense documents

### LLM Vision Analysis
- Fallback for P&IDs, engineering drawings, and blueprints
- Extracts equipment tags (T-101, P-201), process parameters, valve labels, line specs
- Uses OpenRouter with Gemini Flash 1.5 Vision

---

## Retrieval-Augmented Generation (RAG)

ForgeAI answers questions using only uploaded industrial documents.

Pipeline:

User Question

↓

Query Rewriter

↓

Multi-Entity Classifier

├── Standard Query → Semantic Search (top_k=8)

└── Multi-Entity Query → Expanded Search:

    ├── Preliminary vector search (top_k=5)

    ├── LLM extracts entity list (e.g., incidents, equipment tags)

    ├── Parallel sub-queries: each entity + question (top_k=2)

    └── Merged, deduplicated context

↓

Prompt Builder

↓

OpenRouter LLM

↓

Source-backed Answer

### Multi-Entity Expansion
Automatically detects questions like *"List all equipment tags"* or *"Summarize all incidents"* and expands retrieval to cover each entity individually before answering.

---

## AI Chat Assistant

Supports:

- Natural language questions
- Multi-turn conversations
- Conversation memory
- Follow-up questions
- Engineering knowledge retrieval
- **Multi-Entity Expansion** — automatically expands global/comparative queries into targeted sub-searches

Example:

> What is pulley lagging?

Follow-up:

> Why is it important?

The assistant understands context without repeating previous questions.

---

## Source Attribution

Every answer includes:

- Source Document
- Page Number
- Section
- Similarity Score

This ensures transparency and explainability.

---

## Knowledge Graph

ForgeAI automatically builds an interactive Knowledge Graph from uploaded documents.

Features:

- Concept extraction
- Concept relationships
- Interactive visualization
- Clickable nodes
- Related document references

---

## Conversation History

- Multiple chat sessions
- Session titles generated automatically
- Persistent conversation storage
- Chat history retrieval

---

# Project Workflow

```
                    User Login
                         │
                         ▼
                  Authentication
                         │
                         ▼
                 ForgeAI Dashboard
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
 Upload Document      AI Chat      Knowledge Graph
        │                │                │
        ▼                ▼                │
 PDF Text Extraction  User Question       │
        │                │                │
        ▼                ▼                │
 Semantic Chunking  Query Rewriting       │
        │                │                │
        ▼                ▼                │
 Generate Embeddings Retrieval Engine     │
        │                │                │
        ▼                ▼                │
     ChromaDB      Relevant Chunks        │
        │                │                │
        └────────────► Prompt Builder ◄───┘
                         │
                         ▼
                 OpenRouter LLM
                         │
                         ▼
               Source-backed Response
                         │
                         ▼
             Conversation History Saved
```

# Tech Stack

## Frontend

- React
- TypeScript
- Material UI
- React Router
- React Flow
- Axios

---

## Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic

---

## AI Stack

- OpenRouter (chat + vision models)
- Gemini Flash 1.5 Vision (P&ID analysis)
- BAAI/bge-small-en-v1.5
- Sentence Transformers
- ChromaDB
- spaCy
- PyMuPDF
- Tesseract OCR
- Pillow (image processing)

---

## Database

- PostgreSQL
- ChromaDB

---

# Project Structure

```
forge-ai/

├── backend/
│   ├── app/
│   │   ├── api/v1/            (auth, documents, chat, graph, ...)
│   │   ├── core/              (config, security, constants)
│   │   ├── database/          (session, base, init_db)
│   │   ├── embeddings/        (embedder)
│   │   ├── llm/               (client, prompts, prompt_builder)
│   │   ├── models/            (SQLAlchemy models)
│   │   ├── parsing/           (ocr_service, vision_service, parser)
│   │   ├── schemas/           (Pydantic schemas)
│   │   ├── services/          (chat, upload, retriever, ...)
│   │   ├── utils/             (text_chunker, nlp)
│   │   ├── vectorstore/       (chroma_client)
│   │   ├── seeds/             (seed.py)
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api/               (api.ts, auth.ts, documents.ts)
│   │   ├── components/        (chat, dashboard, documents, graph, ...)
│   │   ├── context/           (AuthContext)
│   │   ├── pages/             (Login, Dashboard, Documents, Chat, ...)
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── theme/
│   │   └── App.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

# Installation

## Backend

```bash
cd backend

python -m venv venv
```

Windows

```bash
venv\Scripts\activate
```

Linux

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run backend

```bash
uvicorn app.main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# Environment Variables

Create a `.env` file inside the backend directory.

```env
DATABASE_URL=postgresql://username:password@localhost:5432/forgeai

JWT_SECRET_KEY=your_secret_key

JWT_ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60

REFRESH_TOKEN_EXPIRE_DAYS=7

OPENROUTER_API_KEY=your_api_key

OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

OPENROUTER_MODEL=deepseek/deepseek-chat-v3

VISION_MODEL=google/gemini-flash-1.5

TESSERACT_PATH=C:\Program Files\Tesseract-OCR\tesseract.exe
```

---

# API Overview

Authentication

```
POST /auth/register

POST /auth/login

POST /auth/refresh
```

Documents

```
GET /documents

POST /documents/upload

DELETE /documents/{id}
```

Chat

```
POST /chat

GET /chat/sessions

GET /chat/messages/{session_id}
```

Knowledge Graph

```
GET /graph

GET /graph/node/{concept}
```

---


# Challenges Faced

During the development of ForgeAI several engineering challenges were encountered.

## 1. Context-aware Conversations

Challenge

Follow-up questions such as:

> Why is it important?

should automatically refer to the previous engineering topic.

Solution

Implemented conversation history with a Query Rewriter that rewrites follow-up questions into standalone questions before retrieval.

---

## 2. Accurate Document Retrieval

Challenge

Large industrial manuals contain thousands of paragraphs, making direct LLM querying inefficient.

Solution

Implemented semantic chunking with dense embeddings using Sentence Transformers and ChromaDB to retrieve only the most relevant sections.

---

## 3. Explainable AI Responses

Challenge

LLM-generated responses should be verifiable.

Solution

Each response includes:

- Source document
- Page number
- Section
- Similarity-based retrieval

allowing engineers to verify every answer.

---

## 4. Knowledge Discovery

Challenge

Engineers should be able to visualize relationships between engineering concepts instead of reading hundreds of pages.

Solution

Implemented an interactive Knowledge Graph generated from uploaded documents with clickable nodes and linked document references.

---

## 5. P&ID & Engineering Drawing Extraction

Challenge

Standard OCR fails on engineering P&ID diagrams — sparse labels, equipment tags (T-101), and technical annotations are misread or missed entirely.

Solution

Added a 3-tier extraction pipeline:
1. Native PDF text extraction (fast path)
2. Improved Tesseract OCR with image preprocessing (contrast, sharpening, binarization) and smart PSM selection (PSM 11 for sparse diagrams, PSM 6 for dense docs)
3. LLM Vision fallback via Gemini Flash 1.5 that extracts equipment tags, process parameters, valve labels, and line specs

---

## 6. Multi-Entity Query Expansion

Challenge

Questions like *"List all equipment tags"* or *"Summarize all incidents"* require retrieving information about multiple distinct entities, which a single vector search may miss.

Solution

Implemented a Multi-Entity RAG Router that:
1. Classifies the query as multi-entity using a fast LLM call
2. Runs a preliminary vector search to identify candidate entities
3. Extracts entity names via LLM
4. Launches parallel sub-queries for each entity (capped at 10)
5. Merges and deduplicates all chunks before building the final prompt

---

## 7. Token Expiry & Seamless Refresh

Challenge

Users returning after an idle period received 401 errors, breaking the experience.

Solution

Implemented a refresh token system:
- Backend: `POST /auth/refresh` issues new access + refresh token pairs
- Frontend: Axios response interceptor catches 401s, automatically refreshes, and replays queued requests — all transparent to the user

---

## 8. Session Management

Challenge

Maintain multiple conversations without losing context.

Solution

Implemented persistent chat sessions with automatic session titles and conversation history stored in PostgreSQL.


# Future Enhancements

- Predictive Maintenance Agent
- Multi-document comparison
- Neo4j Graph Database integration
- Multi-Agent AI workflows
- Cloud deployment with persistent vector database
- Role-based access control (RBAC)
- Rate limiting

# Key Innovations

ForgeAI combines multiple AI techniques into a unified platform.

- Retrieval-Augmented Generation (RAG) with Multi-Entity Expansion
- Semantic Search
- Conversation Memory
- Explainable AI with source attribution
- Interactive Knowledge Graph
- Industrial Document Intelligence
- P&ID / Engineering Drawing Vision Analysis
- 3-Tier OCR Pipeline (text → Tesseract → LLM Vision)
- Automatic Token Refresh
- Image File Upload Support (PNG/JPEG)

Unlike traditional document search systems, ForgeAI enables engineers to ask natural language questions and receive context-aware, source-backed responses within seconds.


---

# Author

Mohd Yusuf


---

# License

This project was developed as part of a Hackathon submission.

---

# Screenshots

- Login Page
- Dashboard
- Document Upload
- AI Chat
- Knowledge Graph

(Screenshots uploading soon........)

---

# Acknowledgements

- FastAPI
- React
- Material UI
- ChromaDB
- Sentence Transformers
- OpenRouter
- spaCy
- PyMuPDF

# Impact

ForgeAI significantly reduces the time required to search technical documentation and assists engineers in accessing critical maintenance knowledge through natural language interaction.

The platform transforms static industrial documents into an intelligent knowledge system capable of supporting maintenance, operations, and decision-making processes.
