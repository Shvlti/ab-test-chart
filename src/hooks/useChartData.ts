import { useState, useEffect } from "react";
import { ChartData, ProcessedDataPoint } from "../types/chart";
import { processChartData, aggregateDataByWeek } from "../utils/calculations";

export const useChartData = (timeRange: string, selectedVariations: string[]) => {
  const [chartData, setChartData] = useState<ChartData>({
    variations: [],
    data: [],
  });
  const [processedData, setProcessedData] = useState<ProcessedDataPoint[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}/data.json`);
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error("Error loading chart data:", error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (chartData.variations.length > 0 && chartData.data.length > 0) {
      let dataToProcess = chartData.data;
      if (timeRange === "week") {
        dataToProcess = aggregateDataByWeek(chartData.data);
      }
      const processedChartData = { ...chartData, data: dataToProcess };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProcessedData(processChartData(processedChartData, selectedVariations));
    }
  }, [chartData, selectedVariations, timeRange]);

  return { chartData, processedData };
};