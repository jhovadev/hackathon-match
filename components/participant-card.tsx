"use client";

import Link from "next/link";
import Image from "next/image";
import { Code, Palette, Package, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { getAvatarUrl } from "@/lib/avatar";
import type { Participant } from "@/db/schema";

interface ParticipantCardProps {
  participant: Participant;
}

function getProfileIcon(profile: string) {
  const profileLower = profile.toLowerCase();

  if (profileLower.includes("engineer")) {
    return <Code className="w-4 h-4" />;
  }
  if (profileLower.includes("design")) {
    return <Palette className="w-4 h-4" />;
  }
  if (profileLower.includes("product")) {
    return <Package className="w-4 h-4" />;
  }
  if (profileLower.includes("growth")) {
    return <TrendingUp className="w-4 h-4" />;
  }
  return <Users className="w-4 h-4" />;
}

function getProfileClass(profile: string) {
  const profileLower = profile.toLowerCase();

  if (profileLower.includes("engineer")) {
    return "card-engineer";
  }
  if (profileLower.includes("design")) {
    return "card-designer";
  }
  if (profileLower.includes("product")) {
    return "card-product";
  }
  if (profileLower.includes("growth")) {
    return "card-growth";
  }
  return "card-other";
}

export default function ParticipantCard({ participant }: ParticipantCardProps) {
  const firstName = participant.name.split(" ")[0];
  const avatarUrl = getAvatarUrl(participant);
  const profileClass = getProfileClass(participant.profile);
  const icon = getProfileIcon(participant.profile);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/p/${participant.id}`} className="block">
      <motion.div
        className={`relative ${profileClass}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -4 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card
          className="relative overflow-hidden border-2 transition-all duration-100 rounded-sm"
          style={{
            borderColor: "var(--profile-color)",
            boxShadow: isHovered
              ? "6px 6px 0px var(--profile-color)"
              : "3px 3px 0px var(--profile-color)",
          }}
        >
          <div className="scanline-overlay">
            <div
              className="absolute top-0 left-0 right-0 h-20"
              style={{
                backgroundColor: "var(--profile-color)",
                opacity: 0.1,
              }}
            />

            <div className="relative p-6 flex flex-col items-center space-y-4">
              <div className="relative">
                <div
                  className="w-24 h-24 border-2 pixel-borders overflow-hidden bg-card"
                  style={{
                    borderColor: "var(--profile-color)",
                  }}
                >
                  <Image
                    src={avatarUrl}
                    alt={firstName}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover pixel-borders"
                    unoptimized
                  />
                </div>

                {participant.hasTeam && (
                  <div
                    className="absolute -top-2 -left-2 w-8 h-8 border-2 flex items-center justify-center text-primary-foreground"
                    style={{
                      backgroundColor: "var(--profile-color)",
                      borderColor: "hsl(var(--card))",
                    }}
                  >
                    <Users className="w-4 h-4" />
                  </div>
                )}

                <div
                  className="absolute -bottom-2 -right-2 w-8 h-8 border-2 flex items-center justify-center text-primary-foreground"
                  style={{
                    backgroundColor: "var(--profile-color)",
                    borderColor: "hsl(var(--card))",
                  }}
                >
                  {icon}
                </div>
              </div>

              <div className="text-center space-y-2 w-full">
                <h3 className="text-lg font-bold text-foreground tracking-tight uppercase">
                  {firstName}
                </h3>

                <Badge
                  variant="secondary"
                  className="font-medium text-xs uppercase rounded-none border"
                  style={{
                    backgroundColor: isHovered
                      ? "var(--profile-color)"
                      : "hsl(var(--secondary))",
                    color: isHovered
                      ? "white"
                      : "hsl(var(--secondary-foreground))",
                    borderColor: "var(--profile-color)",
                    transition: "all 0.1s ease",
                  }}
                >
                  {participant.profile || "Other"}
                </Badge>

                <div
                  className="h-0.5 w-12 mx-auto"
                  style={{
                    backgroundColor: "var(--profile-color)",
                  }}
                />

                <p className="text-xs text-muted-foreground line-clamp-2 px-2 min-h-[2.5rem] leading-relaxed">
                  {participant.wantsToBuild.substring(0, 80)}...
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}
