import jwt, { decode } from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.SECRET_KEY || "iuhadfjk";

export const createToken = (payload) => {
  return jwt.sign(payload.toJSON(), secretKey, { expiresIn: "5h" });
};

export const verifyLogin = async (req, res, next) => {
  try {
    const token = req.headers.bearertoken;
    console.log(token);
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ err: "Login expired!/nPlease login again!" });
  }
};
