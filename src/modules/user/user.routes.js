import {
  changeUserName,
  changeUserPassword,
  deleteAccount,
  getUser,
  requestPasswordReset,
  resetPassword,
  signIn,
  signUp,
  updateAccount,
  verifyOTP,
} from "../user/user.controller.js";
import {
  changeUserPasswordValidSchema,
  resetPasswordValidSchema,
  signInValidSchema,
  signUpValidSchema,
  updateUserValidSchema,
} from "./user.validation.js";

import { Router } from "express";
import { checkEmail } from "../../middleware/checkEmail.js";
import { protectedRoutes } from "../auth/auth.controller.js";
import { validate } from "../../middleware/validate.js";

const userRoutes = Router();

userRoutes.post("/signup", validate(signUpValidSchema), checkEmail, signUp);
userRoutes.post("/signin", validate(signInValidSchema), signIn);
userRoutes.post("/reqest-password-reset", requestPasswordReset);
userRoutes.post("/verifyotp", verifyOTP);
userRoutes.post("/reset-password",validate(resetPasswordValidSchema), resetPassword);


userRoutes.put( "/update",validate(updateUserValidSchema),protectedRoutes,updateAccount);
userRoutes.delete("/deleteAccount", protectedRoutes, deleteAccount);
userRoutes.get("/getuser", protectedRoutes, getUser);
userRoutes.patch("/change-password",validate(changeUserPasswordValidSchema),protectedRoutes,changeUserPassword);
userRoutes.patch("/changeName",protectedRoutes,changeUserName)

export default userRoutes;
