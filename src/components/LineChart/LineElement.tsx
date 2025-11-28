// components/chart/LineComponents.tsx
import { Line, Area } from "recharts";
const COLORS = ["#3877EE", "#EF5DA8", "#5DBE7E", "#FF7C43"];
interface LineComponentsProps {
  selectedVariations: string[];
  lineType: "linear" | "smooth";
}

export const LineComponents = ({
  selectedVariations,
  lineType,
}: LineComponentsProps) => (
  <>
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
  </>
);

interface AreaComponentsProps {
  selectedVariations: string[];
}

export const AreaComponents = ({ selectedVariations }: AreaComponentsProps) => (
  <>
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
  </>
);
