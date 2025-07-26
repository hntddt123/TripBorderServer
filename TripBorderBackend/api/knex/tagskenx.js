import logger from '../../setupPino';
import { knexDBInstance } from './knexDBInstance';

export const getTagsPaginationDB = async (limit, offset) => knexDBInstance('tags')
  .limit(limit)
  .offset(offset)
  .orderBy('name', 'desc');

export const createTagByTripIDDB = async (tag) => knexDBInstance('tags')
  .insert({
    uuid: knexDBInstance.fn.uuid(),
    name: tag.name,
    owner_email: tag.owner_email
  }).returning('*')
  .then((rows) => rows[0]);

export const deleteTagByIDDB = async (tagID) => {
  const count = await knexDBInstance('tags')
    .where('uuid', tagID)
    .delete();
  logger.info(`Deleted ${count} row(s) of tag`);
};
