import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import "./Table.css";

export default function BasicTable() {
  const [rows, setRows] = useState([]);

  const fetchData = () => {
    fetch("https://api.xsmartagrichain.com/data/15m")
      .then((response) => response.json())
      .then((data) => {
        // Ambil 4 data terakhir dan urutkan dari terlama ke terbaru
        const selectedData = data.slice(-4).reverse();
        setRows(selectedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();

    // Polling every 60 seconds (60000 milliseconds)
    const intervalId = setInterval(fetchData, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // UTCMonth dimulai dari 0
    const year = date.getUTCFullYear();

    return `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;
  };

  return (
    <div className="Table">
      <h3>Recent Data</h3>
      <TableContainer
        component={Paper}
        style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell align="left">Latitude</TableCell>
              <TableCell align="left">Longitude</TableCell>
              <TableCell align="left">Lux</TableCell>
              <TableCell align="left">Temperature</TableCell>
              <TableCell align="left">Humidity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ color: "white" }}>
            {rows.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {formatTimestamp(row.timestamp)}
                </TableCell>
                <TableCell align="left">{row.latitude}</TableCell>
                <TableCell align="left">{row.longitude}</TableCell>
                <TableCell align="left">{row.lux}</TableCell>
                <TableCell align="left">{row.temperature}°C</TableCell>
                <TableCell align="left">{row.humidity}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
