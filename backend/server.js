const http = require('http');
const url = require('url');
const path = require('path');

const PORT = process.env.PORT || 3001;

// Simple router for API endpoints
const routes = {
  '/api/search': require('./api/search/route.ts'),
  '/api/publications': require('./api/publications/route.ts'),
  '/api/ai/ask': require('./api/ai/ask/route.ts'),
  // Add other routes as needed
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Route handling
  if (routes[pathname]) {
    routes[pathname](req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

module.exports = server;