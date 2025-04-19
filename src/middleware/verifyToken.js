import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  let { token } = req.headers;

  jwt.verify(token, process.env.JWT_KEY_VERIFY_TOKEN, async (err, decoded) => {
    console.log(decoded);
    if (err) return res.status(401).json({ message: "invalid token", err });
    next();
  });
};
