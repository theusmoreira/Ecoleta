import { Router } from 'express';

import validatorPoint from './validators/createPoint';

import multer from 'multer';
import multerConfig from './config/multer';

import ItemsController from './controllers/ItemsController';
import PointsController from './controllers/PointsController';



const routes = Router();
const upload = multer(multerConfig);

const itemsController = new ItemsController();
const pointController = new PointsController();

routes.get('/items', itemsController.index);

routes.get('/points', pointController.index);
routes.get('/points/:id', pointController.show);

routes.post('/points', 
upload.single('image'),
validatorPoint,
pointController.create
);

export default routes;
