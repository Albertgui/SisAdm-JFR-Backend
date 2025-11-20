import { Router } from 'express';
import { createProyecto, getAllProyectos, getProyectoId } from '../controllers/projects.controller.js';

const router = Router();

// Obtener todos los proyectos
router.get('/project/all-projects', getAllProyectos);

// Obtener un proyecto
router.get('/project/:id', getProyectoId);

// Crear un proyecto
router.post('/project', createProyecto);

export default router;