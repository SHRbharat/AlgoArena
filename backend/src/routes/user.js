import { Router } from 'express';
import {
  handleAllUsers,
  updateUserRole,
  deleteUser,
  getUserProgress
} from '../controllers/user.js';
import {
  getProfile,
  getSolvedProblems,
  getContestParticipated,
  getUser,
  updateProfile
} from '../controllers/profile.js';
import { changePassword } from '../auth/auth.js';
import { authenticate } from '../middlewares/auth.js';

const userRouter = Router();

userRouter.route("/all").get(handleAllUsers);
userRouter.route("/role/:id").put(updateUserRole);
userRouter.route("/:id").delete(deleteUser);
userRouter.route("/userdetails").get(authenticate, getUser);
userRouter.route("/profile/:username").get(getProfile);
userRouter.route("/:username/solvedProblems").get(getSolvedProblems);
userRouter.route("/:username/contestParticipated").get(getContestParticipated);
userRouter.route("/updateProfile").put(authenticate, updateProfile);
userRouter.route("/changePassword").put(authenticate, changePassword);
userRouter.route("/getProgress").get(authenticate, getUserProgress);

export default userRouter;
