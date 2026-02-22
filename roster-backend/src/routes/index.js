import { Router } from "express";
import workerRoutes from "../modules/worker/worker.routes.js";
import shiftRoutes from "../modules/shift/shift.routes.js";
import assignmentRoutes from "../modules/assignment/assignment.routes.js";
import exchangeRoutes from "../modules/exchange/exchange.routes.js";
import rosterRoutes from "../modules/roster/roster.routes.js";
import exportRoutes from "../modules/export/export.routes.js";
import rosterPeriodRoutes from "../modules/rosterPeriod/rosterPeriod.routes.js";
import dutyCodeRoutes from "../modules/dutyCode/dutyCode.routes.js";
import availabilityRoutes from "../modules/availability/availability.routes.js";

const router = Router();

router.get("/health", (req, res) => res.json({ status: "ok" }));

router.use("/workers", workerRoutes);

router.use("/shifts", shiftRoutes);

router.use("/assignments", assignmentRoutes);

router.use("/exchange", exchangeRoutes);

router.use("/roster", rosterRoutes);

router.use("/export", exportRoutes);

router.use("/roster-period", rosterPeriodRoutes);

router.use("/duty-codes", dutyCodeRoutes);

router.use("/availability", availabilityRoutes);

export default router;
