import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { DataFrame } from "danfojs";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



const tradeNoReqCols = [
  {
    field: 'UUID',
    headerName: 'UUID',
    width: 400,
  },
  {
    field: 'Symbol',
    headerName: 'Symbol',
    width: 150,
  }
];

function Real({ inputData }) {

  const [tradesNoReqs, setTradesNoReqs] = useState([]);

  useEffect(() => {
    const df = new DataFrame(inputData);
    df["TimeStamp"] = df["TimeStamp"].str.substring(0, 19)

    {
      const rows = [];
      const tradeSubs = df.iloc({
        rows: df["MessageType"].eq("Cancelled")
      });

      const orders = tradeSubs["OrderID"].unique().values;

      orders.forEach((o) => {
        const sub = df.iloc({
          rows: df["OrderID"].eq(o).and(df["MessageType"].eq("CancelRequest"))
        });

        if(sub.size === 0) {

          const s = df.iloc({
            rows: df["OrderID"].eq(o)
          });

          rows.push({ id: o, UUID: o, Symbol: s.iloc({ rows: [0] })["Symbol"].values[0] })
        }

      });

      setTradesNoReqs(rows);
    }


  }, [inputData]);

  return (
    <div>
      <Typography variant="h6">Cancelled orders without a request</Typography>
      <DataGrid
        rows={tradesNoReqs}
        columns={tradeNoReqCols}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        sx={{ minHeight: "400px", width: '100%' }}
      />
    </div>
  )
}

export default function Abnormality({ inputData }) {

  // const missingRequestAck = () => {

  // };

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography>Abnormalities</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Real inputData={inputData}/>
        {/* {missingRequestAck()} */}
      </AccordionDetails>
    </Accordion>
  )
};