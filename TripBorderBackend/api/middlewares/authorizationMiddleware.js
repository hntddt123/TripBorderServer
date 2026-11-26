import { knexDBInstance } from '../knex/knexDBInstance';
import { getTripAccessDB } from '../knex/tripsknex';
import { isAdmin } from '../routes/controllers/authController';

/*
 * Ownership / access middlewares. Mount AFTER optionalAuth (reads) or
 * requireAuth (writes). Each takes a getter so it works with the existing
 * request shapes (body.tripID, body.data, body.data.trips_uuid, params.uuid).
 */

const deny = (req, res) => (req.user
  ? res.status(403).json({ error: 'Forbidden' })
  : res.status(401).json({ isAuthenticated: false, message: 'Auth failed' }));

// Read: public trip, owner, shared recipient, or admin. Sets req.trip / req.tripAccess
export const requireTripReadAccess = (getTripID) => async (req, res, next) => {
  try {
    const tripID = getTripID(req);
    if (!tripID || typeof tripID !== 'string') {
      return res.status(400).json({ error: 'trip uuid is required' });
    }

    const { trip, access } = await getTripAccessDB(tripID, req.user?.email);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (isAdmin(req.user)) {
      req.trip = trip;
      req.tripAccess = 'admin';
      return next();
    }

    if (!access) {
      return deny(req, res);
    }

    req.trip = trip;
    req.tripAccess = access;
    return next();
  } catch (error) {
    return next(error);
  }
};

// Write: trip owner or admin
export const requireTripOwner = (getTripID) => async (req, res, next) => {
  try {
    const tripID = getTripID(req);
    if (!tripID || typeof tripID !== 'string') {
      return res.status(400).json({ error: 'trip uuid is required' });
    }

    const trip = await knexDBInstance('trips').where({ uuid: tripID }).first();
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (!isAdmin(req.user) && trip.owner_email !== req.user?.email) {
      return deny(req, res);
    }

    req.trip = trip;
    req.tripAccess = isAdmin(req.user) ? 'admin' : 'owner';
    return next();
  } catch (error) {
    return next(error);
  }
};

// Write on a child row (hotels, meals, ...): owner of the row's parent trip, or admin
export const requireRowTripOwner = (tableName, getRowID) => async (req, res, next) => {
  try {
    const rowID = getRowID(req);
    if (!rowID || typeof rowID !== 'string') {
      return res.status(400).json({ error: 'uuid is required' });
    }

    const row = await knexDBInstance(tableName)
      .select(`${tableName}.uuid`, 'trips.owner_email')
      .join('trips', `${tableName}.trips_uuid`, '=', 'trips.uuid')
      .where(`${tableName}.uuid`, rowID)
      .first();

    if (!row) {
      return res.status(404).json({ error: 'Not found' });
    }

    if (!isAdmin(req.user) && row.owner_email !== req.user?.email) {
      return deny(req, res);
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

// Write on a row that carries owner_email itself (tags, mileages): owner or admin
export const requireRowOwnerEmail = (tableName, getRowID) => async (req, res, next) => {
  try {
    const rowID = getRowID(req);
    if (!rowID || typeof rowID !== 'string') {
      return res.status(400).json({ error: 'uuid is required' });
    }

    const row = await knexDBInstance(tableName)
      .select('uuid', 'owner_email')
      .where({ uuid: rowID })
      .first();

    if (!row) {
      return res.status(404).json({ error: 'Not found' });
    }

    if (!isAdmin(req.user) && row.owner_email !== req.user?.email) {
      return deny(req, res);
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

// Overwrite body.data.owner_email with the caller's email (never trust the client)
export const forceOwnerEmail = (req, res, next) => {
  if (!req.body || typeof req.body.data !== 'object' || req.body.data === null) {
    return res.status(400).json({ error: 'data is required' });
  }
  req.body.data.owner_email = req.user.email;
  return next();
};

// Common getters for the existing request shapes
export const fromBodyTripID = (req) => req.body?.tripID;
export const fromBodyData = (req) => req.body?.data;
export const fromBodyDataTripsUUID = (req) => req.body?.data?.trips_uuid;
export const fromParamsUUID = (req) => req.params?.uuid;
