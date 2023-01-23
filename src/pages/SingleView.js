import { useState } from "react";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import VolumeNumbers from "../graphs/VolumeNumbers";
import VolumePercent from "../graphs/VolumePercent";
import AverageTime from "../graphs/AverageTime";
import Abnormality from "../graphs/Abnormality";
import { Typography } from "@mui/material";


export default function SingleView() {

  const [data, setData] = useState(null);
  const [filename, setFilename] = useState("");

  const [ogData, setOgData] = useState(null);

  const fileChanged = e => {
    const file = e.target.files[0];
    setFilename(file.name);
    
    file.text().then((d) => {
      setData(null);
      const j = JSON.parse(d);
      setData(j);
      setOgData(j);
    });
  };
  
  const allGraphs = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '70%' }}>
      <VolumeNumbers inputData={data}></VolumeNumbers>
      <VolumePercent inputData={data}></VolumePercent>
      {/* <AverageTime inputData={data}></AverageTime> */}
      <Abnormality inputData={data}></Abnormality>
    </Box>
  );

  return (
    <Stack direction="column" alignItems="center" spacing={2}>
      <Button variant="contained" component="label">
        Upload
        <input hidden onChange={fileChanged} id="upload" type="file" accept="application/json" />
      </Button>
      <Typography>{filename}</Typography>

      {data && allGraphs()}
    </Stack>
  )
};