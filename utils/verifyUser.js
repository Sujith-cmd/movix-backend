import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import Cookies from "js-cookie";

export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  // console.log("Access Token:", token);
  // const token = req.cookies.access_token;
  //     console.log(typeof(token));
  if (!token) return next(errorHandler(401, 'You are not authenticated!'));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Token is not valid!"));
    // console.log("user");
    // console.log(user);
    req.user = user;
    next();
  });
};
