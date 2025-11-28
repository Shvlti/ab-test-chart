import { useState } from "react";

export const useVariations = (initialVariations: string[] = ["Original"]) => {
  const [selectedVariations, setSelectedVariations] = useState<string[]>(initialVariations);

  const handleVariationToggle = (variation: string, allVariations: string[]) => {
    setSelectedVariations((prev) => {
      if (prev.includes(variation)) {
        return prev.length > 1 ? prev.filter((v) => v !== variation) : prev;
      } else {
        return [...prev, variation];
      }
    });
  };

  const selectAllVariations = (allVariations: string[]) => {
    setSelectedVariations(allVariations);
  };

  const selectOneVariation = (firstVariation: string) => {
    setSelectedVariations([firstVariation]);
  };

  return {
    selectedVariations,
    setSelectedVariations,
    handleVariationToggle,
    selectAllVariations,
    selectOneVariation,
  };
};