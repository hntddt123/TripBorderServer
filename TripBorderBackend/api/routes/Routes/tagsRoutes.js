import { Router } from 'express';
import {
  getAllTagsPagination,
  getTagsByEmailPagination,
  createTagByTrip,
  deleteTagByID
} from '../controllers/tagsController';

const tagsRouter = Router();

tagsRouter.get('/', getAllTagsPagination);
tagsRouter.post('/tagsbyemailpagination', getTagsByEmailPagination);
tagsRouter.post('/upload', createTagByTrip);
tagsRouter.delete('/removebyid', deleteTagByID);

export default tagsRouter;
