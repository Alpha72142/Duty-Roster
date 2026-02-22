import { Router } from "express";
import * as ctrl from "./shift.controller.js";

const router = Router();

router.get("/", ctrl.getShifts);

export default router;