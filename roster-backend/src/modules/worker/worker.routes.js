import { Router } from "express";
import * as ctrl from "./worker.controller.js";

const router = Router();

router.post("/", ctrl.createWorker);
router.get("/", ctrl.getWorkers);
router.put("/:id", ctrl.updateWorker);
router.patch("/:id/deactivate", ctrl.deleteWorker);
router.delete("/:id", ctrl.hardDeleteWorker);

export default router;
