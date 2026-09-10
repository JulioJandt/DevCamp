import express from 'express';
import {
  lerPartidas,
  lerPartidaPorId,
  addPartida,
  attPlacar,
  delPartida
} from '../controllers/matchController.js';

const router = express.Router();

router.get('/', lerPartidas);
router.get('/:id', lerPartidaPorId);
router.post('/', addPartida);
router.put('/:id/placar', attPlacar);
router.delete('/:id', delPartida);

export default router;
