import { Router } from "express";
import { getAllProducts, addNewProduct } from "../services/products.js";
import isAdmin from "../middlewares/isAdmin.js";
import validateMenuBody from "../middlewares/validateMenuBody.js";

const router = Router();

// GET all products
router.get("/", async (req, res, next) => {
  const result = await getAllProducts();

  if (result) {
    res.json({
      success: true,
      products: result,
    });
  } else {
    next({
      status: 404,
      message: "No products found",
    });
  }
});

// Add new product to menu
router.post("/", isAdmin, validateMenuBody, async (req, res, next) => {
  const { title, desc, price } = req.body;

  const newProduct = await addNewProduct(title, desc, price);

  if (newProduct) {
    res.status(201).json({
      success: true,
      message: "Item added to menu!",
      newProduct,
    });
  } else {
    next({
      status: 500,
      message: "Could not add new product",
    });
  }
});

export default router;
