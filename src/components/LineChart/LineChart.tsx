import React, { forwardRef } from "react";
import {
  LineChart as RechartsLineChart,
  AreaChart,
  ResponsiveContainer,
} from "recharts";
import { ProcessedDataPoint, LineType, Theme } from "@/types/chart";
import { CHART_MARGIN } from "../../constants/chart";
import { ChartElements } from "./ChartElement";
import { LineComponents, AreaComponents } from "./LineElement";
import "./LineChart.module.scss"; // ← ОБЫЧНЫЙ импорт без styles

interface LineChartProps {
  data: ProcessedDataPoint[];
  selectedVariations: string[];
  onVariationToggle: (variation: string) => void;
  lineType?: LineType;
  theme?: Theme;
}

export const LineChart = forwardRef<any, LineChartProps>(
  (
    {
      data,
      selectedVariations,
      onVariationToggle,
      lineType = "linear",
      theme = "light",
    },
    ref
  ) => {
    const renderChart = () => {
      const commonProps = {
        data: data,
        ref,
        margin: CHART_MARGIN,
      };

      const ChartWrapper = lineType === "area" ? AreaChart : RechartsLineChart;

      return (
        <ChartWrapper {...commonProps}>
          <ChartElements onVariationToggle={onVariationToggle} theme={theme} />
          {lineType === "area" ? (
            <AreaComponents selectedVariations={selectedVariations} />
          ) : (
            <LineComponents
              selectedVariations={selectedVariations}
              lineType={lineType}
            />
          )}
        </ChartWrapper>
      );
    };

    return (
      // ↓ ИСПОЛЬЗУЙ ОБЫЧНЫЕ КЛАССЫ без styles
      <div className={`chartContainer ${theme}`}>
        <ResponsiveContainer width="100%" height={400}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    );
  }
);

LineChart.displayName = "LineChart";
