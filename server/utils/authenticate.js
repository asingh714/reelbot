import { isTokenValid } from "./jwt.js";

export const authenticate = async (req, res, next) => {
  const { token } = req.signedCookies;

  if (!token) {
    return res.status(401).json({ msg: "Authentication Invalid" });
  }
  try {
    const { id, username, email } = await isTokenValid({
      token,
    });
    req.user = { id, username, email };
    next();
  } catch (error) {
    return res.status(401).json({ msg: "You need to login" });
  }
};
