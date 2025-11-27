import { pool } from '../db.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

export const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

export const uploadFactura = async (req, res) => {
    try {
    const { id_proyecto } = req.body;
    if (!req.file) {
        return res.status(400).json({ error: 'No se subió ningún archivo' });
    }
    const rutaRelativa = `uploads/${req.file.filename}`;
    const result = await pool.query('INSERT INTO factura (id_proyecto, url_imagen, nombre_archivo) VALUES ($1, $2, $3) RETURNING *;', [id_proyecto, rutaRelativa, req.file.originalname]);
    const fullUrl = `${req.protocol}://${req.get('host')}/${rutaRelativa}`;
    res.json({ ...result.rows[0], fullUrl });
    } catch (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'El archivo excede el límite de 10MB' });
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Traer facturas por proyecto
export const getBillsId = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM factura WHERE id_proyecto = $1 ORDER BY created_at DESC', [id]);
        const imagenesConUrl = result.rows.map(img => ({
            ...img,
            url_completa: `${req.protocol}://${req.get('host')}/${img.url_imagen}`
        }));
        res.json(imagenesConUrl);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener imágenes');
    }
};

