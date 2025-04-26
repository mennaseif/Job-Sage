import mongoose, { Schema } from "mongoose";

let userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "username is required"],
    },
    
    email: {
      type: String,
      unique: true,
      required: [true, "email is required"],
    },
    
    password: {
      type: String,
      required: true,
      minlength: [6, "password should be more than 6"],
    },
    passwordChangedAt: Date,
    mobileNumber: {
      type: Number,
      unique: true,
      required: [true, "mobile number is required"],
    },
    userType: {
      type: String,
      enum: ["Graduated", "Student"],
      required: [true, "userType is required"],
    },
    
    status: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Offline",
    },
    resetOTP: { type: String, required: false },
    resetOTPExpiration: { type: Date, required: false },
  },
  { timestamps: true, versionKey: false }
);

userSchema.pre("save", function (next) {
  this.username = `${this.firstName}${this.lastName}`;
  next();
});


export const User = mongoose.model("User", userSchema);
