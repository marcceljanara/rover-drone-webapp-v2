import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UilSun, UilTemperature, UilTear } from "@iconscout/react-unicons";
import Card from "../Card/Card";
import "./DataDetail.css";

const DataDetail = () => {
  const { id } = useParams();
  const accessToken = localStorage.getItem("accessToken");

  const [interval, setIntervalValue] = useState("1h"); // untuk chart & download
  const [analysisInterval, setAnalysisInterval] = useState("24h"); // khusus analisis

  const [sensorData, setSensorData] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [limitsData, setLimitsData] = useState([]);
  const [analysis, setAnalysis] = useState([]);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const fetchSensorChart = () => {
    fetch(`${process.env.REACT_APP_API_URL}/v1/devices/${id}/sensors/intervals?interval=${interval}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(res => res.json())
      .then(result => {
        const sensors = result.data?.sensors || [];
        setSensorData(sensors);
        setTimestamps(sensors.map(item => item.timestamp));
      })
      .catch(err => console.error(err));
  };

  const fetchSensorLimits = () => {
    fetch(`${process.env.REACT_APP_API_URL}/v1/devices/${id}/sensors/limits?limit=5`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(res => res.json())
      .then(result => {
        setLimitsData(result.data?.sensors || []);
      })
      .catch(err => console.error(err));
  };

  const fetchAnalysis = () => {
    setLoadingAnalysis(true);
    fetch(`${process.env.REACT_APP_API_URL}/v1/chats/${id}/analyze?interval=${analysisInterval}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(res => res.json())
      .then(result => {
        let parsed = [];
        try {
          parsed = JSON.parse(result.data);
        } catch {
          parsed = [result.data];
        }
        console.log(result.data)
        setAnalysis(parsed);
      })
      .catch(err => console.error("Gagal ambil analisis LLM:", err))
      .finally(() => setLoadingAnalysis(false));
  };

  const handleDownloadCSV = () => {
    fetch(`${process.env.REACT_APP_API_URL}/v1/devices/${id}/sensors/downloads?interval=${interval}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Gagal mengunduh file");
        return res.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `sensor-data-${id}-${interval}.csv`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch(err => {
        console.error("Download failed:", err);
        alert("Terjadi kesalahan saat mengunduh file.");
      });
  };

  useEffect(() => {
    fetchSensorChart();
    fetchSensorLimits();

    const polling = setInterval(() => {
      fetchSensorChart();
      fetchSensorLimits();
    }, 10000);

    return () => clearInterval(polling);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval]);

  const getSeriesData = (key) => sensorData.map(item => item[key]);

  const rawCardConfigs = [
    {
      title: "Lux",
      icon: UilSun,
      color: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
      key: "light_intensity",
      satuan: " lx",
    },
    {
      title: "Temperature",
      icon: UilTemperature,
      color: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
      key: "temperature",
      satuan: " °C",
    },
    {
      title: "Humidity",
      icon: UilTear,
      color: "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
      key: "humidity",
      satuan: " %",
    },
  ];

  const cardConfigs = rawCardConfigs
    .map(card => {
      const series = getSeriesData(card.key);
      if (!series || series.length === 0 || series.every(v => v === null || v === undefined)) return null;
      return {
        ...card,
        value: sensorData.at(0)?.[card.key],
        series,
      };
    })
    .filter(Boolean);

  return (
    <div className="data-detail">
      <h2>{id}</h2>

      {/* Interval untuk fetch chart & download */}
      <select value={interval} onChange={(e) => setIntervalValue(e.target.value)} className="interval-select">
        {["15m", "1h", "6h", "12h", "24h", "30d", "60d", "90d"].map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      <div className="download-section">
        <button className="download-btn" onClick={handleDownloadCSV}>
          Unduh Data Sensor (CSV)
        </button>
      </div>

      <div className="cards-section">
        {cardConfigs.length > 0 ? (
          cardConfigs.map((card, idx) => (
            <Card
              key={idx}
              title={card.title}
              color={{ backGround: card.color }}
              barValue={70}
              value={card.value}
              satuan={card.satuan}
              png={card.icon}
              xaxis={timestamps}
              series={[{ name: card.title, data: card.series }]}
              interval={interval}
            />
          ))
        ) : (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            Tidak ada data sensor tersedia untuk ditampilkan.
          </p>
        )}
      </div>

      <h3>Latest Sensor Data</h3>
      <table className="sensor-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Temperature (°C)</th>
            <th>Humidity (%)</th>
            <th>Light (lx)</th>
          </tr>
        </thead>
        <tbody>
          {limitsData.map((item, idx) => (
            <tr key={idx}>
              <td>{item.timestamp}</td>
              <td>{item.temperature}</td>
              <td>{item.humidity}</td>
              <td>{item.light_intensity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Analisis dari LLM */}
      <div className="analysis-section">
        <div className="analysis-header">
          <h3>🤖 AI Analysis</h3>
          <div className="analysis-controls">
            <select
              value={analysisInterval}
              onChange={(e) => setAnalysisInterval(e.target.value)}
              className="interval-select"
            >
              {["15m", "1h", "6h", "12h", "24h", "30d", "60d", "90d"].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <button className="analyze-btn" onClick={fetchAnalysis}>
              🔎 Analisis
            </button>
          </div>
        </div>

        <div className="analysis-body">
          {loadingAnalysis ? (
            <div className="loading-spinner">
              <p>AI Menganalisis..</p>
              <div className="spinner" />
            </div>
          ) : analysis.length > 0 ? (
            <ul className="analysis-list">
              {analysis.map((msg, idx) => (
                <li key={idx} className="analysis-item">✨ {msg}</li>
              ))}
            </ul>
          ) : (
            <p className="empty-analysis">
              Belum ada analisis. Pilih interval lalu klik <b>Analisis</b>.
            </p>
          )}
        </div>
      </div>

    </div>
  );
};

export default DataDetail;
