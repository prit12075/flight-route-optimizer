import express from 'express';
import cors from 'cors';
import optimizeRouter from './routes/optimize.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/optimize', optimizeRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Flight Route Optimizer server running on port ${PORT}`);
});
