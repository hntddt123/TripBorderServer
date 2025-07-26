import logger from '../../../setupPino';
import { getPaginationOffset } from './utility/paginationUtility';
import { getResourcesByTripID } from './utility/genericControllerUtility';
import { getTableTotalCountDB } from '../../knex/utilityknex';
import {
  getPOIsPaginationDB,
  createPOIByTripIDDB,
  updatePOIByIDDB,
  deletePOIByIDDB
} from '../../knex/poiknex';

export const getAllPOIsPagination = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const offset = getPaginationOffset(page, limit);

    const totalResult = await getTableTotalCountDB('points_of_interest');
    const total = parseInt(totalResult.total, 10);

    const pois = await getPOIsPaginationDB(limit, offset);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      res.status(400).json({ error: 'Invalid page number' });
    }

    res.json({
      pois,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching points_of_interest ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPOIsByTrip = async (req, res) => getResourcesByTripID(req, res, {
  resourceName: 'points_of_interest',
  orderBy: 'visit_time',
  orderPrecedence: 'asc'
});

export const createPOIByTrip = async (req, res) => {
  try {
    const poi = req.body.data;

    const newPOI = await createPOIByTripIDDB(poi);

    res.json({
      poi: newPOI,
    });
  } catch (error) {
    logger.error(`Error Creating points_of_interest by trips_uuid ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePOIByID = async (req, res) => {
  const { uuid } = req.params;
  const updateData = req.body.data;

  try {
    const updatedRows = await updatePOIByIDDB(uuid, updateData);

    if (updatedRows === 0) {
      res.status(404).json({ error: 'POI not found' });
    } else {
      res.json({ message: 'POI Updated!' });
    }
  } catch (error) {
    logger.error(`Error in updating POI: ${error}`);
    res.status(500).send({ error: 'Failed to update POI' });
  }
};

export const deletePOIByID = async (req, res) => {
  const poiID = req.body.data;

  try {
    await deletePOIByIDDB(poiID);
    res.json({ message: 'POI Removed!' });
  } catch (error) {
    logger.error(`Error in removing points_of_interest: ${error}`);
    res.status(500).send({ error: 'Failed to remove points_of_interest' });
  }
};
