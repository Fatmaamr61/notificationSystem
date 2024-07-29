import Router from "express";
import { isAuthenticated } from "./../../middlewares/authentication.middleware.js";
import { isAuthorized } from "./../../middlewares/authorization.middleware.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import {
  createProductSchema,
  discountSchema,
} from "./product.validation.js";
import {
  addDiscount,
  addProduct,
  getAllProducts,
} from "./product.controller.js";

const router = Router({ mergeParams: true });

// CRUD
// create product
router.post(
  "/new",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(createProductSchema),
  addProduct
);

// add discount
router.patch(
  "/discount/:productId",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(discountSchema),
  addDiscount
);

// get all products
router.get("/", getAllProducts);

export default router;
