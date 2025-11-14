export function generateAvatarSeed(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let seed = "";
  for (let i = 0; i < 10; i++) {
    seed += chars[Math.floor(Math.random() * chars.length)];
  }
  return seed;
}

export function getAvatarUrl(participant: {
  avatarSeed?: string | null;
  id: string;
}): string {
  const seed = participant.avatarSeed || participant.id;
  return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`;
}
