import { Router } from 'express';
import {
  handleCreateTopic,
  handleDeleteTopic,
  handleEditTopic,
  handleGetAll
} from '../controllers/topic.js';

const topicRouter = Router();

topicRouter.route('/create').post(handleCreateTopic);
topicRouter.route('/:id').delete(handleDeleteTopic);
topicRouter.route('/:id').put(handleEditTopic);
topicRouter.route('/all').get(handleGetAll);

export default topicRouter;
