import { pool } from '../db.js';

// Traer todas las personas
export const getAllPersona = async (req, res) => {
    try {
        const {rows} = await pool.query('SELECT * FROM persona');
        if (rows.length === 0) {
            return res.status(404).json({message: 'No hay registros'});
        }
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({message: 'Error interno del servidor'})
    }
}

// Traer una persona
export const getPersonaId = async (req, res) => {
    try {
        const {id} = req.params;
        const cedula = id.trim();
        const {rows} = await pool.query('SELECT * FROM persona WHERE cedula = $1', [cedula]);
        if (rows.length === 0) {
            return res.status(404).json({message: 'No se encontró la persona'});
        }
        res.json(rows);
    } catch (error) {
        res.status(500).json({message: 'Error interno del servidor'})
    }
}

// Crear una persona
export const createPerson = async (req, res) => {
    try {
        const body = req.body;
        const nombre = body.nombre.trim()
        const cedula = body.cedula.trim()
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!nombre || !nameRegex.test(nombre)) {
            return res.status(400).json({ 
                message: 'El campo "nombre" es inválido. Solo se permiten letras y espacios' 
            });
        }
        const cedulaRegex = /^\d+$/; 
        if (!cedula || !cedulaRegex.test(cedula)) {
            return res.status(400).json({ 
                message: 'El campo "cédula" es inválido. Solo se permiten números.' 
            });
        }
        const {rows} = await pool.query('INSERT INTO persona (nombre, cedula) VALUES ($1, $2) RETURNING *', [nombre, cedula]);
        res.json({message: 'Persona creada con éxito', data: rows});
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ 
                message: 'La cédula proporcionada ya existe en el sistema',
                error: error.code
            });
        }
        res.status(500).json({message: 'Error interno del servidor', error: error.code});
    }
}

// Editar una persona
export const editPerson = async (req, res) => {
    try {
        const {id} = req.params;
        const data = req.body;
        const nombre = data.nombre.trim();
        const cedula = id.trim();
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!nombre || !nameRegex.test(nombre)) {
            return res.status(400).json({ 
                message: 'El campo nombre es inválido. Solo se permiten letras y espacios' 
            });
        }
        const cedulaRegex = /^\d+$/; 
        if (!cedula || !cedulaRegex.test(cedula)) {
            return res.status(400).json({ 
                message: 'El campo cédula es inválido. Solo se permiten números.' 
            });
        }
        const {rows} = await pool.query('UPDATE persona SET nombre = $1, cedula = $2 WHERE cedula = $2 RETURNING *', [nombre, cedula]);
        if (rows.length === 0) {
            return res.status(404).json({message: 'Usuario no encontrado'});
        } 
        res.json({message: 'Persona editada con éxito', data: rows});
    } catch (error) {
        res.status(500).json({message: 'Error interno del servidor', error: error.code});
    }
}

// Eliminar una persona
export const deletePerson = async (req, res) => {
    try {
        const {id} = req.params;
        const cedula = id.trim();
        const {rows} = await pool.query('DELETE FROM persona WHERE cedula = $1 RETURNING *', [cedula]);
        if (rows.length === 0) {
            return res.status(404).json({message: 'Usuario no encontrado'});
        } 
        res.json({message: 'Se ha eliminado con éxito', data: rows});
    } catch (error) {
        res.status(500).json({message: 'Error interno del servidor'});
    }
}

// Función para saber si existe la persona para guardar el proyecto
export const checkPersonaExists = async (id_persona) => {
    const { rows } = await pool.query('SELECT COUNT(*) FROM persona WHERE cedula = $1', [id_persona]);
    const count = parseInt(rows[0].count, 10); 
    return count > 0;
}