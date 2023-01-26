import sslRedirect from "heroku-ssl-redirect";
import express, { Request } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import mmmRouter from "./routers/mmmRouter";
import userRouter from "./routers/userRouter";
import cookieParser from "cookie-parser";
import memoryRouter from "./routers/memoryRouter";
import responseRouter from "./routers/responseRouter";
import winston from "winston";
import "winston-mongodb";

const app = express();
const port = process.env.PORT || 6555;

dotenv.config();

let mainDbStatus = false;
let oCDbStatus = false;

let logReq: any;

const connectToDBs = () => {
  mongoose.connect(
    "" + process.env.MONGO,
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
  try {
    const mongoTransport = winston.add(
      new winston.transports.MongoDB({
        db: "" + process.env.MONGO_OC,
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      })
    );

    const logger = winston.createLogger({
      level: "info",
      format: winston.format.json(),
      defaultMeta: { service: "user-service" },
      transports: [mongoTransport],
    });

    logReq = (req: Request<{}, any, any, Record<string, any>>) =>
      logger.log({
        level: "warn",
        message:
          "Req: " +
          JSON.stringify({
            headers: req.headers,
            method: req.method,
            url: req.url,
            httpVersion: req.httpVersion,
            body: req.body,
            cookies: req.cookies,
            path: req.path,
            protocol: req.protocol,
            query: req.query,
            hostname: req.hostname,
            ip: req.ip,
            originalUrl: req.originalUrl,
            params: req.params,
          }),
      });

    oCDbStatus = true;
  } catch (err) {
    console.log(err);
    oCDbStatus = false;
  }
  if (!mainDbStatus || !oCDbStatus) setTimeout(connectToDBs, 180000);
};

connectToDBs();

app.use(sslRedirect());
app.use(express.json());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? ["http://localhost:5665", "http://localhost:3000"]
        : ["https://app.neurobica.online", "https://hedermmm.netlify.app"],
    credentials: true,
  })
);

app.use(cookieParser());

app.listen(port, () => console.log(`Server started on port: ${port}`));

app.use((req, res, next) => {
  if (mainDbStatus || oCDbStatus) {
    logReq
      ? logReq(req)
      : console.log(
          "didnt log but shoud have because it is: ",
          JSON.stringify(logReq)
        );
    next();
  } else
    res
      .status(500)
      .json({ serverError: "Server is down now. Please try again later." });
});

app.use("/mmm", mmmRouter);
app.use("/user", userRouter);
app.use("/memory", memoryRouter);
app.use("/response", responseRouter);
app.get("/areyoualive", (_, res) => res.json({ answer: "yes" }));
