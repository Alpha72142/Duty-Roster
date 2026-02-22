import { Router } from "express";
import * as ctrl from "./export.controller.js";

const router = Router();

router.get("/roster-template", ctrl.exportMonth);

export default router;
