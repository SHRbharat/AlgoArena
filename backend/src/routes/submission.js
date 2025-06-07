import { Router } from 'express';
import {
  handleSubmissionCallback,
  handleRunCallback,
  handleContestSubmissionCallback
} from '../controllers/submission.js';

const submissionRouter = Router();

submissionRouter.route('/:submissionId/submitted_testcase/:id').put(handleSubmissionCallback);
submissionRouter.route('/:submissionId/contest/:contestId/submitted_testcase/:id').put(handleContestSubmissionCallback);
submissionRouter.route('/run/:id').post(handleRunCallback);

export default submissionRouter;
