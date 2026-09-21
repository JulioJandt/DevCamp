import express from 'express';
import userRoutes from './src/routes/userRoutes.js';
import teamRoutes from './src/routes/teamRoutes.js';
import matchRoutes from './src/routes/matchRoutes.js';
import tournamentRoutes from './src/routes/tournamentRoutes.js';

const app = express();
const port = 3000;

// Middleware para parse de JSON
app.use(express.json());

// Rotas
app.use('/users', userRoutes);
app.use('/teams', teamRoutes);
app.use('/matches', matchRoutes); 
app.use('/tournaments', tournamentRoutes); 

// Rota inicial
app.get('/', (req, res) => {
  res.send('API com Express funcionando!');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});