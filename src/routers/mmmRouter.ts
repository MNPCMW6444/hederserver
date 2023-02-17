import express from "express";
import MMM from "../models/mmm";
import NNN from "../models/nnn";

const router = express.Router();

router.post("/addnew", async (req, res) => {
  try {
    const { name, tags, find } = req.body;

    const newMemoryResult = new MMM({
      name,
      tags,
      find,
    });
    const savedMemoryResult = await newMemoryResult.save();
    res.json(savedMemoryResult);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ serverError: "Unexpected error occurred in the server" });
  }
});

router.get("/getall", async (req, res) => {
  try {
    const savedMemoryResult = await MMM.find();
    res.json(savedMemoryResult);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ serverError: "Unexpected error occurred in the server" });
  }
});

router.get("/michael", async (req, res) => {
  try {
    const aaaaa = await NNN.find();
    res.json({ yoad: aaaaa[0].name === "open", dsfds: "gfssdf" });
  } catch (err) {
    console.error(err);
    res.json({ yoad: false, dsfds: "gfssdf" });
  }
});

router.post("/open", async (req, res) => {
  setTimeout(
    () =>
      NNN.remove({}, function (err) {
        console.log("collection removed");
      }),
    30000
  );
  const what = req.body.what;
  const s = new NNN({ name: what });
  await s.save();
  res.json({ yoad: what, dsfds: "gfssdf" });
});

export default router;
