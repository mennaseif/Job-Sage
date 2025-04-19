import { AppError } from "../../utils/appError.js";
import Joi from "joi";

export const generalFields = {
  resume: Joi.object({
    fieldname: Joi.string().valid("resume").required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid("application/pdf").required(),
    size: Joi.number().max(5242880).required(), // 5 MB size limit
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
  }).required(),
};

export const validate = (schema) => {
  return (req, res, next) => {
    // Combine request data from body, params, query, and file
    let inputsDate = { ...req.body, ...req.params, ...req.query };

    // If a file is uploaded, include it in the inputs
    if (req.file) {
      inputsDate = { ...inputsDate, resume: req.file }; // Ensure to use the key that matches your schema
    }

    // Validate against the schema
    const { error } = schema.validate(inputsDate, { abortEarly: false });
    if (!error) {
      next(); // No error, proceed to the next middleware
    } else {
      const errMsg = error.details.map((err) => err.message);
      next(new AppError(errMsg.join(", "), 400)); // Join error messages
    }
  };
};
