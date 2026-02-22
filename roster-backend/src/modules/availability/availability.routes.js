import { Router } from "express";
import * as ctrl from "./availability.controller.js";

const router = Router();

router.get("/", ctrl.getAvailability);

export default router;