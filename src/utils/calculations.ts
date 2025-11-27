import { ProcessedDataPoint, ChartData, DataPoint } from '@/types/chart';

export const calculateConversionRate = (visits: number, conversions: number): number => {
  return visits > 0 ? (conversions / visits) * 100 : 0;
};

export const processChartData = (chartData: ChartData, selectedVariations: string[]): ProcessedDataPoint[] => {
  if (!chartData.variations.length || !chartData.data.length) return [];

  const nameToIdMap: { [key: string]: string } = {};
  chartData.variations.forEach(variation => {
    const id = variation.id?.toString() || '0';
    nameToIdMap[variation.name] = id;
  });

  return chartData.data.map(dataPoint => {
    const processedPoint: ProcessedDataPoint = { date: dataPoint.date };
    
    selectedVariations.forEach(variationName => {
      const variationId = nameToIdMap[variationName];
      
      if (variationId && dataPoint.visits && dataPoint.conversions) {
        const visits = dataPoint.visits[variationId] || 0;
        const conversions = dataPoint.conversions[variationId] || 0;
        
        processedPoint[variationName] = calculateConversionRate(visits, conversions);
      } else {
        processedPoint[variationName] = 0;
      }
    });

    return processedPoint;
  });
};

export const aggregateDataByWeek = (data: DataPoint[]): DataPoint[] => {
  const weeklyData: { [weekKey: string]: DataPoint } = {};
  
  data.forEach(dayData => {
    const date = new Date(dayData.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Начало недели (воскресенье)
    
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = {
        date: weekKey,
        visits: {},
        conversions: {}
      };
    }
    
    // Суммируем данные по всем вариациям за неделю
    Object.keys(dayData.visits).forEach(variationId => {
      weeklyData[weekKey].visits[variationId] = 
        (weeklyData[weekKey].visits[variationId] || 0) + dayData.visits[variationId];
      
      weeklyData[weekKey].conversions[variationId] = 
        (weeklyData[weekKey].conversions[variationId] || 0) + dayData.conversions[variationId];
    });
  });
  
  return Object.values(weeklyData).sort((a, b) => a.date.localeCompare(b.date));
};