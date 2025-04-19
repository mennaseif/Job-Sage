import { AppError } from "../../utils/appError.js";
import { catchError } from "../middleware/catcherror.js";

export const deleteOne = (model) => {
  return catchError(async (req, res, next) => {
    let document = await model.deleteOne();

    //let document = await model.findByIdAndDelete(req.params.id);
    document || next(new AppError("Document is not found", 404));
    !document || res.status(200).json({ message: "Success", document });
  });
};

export const addOne = (model) => {
  return catchError(async (req, res, next) => {
    let document = await model.insertMany(req.body);
    !document || res.status(200).json({ message: "Success", document });
  });
};
