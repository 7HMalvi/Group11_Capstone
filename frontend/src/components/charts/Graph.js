//Static Graph 

import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  ["Song", "Like"],
  ["Song 1", 11],
  ["Song 2", 2],
  ["Song 3", 2],
  ["Song 4", 2],
  ["Song 5", 7],
];

export const options = {
  title: "Trending Songs",
  backgroundColor: "black"
};

export default function Graph() {
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
  )
}