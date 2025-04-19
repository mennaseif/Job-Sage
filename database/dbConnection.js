import { connect } from "mongoose";

export const dbConn = connect("mongodb://localhost:27017/job_sage")
  .then(() => {
    console.log("Database connected");
  })
  .catch(() => {
    console.log("Database error");
  });
