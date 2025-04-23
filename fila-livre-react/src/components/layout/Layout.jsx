import React, { useState } from 'react';
import { Box, Toolbar, Container, Typography, Breadcrumbs, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import Header from './Header';
import Sidebar from './Sidebar';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// Componente de layout principal que envolve todas as páginas
// Inclui cabeçalho, barra lateral e área de conteúdo principal
// Responsivo para diferentes tamanhos de tela

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('md')]: {
      marginLeft: 0,
    },
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
  }),
);

const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const Layout = ({
  children,
  title,
  subtitle,
  breadcrumbs = [],
  user = null,
  onLogout,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Header 
        title="Fila Livre" 
        onMenuClick={handleDrawerToggle}
        user={user}
        onLogout={onLogout}
      />
      
      <Sidebar 
        open={mobileOpen} 
        onClose={handleDrawerToggle} 
      />
      
      <Main open={mobileOpen}>
        <Toolbar /> {/* Espaçamento para o cabeçalho fixo */}
        
        <Container maxWidth="xl" sx={{ py: 2 }}>
          {breadcrumbs.length > 0 && (
            <Breadcrumbs 
              separator={<NavigateNextIcon fontSize="small" />} 
              aria-label="breadcrumb"
              sx={{ mb: 2 }}
            >
              <Link 
                component={RouterLink} 
                to="/dashboard" 
                color="inherit"
                underline="hover"
              >
                Dashboard
              </Link>
              
              {breadcrumbs.map((breadcrumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                
                return isLast ? (
                  <Typography key={index} color="text.primary">
                    {breadcrumb.label}
                  </Typography>
                ) : (
                  <Link
                    key={index}
                    component={RouterLink}
                    to={breadcrumb.href}
                    color="inherit"
                    underline="hover"
                  >
                    {breadcrumb.label}
                  </Link>
                );
              })}
            </Breadcrumbs>
          )}
          
          {(title || subtitle) && (
            <PageHeader>
              {title && (
                <Typography variant="h4" component="h1" gutterBottom>
                  {title}
                </Typography>
              )}
              
              {subtitle && (
                <Typography variant="subtitle1" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </PageHeader>
          )}
          
          {children}
        </Container>
      </Main>
    </Box>
  );
};

export default Layout;
