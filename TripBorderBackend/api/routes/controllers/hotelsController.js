import logger from '../../../setupPino';
import { getPaginationOffset } from './utility/paginationUtility';
import { getTableTotalCountDB } from '../../knex/utilityknex';
import {
  getHotelsPaginationDB,
  createHotelByTripIDDB,
  updateHotelByIDDB,
  deleteHotelByIDDB
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
  orderBy: 'check_in',
  orderPrecedence: 'asc'
});

export const createHotelByTrip = async (req, res) => {
  try {
    const hotel = req.body.data;
    const newHotels = await createHotelByTripIDDB(hotel);

    res.json({
      hotels: newHotels,
    });
  } catch (error) {
    logger.error(`Error Creating Hotel by trips_uuid ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateHotelByID = async (req, res) => {
  const { uuid } = req.params;
  const updateData = req.body.data;

  try {
    const updatedRows = await updateHotelByIDDB(uuid, updateData);

    if (updatedRows === 0) {
      res.status(404).json({ error: 'Hotel not found' });
    } else {
      res.json({ message: 'Hotel Updated!' });
    }
  } catch (error) {
    logger.error(`Error in updating Hotel: ${error}`);
    res.status(500).send({ error: 'Failed to update Hotel' });
  }
};

export const deleteHotelByID = async (req, res) => {
  const hotelID = req.body.data;

  try {
    await deleteHotelByIDDB(hotelID);
    res.json({ message: 'Hotel Removed!' });
  } catch (error) {
    logger.error(`Error in removing Hotel: ${error}`);
    res.status(500).send({ error: 'Failed to remove Hotel' });
  }
};
