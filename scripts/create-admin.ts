import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { participants } from "../db/schema";
import { generateSecureRandomString, hashPassword } from "../lib/auth";

async function createAdmin() {
  const db = drizzle(process.env.DATABASE_URL!);

  const adminEmail = process.env.ADMIN_EMAIL!;
  const adminPassword = process.env.ADMIN_PASSWORD!;

  const adminId = generateSecureRandomString();
  const hashedPassword = await hashPassword(adminPassword);

  await db.insert(participants).values({
    id: adminId,
    name: "Admin",
    email: adminEmail,
    phoneNumber: "+51000000000",
    wantsToBuild: "Admin account",
    profile: "Admin",
    website: null,
    linkedInHandle: null,
    githubHandle: null,
    xHandle: null,
    organization: "Hackathon PE",
    hasBuilt: null,
    hashedPassword,
    avatarSeed: null,
    teamName: null,
  });

  console.log("✓ Admin account created successfully!");
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  console.log(`ID: ${adminId}`);
}

createAdmin().catch((error) => {
  console.error("Error creating admin account:", error);
  process.exit(1);
});
