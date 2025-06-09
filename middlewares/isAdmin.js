export default function isAdmin(_req, _res, next) {
  if (global.user && global.user.role === "admin") {
    next();
  } else {
    next({
      status: 403,
      message: "This feature is only available for admin",
    });
  }
}
