import { pool } from '../db.js';

// Obtener todos los proyectos
export const getAllProyectos = async (req, res) => {
    try {
        const {rows} = await pool.query('SELECT * FROM proyecto as pro JOIN persona as per ON pro.id_persona = per.id');
        if (rows.length === 0) {
            return res.status(404).json({message: 'No hay registros'});
        }
        res.json(rows);
    } catch (error) {
        res.status(500).json({message: 'Error interno del servidor'})
    }
}

// Obtener todos los proyectos
export const getProyectoId = async (req, res) => {
    try {
        const {id} = req.params;
        const {rows} = await pool.query('SELECT * FROM proyecto as pro JOIN persona as per ON pro.id_persona = per.id WHERE pro.id_proyecto = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({message: 'No existe el proyecto'});
        }
        res.json(rows);
    } catch (error) {
        res.status(500).json({message: 'Error interno del servidor'})
    }
}

// Crear un proyecto
export const createProyecto = async (req, res) => {
    try {
        const body = req.body;
        const nombre_proyecto = body.nombre_proyecto.trim();
        const presupuesto = body.presupuesto;
        const fecha_inicio = body.fecha_inicio;
        const fecha_fin = body.fecha_fin;
        const {rows} = pool.query('INSERT INTO proyecto (nombre_proyecto, presupuesto, fecha_inicio, fecha_fin) VALUES ($1, $2, $3, $4) RETURNING *', [nombre_proyecto, presupuesto, fecha_inicio, fecha_fin]);
        res.json({message: 'Proyecto creado con éxito', data: rows});
    } catch (error) {
        res.status(500).json({message: 'Error interno del servidor'})
    }
}