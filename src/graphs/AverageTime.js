import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { DataFrame } from "danfojs";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


// really not sure how to do this rn
export default function AverageTime({ inputData }) {

  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    const df = new DataFrame(inputData);
    df["TimeStamp"] = df["TimeStamp"].str.substring(0, 19)

    const ALL_DATA = [];

    const allStocks = df["Symbol"].unique().sortValues().values;
    const numStocks = allStocks.length;

    // combined or 1
    {
      const layout = {
        barmode: "stacked",
        title: numStocks > 1 ? "Combined Average Time" : `'${allStocks[0]}' Average Time`
      };
    
      const data = [];
      df["MessageType"].unique().sortValues().values.forEach((v) => {
  
        const sub = df.iloc({
          rows: df["MessageType"].eq(v)
        });
  
        const xVals = sub["TimeStamp"].values;
        const yVals = sub["MessageType"].values;
  
        const trace = {
          x: xVals,
          y: yVals,
          type: "histogram",
          name: v,
          opacity: 0.75
        };
  
        data.push(trace);
      });

      ALL_DATA.push({ name: (numStocks > 1 ? "ALL SYMBOLS" : allStocks[0]), layout: layout, data: data });
    }



    // each stock
    if(numStocks > 1) {

      df["MessageType"].unique().sortValues().values.forEach((msgType) => {

        const layout = {
          barmode: "stacked",
          title: `${msgType} Message Volume`
        };

        const dfsub = df.iloc({
          rows: df["MessageType"].eq(msgType)
        });
      
        const data = [];
        dfsub["Symbol"].unique().sortValues().values.forEach((sym) => {
    
          const sub = df.iloc({
            rows: df["Symbol"].eq(sym).and(df["MessageType"].eq(msgType))
          });
    
          const xVals = sub["TimeStamp"].values;
          const yVals = sub["Symbol"].values;
    
          const trace = {
            x: xVals,
            y: yVals,
            type: "histogram",
            name: sym,
            opacity: 0.75
          };
    
          data.push(trace);
        });

        ALL_DATA.push({ name: msgType, layout: layout, data: data });
      });
    }



    setDataList(ALL_DATA);
  }, [inputData]);


  const createPlot = (name, data, layout) => (
    <Plot
      key={name}
      data={data}
      layout={layout}
    >
    </Plot>
  );

  const allPlots = () => {
    if(dataList.length > 1) {
      const out = dataList.map(o => (
        <Accordion key={o.name}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>{o.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {createPlot(o.name, o.data, o.layout)}
          </AccordionDetails>
        </Accordion>
      ));
      return out;
    } else if(dataList.length === 1) {
      const o = dataList[0];
      return createPlot(o.name, o.data, o.layout);
    }
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography>Average Time</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {allPlots()}
      </AccordionDetails>
    </Accordion>
  )
};