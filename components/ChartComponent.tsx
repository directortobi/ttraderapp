import React, { useRef, useEffect } from 'react';
import type { Candle, PriceLine } from '../types';

declare const LightweightCharts: any;

interface ChartComponentProps {
  candles: Candle[];
  barrierLines?: PriceLine[];
}

const ChartComponent: React.FC<ChartComponentProps> = ({ candles, barrierLines }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const priceLinesRef = useRef<any[]>([]);
  
  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = LightweightCharts.createChart(chartContainerRef.current, {
        layout: {
            background: { color: '#151A26' },
            textColor: '#D1D5DB',
        },
        grid: {
            vertLines: { color: '#2A303C' },
            horzLines: { color: '#2A303C' },
        },
        timeScale: {
            timeVisible: true,
            secondsVisible: false,
        },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal,
        },
    });

    seriesRef.current = chartRef.current.addCandlestickSeries({
        upColor: '#00A79E',
        downColor: '#EF5350',
        borderDownColor: '#EF5350',
        borderUpColor: '#00A79E',
        wickDownColor: '#EF5350',
        wickUpColor: '#00A79E',
    });

    const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
            chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
    };

    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
            chartRef.current.remove();
        }
    };
  }, []);

  useEffect(() => {
    if (seriesRef.current && candles.length > 0) {
      seriesRef.current.setData(candles);
    }
  }, [candles]);

  useEffect(() => {
    if (!seriesRef.current) return;

    // Clear existing lines
    priceLinesRef.current.forEach(line => seriesRef.current.removePriceLine(line));
    priceLinesRef.current = [];

    // Add new lines
    if (barrierLines) {
      barrierLines.forEach(b => {
        const priceLine = seriesRef.current.createPriceLine({
          price: b.price,
          color: b.color,
          lineWidth: 2,
          lineStyle: LightweightCharts.LineStyle.Dashed,
          axisLabelVisible: true,
          title: b.title,
        });
        priceLinesRef.current.push(priceLine);
      });
    }

  }, [barrierLines]);

  return <div ref={chartContainerRef} className="w-full h-full" />;
};

export default ChartComponent;
