import { Router } from 'express';
import { createProyecto, deleteProyecto, editProyecto, getAllProyectos, getProyectoId, getProyectosConDetalles } from '../controllers/projects.controller.js';
import { getBillsId, upload, uploadFactura } from '../controllers/bills.controller.js';

const router = Router();

// Ver en tabla los proyectos
router.get('/project/table', getProyectosConDetalles);

// Obtener todos los proyectos
router.get('/project/all-projects', getAllProyectos);

// Obtener un proyecto
router.get('/project/:id', getProyectoId);

// Obtener facturas por proyecto
router.get('/project/:id/bills', getBillsId);

// Crear un proyecto
router.post('/project', createProyecto);

// Subir una factura
router.post('/project/upload-img', upload.single('imagen'), uploadFactura);

// Editar un proyecto
router.put('/project/:id', editProyecto);

// Eliminar un proyecto
router.delete('/project/:id', deleteProyecto);

export default router;