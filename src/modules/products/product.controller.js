import { Product } from "../../../db/models/product.model.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import slugify from "slugify";
import { notifyUsers } from "../../utils/socket.js";

export const addProduct = AsyncHandler(async (req, res, next) => {
  const { name } = req.body;

  // create product
  const product = await Product.create({
    ...req.body,
    slug: slugify(name),
    createdBy: req.user._id,
  });

  const finalPrice = req.body.discount
    ? Number.parseFloat(
        product.price - (product.price * req.body.discount) / 100
      ).toFixed(2)
    : req.body.price;

  product.discount = req.body.discount;
  product.finalPrice = finalPrice;
  await product.save();

  // send real-time notifications
  notifyUsers("new-product", {
    message: `${product.name}`,
  });

  res.json({ success: true, results: product });
});

export const addDiscount = AsyncHandler(async (req, res, next) => {
  const { discount } = req.body;

  // Check product
  const product = await Product.findById({ _id: req.params.productId });
  if (!product) return next(new Error("product not found!"));

  if (discount) {
    const finalPrice = Number.parseFloat(
      product.price - (product.price * discount) / 100
    ).toFixed(2);
    product.discount = discount;
    product.finalPrice = finalPrice;
    await product.save();

    // Notify users once
    notifyUsers("new-discount", {
      message: `Hurry up a ${discount}% off on ${product.name}`,
      product,
    });

    return res.json({
      success: true,
      message: "discount added successfully!",
      results: product,
    });
  } else {
    notifyUsers("new-discount", {
      message: `Hurry up a ${discount}% off on ${product.name}`,
      product,
    });
  }

  return res.json({ success: true, results: product });
});

export const getAllProducts = AsyncHandler(async (req, res, next) => {
  if (req.params.categoryId) {
    const category = await Category.findById(req.params.categoryId);
    if (!category)
      return next(new Error("category not found!", { cause: 404 }));

    const product = await Product.find({
      category: req.params.categoryId,
    });
    return res.json({ success: true, results: product });
  }

  const products = await Product.find();

  if (products.length < 1)
    return next(new Error("no products found!", { cause: 404 }));

  return res.json({ success: true, results: products });
});
