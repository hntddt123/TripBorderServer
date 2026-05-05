import { Router } from 'express';
import {
  getAllTagsPagination,
  getAllTagsInfiniteScroll,
  getTagsByEmailPagination,
  createTagByTrip,
  deleteTagByID
} from '../controllers/tagsController';

const tagsRouter = Router();

tagsRouter.get('/', getAllTagsPagination);
tagsRouter.get('/infinite', getAllTagsInfiniteScroll);
tagsRouter.post('/tagsbyemailpagination', getTagsByEmailPagination);
tagsRouter.post('/upload', createTagByTrip);
tagsRouter.delete('/removebyid', deleteTagByID);

export default tagsRouter;
