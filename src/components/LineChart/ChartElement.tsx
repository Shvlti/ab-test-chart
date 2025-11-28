import { CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import styles from "./LineChart.module.scss";

interface ChartElementsProps {
  onVariationToggle: (variation: string) => void;
}

export const ChartElements = ({ onVariationToggle }: ChartElementsProps) => (
  <>
    <CartesianGrid strokeDasharray="3 3" className={styles.grid} />
    <XAxis dataKey="date" className={styles.axis} />
    <YAxis className={styles.axis} tickFormatter={(value) => `${value}%`} />
    <Tooltip
      formatter={(value: number) => [`${value.toFixed(2)}%`, "Conversion Rate"]}
    />
    <Legend onClick={(e) => onVariationToggle(e.dataKey as string)} />
  </>
);
