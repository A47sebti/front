import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Place as SiteIcon,
  Build as InterventionIcon,
  Assessment as ReportIcon,
  People as UserIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      roles: ['ADMIN', 'GESTIONNAIRE', 'TECHNICIEN'],
    },
    {
      text: 'Sites',
      icon: <SiteIcon />,
      path: '/sites',
      roles: ['ADMIN', 'GESTIONNAIRE'],
    },
    {
      text: 'Interventions',
      icon: <InterventionIcon />,
      path: '/interventions',
      roles: ['ADMIN', 'GESTIONNAIRE', 'TECHNICIEN'],
    },
    {
      text: 'Rapports',
      icon: <ReportIcon />,
      path: '/reports',
      roles: ['ADMIN', 'GESTIONNAIRE'],
    },
    {
      text: 'Utilisateurs',
      icon: <UserIcon />,
      path: '/users',
      roles: ['ADMIN'],
    },
  ];

  const filteredMenuItems = menuItems.filter(
    item => user && item.roles.includes(user.role)
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          top: '64px',
          height: 'calc(100% - 64px)',
        },
      }}
    >
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname.startsWith(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </Drawer>
  );
};

export default Sidebar; 