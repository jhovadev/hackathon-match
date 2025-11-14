"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import ParticipantCard from "./participant-card";
import { ShuffleProgressBar } from "./shuffle-progress-bar";
import { ParticipantFilters } from "./participant-filters";
import type { Participant } from "@/db/schema";

interface ParticipantGridProps {
  initialParticipants: Participant[];
}

export function ParticipantGrid({ initialParticipants }: ParticipantGridProps) {
  const [participants, setParticipants] = useState(initialParticipants);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedTeamStatus, setSelectedTeamStatus] = useState("all");

  const SHUFFLE_INTERVAL = 40000;
  const TICK_RATE = 100;

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedRole !== "all") count++;
    if (selectedTeamStatus !== "all") count++;
    return count;
  }, [selectedRole, selectedTeamStatus]);

  const shuffleArray = useCallback((array: Participant[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const displayedParticipants = useMemo(() => {
    return participants.filter((participant) => {
      const roleMatch =
        selectedRole === "all" ||
        participant.profile.toLowerCase().includes(selectedRole);

      const teamMatch =
        selectedTeamStatus === "all" ||
        (selectedTeamStatus === "yes" && participant.hasTeam) ||
        (selectedTeamStatus === "no" && !participant.hasTeam);

      return roleMatch && teamMatch;
    });
  }, [participants, selectedRole, selectedTeamStatus]);

  const handleManualShuffle = useCallback(() => {
    setParticipants((current) => shuffleArray(current));
    setProgress(100);
  }, [shuffleArray]);

  const handleClearFilters = useCallback(() => {
    setSelectedRole("all");
    setSelectedTeamStatus("all");
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setProgress((prev) => {
          const decrement = (100 / SHUFFLE_INTERVAL) * TICK_RATE;
          const newProgress = Math.max(0, prev - decrement);

          if (newProgress === 0 && prev > 0) {
            setTimeout(() => {
              setParticipants((current) => shuffleArray(current));
            }, 300);

            return 100;
          }

          return newProgress;
        });
      }
    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [shuffleArray, isPaused]);

  return (
    <>
      <ParticipantFilters
        selectedRole={selectedRole}
        selectedTeamStatus={selectedTeamStatus}
        onRoleChange={setSelectedRole}
        onTeamStatusChange={setSelectedTeamStatus}
        onClearFilters={handleClearFilters}
        activeFilterCount={activeFilterCount}
      />

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        layout
      >
        <AnimatePresence mode="popLayout">
          {displayedParticipants.map((participant) => (
            <motion.div
              key={participant.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 25,
              }}
            >
              <ParticipantCard participant={participant} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <ShuffleProgressBar 
        progress={progress} 
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onShuffle={handleManualShuffle}
      />
    </>
  );
}
