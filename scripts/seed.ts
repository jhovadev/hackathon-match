import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { participants } from "../db/schema";
import fs from "fs";
import path from "path";
import { generateSecureRandomString, hashPassword } from "../lib/auth";

interface CSVParticipant {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  wants_to_build: string;
  profile: string;
  website: string;
  linkedIn_handle: string;
  github_handle: string;
  x_handle: string;
  organization: string;
  has_built: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function parseCSV(filePath: string): CSVParticipant[] {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent.split("\n");
  const parsedParticipants: CSVParticipant[] = [];

  let currentParticipant: Partial<CSVParticipant> | null = null;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) continue;

    const match = line.match(/^([^,]+),/);

    if (match && match[1].length > 10 && /^[A-Za-z0-9]+$/.test(match[1])) {
      if (currentParticipant && currentParticipant.id) {
        parsedParticipants.push(currentParticipant as CSVParticipant);
      }

      const parts = parseCSVLine(line);
      currentParticipant = {
        id: parts[0] || "",
        name: parts[1] || "",
        email: parts[2] || "",
        phone_number: parts[3] || "",
        wants_to_build: parts[4] || "",
        profile: parts[5] || "",
        website: parts[6] || "",
        linkedIn_handle: parts[7] || "",
        github_handle: parts[8] || "",
        x_handle: parts[9] || "",
        organization: parts[10] || "",
        has_built: parts[11] || "",
      };
    } else if (currentParticipant) {
      currentParticipant.has_built =
        (currentParticipant.has_built || "") + " " + line;
    }
  }

  if (currentParticipant && currentParticipant.id) {
    parsedParticipants.push(currentParticipant as CSVParticipant);
  }

  return parsedParticipants;
}

async function seed() {
  const db = drizzle(process.env.DATABASE_URL!);

  const csvPath = path.join(process.cwd(), "app", "participants.csv");
  const csvParticipants = parseCSV(csvPath);

  const credentials: { email: string; password: string }[] = [];

  console.log(`Found ${csvParticipants.length} participants in CSV`);

  for (const csvParticipant of csvParticipants) {
    const password = generateSecureRandomString();
    const hashedPassword = await hashPassword(password);

    await db.insert(participants).values({
      id: csvParticipant.id,
      name: csvParticipant.name,
      email: csvParticipant.email,
      phoneNumber: csvParticipant.phone_number,
      wantsToBuild: csvParticipant.wants_to_build,
      profile: csvParticipant.profile,
      website: csvParticipant.website || null,
      linkedInHandle: csvParticipant.linkedIn_handle || null,
      githubHandle: csvParticipant.github_handle || null,
      xHandle: csvParticipant.x_handle || null,
      organization: csvParticipant.organization || null,
      hasBuilt: csvParticipant.has_built || null,
      hashedPassword,
    });

    credentials.push({
      email: csvParticipant.email,
      password,
    });

    console.log(`✓ Seeded ${csvParticipant.name}`);
  }

  const credentialsCSV = ["email,password"]
    .concat(credentials.map((c) => `${c.email},${c.password}`))
    .join("\n");

  const credentialsPath = path.join(process.cwd(), "credentials.csv");
  fs.writeFileSync(credentialsPath, credentialsCSV);

  console.log(`\n✓ Created credentials.csv with ${credentials.length} entries`);
  console.log("✓ Database seeded successfully!");
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
