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
      return res.status(400).json({ error: 'Invalid page number' });
    }

    return res.json({
      tags,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching tags ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllTagsInfiniteScroll = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const offset = getPaginationOffset(page, limit);

    const totalResult = await getTableTotalCountDB('tags');
    const total = parseInt(totalResult.total, 10);

    const tags = await getTagsPaginationDB(limit, offset);

    const totalPages = total > 0 ? Math.ceil(total / limit) : 0;
    const hasMore = page < totalPages;

    if (page > totalPages && total > 0) {
      return res.json({
        tags: [],
        total,
        totalPages,
        page,
        hasMore: false
      });
    }

    return res.json({
      tags,
      total,
      totalPages,
      page,
      hasMore
    });
  } catch (error) {
    logger.error(`Error Fetching tags ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
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

    return res.json({
      tag: newTag,
    });
  } catch (error) {
    logger.error(`Error Creating Tag by trips_uuid ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTagByID = async (req, res) => {
  const tagID = req.body.data;

  try {
    await deleteTagByIDDB(tagID);
    return res.json({ message: 'Tag Removed!' });
  } catch (error) {
    logger.error(`Error in removing Tag: ${error}`);
    return res.status(500).send({ error: 'Failed to remove Tag' });
  }
};
