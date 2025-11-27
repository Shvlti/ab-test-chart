import { useState, useEffect, useRef } from "react";
import { LineChart } from "./components/LineChart/LineChart";
import {
  ChartData,
  ProcessedDataPoint,
  TimeRange,
  LineType,
  Theme,
} from "./types/chart";
import { processChartData, aggregateDataByWeek } from "./utils/calculations";
import "./App.css";
import html2canvas from "html2canvas";

function App() {
  const [chartData, setChartData] = useState<ChartData>({
    variations: [],
    data: [],
  });
  const [selectedVariations, setSelectedVariations] = useState<string[]>([
    "Original",
  ]);
  const [processedData, setProcessedData] = useState<ProcessedDataPoint[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("day");
  const [lineType, setLineType] = useState<LineType>("linear");
  const [theme, setTheme] = useState<Theme>("light");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}/data.json`);
        const data = await response.json();
        setChartData(data);

        if (data.variations?.[0]) {
          setSelectedVariations([data.variations[0].name]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
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
      setProcessedData(
        processChartData(processedChartData, selectedVariations)
      );
    }
  }, [chartData, selectedVariations, timeRange]);

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleVariationToggle = (variation: string) => {
    setSelectedVariations((prev) => {
      if (prev.includes(variation)) {
        // Не позволяем убрать последнюю вариацию
        return prev.length > 1 ? prev.filter((v) => v !== variation) : prev;
      } else {
        return [...prev, variation];
      }
    });
  };

  const handleExportPNG = async () => {
    const chartElement = document.querySelector(
      ".recharts-wrapper"
    ) as HTMLElement;

    if (chartElement) {
      try {
        const canvas = await html2canvas(chartElement, {
          backgroundColor: theme === "dark" ? "#2d2d2d" : "#ffffff",
          scale: 2,
          useCORS: true,
        });

        const link = document.createElement("a");
        link.download = `ab-test-chart-${
          new Date().toISOString().split("T")[0]
        }.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (error) {
        console.error("Error exporting chart:", error);
        alert("Error exporting chart. Please try again.");
      }
    }
  };

  const allVariationNames = chartData.variations.map((v) => v.name);

  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <h1>A/B Test Conversion Rates</h1>
        <div className="controls">
          {/* Селектор вариантов с множественным выбором */}
          <div className="control-group" ref={dropdownRef}>
            <label className="control-label">
              <h3>Select Variations:</h3>
            </label>
            <div className="custom-dropdown">
              <button
                className="dropdown-toggle"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedVariations.length === allVariationNames.length
                  ? "All Variations"
                  : `${selectedVariations.length} selected`}{" "}
                ▼
              </button>

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  {allVariationNames.map((variation) => (
                    <label key={variation} className="dropdown-option">
                      <input
                        type="checkbox"
                        checked={selectedVariations.includes(variation)}
                        onChange={() => handleVariationToggle(variation)}
                        disabled={
                          selectedVariations.length === 1 &&
                          selectedVariations.includes(variation)
                        }
                      />
                      <span>{variation}</span>
                    </label>
                  ))}
                  <div className="dropdown-actions">
                    <button
                      className="dropdown-action-btn"
                      onClick={() => {
                        if (
                          selectedVariations.length < allVariationNames.length
                        ) {
                          setSelectedVariations(allVariationNames);
                        }
                      }}
                    >
                      Select All
                    </button>
                    <button
                      className="dropdown-action-btn"
                      onClick={() => {
                        if (selectedVariations.length > 1) {
                          setSelectedVariations([allVariationNames[0]]);
                        }
                      }}
                    >
                      Select One
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Выбор дня/недели */}
          <div className="control-group">
            <label className="control-label">
              <h3>Time Range:</h3>
            </label>
            <div className="button-group">
              <button
                className={`time-btn ${timeRange === "day" ? "active" : ""}`}
                onClick={() => setTimeRange("day")}
              >
                Day
              </button>
              <button
                className={`time-btn ${timeRange === "week" ? "active" : ""}`}
                onClick={() => setTimeRange("week")}
              >
                Week
              </button>
            </div>
          </div>

          {/* Стиль линии */}
          <div className="control-group">
            <label className="control-label">
              <h3>Line Style:</h3>
            </label>
            <select
              value={lineType}
              onChange={(e) => setLineType(e.target.value as LineType)}
              className="control-select"
            >
              <option value="linear">Linear</option>
              <option value="smooth">Smooth</option>
              <option value="area">Area</option>
            </select>
          </div>

          {/* Переключение темы */}
          <div className="control-group">
            <label className="control-label">
              <h3>Theme:</h3>
            </label>
            <button
              className="theme-toggle"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? "Dark" : "Light"}
            </button>
          </div>

          {/* Экспорт */}
          <div className="control-group">
            <label className="control-label">
              <h3>Export:</h3>
            </label>
            <button className="export-btn" onClick={handleExportPNG}>
              Export PNG
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {processedData.length > 0 ? (
          <LineChart
            ref={chartRef}
            data={processedData}
            selectedVariations={selectedVariations}
            onVariationToggle={handleVariationToggle}
            lineType={lineType}
            theme={theme}
          />
        ) : (
          <div className="loading">Loading chart data...</div>
        )}
      </main>
    </div>
  );
}

export default App;
