import { Router } from "express";
import { createPerson, deletePerson, editPerson, getAllPersona, getPersonaId } from "../controllers/person.controller.js";

const router = Router();

// Obtener todas las personas
router.get('/person/all-person', getAllPersona);

// Obtener una persona
router.get('/person/:id', getPersonaId);

// Crear una persona
router.post('/person', createPerson);

// Editar una persona
router.put('/person/:id', editPerson);

// Eliminar una persona
router.delete('/person/:id', deletePerson);

export default router;