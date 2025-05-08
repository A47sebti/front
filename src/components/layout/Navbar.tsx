import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Gestion des Sites Mobiles
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={RouterLink} to="/">
            Tableau de Bord
          </Button>
          <Button color="inherit" component={RouterLink} to="/sites/new">
            Sites
          </Button>
          <Button color="inherit" component={RouterLink} to="/interventions">
            Interventions
          </Button>
          <Button color="inherit" component={RouterLink} to="/reports">
            Rapports
          </Button>
          <Button color="inherit" component={RouterLink} to="/login">
            Connexion
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 