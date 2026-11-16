import express from 'express';
import {
  lerJogos,
  lerJogoPorId,
  addJogo,
  delJogo
} from '../controllers/gameController.js';

const router = express.Router();

router.get('/', lerJogos);
router.get('/:id', lerJogoPorId);
router.post('/', addJogo);
router.delete('/:id', delJogo);

export default router;