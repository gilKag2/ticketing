import { requireAuth } from "@gil-tickets/common";
import express, { Request, Response, Router } from "express";
import { Order } from "../models/order";

const router = Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate("ticket");

  res.send(orders);
});

export { router as IndexOrderRouter };
