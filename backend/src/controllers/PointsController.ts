import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;

    const parserItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    const points = await knex('points')
      .join('points_items', 'points.id', '=', 'points_items.point_id')
      .whereIn('points_items.item_id', parserItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    const serializedPoints = points.map(point => {
      return {
        ...point,
        image_url: `http://192.168.100.108:3333/uploads/temp/${point.image}`,
      }
    });

    return res.json(serializedPoints);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const point = await knex('points').where('id', id).first();

    const serializedPoint = {
      ...point,
      image_url: `http://192.168.100.108:3333/uploads/temp/${point.image}`,
    };

    if (!point) {
      return res.status(400).json({ message: 'Point not found' })
    }

    const items = await knex('items')
      .join('points_items', 'items.id', '=', 'points_items.item_id')
      .where('points_items.point_id', '=', id)
      .select('items.title');

    return res.json({ serializedPoint, items });

  }

  async create(req: Request, res: Response) {

    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    } = req.body;

    const trx = await knex.transaction();

    const points = {
      image: req.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    };

    const insertIds = await trx('points').insert(points);

    const point_id = insertIds[0];
    const pointItems = items
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
        return {
          item_id,
          point_id
        };
      });

    await trx('points_items').insert(pointItems);

    await trx.commit();

    return res.json({
      id: point_id,
      ...points
    })
  }

};

export default PointsController;