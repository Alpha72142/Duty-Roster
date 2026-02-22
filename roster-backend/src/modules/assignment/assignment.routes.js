import { Router } from "express";
import * as ctrl from "./assignment.controller.js";

const router = Router();

router.post("/", ctrl.createAssignment);
router.put("/:id", ctrl.updateAssignment);
router.patch("/:id/remove", ctrl.deleteAssignment);
router.get("/roster", ctrl.getRoster);

export default router;