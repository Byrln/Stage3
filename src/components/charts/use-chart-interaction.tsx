"use client";

import { localPoint } from "@visx/event";
import type { ScaleLinear, ScaleTime } from "@visx/scale";
import { useCallback, useState } from "react";
import type { LineConfig, Margin, TooltipData } from "./chart-context";

export interface ChartSelection {
  x: number;
  y: number;
  width: number;
  height: number;
  data: Record<string, unknown>[];
}

interface UseChartInteractionProps {
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  data: Record<string, unknown>[];
  lines: LineConfig[];
  margin: Margin;
  xAccessor: (d: Record<string, unknown>) => Date;
  bisectDate: (
    data: Record<string, unknown>[],
    x: Date,
    lo?: number,
    hi?: number
  ) => number;
  canInteract: boolean;
}

export function useChartInteraction({
  xScale,
  yScale,
  data,
  lines,
  margin,
  xAccessor,
  bisectDate,
  canInteract,
}: UseChartInteractionProps) {
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const [selection, setSelection] = useState<ChartSelection | null>(null);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<SVGGElement> | React.TouchEvent<SVGGElement>) => {
      if (!canInteract) return;

      const { x } = localPoint(event) || { x: 0 };
      const x0 = xScale.invert(x - margin.left);
      const index = bisectDate(data, x0, 1);
      const d0 = data[index - 1];
      const d1 = data[index];
      let d = d0;
      
      if (d1 && xAccessor(d1)) {
        d =
          x0.valueOf() - xAccessor(d0).valueOf() >
          xAccessor(d1).valueOf() - x0.valueOf()
            ? d1
            : d0;
      }

      if (!d) return;

      const xPos = xScale(xAccessor(d));
      const yPositions: Record<string, number> = {};

      lines.forEach((line) => {
        const value = d[line.dataKey];
        if (typeof value === "number") {
          yPositions[line.dataKey] = yScale(value);
        }
      });

      setTooltipData({
        point: d,
        index: data.indexOf(d),
        x: xPos + margin.left,
        yPositions,
      });
    },
    [canInteract, xScale, margin.left, bisectDate, data, xAccessor, lines, yScale]
  );

  const handlePointerLeave = useCallback(() => {
    setTooltipData(null);
    setSelection(null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelection(null);
  }, []);

  return {
    tooltipData,
    setTooltipData,
    selection,
    clearSelection,
    interactionHandlers: {
      onPointerMove: handlePointerMove,
      onPointerLeave: handlePointerLeave,
      onTouchMove: handlePointerMove,
      onTouchEnd: handlePointerLeave,
    },
    interactionStyle: {
      touchAction: "none" as const,
      cursor: "crosshair",
    },
  };
}
