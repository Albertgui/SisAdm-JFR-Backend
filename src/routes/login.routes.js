import { Router } from "express";
import { createUser, eliminarUsuario, loginUser, obtenerUsuarios } from "../controllers/login.controller.js";

const router = Router()

// Obtener rutas protegidas
//router.get('/protected');

//Obtener usuarios
router.get('/get-user', obtenerUsuarios);

// Registrar usuarios
router.post('/register', createUser);

//Login usuarios
router.post('/login', loginUser);

//Borrar usuario
router.delete('/delete/:id', eliminarUsuario);

// Login de usuarios
//router.post('/login');

// Logout de usuarios
//router.post('/logout')

export default router;