import sslRedirect from "heroku-ssl-redirect";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import NNN from "./models/nnn";
import cookieParser from "cookie-parser";

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

app.get("/areyoualive", (_, res) => res.json({ answer: "yes" }));

app.get("/michael", async (req, res) => {
  try {
    const aaaaa = await NNN.find();
    res.json({
      yoad: aaaaa[0]?.name ? "open" : "close",
      dsfds: "gfssdf",
    });
  } catch (err) {
    console.error(err);
    res.json({ yoad: "close", dsfds: "gfssdf" });
  }
});

app.post("/open", async (req, res) => {
  setTimeout(
    () =>
      NNN.remove({}, function (err) {
        console.log("collection removed");
      }),
    120000
  );
  const what = req.body.what;
  const s = new NNN({ name: "what" });
  await s.save();
  res.json({});
});
