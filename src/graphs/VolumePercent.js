import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { DataFrame } from "danfojs";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


function Real({ inputData }) {
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
        title: numStocks > 1 ? "Combined Messages Volume" : `'${allStocks[0]}' Message Volume`
      };
    
      const data = [];

      const count = df["MessageType"].sortValues().valueCounts();

      const trace = {
        values: count.values,
        labels: count.index,
        type: "pie"
      };

      data.push(trace);

      ALL_DATA.push({ name: (numStocks > 1 ? "ALL SYMBOLS" : allStocks[0]), layout: layout, data: data });
    }



    // each stock
    if(numStocks > 1) {

      df["MessageType"].unique().sortValues().values.forEach((msgType) => {

        const layout = {
          title: `${msgType} Message Volume`
        };

        const data = [];

        const sub = df.iloc({
          rows: df["MessageType"].eq(msgType)
        });

        const count = {};

        allStocks.forEach((s) => {
          const sub2 = df.iloc({
            rows: sub["Symbol"].eq(s)
          });

          if(sub2.size > 0) {
            count[s] = sub2.size;
          }
        });

        // why does this crash
        // const count = sub["Symbol"].valueCounts();

        const trace = {
          values: Object.values(count),
          labels: Object.keys(count),
          type: "pie"
        };
  
        data.push(trace);

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
        <Accordion key={o.name} TransitionProps={{ unmountOnExit: true }}>
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

  return allPlots();
}

export default function VolumePercent({ inputData }) {

  

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography>Volume of Messages (Percentage)</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Real inputData={inputData}/>
      </AccordionDetails>
    </Accordion>
  )
};