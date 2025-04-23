import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Collapse,
  useMediaQuery
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import QrCodeIcon from '@mui/icons-material/QrCode';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useNavigate, useLocation } from 'react-router-dom';

// Componente de barra lateral para navegação
// Responsivo para diferentes tamanhos de tela
// Suporta modo fixo em desktop e modo temporário em dispositivos móveis

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme, open, variant }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.mode === 'light' ? '#1F2937' : theme.palette.background.default,
    color: theme.palette.mode === 'light' ? '#FFFFFF' : theme.palette.text.primary,
    borderRight: 'none',
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Sidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [openSubMenu, setOpenSubMenu] = useState('');
  
  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };
  
  const handleSubMenuToggle = (menu) => {
    setOpenSubMenu(openSubMenu === menu ? '' : menu);
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      text: 'Fila',
      icon: <PeopleIcon />,
      path: '/queue',
    },
    {
      text: 'QR Code',
      icon: <QrCodeIcon />,
      path: '/qrcode',
    },
    {
      text: 'Estatísticas',
      icon: <BarChartIcon />,
      path: '/statistics',
    },
    {
      text: 'Configurações',
      icon: <SettingsIcon />,
      path: '/settings',
    },
  ];

  const drawer = (
    <>
      <DrawerHeader />
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      <List sx={{ pt: 1 }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            {item.subMenu ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleSubMenuToggle(item.text)}
                    selected={isActive(item.path)}
                    sx={{
                      py: 1.5,
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      },
                      '&.Mui-selected:hover': {
                        backgroundColor: 'rgba(59, 130, 246, 0.3)',
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ 
                        fontSize: '0.9rem',
                        fontWeight: isActive(item.path) ? 500 : 400,
                      }}
                    />
                    {openSubMenu === item.text ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={openSubMenu === item.text} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subMenu.map((subItem) => (
                      <ListItemButton
                        key={subItem.text}
                        onClick={() => handleNavigate(subItem.path)}
                        selected={isActive(subItem.path)}
                        sx={{
                          pl: 7,
                          py: 1,
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(59, 130, 246, 0.2)',
                          },
                          '&.Mui-selected:hover': {
                            backgroundColor: 'rgba(59, 130, 246, 0.3)',
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          },
                        }}
                      >
                        <ListItemText 
                          primary={subItem.text} 
                          primaryTypographyProps={{ 
                            fontSize: '0.85rem',
                            fontWeight: isActive(subItem.path) ? 500 : 400,
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  selected={isActive(item.path)}
                  sx={{
                    py: 1.5,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: 'rgba(59, 130, 246, 0.3)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem',
                      fontWeight: isActive(item.path) ? 500 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>
    </>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {isMobile ? (
        <StyledDrawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
        >
          {drawer}
        </StyledDrawer>
      ) : (
        <StyledDrawer
          variant="permanent"
          open={true}
        >
          {drawer}
        </StyledDrawer>
      )}
    </Box>
  );
};

export default Sidebar;
