import sslRedirect from "heroku-ssl-redirect";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import mmmRouter from "./routers/mmmRouter";
import userRouter from "./routers/userRouter";
import cookieParser from "cookie-parser";
import memoryRouter from "./routers/memoryRouter";
import responseRouter from "./routers/responseRouter";
import "winston-mongodb";

const app = express();
const port = process.env.PORT || 6555;

dotenv.config();

let mainDbStatus = false;

const connectToDBs = () => {
  mongoose.connect(
    "" + process.env.SAFE,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions,
    (err) => {
      if (err) return console.error(err);
      console.log("Connected to Main MongoDB");
      mainDbStatus = true;
    }
  );

  if (!mainDbStatus) setTimeout(connectToDBs, 180000);
};

connectToDBs();

app.use(sslRedirect());
app.use(express.json());

app.use(cors());

app.use(cookieParser());

app.listen(port, () => console.log(`Server started on port: ${port}`));

app.use("/mmm", mmmRouter);
app.use("/user", userRouter);
app.use("/memory", memoryRouter);
app.use("/response", responseRouter);
app.get("/areyoualive", (_, res) => res.json({ answer: "yes" }));
