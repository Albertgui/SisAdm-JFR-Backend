import { Router } from "express";
import { createUser, eliminarUsuario, loginUser, obtenerUsuarios } from "../controllers/login.controller.js";
import { validationsLogin } from "../middlewares/login.middleware.js";

const router = Router()

//Obtener usuarios
router.get('/get-user', obtenerUsuarios);

// Registrar usuarios
router.post('/register', createUser);

//Login usuarios
router.post('/login', validationsLogin, loginUser);

//Borrar usuario
router.delete('/delete/:id', eliminarUsuario);

export default router;