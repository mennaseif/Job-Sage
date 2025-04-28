import { AppError } from "../../utils/appError.js";
import { User } from "../../database/models/user.models.js";
import bcrypt from "bcrypt";

export const checkEmail = async (req, res, next) => {
  try {
    const isFound = await User.findOne({
      $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }],
    });

    if (isFound) {
      return next(new AppError("Email or phone number already exists.", 409));
    }

    req.body.password = await bcrypt.hash(req.body.password, 8);

    next();
  } catch (error) {
    next(error);
  }
};
