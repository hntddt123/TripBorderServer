import { Router } from 'express';
import {
  getAllTagsPagination,
  getAllTagsInfiniteScroll,
  getTagsByEmailPagination,
  createTagByTrip,
  deleteTagByID
} from '../controllers/tagsController';
import { requireAuth, requireAdmin } from '../controllers/authController';
import {
  requireRowOwnerEmail,
  forceOwnerEmail,
  fromBodyData
} from '../../middlewares/authorizationMiddleware';

const tagsRouter = Router();

tagsRouter.get('/', requireAdmin, getAllTagsPagination);
tagsRouter.get('/infinite', requireAdmin, getAllTagsInfiniteScroll);
tagsRouter.post('/tagsbyemailpagination', requireAuth, getTagsByEmailPagination);
tagsRouter.post('/upload', requireAuth, forceOwnerEmail, createTagByTrip);
tagsRouter.delete('/removebyid', requireAuth, requireRowOwnerEmail('tags', fromBodyData), deleteTagByID);

export default tagsRouter;
