import { Router } from "express";
import { isValid } from "../../middlewares/validation.middleware.js";
import {
  activateSchema,
  loginSchema,
  registerSchema,
} from "./auth.validation.js";
import {
  activateAccount,
  deleteAccount,
  logOut,
  login,
  register,
} from "./auth.controller.js";
import { isAuthenticated } from "../../middlewares/authentication.middleware.js";
const router = Router();

// register
router.post("/register", isValid(registerSchema), register);

// activate account
router.get(
  "/confirmEmail/:activationCode",
  isValid(activateSchema),
  activateAccount
);

// login
router.post("/login", isValid(loginSchema), login);

// logOut
router.get("/logout", isAuthenticated, logOut);

// delete account
router.delete("/account/delete", isAuthenticated, deleteAccount);

export default router;
