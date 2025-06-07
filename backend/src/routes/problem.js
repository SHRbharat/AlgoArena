import { Router } from 'express';
import {
  handleSubmitProblem,
  handleRunProblem,
  handleCreateProblem,
  handleEditProblem,
  handleDeleteProblem,
  handleGetAllProblem,
  handleGetFilterProblems,
  handleGetProblemById,
  handleGetAllExampleTestcases,
  handleGetSubmissions,
  handleAdminGetAllProblem,
  handleAdminGetFilterProblems
} from '../controllers/problem.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const problemRouter = Router();

problemRouter.route('/:id/submit').post(authenticate, handleSubmitProblem);
problemRouter.route('/:id/run').post(handleRunProblem);
problemRouter.route('/create').post(authenticate, authorize(['Admin', 'Organiser']), handleCreateProblem);
problemRouter.route('/admin/all').get(authenticate, authorize(['Admin', 'Organiser']), handleAdminGetAllProblem);
problemRouter.route('/admin/filter').get(authenticate, authorize(['Admin', 'Organiser']), handleAdminGetFilterProblems);
problemRouter.route('/all').get(handleGetAllProblem);
problemRouter.route('/filter').get(handleGetFilterProblems);
problemRouter.route('/:id').get(handleGetProblemById);
problemRouter.route('/edit').patch(authenticate, authorize(['Admin', 'Organiser']), handleEditProblem);
problemRouter.route('/:id').delete(authenticate, authorize(['Admin', 'Organiser']), handleDeleteProblem);
problemRouter.route('/:id/example_testcases').get(handleGetAllExampleTestcases);
problemRouter.route('/:id/submissions').get(authenticate, handleGetSubmissions);

export default problemRouter;
