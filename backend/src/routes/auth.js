import { Router } from "express";
import {
  handleGoogleAuth,
  handleLogin,
  handleSignup,
  handleValidation,
  handleSendOTP,
  handleVerifyOTP,
  handleLogoutUser,
} from "../auth/auth.js";
import { authenticate } from "../middlewares/auth.js";

const authRouter = Router();

authRouter.route('/signup').post(handleSignup);
authRouter.route('/login').post(handleLogin);
authRouter.route('/logout').get(handleLogoutUser);
authRouter.route('/google').post(handleGoogleAuth);
authRouter.route('/validate').get(authenticate, handleValidation);
authRouter.route('/send-otp').post(handleSendOTP);
authRouter.route('/verify-otp').post(handleVerifyOTP);

export default authRouter;
