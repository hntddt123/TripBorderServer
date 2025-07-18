import { Router } from 'express';
import {
  getAllTagsPagination,
  createTagByTrip,
  deleteTagByID
} from '../controllers/tagsController';

const tagsRouter = Router();

tagsRouter.get('/', getAllTagsPagination);
tagsRouter.post('/upload', createTagByTrip);
tagsRouter.delete('/removebyid', deleteTagByID);

export default tagsRouter;
