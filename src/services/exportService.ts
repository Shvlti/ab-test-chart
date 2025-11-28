import html2canvas from "html2canvas";

export const exportChartAsPNG = async (theme: string) => {
  const chartElement = document.querySelector(".recharts-wrapper") as HTMLElement;

  if (!chartElement) {
    throw new Error("Chart element not found");
  }

  const canvas = await html2canvas(chartElement, {
    backgroundColor: theme === "dark" ? "#2d2d2d" : "#ffffff",
    scale: 2,
    useCORS: true,
  });

  const link = document.createElement("a");
  link.download = `ab-test-chart-${new Date().toISOString().split("T")[0]}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
};