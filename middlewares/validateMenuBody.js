export default function validateMenuBody(req, res, next) {
  if (req.body) {
    const { title, desc, price } = req.body;
    if (
      typeof title === "string" &&
      typeof desc === "string" &&
      typeof price === "number"
    ) {
      if (price >= 0) {
        next();
      } else {
        res.status(400).json({
          success: false,
          message: "Price may not be a negative number",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Both title, desc and price required",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "No body found in request",
    });
  }
}
