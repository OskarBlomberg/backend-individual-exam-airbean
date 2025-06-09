import { v4 as uuid } from "uuid";
import Product from "../models/product.js";

// GET ALL PRODUCTS
export async function getAllProducts() {
  const allProducts = await Product.find();
  return allProducts;
}

// FIND PRODUCT BY ID
export async function getProduct(prodId) {
  try {
    const product = await Product.findOne({ prodId: prodId });
    return product;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

// ADD NEW PRODUCT
export async function addNewProduct(title, desc, price) {
  try {
    const shortUuid = uuid().slice(0, 5);
    const prodId = `prod-${shortUuid}`;

    const newProduct = new Product({
      prodId,
      title,
      desc,
      price,
    });

    await newProduct.save();
    return newProduct;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

// UPDATE PRODUCT
export async function updateProduct(prodId, title, desc, price) {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { prodId },
      { title, desc, price },
      { new: true }
    );
    return updatedProduct;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

// DELETE PRODUCT
export async function deleteProduct(prodId) {
  try {
    const deletedProduct = await Product.findOneAndDelete({ prodId });
    return deletedProduct;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}
