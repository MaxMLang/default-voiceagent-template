// Import dotenv at the top to load environment variables early
require('dotenv').config();

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
// Explicitly tell Next.js not to start its own server
const app = next({ dev, hostname: '0.0.0.0', port: process.env.PORT || 3000 });
const handle = app.getRequestHandler();
const port = parseInt(process.env.PORT || '3000', 10);

// Add global error handler
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Log environment info
console.log('Starting server with:');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`PORT: ${port}`);

app.prepare()
  .then(() => {
    console.log('Next.js app prepared');
    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });
    
    server.listen(port, '0.0.0.0', (err) => {
      if (err) {
        console.error('Error starting server:', err);
        throw err;
      }
      console.log(`> Ready on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Error preparing app:', err);
    process.exit(1);
  }); 