import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { User } from "../../../db/models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../../utils/sendEmail.js";
import {
  signUpTemp,
  accountActivatedTemplate,
} from "../../utils/generateHTML.js";
import jwt from "jsonwebtoken";
import { Token } from "../../../db/models/token.model.js";

export const register = AsyncHandler(async (req, res, next) => {
  // data from request
  const { userName, email, password } = req.body;

  // check user existance
  const isUser = await User.findOne({ email });
  if (isUser)
    return next(new Error("Email already registered", { cause: 409 }));

  // hash password
  const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SALT));

  // generate activation code
  const activationCode = crypto.randomBytes(64).toString("hex");

  // create user
  const user = await User.create({
    userName,
    email,
    password: hashPassword,
    activationCode,
  });

  // create confirmation link
  const link = `http://localhost:5005/auth/confirmEmail/${activationCode}`;

  // send email
  const isSent = await sendEmail({
    to: email,
    subject: "activate account",
    html: signUpTemp(link),
  });
  console.log(isSent);
  // send response
  return isSent
    ? res.json({ success: true, message: "please check your email" })
    : next(new Error("something went wrong!"));
});

export const activateAccount = AsyncHandler(async (req, res, next) => {
  // find user, delete activation code, update isConfirmed
  const user = await User.findOneAndUpdate(
    { activationCode: req.params.activationCode },
    {
      isConfirmed: true,
      $unset: { activationCode: 1 },
    }
  );

  // check if user doesn't exist
  if (!user) return next(new Error("user not found!!", { cause: 404 }));

  // send response
  return res.send(accountActivatedTemplate());
});

export const login = AsyncHandler(async (req, res, next) => {
  // data from request
  const { email, password } = req.body;

  // check user
  const user = await User.findOne({ email });
  if (!user) return next(new Error("invalid email!", { cause: 400 }));

  // check is confrirmed
  if (!user.isConfirmed)
    return next(new Error("un activated account!!", { cause: 400 }));

  // check password
  const pass = bcrypt.compareSync(password, user.password);
  if (!pass) return next(new Error("Wrong password", { cause: 400 }));

  // check if user have active token and invalidate it
  const tokens = await Token.find({ user: user._id });
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });

  // generate token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.TOKEN_KEY
  );

  // save token in token model
  await Token.create({
    token,
    user: user._id,
    agent: req.headers["user-agent"],
  });

  // change user status to online and save
  user.status = "online";
  await user.save();

  // get user role
  const userRole = await User.findById(user._id);

  // send response
  return res.json({ success: true, results: token, role: userRole.role });
});

export const logOut = AsyncHandler(async (req, res, next) => {
  const id = req.user._id;
  let { token } = req.headers;

  // invalidate token
  token = token.split(process.env.BEARER)[1];
  const removeToken = await Token.findOneAndUpdate(
    { token },
    { isValid: false },
    { new: true }
  );

  return res.status(202).json({ success: true, message: `You are logged Out` });
});

export const deleteAccount = AsyncHandler(async (req, res, next) => {
  const id = req.user._id;
  let { token } = req.headers;

  // delete tokens
  const tokens = await Token.deleteMany({ user: id });
  console.log(tokens);

  // delete user
  const user = await User.findByIdAndDelete(id);

  return res
    .status(202)
    .json({ success: true, message: `user deleted successfully..` });
});
