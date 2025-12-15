import { pool } from "../db.js";
import bcrypt from 'bcryptjs';

// Obtener todos los usuarios
export const obtenerUsuarios = async(req, res) => {
    try {
        const { rows } = await pool.query(`SELECT * FROM tm_user`)
        res.json({ message: 'Solicitud exitosa.', data: rows });
    } catch (error) {
        res.status(500).json({message: 'Error interno del servidor'});
    }
}

// Crear un usuario
export const createUser = async(req, res) => {
    try {
        const {username, pass} = req.body;
        if (!username || !pass) {
            return res.status(404).json({ message: 'Los datos no fueron enviados de forma correcta' })
        }
        const isValid = await validarUser(username);
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(pass, salt);
        if (!isValid) {
            const { rows } = await pool.query(`INSERT INTO tm_user (username, pass) VALUES ($1, $2) RETURNING *`, [username, passwordHash]);
            return res.json({ message: 'Se ha creado el usuario con éxito', data: rows });
        }else {
            return res.json({ message: `El nombre de usuario ${username} ya está registrado` });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Error interno del servidor'});
    }
}

// Lógica de login 
export const loginUser = async(req, res) => {
    try {
        const {username, pass} = req.body;
        if (!username || !pass) {
            return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
        }
        const result = await pool.query('SELECT * FROM tm_user WHERE username = $1', [usuario]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        const userFound = result.rows[0];
        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        // 5. Login Exitoso
        // Aquí normalmente generarías un token (JWT), pero por ahora devolvemos los datos (sin el password)
        // Eliminamos el password del objeto antes de enviarlo
        const { password: _, ...userPublicData } = userFound;
        return res.status(200).json({ message: 'Login exitoso', user: userPublicData });
    } catch {
        res.status(500).json({message: 'Error interno del servidor'});
    }
}

// Eliminar usuario
export const eliminarUsuario = async(req, res) => {
    try {
        const {id} = req.params;
        if(!id){
            res.status(404).json({ message: 'El id no existe'});
        }
        const { rows } = await pool.query(`DELETE FROM tm_user WHERE id = $1 RETURNING *`, [id]);
        res.json({ message: 'Se ha eliminado el usuario con éxito', data: rows });
    } catch (error) {
        res.status(500).json({message: 'Error interno del servidor'});
    }
}


// Validar si existe el usuario
export const validarUser = async (user) => {
    try {
        const { rows } = await pool.query(`SELECT COUNT(*) FROM tm_user WHERE username = $1`, [user]);
        const count = parseInt(rows[0].count, 10); 
        return count > 0;
    } catch (error) {
        res.status(500).json({message: 'Error interno del servidor'});
    }
}

