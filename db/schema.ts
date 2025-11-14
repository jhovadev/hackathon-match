import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const participants = pgTable("participants", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number").notNull(),
  wantsToBuild: text("wants_to_build").notNull(),
  profile: text("profile").notNull(),
  website: text("website"),
  linkedInHandle: text("linkedin_handle"),
  githubHandle: text("github_handle"),
  xHandle: text("x_handle"),
  organization: text("organization"),
  hasBuilt: text("has_built"),
  hashedPassword: text("hashed_password").notNull(),
  avatarSeed: text("avatar_seed"),
  hasTeam: boolean("has_team").notNull().default(false),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  secretHash: text("secret_hash").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => participants.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Participant = typeof participants.$inferSelect;
export type Session = typeof sessions.$inferSelect;
