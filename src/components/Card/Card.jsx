import React, { useMemo, useState } from "react";
import "./Card.css";
import "react-circular-progressbar/dist/styles.css";
import { motion, AnimateSharedLayout } from "framer-motion";
import { UilTimes } from "@iconscout/react-unicons";
import Chart from "react-apexcharts";

const Card = (props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <AnimateSharedLayout>
      <CompactCard param={props} setExpanded={() => setExpanded(true)} />
      {expanded && <ExpandedCard param={props} setExpanded={() => setExpanded(false)} />}
    </AnimateSharedLayout>
  );
};

function CompactCard({ param, setExpanded }) {
  const Png = param.png;
  const accent = param.color?.accent || param.color?.backGround || "var(--color-primary)";
  const value = param.value ?? "--";

  return (
    <motion.button
      type="button"
      className="CompactCard"
      style={{ "--metric-accent": accent }}
      layoutId={`expandable-card-${param.title}`}
      onClick={setExpanded}
      aria-label={`Buka grafik ${param.title}`}
    >
      <div className="metric-icon" aria-hidden="true">
        {Png ? <Png /> : null}
      </div>
      <div className="radialBar">
        <span>{param.title}</span>
        <strong>{value}{param.satuan}</strong>
      </div>
      <span className="metric-period">Last 1 hour</span>
    </motion.button>
  );
}

function ExpandedCard({ param, setExpanded }) {
  const chartTitleId = `chart-title-${String(param.title || "metric").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const chartData = useMemo(() => {
    const xaxis = Array.isArray(param.xaxis) ? param.xaxis : [];
    const series = Array.isArray(param.series?.[0]?.data) ? param.series[0].data : [];

    return xaxis
      .map((time, index) => ({
        x: new Date(time).getTime(),
        y: series[index],
      }))
      .filter((point) => Number.isFinite(point.x) && point.y !== undefined)
      .sort((a, b) => a.x - b.x);
  }, [param.series, param.xaxis]);

  const data = {
    options: {
      chart: {
        type: "area",
        height: "auto",
        zoom: { enabled: false },
        toolbar: { show: false },
        foreColor: "#60736a",
      },
      fill: {
        colors: ["#167a3f"],
        opacity: 0.18,
        type: "gradient",
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: "smooth",
        colors: ["#167a3f"],
        width: 3,
      },
      tooltip: {
        x: { format: "dd/MM/yy HH:mm" },
      },
      grid: {
        borderColor: "#dce8dc",
        strokeDashArray: 4,
      },
      xaxis: {
        type: "datetime",
        labels: { datetimeUTC: false },
      },
    },
    series: [
      {
        name: param.series?.[0]?.name || param.title,
        data: chartData,
      },
    ],
  };

  return (
    <div className="ExpandedCardOverlay" role="presentation" onClick={setExpanded}>
      <motion.div
        className="ExpandedCard"
        layoutId={`expandable-card-${param.title}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={chartTitleId}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="close-chart-button" type="button" onClick={setExpanded} aria-label="Tutup grafik">
          <UilTimes />
        </button>
        <div className="expanded-card-header">
          <p className="eyebrow">Telemetry chart</p>
          <h2 id={chartTitleId}>{param.title}</h2>
          <span>Last 24 hours</span>
        </div>
        <div className="chartContainer">
          {chartData.length > 0 ? (
            <Chart options={data.options} series={data.series} type="area" height={340} width="100%" />
          ) : (
            <p className="empty-state">Data grafik belum tersedia.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Card;
