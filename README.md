# SBKE - Space Biology Knowledge Engine

A unified platform for accessing NASA space biology research data, publications, datasets, and projects.

## Project Structure

```
sbke/
├── frontend/           # Next.js React application
│   ├── src/
│   │   ├── app/       # Next.js pages & API routes
│   │   ├── components/ # React components
│   │   ├── hooks/     # Custom React hooks
│   │   └── lib/       # Utilities & services
│   ├── package.json
│   └── next.config.mjs
├── backend/            # Reserved for future microservices
│   └── (currently unused)
├── datasets/          # Data processing and storage
│   ├── *.json         # NASA data files
│   ├── *.py           # Python data processing scripts
│   └── requirements.txt
└── package.json       # Root package.json for monorepo
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- npm or pnpm

### Installation

1. Install all dependencies:
```bash
npm run install:all
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

### Development

Start the application:
```bash
npm run dev
```

This runs the Next.js application with integrated API routes on http://localhost:3000

### Data Processing

Process NASA datasets:
```bash
npm run data:process
```

### Building for Production

```bash
npm run build
npm run start
```

## Features

- **Unified Search**: Search across 4 NASA data sources simultaneously
- **AI-Powered Discovery**: Semantic search with natural language queries
- **Knowledge Graph**: Visualize connections between research entities
- **Timeline Analysis**: Track research evolution over time
- **Citation Tools**: Export citations in multiple formats
- **Deep Linking**: Direct access to original NASA sources

## Data Sources

- NASA Publications
- OSDR Datasets  
- NSLSL Library
- Task Book Projects

## Technology Stack

### Frontend
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Radix UI Components

### Backend  
- Node.js
- TypeScript
- Neon Database
- Google Generative AI

### Data Processing
- Python
- BeautifulSoup
- Pandas
- NumPy