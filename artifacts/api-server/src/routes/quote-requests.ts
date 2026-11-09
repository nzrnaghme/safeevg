import { Router, type IRouter } from "express";
import { db, quoteRequestsTable } from "@workspace/db";
import {
  CreateQuoteRequestBody,
  CreateQuoteRequestResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/quote-requests", async (req, res): Promise<void> => {
  const parsed = CreateQuoteRequestBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid quote request");
    res.status(400).json({ error: "Please check the form and try again." });
    return;
  }

  const [saved] = await db
    .insert(quoteRequestsTable)
    .values(parsed.data)
    .returning({
      id: quoteRequestsTable.id,
      receivedAt: quoteRequestsTable.receivedAt,
    });

  res.status(201).json(CreateQuoteRequestResponse.parse(saved));
});

export default router;
