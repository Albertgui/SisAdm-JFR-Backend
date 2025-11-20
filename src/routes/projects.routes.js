import { Router } from 'express';
import { createProyecto, deleteProyecto, editProyecto, getAllProyectos, getProyectoId, getProyectosConDetalles } from '../controllers/projects.controller.js';

const router = Router();

// Ver en tabla los proyectos
router.get('/project/table', getProyectosConDetalles);

// Obtener todos los proyectos
router.get('/project/all-projects', getAllProyectos);

// Obtener un proyecto
router.get('/project/:id', getProyectoId);

// Crear un proyecto
router.post('/project', createProyecto);

// Editar un proyecto
router.put('/project/:id', editProyecto);

// Eliminar un proyecto
router.delete('/project/:id', deleteProyecto);

export default router;