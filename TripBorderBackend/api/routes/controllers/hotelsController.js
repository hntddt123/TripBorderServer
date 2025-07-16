import logger from '../../../setupPino';
import { getPaginationOffset } from './utility/paginationUtility';
import { getTableTotalCountDB } from '../../knex/utilityknex';
import {
  getHotelsPaginationDB,
  createHotelsByTripIDDB,
  deleteHotelsByIDDB
} from '../../knex/hotelsknex';
import { getResourcesByTripID } from './utility/genericControllerUtility';

export const getAllHotelsPagination = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const offset = getPaginationOffset(page, limit);

    const totalResult = await getTableTotalCountDB('hotels');
    const total = parseInt(totalResult.total, 10);

    const hotels = await getHotelsPaginationDB(limit, offset);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      res.status(400).json({ error: 'Invalid page number' });
    }

    res.json({
      hotels,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching hotels ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getHotelsByTrip = async (req, res) => getResourcesByTripID(req, res, {
  resourceName: 'hotels',
  orderBy: 'check_in'
});

export const createHotelsByTrip = async (req, res) => {
  try {
    const hotels = req.body.data;

    const newHotels = await createHotelsByTripIDDB(hotels);

    res.json({
      hotels: newHotels,
    });
  } catch (error) {
    logger.error(`Error Creating Hotels by trips_uuid ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteHotelsByID = async (req, res) => {
  const hotelID = req.body.data;

  try {
    await deleteHotelsByIDDB(hotelID);
    res.json({ message: 'Hotels Removed!' });
  } catch (error) {
    logger.error(`Error in removing Hotels: ${error}`);
    res.status(500).send({ error: 'Failed to remove Hotels' });
  }
};
