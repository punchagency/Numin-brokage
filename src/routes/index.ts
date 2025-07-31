import { Router } from "express";
import authRoutes from "./auth.route";
import marketRoutes from "./market.route";

const router = Router();

router.get("/", (req, res) => {
  res.send("Welcome to the Brokers API");
});

router.use("/auth", authRoutes);
router.use("/market", marketRoutes);

export default router;
