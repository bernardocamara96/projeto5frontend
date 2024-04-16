import React, { PureComponent } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default class LineGraphic extends PureComponent {
   render() {
      const { data, isTablet, isMobile, isSmallMobile, isMobileResolution, dataName } = this.props;

      const filteredData = data.filter((item, index) => {
         return index % 4 === 0;
      });

      const formatYAxisTick = (tick) => {
         return parseInt(tick, 10);
      };

      return (
         <ResponsiveContainer
            width={isMobileResolution ? "100%" : "83%"}
            height="100%"
            aspect={isMobileResolution ? 2 : isSmallMobile ? 1.5 : isMobile ? 2.7 : isTablet ? 3.5 : 4.5}
         >
            <LineChart
               width={500}
               height={500}
               data={isSmallMobile ? filteredData : data}
               margin={{
                  top: 30,
                  right: 15,
               }}
            >
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="date" interval={isSmallMobile ? 5 : isMobile ? 9 : 4} />
               <YAxis tickFormatter={formatYAxisTick} />
               <Tooltip />
               <Line type="monotone" dataKey={dataName} stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
         </ResponsiveContainer>
      );
   }
}
