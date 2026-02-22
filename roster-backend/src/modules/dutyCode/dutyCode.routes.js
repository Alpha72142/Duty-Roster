import { Router } from "express";
import * as ctrl from "./dutyCode.controller.js";

const router = Router();

router.get("/", ctrl.getAll);
router.put("/:id", ctrl.update); // ← new

export default router;
