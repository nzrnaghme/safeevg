import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const quoteRequestsTable = pgTable("quote_requests", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  propertyAddress: text("property_address"),
  zipCode: text("zip_code"),
  serviceNeeded: text("service_needed"),
  propertyType: text("property_type"),
  projectDetails: text("project_details"),
  contactPermission: text("contact_permission"),
  receivedAt: timestamp("received_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type QuoteRequest = typeof quoteRequestsTable.$inferSelect;
