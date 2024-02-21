import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

export const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });

  const thirtyDays = 1000 * 60 * 60 * 24 * 30;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + thirtyDays),
    secure: process.env.NODE_ENV,
    signed: true,
    sameSite: "None", // **Testing only**
  });
};

export const isTokenValid = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
