import { drizzle } from "drizzle-orm/neon-http";

// biome-ignore lint/style/noNonNullAssertion: i'm sure it exists
export const db = drizzle(process.env.DATABASE_URL!);
