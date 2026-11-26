import logger from '../../../setupPino';
import { pickAllowedFields, UPDATABLE_FIELDS } from './utility/fieldUtility';
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
      return res.status(400).json({ error: 'Invalid page number' });
    }

    return res.json({
      hotels,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching hotels ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getHotelsByTrip = async (req, res) => getResourcesByTripID(req, res, {
  resourceName: 'hotels',
  orderBy: 'check_in',
  orderPrecedence: 'asc',
  publicOmitFields: ['booking_reference']
});

export const createHotelByTrip = async (req, res) => {
  try {
    const hotel = req.body.data;
    const newHotels = await createHotelByTripIDDB(hotel);

    return res.json({
      hotels: newHotels,
    });
  } catch (error) {
    logger.error(`Error Creating Hotel by trips_uuid ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateHotelByID = async (req, res) => {
  const { uuid } = req.params;
  // Ownership checked by requireRowTripOwner; only allow known columns
  const updateData = pickAllowedFields(req.body?.data, UPDATABLE_FIELDS.hotels);

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'No updatable fields' });
  }

  try {
    const updatedRows = await updateHotelByIDDB(uuid, updateData);

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    return res.json({ message: 'Hotel Updated!' });
  } catch (error) {
    logger.error(`Error in updating Hotel: ${error}`);
    return res.status(500).send({ error: 'Failed to update Hotel' });
  }
};

export const deleteHotelByID = async (req, res) => {
  const hotelID = req.body.data;

  try {
    await deleteHotelByIDDB(hotelID);
    return res.json({ message: 'Hotel Removed!' });
  } catch (error) {
    logger.error(`Error in removing Hotel: ${error}`);
    return res.status(500).send({ error: 'Failed to remove Hotel' });
  }
};
