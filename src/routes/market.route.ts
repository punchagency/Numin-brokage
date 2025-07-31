import { Router } from "express";
import { container } from "tsyringe";
import { validate, authorize } from "../middleware/validate";
import { loginSchema } from "../interfaces/auth.interface";
// import { MarketController } from "../controllers/market.controller";
import { MarketController } from "../controllers/market.controller";

const router = Router();
const marketController = container.resolve(MarketController);

router.post(
  "/place-order",
  // validate(loginSchema),
  authorize(),
  async (req, res) => {
    const result = await marketController.placeOrder(req);
    res.json(result);
  }
);

router.get("/instruments", authorize(), async (req, res) => {
  const result = await marketController.getInstruments(req);
  res.json(result);
});

export default router;
