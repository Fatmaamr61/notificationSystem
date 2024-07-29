import express from "express";
import dotenv from "dotenv";
import { appRouter } from "./src/appRouter.js";
import { connectionDB } from "./DB/connection.js";
import { setupSocket, notifyUsers } from "./src/utils/socket.js";

connectionDB();
dotenv.config();

const app = express();
const port = process.env.PORT;

// routing
appRouter(app, express);

const server = app.listen(port, () => {
  console.log(
    `......................SERVER RUNNING ON PORT ${port}......................`
  );
});
const io = setupSocket(server);

export { notifyUsers };
