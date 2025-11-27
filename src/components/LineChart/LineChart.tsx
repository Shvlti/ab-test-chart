import React, { forwardRef, useState } from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  Brush,
} from "recharts";
import { ProcessedDataPoint, LineType, Theme } from "@/types/chart";
import styles from "./LineChart.module.scss";

interface LineChartProps {
  data: ProcessedDataPoint[];
  selectedVariations: string[];
  onVariationToggle: (variation: string) => void;
  lineType?: LineType;
  theme?: Theme;
}

const COLORS = ["#3877EE", "#EF5DA8", "#5DBE7E", "#FF7C43"];

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
    const [brushIndex, setBrushIndex] = useState({
      startIndex: 0,
      endIndex: data.length - 1,
    });

    const renderChartContent = () => {
      const commonProps = {
        data: data.slice(brushIndex.startIndex, brushIndex.endIndex + 1),
        ref,
        margin: { top: 5, right: 30, left: 20, bottom: 5 },
      };

      const chartContent =
        lineType === "area" ? (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className={styles.grid} />
            <XAxis dataKey="date" className={styles.axis} />
            <YAxis
              className={styles.axis}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              formatter={(value: number) => [
                `${value.toFixed(2)}%`,
                "Conversion Rate",
              ]}
            />
            <Legend onClick={(e) => onVariationToggle(e.dataKey as string)} />
            {selectedVariations.map((variation, index) => (
              <Area
                key={variation}
                type="monotone"
                dataKey={variation}
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        ) : (
          <RechartsLineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className={styles.grid} />
            <XAxis dataKey="date" className={styles.axis} />
            <YAxis
              className={styles.axis}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              formatter={(value: number) => [
                `${value.toFixed(2)}%`,
                "Conversion Rate",
              ]}
            />
            <Legend onClick={(e) => onVariationToggle(e.dataKey as string)} />
            {selectedVariations.map((variation, index) => (
              <Line
                key={variation}
                type={lineType === "smooth" ? "monotone" : "linear"}
                dataKey={variation}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </RechartsLineChart>
        );

      return (
        <>
          {chartContent}
          <Brush
            dataKey="date"
            height={30}
            stroke="#3877EE"
            fill="#f0f0f0"
            startIndex={brushIndex.startIndex}
            endIndex={brushIndex.endIndex}
            onChange={(e) => {
              if (e.startIndex !== undefined && e.endIndex !== undefined) {
                setBrushIndex({
                  startIndex: e.startIndex,
                  endIndex: e.endIndex,
                });
              }
            }}
          />
        </>
      );
    };

    return (
      <div className={`${styles.chartContainer} ${styles[theme]}`}>
        <div className={styles.chartHeader}>
          <button
            className={styles.resetZoom}
            onClick={() =>
              setBrushIndex({ startIndex: 0, endIndex: data.length - 1 })
            }
            disabled={
              brushIndex.startIndex === 0 &&
              brushIndex.endIndex === data.length - 1
            }
          >
            Reset Zoom
          </button>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          {renderChartContent()}
        </ResponsiveContainer>
      </div>
    );
  }
);

LineChart.displayName = "LineChart";
