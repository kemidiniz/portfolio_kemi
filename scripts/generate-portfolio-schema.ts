import { z } from "zod";
import { portfolioSchema } from "../src/lib/portfolio";
import { writeFileSync } from "node:fs";
const schema = z.toJSONSchema(portfolioSchema, { target: "draft-7" });
// Keep the SQL-side validation in sync when changing PortfolioData.
const path = "supabase/migrations/202610220001_portfolio_cms.sql";
const { readFileSync } = await import("node:fs");
const sql = readFileSync(path, "utf8");
const literal = JSON.stringify(schema).replaceAll("'", "''");
writeFileSync(
  path,
  sql.replace(/  shape := '[^\n]*'::jsonb;/, `  shape := '${literal}'::jsonb;`),
);
