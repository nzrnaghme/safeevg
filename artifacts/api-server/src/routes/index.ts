import { Router, type IRouter } from "express";
import healthRouter from "./health";
import quoteRequestsRouter from "./quote-requests";
import siteContentRouter from "./site-content";

const router: IRouter = Router();

router.use(healthRouter);
router.use(quoteRequestsRouter);
router.use(siteContentRouter);

export default router;
