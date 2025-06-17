import { useEffect, useRef } from "react";
import {
  lightningChart,
  ChartXY,
  SolidLine,
  ColorRGBA,
  SolidFill
} from "@arction/lcjs";
import { Subject, combineLatest } from "rxjs";
import { Box, FormControlLabel, Checkbox } from "@mui/material";

const dataA = Array.from({ length: 100 }, (_, x) => ({ x, y: Math.sin(x / 7) + Math.cos(x / 3) }));
const dataB = Array.from({ length: 100 }, (_, x) => ({ x, y: Math.cos(x / 5) - Math.sin(x / 5)}));
const dataC = Array.from({ length: 100 }, (_, x) => ({ x, y: Math.sin(x / 3) + Math.cos(x / 7) }));

const ChartWithRx: React.FC = () => {
  const chartRef = useRef<ChartXY | null>(null);
  const seriesRef = useRef<import("@arction/lcjs").LineSeries[]>([]);

  const showA$ = useRef(new Subject<boolean>()).current;
  const showB$ = useRef(new Subject<boolean>()).current;
  const showC$ = useRef(new Subject<boolean>()).current;

  useEffect(() => {
    const lc = lightningChart({
      license:
        '0002-n0i9AP8MN/ezP+gV3RZRzNiQvQvBKwBJvTnrFTHppybuCwWuickxBJV+q3qyoeEBGSE4hS0aeo3pySDywrb/iIsl-MEUCIAiJOU3BrUq71LqSlRAIFAI0dKK05qBRIJYHFmBoOoIHAiEA4Y55O1QpeuEkiuVktPGLauOHc1TzxNu85/vz/eNscz8=',
      licenseInformation: {
        appTitle: 'LightningChart JS Trial',
        company: 'LightningChart Ltd.',
      },
    });

    const chart = lc.ChartXY({ container: "chart-container" })
      .setTitle("Chart & RXjs");

    chartRef.current = chart;

    const sA = chart.addLineSeries().setName("Line A").setStrokeStyle(
      new SolidLine({
        thickness: 2,
        fillStyle: new SolidFill({ color: ColorRGBA(255, 0, 0) })
      })
    );
    const sB = chart.addLineSeries().setName("Line B").setStrokeStyle(
      new SolidLine({
        thickness: 2,
        fillStyle: new SolidFill({ color: ColorRGBA(0, 0, 255) })
      })
    );
    const sC = chart.addLineSeries().setName("Line C").setStrokeStyle(
      new SolidLine({
        thickness: 2,
        fillStyle: new SolidFill({ color: ColorRGBA(0, 128, 0) })
      })
    );

    sA.add(dataA);
    sB.add(dataB);
    sC.add(dataC);

    seriesRef.current = [sA, sB, sC];

    const sub = combineLatest([showA$, showB$, showC$]).subscribe(
      ([a, b, c]) => {
        sA.setVisible(a);
        sB.setVisible(b);
        sC.setVisible(c);
      }
    );

    showA$.next(true);
    showB$.next(true);
    showC$.next(true);

    return () => {
      chart.dispose();
      sub.unsubscribe();
    };
  }, []);

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControlLabel
          control={<Checkbox defaultChecked onChange={(e) => showA$.next(e.target.checked)} />}
          label="Show A"
        />
        <FormControlLabel
          control={<Checkbox defaultChecked onChange={(e) => showB$.next(e.target.checked)} />}
          label="Show B"
        />
        <FormControlLabel
          control={<Checkbox defaultChecked onChange={(e) => showC$.next(e.target.checked)} />}
          label="Show C"
        />
      </Box>

      {/* Chart container */}
      <Box
        id="chart-container"
        sx={{
          width: "100%",
          height: "600px",
          border: "1px solid #ccc",
          borderRadius: 2
        }}
      />
    </Box>
  );
};

export default ChartWithRx;
