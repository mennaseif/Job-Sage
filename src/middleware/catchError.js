/*export function catchError(callBack) {
  return (req, res, next) => {
    callBack(req, res, next).catch((err) => {
      res.status(500).json({ err: err.message });
    });
  };
}*/

export const catchError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
