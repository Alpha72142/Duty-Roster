import { Router } from "express";
import * as ctrl from "./rosterPeriod.controller.js";

const router = Router();

router.post("/publish", ctrl.publish);
router.post("/lock", ctrl.lock);
router.post("/unlock", ctrl.unlock);
router.get("/status", ctrl.getStatus);
export default router;
