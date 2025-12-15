import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import personaRoutes from './routes/persona.routes.js'
import projectRoutes from './routes/projects.routes.js'
import loginRoutes from './routes/login.routes.js'
import { PORT } from './config.js';

const app = express();
app.use(cors());

app.use(morgan('dev'));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, '..', '..', 'uploads'); 
app.use('/uploads', express.static(uploadsPath))

// Usar rutas y controladores
app.use(personaRoutes);
app.use(projectRoutes);
app.use(loginRoutes);

app.listen(PORT, () => {
    console.log('Escuchando en puerto:', PORT);
});
