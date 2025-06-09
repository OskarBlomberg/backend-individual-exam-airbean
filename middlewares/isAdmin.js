import jwt from "jsonwebtoken";

export default function isAdmin(req, _res, next) {
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");

    try {
      const decoded = jwt.verify(token, process.env.PRIVATE_KEY);

      if (decoded.role === "admin") {
        next();
      } else {
        next({
          status: 403,
          message: "This feature is only available for admin",
        });
      }
    } catch (error) {
      next({
        status: 400,
        message: "Invalid token",
      });
    }
  } else {
    next({
      status: 400,
      message: "No token provided",
    });
  }
}
