import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { GetGraphData } from "../../services/APIRoutes";

export const options = {
  title: "Trending Songs",
  backgroundColor: "black",
  titleTextStyle: { color: "white" },
  legend: { textStyle: { color: "white" } },
  pieSliceTextStyle: { color: "black" }
};

export default function Graph() {
  const [data, setData] = useState([["Song", "Like"]]);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('userToken');
      const response = await fetch(GetGraphData, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setData(data.data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width={"100%"}
        height={"400px"}
      />
    </div>
  );
}
