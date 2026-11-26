import logger from '../../../setupPino';
import { isSubscriptionActive } from '../../../utility/time';
import {
  getTripsTotalCountDB,
  getTripsPublicTotalCountDB,
  getTripsPaginationDB,
  getTripsPublicPaginationDB,
  getMySharedTripsWithRecipientsPaginationDB,
  getMySharedTripsTotalCountDB,
  getOthersSharedTripsWithRecipientsPaginationDB,
  getOthersSharedTripsTotalCountDB,
  getTripsByUUIDDB,
  initTripsDB,
  updateTripsDB,
  deleteTripsDB,
  getTripsWithTagNamePublicTotalCountDB,
  getTripsWithTagNamePublicPaginationDB,
  getTripsTotalCountByEmailDB
} from '../../knex/tripsknex';
import {
  omitFieldsFromRows,
  parsePagination,
  pickAllowedFields,
  TRIP_SHARED_MODES,
  UPDATABLE_FIELDS
} from './utility/fieldUtility';
import { getPaginationOffset } from './utility/paginationUtility';
import { getResourcesByEmailPagination } from './utility/genericControllerUtility';

export const getAllTripsPagination = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const offset = getPaginationOffset(page, limit);

    const totalResult = await getTripsTotalCountDB();
    const total = parseInt(totalResult.total, 10);

    const trips = await getTripsPaginationDB(limit, offset);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      return res.status(400).json({ error: 'Invalid page number' });
    }

    return res.json({
      trips,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching trips ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTripsPublicPagination = async (req, res) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const tagName = typeof req.query.tagName === 'string' ? req.query.tagName.trim() : '';

    const totalResult = (tagName === '')
      ? await getTripsPublicTotalCountDB()
      : await getTripsWithTagNamePublicTotalCountDB(tagName);
    const total = parseInt(totalResult?.total || 0, 10);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      return res.status(400).json({ error: 'Invalid page number' });
    }

    const rows = (tagName === '')
      ? await getTripsPublicPaginationDB(limit, offset)
      : await getTripsWithTagNamePublicPaginationDB(limit, offset, tagName);

    // Public listing never exposes the owner's email
    const trips = omitFieldsFromRows(rows, ['owner_email']);

    return res.json({
      trips,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching public trips ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Access checked by requireTripReadAccess: req.trip, req.tripAccess
export const getTripByUUID = async (req, res) => {
  try {
    const trips = await getTripsByUUIDDB(req.trip.uuid);
    const visibleTrips = (req.tripAccess === 'public')
      ? omitFieldsFromRows(trips, ['owner_email'])
      : trips;

    return res.json({ trips: visibleTrips });
  } catch (error) {
    logger.error(`Error fetching trip ${req.trip?.uuid}: ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTripsByEmailPagination = async (req, res) => getResourcesByEmailPagination(req, res, {
  resourceName: 'trips',
  orderBy: 'updated_at',
  orderPrecedence: 'desc'
});

// GET trips shared + array of recipients
export const getMySharedTripsPagination = async (req, res) => {
  try {
    const ownerEmail = req.user.email; // never trust req.body.email
    const { page, limit, offset } = parsePagination(req.body);

    const totalResult = await getMySharedTripsTotalCountDB(ownerEmail);
    const total = parseInt(totalResult?.total || 0, 10);

    const trips = await getMySharedTripsWithRecipientsPaginationDB(ownerEmail, limit, offset);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      return res.status(400).json({ error: 'Invalid page number' });
    }

    return res.json({
      // trip has shared_emails: ["email1", "email2", ...]
      trips,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error fetching my shared trips for ${req.user?.email}: ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
// GET trips shared + array of recipients
export const getOthersSharedTripsPagination = async (req, res) => {
  try {
    const othersEmail = req.user.email; // never trust req.body.email
    const { page, limit, offset } = parsePagination(req.body);

    const totalResult = await getOthersSharedTripsTotalCountDB(othersEmail);
    const total = parseInt(totalResult?.total || 0, 10);

    const trips = await getOthersSharedTripsWithRecipientsPaginationDB(othersEmail, limit, offset);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      return res.status(400).json({ error: 'Invalid page number' });
    }

    return res.json({
      // trip has shared_emails: ["email1", "email2", ...]
      trips,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error fetching others shared trips for ${req.user?.email}: ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const initTrips = async (req, res) => {
  try {
    // Caller identity comes from the session, not req.body.data.ownerEmail
    const { email: ownerEmail, role, subscription_end_at: subscription } = req.user;
    const { total } = await getTripsTotalCountByEmailDB(ownerEmail);
    const tripCount = parseInt(total, 10);

    if (role !== 'admin') {
      if (role === 'user' && tripCount > 1) {
        return res.status(403).send({ error: 'Free version only supports 2 trips' });
      }
      if (!isSubscriptionActive(subscription) && tripCount > 1) {
        return res.status(403).send({ error: 'Subscription ended Free version only supports 2 trips' });
      }
      if (role !== 'premium_user' && role !== 'user') {
        return res.status(403).send({ error: 'Forbidden' });
      }
    }

    const trip = await initTripsDB(ownerEmail);
    return res.json({
      trip: trip,
      message: 'Trip Created!'
    });
  } catch (error) {
    logger.error(`Error in creating Trip: ${error}`);
    return res.status(500).send({ error: 'Failed to create Trip' });
  }
};

export const updateTrips = async (req, res) => {
  const { uuid } = req.params;
  const updateData = pickAllowedFields(req.body?.data, UPDATABLE_FIELDS.trips);

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'No updatable fields' });
  }
  if (updateData.shared_mode !== undefined && !TRIP_SHARED_MODES.includes(updateData.shared_mode)) {
    return res.status(400).json({ error: 'Invalid shared_mode' });
  }

  try {
    const updatedRows = await updateTripsDB(uuid, updateData);

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Trips not found' });
    }
    return res.json({ message: 'Trips Updated!' });
  } catch (error) {
    logger.error(`Error in updating Trips: ${error}`);
    return res.status(500).send({ error: 'Failed to update Trips' });
  }
};

export const deleteTripsByID = async (req, res) => {
  const tripID = req.body.data;

  try {
    await deleteTripsDB(tripID);
    return res.json({ message: 'Trip Removed!' });
  } catch (error) {
    logger.error(`Error in removing Trip: ${error}`);
    return res.status(500).send({ error: 'Failed to remove Trip' });
  }
};
