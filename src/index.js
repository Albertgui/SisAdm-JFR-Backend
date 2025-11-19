import express from 'express';
import morgan from 'morgan';
import personaRoutes from './routes/persona.routes.js'
import { PORT } from './config.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(personaRoutes)

app.listen(PORT);
console.log('Escuchando en puerto:', PORT)