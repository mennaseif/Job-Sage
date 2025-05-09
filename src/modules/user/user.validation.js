import Joi from "joi";

const signUpValidSchema = Joi.object({
  fullName: Joi.string().min(2).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[A-Z][A-Za-z0-9]{8,40}$/)
    .required(),
  rePassword: Joi.valid(Joi.ref("password")).required(),
  mobileNumber: Joi.string()
    .pattern(/^(?:\+20|0)(1[0-9]{9})$/)
    .required(),
});

const signInValidSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[A-Z][A-Za-z0-9]{8,40}$/)
    .required(),
    role: Joi.string().valid("Graduated", "Student").required(),
});

const changeUserPasswordValidSchema = Joi.object({
  email: Joi.string().email().required(),
  oldPassword: Joi.string()
    .pattern(/^[A-Z][A-Za-z0-9]{8,40}$/)
    .required(),
  newPassword: Joi.string()
    .pattern(/^[A-Z][A-Za-z0-9]{8,40}$/)
    .required(),
});

const resetPasswordValidSchema = Joi.object({
  newPassword: Joi.string()
    .pattern(/^[A-Z][A-Za-z0-9]{8,40}$/)
    .required(),
  confirmNewPassword: Joi.string()
    .pattern(/^[A-Z][A-Za-z0-9]{8,40}$/)
    .required(),
});

const updateUserValidSchema = Joi.object({
  name: Joi.string().min(2).max(1000),
  email: Joi.string().min(2).max(2000),
  recoveryEmail: Joi.string().min(2).max(2000),
  password: Joi.string().pattern(/^[A-Z][A-Za-z0-9]{8,40}$/),
});

export {
  signUpValidSchema,
  signInValidSchema,
  changeUserPasswordValidSchema,
  updateUserValidSchema,
  resetPasswordValidSchema
};
