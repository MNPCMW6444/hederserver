import express from "express";
import MMM from "../models/mmm";

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

export default router;
