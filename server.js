import express from 'express';
import userRoutes from './src/routes/userRoutes.js';
import teamRoutes from './src/routes/teamRoutes.js';
import matchRoutes from './src/routes/matchRoutes.js';
import tournamentRoutes from './src/routes/tournamentRoutes.js';
import gameRoutes from './src/routes/gameRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import { verificarToken } from './src/middlewares/authMiddleware.js';

const app = express();
const port = 3000;

// Middleware para parse de JSON
app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
  res.send('API com Express funcionando!');
});

// Rota de login (pública)
app.use(authRoutes);

// A partir daqui, todas as rotas exigem um token JWT válido
app.use(verificarToken);

// Rotas
app.use('/users', userRoutes);
app.use('/teams', teamRoutes);
app.use('/matches', matchRoutes);
app.use('/tournaments', tournamentRoutes);
app.use('/games', gameRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});