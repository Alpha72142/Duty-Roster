import { Router } from "express";
import * as ctrl from "./roster.controller.js";

const router = Router();

router.post("/copy", ctrl.copyRoster);

export default router;
