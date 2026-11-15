import 'dotenv/config';
import http from 'http';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getApiApp, attachSeoRoutes } from './src/server/createApiApp';

async function startServer() {
  const app = getApiApp();
  const portArgIndex = process.argv.indexOf('--port');
  const cliPort = portArgIndex !== -1 ? parseInt(process.argv[portArgIndex + 1], 10) : undefined;
  const PORT = Number(process.env.PORT) || cliPort || 3000;

  const hostArgIndex = process.argv.indexOf('--host');
  const cliHost = hostArgIndex !== -1 ? process.argv[hostArgIndex + 1] : undefined;
  const HOST = process.env.HOST || cliHost || '0.0.0.0';

  attachSeoRoutes(app);

  const httpServer = http.createServer(app);

  // Vite middleware setup in development; static dist serving in production
  if (process.env.NODE_ENV !== 'production') {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer },
        watch: isHmrDisabled ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, HOST, () => {
    console.log(`BALKI TECHNOLOGIES server running on http://${HOST}:${PORT}`);
  });

  const shutdown = () => {
    httpServer.close(() => {
      process.exit(0);
    });
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer();
