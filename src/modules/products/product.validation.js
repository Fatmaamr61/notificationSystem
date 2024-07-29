import joi from "joi";
import { isValidObjectId } from "./../../middlewares/validation.middleware.js";

export const createProductSchema = joi
  .object({
    name: joi.string().min(4).max(20).required(),
    price: joi.number().min(1).required(),
    description: joi.string(),
    availableItems: joi.number().min(1).required(),
    soldItems: joi.number().min(0),
    discount: joi.number().min(1).max(100),
    createdBy: joi.string().custom(isValidObjectId),
  })
  .required();

// discount schema
export const discountSchema = joi.object({
  productId: joi.string().custom(isValidObjectId).required(),
  discount: joi.number().greater(0).less(99).required(),
});

