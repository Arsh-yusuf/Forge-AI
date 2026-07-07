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

- JWT Authentication
- Secure Login
- User Registration
- Protected Routes

---

## Document Management

- Upload PDF documents
- Store document metadata
- Delete uploaded documents
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

Every uploaded PDF is automatically processed.

Pipeline:

PDF Upload

↓

Text Extraction (PyMuPDF)

↓

Semantic Chunking

↓

Embeddings

↓

Vector Database (ChromaDB)

---

## Retrieval-Augmented Generation (RAG)

ForgeAI answers questions using only uploaded industrial documents.

Pipeline:

User Question

↓

Query Rewriter

↓

Semantic Search

↓

Relevant Chunks

↓

Prompt Builder

↓

OpenRouter LLM

↓

Source-backed Answer

---

## AI Chat Assistant

Supports:

- Natural language questions
- Multi-turn conversations
- Conversation memory
- Follow-up questions
- Engineering knowledge retrieval

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

# System Architecture

```
                     React Frontend
                           │
                           │
                 JWT Authentication
                           │
                           ▼
                     FastAPI Backend
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
 Document Upload      AI Chat          Knowledge Graph
        │                  │                  │
        ▼                  ▼                  │
   PDF Extraction    Query Rewriter           │
        │                  │                  │
        ▼                  ▼                  │
 Semantic Chunking   Prompt Builder           │
        │                  │                  │
        ▼                  ▼                  │
 Sentence Embeddings        │                │
        │                  ▼                │
        └──────────► ChromaDB ◄─────────────┘
                     Vector Search
                           │
                           ▼
                     OpenRouter LLM
                           │
                           ▼
                   AI Generated Answer
                           │
                           ▼
                  PostgreSQL Database
```

---

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

- OpenRouter
- BAAI/bge-small-en-v1.5
- Sentence Transformers
- ChromaDB
- spaCy
- PyMuPDF

---

## Database

- PostgreSQL
- ChromaDB

---

# Project Structure

```
forge-ai/

│

├── backend/

│   ├── app/

│   │   ├── api/

│   │   ├── database/

│   │   ├── llm/

│   │   ├── models/

│   │   ├── routers/

│   │   ├── schemas/

│   │   ├── services/

│   │   ├── utils/

│   │   └── main.py

│   │

│   └── requirements.txt

│

├── frontend/

│   ├── src/

│   │   ├── api/

│   │   ├── components/

│   │   ├── pages/

│   │   ├── layouts/

│   │   └── App.tsx

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

SECRET_KEY=your_secret_key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60

OPENROUTER_API_KEY=your_api_key
```

---

# API Overview

Authentication

```
POST /auth/register

POST /auth/login
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

# Future Enhancements

- OCR support for scanned documents
- Compliance Intelligence Agent
- Predictive Maintenance Agent
- Multi-document comparison
- Neo4j Graph Database integration
- Multi-Agent AI workflows
- Cloud deployment with persistent vector database

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