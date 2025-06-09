export default function validateMenuBody(req, res, next) {
  if (req.body) {
    const { title, desc, price } = req.body;
    if (title && desc && price) {
      next();
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
