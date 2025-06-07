import { Router } from 'express';
import {
  handleCreateContest,
  handleDeleteContest,
  handleEditContest,
  handleGetContestByID,
  handleGetAll,
  handleContestRegister,
  handleGetLeaderboard
} from '../controllers/contest.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const contestRouter = Router();

contestRouter.route('/create').post(authenticate, authorize(['Organiser', 'Admin']), handleCreateContest);
contestRouter.route('/:id').delete(authenticate, authorize(['Organiser', 'Admin']), handleDeleteContest);
contestRouter.route('/:id').put(authenticate, authorize(['Organiser', 'Admin']), handleEditContest);
contestRouter.route('/all').get(authenticate, handleGetAll);
contestRouter.route('/:id').get(authenticate, handleGetContestByID);
contestRouter.route('/:id/register').get(authenticate, handleContestRegister);
contestRouter.route('/:id/leaderboard').get(authenticate, handleGetLeaderboard);

export default contestRouter;
