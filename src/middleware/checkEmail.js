import { AppError } from "../../utils/appError.js";
import { User } from "../../database/models/user.models.js";
import bcrypt from "bcrypt";

export const checkEmail = async (req, res, next) => {
  // Check if email or mobile number already exists
  const isFound = await User.findOne({
    $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }],
  });

  if (isFound)
    return next(new AppError("Email or phone number already exists.", 409));

  // Hash the password before saving the user
  req.body.password = await bcrypt.hash(req.body.password, 8);
  await user.save();


  next();
};
