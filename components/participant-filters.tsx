"use client";

import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ParticipantFiltersProps {
  selectedRole: string;
  selectedTeamStatus: string;
  onRoleChange: (role: string) => void;
  onTeamStatusChange: (status: string) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

const ROLES = [
  { value: "all", label: "All Roles" },
  { value: "engineer", label: "Engineer" },
  { value: "design", label: "Designer" },
  { value: "product", label: "Product" },
  { value: "growth", label: "Growth" },
  { value: "other", label: "Other" },
];

const TEAM_STATUS = [
  { value: "all", label: "All" },
  { value: "yes", label: "Has Team" },
  { value: "no", label: "No Team" },
];

export function ParticipantFilters({
  selectedRole,
  selectedTeamStatus,
  onRoleChange,
  onTeamStatusChange,
  onClearFilters,
  activeFilterCount,
}: ParticipantFiltersProps) {
  return (
    <div className="mb-8 p-4 border-2 border-foreground rounded-sm bg-card">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-5 h-5" />
        <h2 className="text-sm font-bold uppercase tracking-wide">Filters</h2>
        {activeFilterCount > 0 && (
          <Badge
            variant="secondary"
            className="rounded-sm border-2 border-foreground text-xs"
          >
            {activeFilterCount} Active
          </Badge>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-xs uppercase font-medium mb-2 text-muted-foreground">
            Role
          </label>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((role) => (
              <Button
                key={role.value}
                onClick={() => onRoleChange(role.value)}
                variant={selectedRole === role.value ? "default" : "outline"}
                size="sm"
                className="rounded-sm border-2 text-xs uppercase font-medium"
              >
                {role.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-xs uppercase font-medium mb-2 text-muted-foreground">
            Team Status
          </label>
          <div className="flex flex-wrap gap-2">
            {TEAM_STATUS.map((status) => (
              <Button
                key={status.value}
                onClick={() => onTeamStatusChange(status.value)}
                variant={
                  selectedTeamStatus === status.value ? "default" : "outline"
                }
                size="sm"
                className="rounded-sm border-2 text-xs uppercase font-medium"
              >
                {status.label}
              </Button>
            ))}
          </div>
        </div>

        {activeFilterCount > 0 && (
          <div className="flex items-end">
            <Button
              onClick={onClearFilters}
              variant="outline"
              size="sm"
              className="rounded-sm border-2 text-xs uppercase font-medium"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
