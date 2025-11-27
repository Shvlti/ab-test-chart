export interface DataPoint {
  date: string;
  visits: { [variationId: string]: number };
  conversions: { [variationId: string]: number };
}

export interface Variation {
  id?: string | number;
  name: string;
}

export interface VariationData {
  variation: string;
  data: DataPoint[];
}

export interface ProcessedDataPoint {
  date: string;
  [variationName: string]: number | string;
}

export interface ChartData {
  variations: Variation[];
  data: DataPoint[];
}

export type TimeRange = 'day' | 'week';
export type LineType = 'linear' | 'smooth' | 'area';
export type Theme = 'light' | 'dark';