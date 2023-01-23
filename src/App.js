import { useState } from "react";
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import SingleView from './pages/SingleView';

function App() {

  const [drawerOpened, setDrawerOpened] = useState(false);
  const [viewType, setViewType] = useState("Single");



  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => setDrawerOpened(false)}
      onKeyDown={() => setDrawerOpened(false)}
    >
      <List>
        <ListItem>
          <ListItemText primary={"Single"} />
        </ListItem>
        <ListItem>
          <ListItemText primary={"Dual"} />
        </ListItem>
      </List>
    </Box>
  );

  const getView = () => viewType === "Single" ? <SingleView/> : <SingleView/>;

  return (
    <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setDrawerOpened(true)} 
          >
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            NBC Challenge
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor={"left"}
        open={drawerOpened}
        onClose={() => setDrawerOpened(false)}
      >
        {list()}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }}>
        {/* <Toolbar /> */}
        {getView()}

      </Box>
    </Box>
  );
}

export default App;
