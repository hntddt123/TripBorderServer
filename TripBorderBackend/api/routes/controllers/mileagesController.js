import {
  getMileagesTotalCountDB,
  getMileagesPaginationDB,
  getAllVerifiedAndListedMileagesDB,
  getVerifiedAndListedMileagesPaginationDB,
  getMileagesTotalCountByEmailDB,
  getMileagesByEmailPaginationDB,
  insertMileagesDB,
  deleteMileagesDB,
  updateMileagesDB
} from '../../knex/mileageknex';
import logger from '../../../setupPino';
import { getPaginationLimit, getPaginationOffset } from './utility/paginationUtility';

export const getAllMileagePagination = async (req, res) => {
  try {
    const { page } = req.query;
    const limit = getPaginationLimit(req);
    const offset = getPaginationOffset(req);

    const totalResult = await getMileagesTotalCountDB();
    const total = parseInt(totalResult.total, 10);

    const mileages = await getMileagesPaginationDB(limit, offset);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      res.status(400).json({ error: 'Invalid page number' });
    }

    res.json({
      mileages,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching mileages ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMileagesSelling = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = (page - 1) * limit;

    const totalResult = await getAllVerifiedAndListedMileagesDB();
    const total = parseInt(totalResult.total, 10);

    const mileages = await getVerifiedAndListedMileagesPaginationDB(limit, offset);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      res.status(400).json({ error: 'Invalid page number' });
    }

    res.json({
      mileages,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching mileages selling ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMileagesByEmail = async (req, res) => {
  try {
    const ownerEmail = req.body.email;
    const page = req.body.page || 1;
    const limit = req.body.limit || 10;
    const offset = (page - 1) * limit;

    const totalResult = await getMileagesTotalCountByEmailDB(ownerEmail);
    const total = parseInt(totalResult.total, 10);

    const mileages = await getMileagesByEmailPaginationDB(ownerEmail, limit, offset);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      res.status(400).json({ error: 'Invalid page number' });
    }

    res.json({
      mileages,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching mileages ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const postMileagesByEmail = async (req, res) => {
  const newMileage = req.body.data;

  try {
    await insertMileagesDB(newMileage);
    res.json({ message: 'Mileage Created!' });
  } catch (error) {
    logger.error(`Error in creating Mileage: ${error}`);
    res.status(500).send({ error: 'Failed to create Mileage' });
  }
};

export const deleteMileagesByID = async (req, res) => {
  const mileageID = req.body.data;

  try {
    await deleteMileagesDB(mileageID);
    res.json({ message: 'Mileage Removed!' });
  } catch (error) {
    logger.error(`Error in removing Mileage: ${error}`);
    res.status(500).send({ error: 'Failed to remove Mileage' });
  }
};

export const updateMileages = async (req, res) => {
  const { uuid } = req.params;
  const updates = req.body.data;

  const updateData = {};
  if (updates.is_verified !== undefined) updateData.is_verified = updates.is_verified;
  if (updates.is_listed !== undefined) updateData.is_listed = updates.is_listed;

  try {
    const updatedRows = await updateMileagesDB(uuid, updateData);

    if (updatedRows.length === 0) {
      res.status(404).json({ error: 'Mileage not found' });
    }

    res.json({ message: 'Mileage Updated!' });
  } catch (error) {
    logger.error(`Error in updating Mileage: ${error}`);
    res.status(500).send({ error: 'Failed to update Mileage' });
  }
};
