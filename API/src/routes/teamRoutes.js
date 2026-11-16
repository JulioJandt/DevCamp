import express from 'express';
import {
  lerTimes,
  lerTimePorId,
  addTime,
  attTime,
  delTime,
  addJogador,
  removeJogador
} from '../controllers/teamController.js';

const router = express.Router();

router.get('/', lerTimes);
router.get('/:id', lerTimePorId);
router.post('/', addTime);
router.put('/:id', attTime);
router.delete('/:id', delTime);
router.post('/:id/jogadores', addJogador);
router.delete('/:id/jogadores/:jogadorId', removeJogador);

export default router;
