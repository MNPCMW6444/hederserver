import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import memoryResult from "../models/memoryResult";

const router = express.Router();

router.post("/save", async (req, res) => {
  try {
    const { score } = req.body;
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ clientMessage: "Unauthorized" });
    if (score === undefined)
      return res.status(400).json({ clientMessage: "No Result" });
    const validatedUser = jwt.verify(token, process.env.JWT_SECRET as string);
    const userId = (validatedUser as JwtPayload).id;
    const newMemoryResult = new memoryResult({
      owner: userId,
      result: score,
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

router.get("/getScores", async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ clientMessage: "Unauthorized" });
    const validatedUser = jwt.verify(token, process.env.JWT_SECRET as string);
    const userId = (validatedUser as JwtPayload).id;
    const memories = await memoryResult.find();
    res.json(
      memories.filter((resp) => (resp.owner as any).toString() === userId)
    );
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ serverError: "Unexpected error occurred in the server" });
  }
});

export default router;
