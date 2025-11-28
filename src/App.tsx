import { useRef, useState } from "react";
import { LineChart } from "./components/LineChart/LineChart";

import { VariationDropdown } from "./components/controls/VariationDropdown";
import { TimeRange, LineType, Theme } from "./types/chart";
import { useChartData } from "./hooks/useChartData";
import { useDropdown } from "./hooks/useDropdown";
import { useVariations } from "./hooks/useVariations";
import { exportChartAsPNG } from "./services/exportService";
import "./App.css";

function App() {
  // Сначала инициализируем все состояния
  const [timeRange, setTimeRange] = useState<TimeRange>("day");
  const [lineType, setLineType] = useState<LineType>("linear");
  const [theme, setTheme] = useState<Theme>("light");

  // Затем инициализируем кастомные хуки
  const {
    selectedVariations,
    handleVariationToggle,
    selectAllVariations,
    selectOneVariation,
  } = useVariations(["Original"]);

  // Теперь используем selectedVariations в useChartData
  const { chartData, processedData } = useChartData(
    timeRange,
    selectedVariations
  );
  const { isOpen, setIsOpen, dropdownRef } = useDropdown();

  const chartRef = useRef<HTMLDivElement>(null);
  const allVariationNames = chartData.variations.map((v) => v.name);

  const handleExportPNG = async () => {
    try {
      await exportChartAsPNG(theme);
    } catch (error) {
      console.error("Error exporting chart:", error);
      alert("Error exporting chart. Please try again.");
    }
  };

  const handleTimeRangeChange = (range: TimeRange) => setTimeRange(range);
  const handleLineTypeChange = (type: LineType) => setLineType(type);
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <h1>A/B Test Conversion Rates</h1>
        <div className="controls">
          {/* Variation Dropdown */}
          <div ref={dropdownRef}>
            <VariationDropdown
              allVariations={allVariationNames}
              selectedVariations={selectedVariations}
              onVariationToggle={(variation) =>
                handleVariationToggle(variation, allVariationNames)
              }
              onSelectAll={() => selectAllVariations(allVariationNames)}
              onSelectOne={() => selectOneVariation(allVariationNames[0])}
              isOpen={isOpen}
              onToggle={() => setIsOpen(!isOpen)}
            />
          </div>

          {/* Time Range */}
          <div className="control-group">
            <label className="control-label">
              <h3>Time Range:</h3>
            </label>
            <div className="button-group">
              <button
                className={`time-btn ${timeRange === "day" ? "active" : ""}`}
                onClick={() => handleTimeRangeChange("day")}
              >
                Day
              </button>
              <button
                className={`time-btn ${timeRange === "week" ? "active" : ""}`}
                onClick={() => handleTimeRangeChange("week")}
              >
                Week
              </button>
            </div>
          </div>

          {/* Line Style */}
          <div className="control-group">
            <label className="control-label">
              <h3>Line Style:</h3>
            </label>
            <select
              value={lineType}
              onChange={(e) => handleLineTypeChange(e.target.value as LineType)}
              className="control-select"
            >
              <option value="linear">Linear</option>
              <option value="smooth">Smooth</option>
              <option value="area">Area</option>
            </select>
          </div>

          {/* Theme */}
          <div className="control-group">
            <label className="control-label">
              <h3>Theme:</h3>
            </label>
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? "Dark" : "Light"}
            </button>
          </div>

          {/* Export */}
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
            onVariationToggle={(variation) =>
              handleVariationToggle(variation, allVariationNames)
            }
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
