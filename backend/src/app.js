import { config } from "dotenv";
config();
import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import problemRouter from "./routes/problem.js";
import submissionRouter from "./routes/submission.js";
import companyRouter from "./routes/company.js";
import topicRouter from "./routes/topic.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import contestRouter from "./routes/contest.js";

const app = express();
const server = http.createServer(app);

// Create Socket.IO instance AFTER creating the server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

// Socket.IO connection logic
io.on("connection", (socket) => {
  console.log(`Socket connected<app.js>: ${socket.id}`);
  socket.on("join", (uid) => {
    console.log(`Client joined room<app.js>: ${uid}`);
    socket.join(uid);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected<app.js>: ${socket.id}`);
  });
});

const socketMiddleware = (ioInstance) => {
  return (req, res, next) => {
    req.io = ioInstance;
    next();
  };
};

import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js";
import {
  contestStartQueue,
  contestEndQueue,
  emailQueue,
} from "./bullmq/queues/contestQueues.js";

const serverAdapter = new ExpressAdapter();

createBullBoard({
  queues: [
    new BullMQAdapter(contestStartQueue),
    new BullMQAdapter(contestEndQueue),
    new BullMQAdapter(emailQueue),
  ],
  serverAdapter,
});

serverAdapter.setBasePath("/admin/queues");

app.use("/admin/queues", serverAdapter.getRouter());

// Middleware and route setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(socketMiddleware(io));

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use("/api/problem", problemRouter);
app.use("/api/submission", submissionRouter);
app.use("/api/company", companyRouter);
app.use("/api/topic", topicRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/contest", contestRouter);

app.get("/", async (req, res) => {
  res.send("Server is running");
});

app.put("/callback", async (req, res) => {
  console.log("<app.js> /callback \n",req.body);
  res.status(200).json({ message: "done" });
});

export { server, io };




// # CORS Headers
//     add_header Access-Control-Allow-Origin "https://algo-arena-psi.vercel.app/";
//     add_header Access-Control-Allow-Credentials true;
//     add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS, PUT, DELETE';
//     add_header Access-Control-Allow-Headers 'Origin, Content-Type, Accept, Authorization, X-Requested-With';

// # Preflight
// if ($request_method = OPTIONS ) {
//     add_header Access-Control-Allow-Origin "https://algo-arena-psi.vercel.app/";
//     add_header Access-Control-Allow-Credentials true;
//     add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS, PUT, DELETE';
//     add_header Access-Control-Allow-Headers 'Origin, Content-Type, Accept, Authorization, X-Requested-With';
//     return 204;
// }