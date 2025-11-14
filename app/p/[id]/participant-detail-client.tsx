"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Code,
  Palette,
  Package,
  TrendingUp,
  Users,
  Globe,
  Mail,
  Phone,
  ArrowLeft,
} from "lucide-react";
import { FaXTwitter, FaLinkedin, FaGithub } from "react-icons/fa6";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { getAvatarUrl } from "@/lib/avatar";
import type { Participant } from "@/db/schema";

interface ParticipantDetailClientProps {
  participant: Participant;
}

function getProfileIcon(profile: string) {
  const profileLower = profile.toLowerCase();

  if (profileLower.includes("engineer")) {
    return <Code className="w-6 h-6" />;
  }
  if (profileLower.includes("design")) {
    return <Palette className="w-6 h-6" />;
  }
  if (profileLower.includes("product")) {
    return <Package className="w-6 h-6" />;
  }
  if (profileLower.includes("growth")) {
    return <TrendingUp className="w-6 h-6" />;
  }
  return <Users className="w-6 h-6" />;
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

export default function ParticipantDetailClient({
  participant,
}: ParticipantDetailClientProps) {
  const avatarUrl = getAvatarUrl(participant);
  const profileClass = getProfileClass(participant.profile);
  const icon = getProfileIcon(participant.profile);

  return (
    <div className={`min-h-screen bg-background ${profileClass}`}>
      <div
        className="relative overflow-hidden scanline-overlay"
        style={{
          backgroundColor: "var(--profile-color)",
        }}
      >
        <div className="pixel-grid-overlay h-32 flex items-center justify-start overflow-hidden">
          {participant.hasTeam && (
            <div className="flex whitespace-nowrap">
              {Array.from({ length: 15 }).map((_, i) => (
                <span
                  key={i}
                  className="text-2xl font-bold tracking-widest uppercase inline-block px-8"
                  style={{
                    color: "rgba(255, 255, 255, 0.3)",
                    fontFamily: "monospace",
                    letterSpacing: "0.3em",
                  }}
                >
                  HAS TEAM
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-2 bg-background/90 border-2 text-foreground hover:bg-background transition-colors duration-100 rounded-sm"
            style={{
              borderColor: "hsl(var(--foreground))",
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium uppercase">Back</span>
          </Link>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            className="max-w-4xl mx-auto border-2 rounded-sm"
            style={{
              borderColor: "var(--profile-color)",
              boxShadow: "8px 8px 0px var(--profile-color)",
            }}
          >
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center md:items-start space-y-4">
                  <div
                    className="w-48 h-48 border-2 pixel-borders overflow-hidden bg-card"
                    style={{
                      borderColor: "var(--profile-color)",
                    }}
                  >
                    <div className="w-full h-full relative">
                      {participant.hasTeam && (
                        <div
                          className="absolute top-2 left-2 w-10 h-10 border-2 flex items-center justify-center text-primary-foreground z-10"
                          style={{
                            backgroundColor: "var(--profile-color)",
                            borderColor: "hsl(var(--card))",
                          }}
                        >
                          <Users className="w-6 h-6" />
                        </div>
                      )}
                      <div
                        className="absolute top-2 right-2 w-10 h-10 border-2 flex items-center justify-center text-primary-foreground z-10"
                        style={{
                          backgroundColor: "var(--profile-color)",
                          borderColor: "hsl(var(--card))",
                        }}
                      >
                        {icon}
                      </div>
                      <Image
                        src={avatarUrl}
                        alt={participant.name}
                        width={192}
                        height={192}
                        className="w-full h-full object-cover pixel-borders"
                        unoptimized
                      />
                    </div>
                  </div>

                  <Badge
                    className="text-sm font-medium px-4 py-2 text-primary-foreground uppercase rounded-none border-2"
                    style={{
                      backgroundColor: "var(--profile-color)",
                      borderColor: "var(--profile-color-dark)",
                    }}
                  >
                    {participant.profile || "Other"}
                  </Badge>
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2 uppercase tracking-tight">
                      {participant.name}
                    </h1>

                    {participant.organization && (
                      <p className="text-base text-muted-foreground font-medium">
                        {participant.organization}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {participant.email && (
                      <motion.a
                        href={`mailto:${participant.email}`}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs border-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-100 rounded-sm"
                        whileHover={{ scale: 1.02 }}
                        style={{
                          borderColor: "hsl(var(--border))",
                        }}
                      >
                        <Mail className="w-3 h-3" />
                        <span className="hidden sm:inline">
                          {participant.email}
                        </span>
                      </motion.a>
                    )}

                    {participant.phoneNumber && (
                      <motion.a
                        href={`tel:${participant.phoneNumber}`}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs border-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-100 rounded-sm"
                        whileHover={{ scale: 1.02 }}
                        style={{
                          borderColor: "hsl(var(--border))",
                        }}
                      >
                        <Phone className="w-3 h-3" />
                        <span className="hidden sm:inline">
                          {participant.phoneNumber}
                        </span>
                      </motion.a>
                    )}

                    {participant.website && (
                      <motion.a
                        href={participant.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 text-xs border-2 hover:bg-opacity-10 transition-colors duration-100 rounded-sm"
                        style={{
                          color: "var(--profile-color)",
                          borderColor: "var(--profile-color)",
                        }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Globe className="w-3 h-3" />
                        Website
                      </motion.a>
                    )}

                    {participant.linkedInHandle && (
                      <motion.a
                        href={participant.linkedInHandle}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 text-xs border-2 hover:bg-opacity-10 transition-colors duration-100 rounded-sm"
                        style={{
                          color: "var(--profile-color)",
                          borderColor: "var(--profile-color)",
                        }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <FaLinkedin className="w-3 h-3" />
                        LinkedIn
                      </motion.a>
                    )}

                    {participant.githubHandle && (
                      <motion.a
                        href={participant.githubHandle}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 text-xs border-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-100 rounded-sm"
                        whileHover={{ scale: 1.02 }}
                        style={{
                          borderColor: "hsl(var(--border))",
                        }}
                      >
                        <FaGithub className="w-3 h-3" />
                        GitHub
                      </motion.a>
                    )}

                    {participant.xHandle && (
                      <motion.a
                        href={participant.xHandle}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 text-xs border-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-100 rounded-sm"
                        whileHover={{ scale: 1.02 }}
                        style={{
                          borderColor: "hsl(var(--border))",
                        }}
                      >
                        <FaXTwitter className="w-3 h-3" />X
                      </motion.a>
                    )}
                  </div>

                  <div className="space-y-6">
                    {participant.wantsToBuild && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div
                          className="h-0.5 w-full mb-3"
                          style={{ backgroundColor: "var(--profile-color)" }}
                        />
                        <h2 className="text-base font-bold text-foreground mb-2 uppercase tracking-wide">
                          What they want to build
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {participant.wantsToBuild}
                        </p>
                      </motion.div>
                    )}

                    {participant.hasBuilt && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div
                          className="h-0.5 w-full mb-3"
                          style={{ backgroundColor: "var(--profile-color)" }}
                        />
                        <h2 className="text-base font-bold text-foreground mb-2 uppercase tracking-wide">
                          What they&apos;ve built
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                          {participant.hasBuilt}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
