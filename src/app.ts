import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import { getFullApiSpec, initializeSwagger } from './config/swagger';
import db from './config/knex';
import router from './router';
import { errorHandler } from './middlewares/error-handler';
import { shortRateLimiter, longRateLimiter } from './middlewares/rate-limiter';
import main from './utils/message-broker';
main();

const app: Express = express();
initializeSwagger();

// Middleware Setup
app.use(
  cors({
    origin: true, // reflect request origin (any origin allowed)
    credentials: true, // send/receive cookies cross-origin
  }),
);
app.use(express.json());
// app.use(shortRateLimiter);
// app.use(longRateLimiter);

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
// ================================================================

// Route Definitions
const fullApiSpec = getFullApiSpec();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(fullApiSpec));

app.get('/api/health', async (req: Request, res: Response) => {
  try {
    await db.raw('SELECT 1+1 as result');
    res.status(200).json({
      status: 'ok',
      message: 'Server is up and database is connected.',
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(503).json({
      status: 'error',
      message: 'Server is up but database connection failed.',
    });
  }
});

app.use('/', router);
app.use(errorHandler);
// ================================================================

// Server Startup
const port = process.env.PORT || 3000;
const server = http.createServer(app);
async function startServer() {
  try {
    await db.raw('SELECT 1+1 as result');
    console.log('✅ Database connection successful!');

    server.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
    console.error('Server will not start without a database connection.');
    process.exit(1);
  }
}
startServer();
// ================================================================
