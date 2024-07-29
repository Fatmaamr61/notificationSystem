import authRouter from "./modules/auth/auth.router.js";
import productRouter from "./modules/products/product.router.js";
import morgan from "morgan";
import cors from "cors";

export const appRouter = (app, express) => {
  // morgan
  if (process.env.NODE_ENV == "dev") {
    app.use(morgan("dev"));
  }

  const corsOpts = {
    origin: "*",

    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],

    allowedHeaders: ["Content-Type", "token", "Authorization"],
  };

  app.use(cors(corsOpts));
  // CORS
  app.use(express.json());

  // global middleware
  // app.use((req, res, next) => {
  // req.originalUrl
  /*  if (req.originalUrl === "/order/webhook") {
      return next();
    } */
  //   express.json()(req, res, next);
  // });

  //routes
  //auth
  app.use("/auth", authRouter);

  // product
  app.use("/product", productRouter);

  // not found page router
  app.all("*", (req, res, next) => {
    return next(new Error("page not found!", { cause: 404 }));
  });

  // global error handler
  app.use((error, req, res, next) => {
    const statusCode = error.cause || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  });
};
