import { pool } from '../db.js';
import { checkPersonaExists } from './person.controller.js';

// Ver proyectos en tabla
export const getProyectosConDetalles = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM vista_proyectos_por_persona');
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron proyectos.' });
        }
        res.status(200).json({message: 'Consulta de proyectos exitosa', data: rows});
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// Obtener todos los proyectos
export const getAllProyectos = async (req, res) => {
    try {
        const {rows} = await pool.query('SELECT * FROM proyecto as pro JOIN persona as per ON pro.id_persona = per.cedula');
        if (rows.length === 0) {
            return res.status(404).json({message: 'No hay registros'});
        }
        res.json(rows);
    } catch (error) {
        res.status(500).json({message: 'Error interno del servidor'})
    }
}

// Obtener un proyecto
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
        const id_persona = body.id_persona;
        const personaExist = checkPersonaExists(id_persona);
        if (!personaExist) {
            return res.status(404).json({message: 'La persona con esa cedula no existe y no se puede asociar al proyecto.'});
        }
        const {rows} = pool.query('INSERT INTO proyecto (id_persona, nombre_proyecto, presupuesto, fecha_inicio, fecha_fin) VALUES ($1, $2, $3, $4, $5) RETURNING *', [id_persona, nombre_proyecto, presupuesto, fecha_inicio, fecha_fin]);
        res.json({message: 'Proyecto creado con éxito', data: rows});
    } catch (error) {
        res.status(500).json({message: 'Error interno del servidor'});
    }
}

// Editar un proyecto
export const editProyecto = async (req, res) => {
    try {
        const { id } = req.params; 
        const body = req.body;
        console.log(body) 
        const nombre_proyecto = body.nombre_proyecto.trim();
        const presupuesto = body.presupuesto;
        const fecha_inicio = body.fecha_inicio;
        const fecha_fin = body.fecha_fin;
        const cedula = body.cedula.trim(); 
        const personaExist = await checkPersonaExists(cedula); 
        if (!personaExist) {
            return res.status(404).json({message: `La cédula ${cedula} no existe y no se puede asociar al proyecto.`});
        }
        const result = await pool.query('UPDATE proyecto SET id_persona = $1, nombre_proyecto = $2, presupuesto = $3, fecha_inicio = $4, fecha_fin = $5 WHERE id_proyecto = $6 RETURNING *', [cedula, nombre_proyecto, presupuesto, fecha_inicio, fecha_fin, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({message: `El proyecto con ID ${id} no existe o no se pudo editar.`});
        }
        res.json({message: 'Proyecto editado con éxito', data: result.rows});
    } catch (error) {
        res.status(500).json({message: 'Error interno del servidor'});
    }
}

// Eliminar un proyecto
export const deleteProyecto = async (req, res) => {
    try {
        const {id} = req.params;
        const {rows} = await pool.query('DELETE FROM proyecto WHERE id_proyecto = $1 RETURNING *', [id]);
        if (rows.length === 0) {
            return res.status(404).json({message: 'No existe ese proyecto', data: rows});
        }
        res.json({message: 'Proyecto eliminado con éxito', data: rows});
    } catch (error) {
        res.status(500).json({message: 'Error interno del servidor'});
    }
}