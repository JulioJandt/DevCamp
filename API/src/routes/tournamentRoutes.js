import express from 'express';
import {
  lerTorneios,
  lerTorneioPorId,
  addTorneio,
  inscreverEquipe,
  attTorneio,
  delTorneio
} from '../controllers/tournamentController.js';

const router = express.Router();

router.get('/', lerTorneios);
router.get('/:id', lerTorneioPorId);
router.post('/', addTorneio);
router.post('/:id/inscrever', inscreverEquipe);
router.put('/:id', attTorneio);
router.delete('/:id', delTorneio);

export default router;