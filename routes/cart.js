import { Router } from "express";
import { v4 as uuid } from "uuid";
import { getProduct } from "../services/products.js";
import { updateCart, getOrCreateCart, getAllCarts } from "../services/cart.js";
import { calculateTotal } from "../utils/cartUtils.js";
import { decryptToken } from "../services/users.js";

const router = Router();

//GET all carts
router.get("/", async (req, res, next) => {
  const carts = await getAllCarts();
  if (carts) {
    res.json({
      success: true,
      carts,
    });
  } else {
    next({
      status: 500,
      message: "Could not retrieve carts",
    });
  }
});

// GET cart by ID
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  const cart = await getOrCreateCart(id);
  if (cart) {
    const total = calculateTotal(cart);
    if (cart.items.length > 0) {
      res.json({
        success: true,
        cart,
        total,
      });
    } else {
      res.json({
        success: true,
        message: "Cart is empty",
      });
    }
  } else {
    next({
      status: 500,
      message: "Could not get or create cart",
    });
  }
});

// PUT item in cart
router.put("/", async (req, res, next) => {
  if (req.headers.authorization) {
    const validToken = await decryptToken(req.headers.authorization);

    if (validToken) {
      const userId = validToken.userId;
      const { prodId, qty } = req.body;
      const product = await getProduct(prodId);

      if (product) {
        const cart = await updateCart(userId, {
          prodId: product.prodId,
          title: product.title,
          price: product.price,
          qty: qty,
        });
        if (cart) {
          res.json({
            success: true,
            cart,
          });
        } else {
          next({
            status: 400,
            message: "Quantity must be provided as a positive integer",
          });
        }
      } else {
        next({
          status: 400,
          message: "Invalid product ID",
        });
      }
    } else {
      next({
        status: 401,
        message: "Invalid or expired token",
      });
    }
  } else {
    let { guestId, prodId, qty } = req.body;
    const product = await getProduct(prodId);

    if (!guestId) {
      guestId = `guest-${uuid().substring(0, 5)}`;
    }

    if (product) {
      const cart = await updateCart(guestId, {
        prodId: product.prodId,
        title: product.title,
        price: product.price,
        qty: qty,
      });
      if (cart) {
        res.json({
          success: true,
          cart,
        });
      } else {
        next({
          status: 400,
          message: "Quantity must be provided as a positive integer",
        });
      }
    } else {
      next({
        status: 400,
        message: "Invalid product ID",
      });
    }
  }
});

export default router;
