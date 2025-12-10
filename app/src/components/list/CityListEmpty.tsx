import React from "react";
import { EmptyState } from "@/src/components/ui/EmptyState";

export const CityListEmpty: React.FC = () => {
  return (
    <EmptyState
      icon="location-off"
      message="Нет сохраненных городов"
    />
  );
};
