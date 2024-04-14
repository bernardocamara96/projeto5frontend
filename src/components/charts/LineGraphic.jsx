import React, { PureComponent } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
   {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
   },
   {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
   },
   {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
   },
   {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
   },
];

export default class LineGraphic extends PureComponent {
   static demoUrl = "https://codesandbox.io/s/simple-line-chart-kec3v";

   render() {
      return (
         <ResponsiveContainer width="83%" height="100%" aspect={4.5}>
            <LineChart
               width={500}
               height={500}
               data={data}
               margin={{
                  top: 30,
                  right: 15,
               }}
            >
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="name" />
               <YAxis ticks={[0, 2000, 4000, 6000, 8000, 10000]} />
               <Tooltip />
               <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
               <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
         </ResponsiveContainer>
      );
   }
}
