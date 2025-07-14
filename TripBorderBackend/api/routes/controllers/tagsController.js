import logger from '../../../setupPino';
import { getPaginationOffset } from './utility/paginationUtility';
import { getTableTotalCountDB } from '../../knex/utilityknex';
import { getTagsPaginationDB } from '../../knex/tagskenx';

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
