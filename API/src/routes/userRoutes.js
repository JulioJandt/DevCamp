import express from 'express';
import {
  lerUsuarios,
  lerUsuarioPorId,
  addUsuario,
  attUsuario,
  delUsuario
} from '../controllers/userController.js';

const router = express.Router();

router.get('/', lerUsuarios);
router.get('/:id', lerUsuarioPorId);
router.post('/', addUsuario);
router.put('/:id', attUsuario);
router.delete('/:id', delUsuario);

export default router;