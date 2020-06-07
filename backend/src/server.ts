import express from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import { errors } from 'celebrate';


import routes from './routes';

const app = express();

app.use(cors());

app.use(express.json());
app.use(morgan('dev'));
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errors());

const PORT = 3333;

app.listen(PORT, () => console.log(`> [Server] start in port ${PORT}` ));