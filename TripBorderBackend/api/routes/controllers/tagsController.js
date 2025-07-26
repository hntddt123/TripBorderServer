import logger from '../../../setupPino';
import { getPaginationOffset } from './utility/paginationUtility';
import { getResourcesByEmailPagination } from './utility/genericControllerUtility';
import {
  getTableTotalCountDB
} from '../../knex/utilityknex';
import {
  getTagsPaginationDB,
  createTagByTripIDDB,
  deleteTagByIDDB
} from '../../knex/tagskenx';

export const getAllTagsPagination = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const offset = getPaginationOffset(page, limit);

    const totalResult = await getTableTotalCountDB('tags');
    const total = parseInt(totalResult.total, 10);

    const tags = await getTagsPaginationDB(limit, offset);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      res.status(400).json({ error: 'Invalid page number' });
    }

    res.json({
      tags,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching tags ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTagsByEmailPagination = async (req, res) => getResourcesByEmailPagination(req, res, {
  resourceName: 'tags',
  orderBy: 'name',
  orderPrecedence: 'desc'
});

export const createTagByTrip = async (req, res) => {
  try {
    const tag = req.body.data;

    const newTag = await createTagByTripIDDB(tag);

    res.json({
      tag: newTag,
    });
  } catch (error) {
    logger.error(`Error Creating Tag by trips_uuid ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTagByID = async (req, res) => {
  const tagID = req.body.data;

  try {
    await deleteTagByIDDB(tagID);
    res.json({ message: 'Tag Removed!' });
  } catch (error) {
    logger.error(`Error in removing Tag: ${error}`);
    res.status(500).send({ error: 'Failed to remove Tag' });
  }
};
