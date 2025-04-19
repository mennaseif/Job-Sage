import jwt from "jsonwebtoken";
import { AppError } from "../../../utils/appError.js";
import { catchError } from "../../middleware/catcherror.js";
import { User } from "../../../database/models/user.models.js";

/**
 * Middleware to protect routes by verifying JWT and attaching the user to the request.
 * @function protectedRoutes
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 * @throws {AppError} If the token is not provided, invalid, or if the user does not exist.
 */
const protectedRoutes = catchError(async (req, res, next) => {
  let { token } = req.headers;
  let userPayload = null;

  // Check if token is provided in the headers
  if (!token) return next(new AppError("token not provided", 401));

  // Verify the token using the secret key
  jwt.verify(token, "menna", (err, payload) => {
    if (err) return next(new AppError("Invalid token", 401));

    // Check if the payload contains the user ID
    if (!payload || !payload._id)
      return next(new AppError("Invalid token payload", 401));

    userPayload = payload;
  });

  // Ensure userPayload is set
  if (!userPayload) return next(new AppError("Invalid token payload", 401));

  // Fetch user by ID from the database
  let user = await User.findById(userPayload._id);
  if (!user)
    return next(
      new AppError("User not found with ID: " + userPayload._id, 404)
    );

  // Check if the user's password has changed after the token was issued
  if (user.passwordChangedAt) {
    let time = parseInt(user.passwordChangedAt.getTime() / 1000);
    if (time > userPayload.iat)
      return next(new AppError("Invalid token..login again", 401));
  }

  // Attach user to the request object
  req.user = user;
  next();
});
/////////////////////////////////////////////////////////////////////////////

/**
 * Middleware to allow access to routes based on user roles.
 * @function allowedTo
 * @param {...string} roles - The roles allowed to access the route.
 * @returns {function} Middleware function that checks user roles.
 * @throws {AppError} If the user is not authenticated or not authorized.
 */
const allowedTo = (...roles) => {
  return catchError(async (req, res, next) => {
    // Check if user is authenticated
    if (!req.user || !req.user.role) {
      return next(new AppError("user not authenticated", 401));
    }

    // Check if the user's role is included in the allowed roles
    if (roles.includes(req.user.role)) {
      return next();
    }
    return next(
      new AppError("you are not authorized to access this endpoint.", 403)
    );
  });
};

export { protectedRoutes, allowedTo };
