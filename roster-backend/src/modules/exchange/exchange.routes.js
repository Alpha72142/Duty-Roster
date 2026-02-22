import { Router } from "express";
import * as ctrl from "./exchange.controller.js";

const router = Router();

router.post("/", ctrl.createRequest);
router.post("/:id/accept", ctrl.accept);
router.post("/:id/reject", ctrl.reject);
router.post("/swap", ctrl.swapNow);

export default router;
