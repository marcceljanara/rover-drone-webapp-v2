import React, { useState, useEffect } from 'react';
import { UilSun, UilTemperature, UilTear } from "@iconscout/react-unicons";

// Component for fetching and updating cards data
export const CardsDataComponent = () => {
  const [batterySocData, setbatterySocData] = useState([]);
  const [batteryVoltageData, setbatteryVoltageData] = useState([]);
  const [batteryCurrentData, setbatteryCurrentData] = useState([]);
  const [timestamps, setTimestamps] = useState([]);

  const fetchData = () => {
    fetch('https://api.xsmartagrichain.com/battery#')
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const lastTenData = data.slice(0,9).reverse();
          
          // Update the state correctly as arrays
          setbatterySocData(lastTenData.map(item => item.batterySoc));
          setbatteryVoltageData(lastTenData.map(item => item.batteryVoltage));
          setbatteryCurrentData(lastTenData.map(item => item.batteryCurrent));
          setTimestamps(lastTenData.map(item => item.timestamp));
        } else {
          console.error("No data returned from API");
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    fetchData();

    // Polling every 10 seconds (10000 milliseconds)
    const intervalId = setInterval(fetchData, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // Cards Data
  const cardsData = [
    {
      title: "batterySoc",
      color: {
        backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
        boxShadow: "0px 10px 20px 0px #e0c6f5",
      },
      barValue: batterySocData[batterySocData.length - 1],
      value: batterySocData[batterySocData.length - 1], // Data terakhir untuk batterySoc
      satuan: " %",
      png: UilSun,
      series: [
        {
          name: "batterySoc",
          data: batterySocData, // 10 data terakhir untuk grafik
        },
      ],
      xaxis: timestamps, // 10 timestamps terakhir untuk grafik
    },
    {
      title: "batteryVoltage",
      color: {
        backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
        boxShadow: "0px 10px 20px 0px #FDC0C7",
      },
      barValue: 80,
      value: batteryVoltageData[batteryVoltageData.length - 1], // Data terakhir untuk batteryVoltage
      satuan: " V",
      png: UilTemperature,
      series: [
        {
          name: "batteryVoltage",
          data: batteryVoltageData, // 10 data terakhir untuk grafik
        },
      ],
      xaxis: timestamps, // 10 timestamps terakhir untuk grafik
    },
    {
      title: "batteryCurrent",
      color: {
        backGround: "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
        boxShadow: "0px 10px 20px 0px #F9D59B",
      },
      barValue: 60,
      value: batteryCurrentData[batteryCurrentData.length - 1], // Data terakhir untuk batteryCurrent
      satuan: " A",
      png: UilTear,
      series: [
        {
          name: "batteryCurrent",
          data: batteryCurrentData, // 10 data terakhir untuk grafik
        },
      ],
      xaxis: timestamps, // 10 timestamps terakhir untuk grafik
    },
  ];

  return { cardsData };
};