import { useEffect, useRef } from "react";
import {
  lightningChart,
  ChartXY,
  SolidLine,
  ColorRGBA,
  SolidFill,
} from "@arction/lcjs";
import { Subject } from "rxjs";
import { Box, Checkbox, FormControlLabel } from "@mui/material";

const dataA = Array.from({ length: 300 }, (_, x) => ({
  x,
  y: Math.sin(x / 7) + Math.cos(x / 3),
}));
const dataB = Array.from({ length: 300 }, (_, x) => ({
  x,
  y: Math.cos(x / 5) - Math.sin(x / 5),
}));
const dataC = Array.from({ length: 300 }, (_, x) => ({
  x,
  y: Math.sin(x / 3) + Math.cos(x / 7),
}));

const ChartWithRx: React.FC = () => {
  const chartRef = useRef<ChartXY | null>(null);
  const seriesRef = useRef<import("@arction/lcjs").LineSeries[]>([]);

  const showA$ = useRef(new Subject<boolean>()).current;
  const showB$ = useRef(new Subject<boolean>()).current;
  const showC$ = useRef(new Subject<boolean>()).current;

  useEffect(() => {
    const lc = lightningChart({
      license:
        "0002-n0i9AP8MN/ezP+gV3RZRzNiQvQvBKwBJvTnrFTHppybuCwWuickxBJV+q3qyoeEBGSE4hS0aeo3pySDywrb/iIsl-MEUCIAiJOU3BrUq71LqSlRAIFAI0dKK05qBRIJYHFmBoOoIHAiEA4Y55O1QpeuEkiuVktPGLauOHc1TzxNu85/vz/eNscz8=",
      licenseInformation: {
        appTitle: "LightningChart JS Trial",
        company: "LightningChart Ltd.",
      },
    });

    const chart = lc
      .ChartXY({ container: "chart-container" })
      .setTitle("Chart & RXjs");

    chartRef.current = chart;

    const seriesA = chart
      .addLineSeries()
      .setName("Line A")
      .setStrokeStyle(
        new SolidLine({
          thickness: 2.5,
          fillStyle: new SolidFill({ color: ColorRGBA(255, 0, 0) }),
        })
      );
    const seriesB = chart
      .addLineSeries()
      .setName("Line B")
      .setStrokeStyle(
        new SolidLine({
          thickness: 2.5,
          fillStyle: new SolidFill({ color: ColorRGBA(0, 0, 255) }),
        })
      );
    const seriesC = chart
      .addLineSeries()
      .setName("Line C")
      .setStrokeStyle(
        new SolidLine({
          thickness: 2.5,
          fillStyle: new SolidFill({ color: ColorRGBA(0, 128, 0) }),
        })
      );

    seriesA.add(dataA);
    seriesB.add(dataB);
    seriesC.add(dataC);

    seriesRef.current = [seriesA, seriesB, seriesC];

    const subA = showA$.subscribe((visible) => seriesA.setVisible(visible));
    const subB = showB$.subscribe((visible) => seriesB.setVisible(visible));
    const subC = showC$.subscribe((visible) => seriesC.setVisible(visible));

    showA$.next(true);
    showB$.next(true);
    showC$.next(true);

    return () => {
      chart.dispose();
      subA.unsubscribe();
      subB.unsubscribe();
      subC.unsubscribe();
    };
  }, []);

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              onChange={(e) => showA$.next(e.target.checked)}
            />
          }
          label="Show A"
        />
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              onChange={(e) => showB$.next(e.target.checked)}
            />
          }
          label="Show B"
        />
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              onChange={(e) => showC$.next(e.target.checked)}
            />
          }
          label="Show C"
        />
      </Box>

      <Box
        id="chart-container"
        sx={{
          width: "100%",
          height: "600px",
          border: "1px solid #ccc",
          borderRadius: 2,
        }}
      />
    </Box>
  );
};

export default ChartWithRx;