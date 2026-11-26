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
import { getPaginationOffset } from './utility/paginationUtility';
import {
  omitFields, parsePagination, pickAllowedFields, UPDATABLE_FIELDS
} from './utility/fieldUtility';

const SELLING_PRIVATE_FIELDS = ['frequent_flyer_number', 'mileage_picture', 'owner_email'];

export const getAllMileagePagination = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const offset = getPaginationOffset(page, limit);

    const totalResult = await getMileagesTotalCountDB();
    const total = parseInt(totalResult.total, 10);

    const mileages = await getMileagesPaginationDB(limit, offset);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      return res.status(400).json({ error: 'Invalid page number' });
    }

    return res.json({
      mileages,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching mileages ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMileagesSelling = async (req, res) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);

    const totalResult = await getAllVerifiedAndListedMileagesDB();
    const total = parseInt(totalResult.total, 10);

    const rows = await getVerifiedAndListedMileagesPaginationDB(limit, offset);
    // Only the listing owner or an admin sees frequent flyer number / picture
    const isAdminUser = req.user?.role === 'admin';
    const mileages = rows.map((row) => ((isAdminUser || row.owner_email === req.user?.email)
      ? row
      : omitFields(row, SELLING_PRIVATE_FIELDS)));

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      return res.status(400).json({ error: 'Invalid page number' });
    }

    return res.json({
      mileages,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching mileages selling ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMileagesByEmail = async (req, res) => {
  try {
    const { email } = req.user; // never trust req.body.email
    const { page, limit, offset } = parsePagination(req.body);

    const totalResult = await getMileagesTotalCountByEmailDB(email);
    const total = parseInt(totalResult.total, 10);

    const mileages = await getMileagesByEmailPaginationDB(email, limit, offset);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      return res.status(400).json({ error: 'Invalid page number' });
    }

    return res.json({
      mileages,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching mileages ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const postMileages = async (req, res) => {
  const newMileage = req.body.data;

  try {
    await insertMileagesDB(newMileage);
    return res.json({ message: 'Mileage Created!' });
  } catch (error) {
    logger.error(`Error in creating Mileage: ${error}`);
    return res.status(500).send({ error: 'Failed to create Mileage' });
  }
};

export const deleteMileagesByID = async (req, res) => {
  const mileageID = req.body.data;

  try {
    await deleteMileagesDB(mileageID);
    return res.json({ message: 'Mileage Removed!' });
  } catch (error) {
    logger.error(`Error in removing Mileage: ${error}`);
    return res.status(500).send({ error: 'Failed to remove Mileage' });
  }
};

export const updateMileages = async (req, res) => {
  const { uuid } = req.params;
  const updateData = pickAllowedFields(req.body?.data, UPDATABLE_FIELDS.mileages);

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'No updatable fields' });
  }

  try {
    const updatedRows = await updateMileagesDB(uuid, updateData);

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Mileage not found' });
    }
    return res.json({ message: 'Mileage Updated!' });
  } catch (error) {
    logger.error(`Error in updating Mileage: ${error}`);
    return res.status(500).send({ error: 'Failed to update Mileage' });
  }
};
