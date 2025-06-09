import { Router } from "express";
import {
  getAllProducts,
  addNewProduct,
  updateProduct,
  getProduct,
} from "../services/products.js";
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
      message: "Item added to menu",
      newProduct,
    });
  } else {
    next({
      status: 500,
      message: "Could not add new product",
    });
  }
});

// Update product by id
router.put("/:id", isAdmin, validateMenuBody, async (req, res, next) => {
  const { id } = req.params;
  const { title, desc, price } = req.body;

  const productExists = await getProduct(id);

  if (!productExists) {
    next({
      status: 404,
      message: "No product with that id found",
    });
    return;
  }

  const updatedProduct = await updateProduct(id, title, desc, price);

  if (updatedProduct) {
    res.json({
      success: true,
      updatedItem: updatedProduct,
    });
  } else {
    next({
      status: 500,
      message: "Could not update product",
    });
  }
});

export default router;
