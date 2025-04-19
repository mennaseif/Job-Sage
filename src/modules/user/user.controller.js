import { sendEmails, sendResetPasswordEmail } from "../../email/email.js";

import { AppError } from "../../../utils/appError.js";
import { User } from "../../../database/models/user.models.js";
import bcrypt from "bcrypt";
import { catchError } from "../../middleware/catcherror.js";
import crypto from "crypto";
import { deleteOne } from "../../handlers/handlers.js";
import jwt from "jsonwebtoken";

/**
 * @description User signup controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @route POST /api/users/signup
 * @access Public
 */
const signUp = catchError(async (req, res, next) => {
  let user = new User(req.body);
  await user.save();

  // Send a confirmation email to the user
  sendEmails(res, req.body.email, next);

  // Generate a JWT token for the user
  let token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_KEY_SIGN_TOKEN
  );

  // Respond with a success message and the generated token
  res.status(201).json({ message: "User registered successfully", token});
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description User login controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @route POST /api/users/signin
 * @access Public
 */
const signIn = catchError(async (req, res, next) => {
  // Find user by email, recovery email, or mobile number
  let user = await User.findOne({
    $or: [
      { email: req.body.loginData },
      { recoveryEmail: req.body.loginData },
      { mobileNumber: req.body.loginData },
    ],
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Compare entered password with hashed one
  const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

  if (!isPasswordCorrect) {
    return next(new AppError("Incorrect password", 401));
  }

  // Update user status to Online
  user.status = "Online";
  await user.save();

  // Generate JWT
  jwt.sign(
    { _id: user._id, name: user.name, role: user.role },
    process.env.JWT_KEY_SIGN_TOKEN,
    (err, token) => {
      if (err) {
        return next(new AppError("Token generation failed", 500));
      }

      res.status(200).json({
        message: "Login successful",
        token,
        email: user.email, // Include email
      });
    }
  );
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Update user account details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @route PATCH /api/users/update/:id
 * @access Private
 */
const updateAccount = catchError(async (req, res, next) => {
  const {
    email,
    mobileNumber,
    recoveryEmail,
    DateofBirth,
    lastName,
    firstName,
  } = req.body;

  const user = await User.findOne();
  if (!user) return next(new AppError("User not found", 404));

  // Check if email is unique and update if necessary
  if (email && email !== user.email) {
    const existEmail = await User.findOne({ email });
    if (existEmail)
      return res.status(400).json({ message: "Email is already taken" });
    user.email = email;
  }

  // Check if mobile number is unique and update if necessary
  if (mobileNumber && mobileNumber !== user.mobileNumber) {
    const existMobile = await User.findOne({ mobileNumber });
    if (existMobile)
      return res
        .status(400)
        .json({ message: "Mobile number is already taken" });
    user.mobileNumber = mobileNumber;
  }

  // Update additional user fields
  if (recoveryEmail) user.recoveryEmail = recoveryEmail;
  if (DateofBirth) user.DateofBirth = DateofBirth;
  if (lastName) user.lastName = lastName;
  if (firstName) user.firstName = firstName;

  // Save the updated user data
  await user.save();
  res.status(200).json({ message: "Account updated successfully", user });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Delete user account controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @route DELETE /api/users/delete/:id
 * @access Private
 */
const deleteAccount = deleteOne(User);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Get user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @route GET /api/users/getuser/:id
 * @access Private
 */
const getUser = catchError(async (req, res, next) => {
  if (req.user._id.toString() !== req.params.id)
    return next(
      new AppError("You are not authorized to access this account", 403)
    );
  let user = await User.findOne();
  if (!user) return next(new AppError("User not found", 404));

  // Respond with the user data
  res.status(200).json({ message: "Success", user });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Change user password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @route PATCH /api/users/change-password/:id
 * @access Private
 */
const changeUserPassword = catchError(async (req, res, next) => {
  // Find user by email
  let user = await User.findOne({ email: req.body.email });

  // Check if the old password is correct
  if (user && bcrypt.compareSync(req.body.oldPassword, user.password)) {
    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 8);

    // Update the user's password with the hashed password
    await User.findOneAndUpdate(
      { email: req.body.email },
      { password: hashedNewPassword, passwordChangedAt: Date.now() }
    );

    // Generate a new JWT token for the user
    let token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_KEY_SIGN_TOKEN
    );
    return res
      .status(201)
      .json({ message: "Password changed successfully", token });
  }

  next(new AppError("Incorrect email or password", 401));
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Request password reset (OTP)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @route POST /api/users/request-password-reset
 * @access Public
 */
const requestPasswordReset = catchError(async (req, res, next) => {
  const { email } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User is not found" });

  // Generate OTP and set expiration time
  const otp = crypto.randomInt(100000, 999999).toString();
  user.resetOTP = otp;
  user.resetOTPExpiration = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
  await user.save();

  // Send the OTP to the user's email
  await sendResetPasswordEmail(email, otp);
  res.status(200).json({ message: "OTP sent to email" });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @description Verify OTP for password reset
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @route POST /api/users/verifyotp
 * @access Public
 */

const verifyOTP = catchError(async (req, res, next) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({ message: 'OTP is required' });
  }

  const user = await User.findOne({ resetOTP: otp });

  if (!user) {
    return res.status(404).json({ message: 'Invalid OTP' });
  }

  if (user.resetOTPExpiration < Date.now()) {
    return res.status(400).json({ message: 'OTP expired' });
  }

  user.resetOTP = null;
  user.resetOTPExpiration = null;

  await user.save();

  res.status(200).json({ message: 'OTP verification successful' });
});

/////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @description Reset password using token
 * @route POST /api/users/reset-password
 * @access Public
 */

const resetPassword = catchError(async (req, res, next) => {
  const { newPassword, confirmNewPassword } = req.body;
  const token = req.headers.token;

  if (!token || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ message: "Token, new password, and confirm password are required" });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "New password and confirmation do not match" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_KEY_SIGN_TOKEN);
    console.log("Decoded token payload:", decoded);
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const user = await User.findById(decoded._id); // 👉 FIXED HERE

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 8);

  user.password = hashedPassword;
  user.passwordChangedAt = Date.now();

  await user.save();
  res.status(200).json({ message: "Password has been reset successfully" });
});


///////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Get user account by recovery email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @route GET /api/users/getaccount
 * @access Public
 */
const getAccountByRecoveryEmail = catchError(async (req, res, next) => {
  // // Find account by email
  let account = await User.find({ recoveryEmail: req.body.recoveryEmail });
  if (account.length == 0)
    return next(new AppError("no accounts with this recovery email", 404));
  // Respond with a success message
  res.status(200).json({ message: "account retrieved successfully", account });
});
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description User logout controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 * @route PATCH /api/users/signout/:id
 * @access Private
 */


export {
  signUp,
  signIn,
  updateAccount,
  deleteAccount,
  getUser,
  changeUserPassword,
  requestPasswordReset,
  verifyOTP,
  resetPassword,
  getAccountByRecoveryEmail,
};
