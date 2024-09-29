import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import serverless from 'serverless-http';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// const __dirname = dirname(fileURLToPath(import.meta.url));


const app = express();

const router = express.Router()
// Middlewares
app.use(cors());
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", 'cdn.jsdelivr.net'],
                styleSrc: ["'self'", 'cdn.jsdelivr.net', 'fonts.googleapis.com'],
                fontSrc: ["'self'", 'fonts.gstatic.com', 'cdn.jsdelivr.net'],
                connectSrc: ["'self'"],
                objectSrc: ["'none'"],
                mediaSrc: ["'none'"],
                frameSrc: ["'none'"],
            },
        },
        crossOriginEmbedderPolicy: true,
    })
);
app.use(morgan('dev'));
// servir archivos estaticos en desarrollo
// app.use(express.static(path.join(__dirname, '..','dist')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes


// API routes
let tasks = [];


// app.get('/',(req,res)=>{
//     res.sendFile(path.join(__dirname,'..' ,'dist','index.html'))
// })

router.post('/addTask', (req, res) => {
    const { task, done } = req.body;
    const newTask = { id: tasks.length + 1, task, done };
    tasks.push(newTask);
    res.json(newTask);
});

router.delete('/delTask', (req, res) => {
    const { id } = req.body;
    tasks = tasks.filter(task => task.id !== parseInt(id));
    res.json(tasks);
});

router.put('/editTask', (req, res) => {
    const { id, task, done } = req.body;
    const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
    if (tasks[taskIndex] !== undefined) {
        tasks[taskIndex].task = task;
        tasks[taskIndex].done = done;
        res.json(tasks[taskIndex]);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

router.get('/getDataDesserts', async (req, res) => {
    try {
        const readDessertData = await fs.readFile(path.join(__dirname, '..','dessert-data.json'), 'utf-8');
        const parseDessertData = JSON.parse(readDessertData);
        res.json(parseDessertData);
    } catch (error) {
        console.error('Ocurrió un error', error);
        res.status(500).json({ error: 'Error al leer los datos' });
    }
});
// app.get('/api/getDataDesserts', async (req, res) => {
//     try {
//         const readDessertData = await fs.readFile(path.join(__dirname, '..','dessert-data.json'), 'utf-8');
//         const parseDessertData = JSON.parse(readDessertData);
//         res.json(parseDessertData);
//     } catch (error) {
//         console.error('Ocurrió un error', error);
//         res.status(500).json({ error: 'Error al leer los datos' });
//     }
// });


// configurar en que puerto escuchar en modo desarrollo
// const port = globalThis.process.env.port ?? 1234
// app.listen(port, () => {
//     console.log(`Server is running on port http://localhost:${port}`);
//     });

app.use('/.netlify/functions/api', router)

// Export the serverless function
export const handler = serverless(app);