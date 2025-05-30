import { Router } from 'express';
import { getAllTagsPagination } from '../controllers/tagsController';

const tagsRouter = Router();

tagsRouter.get('/', getAllTagsPagination);

export default tagsRouter;
