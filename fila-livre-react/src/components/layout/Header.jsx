import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Avatar, 
  Box, 
  Menu, 
  MenuItem, 
  Tooltip,
  Badge,
  useMediaQuery
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

// Componente de cabeçalho para o layout principal
// Inclui logo, título, notificações e menu de usuário
// Responsivo para diferentes tamanhos de tela

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

const Logo = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: theme.spacing(2),
}));

const Header = ({ 
  title = 'Fila Livre', 
  onMenuClick,
  user = null,
  onLogout
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  
  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };
  
  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  const handleLogout = () => {
    handleUserMenuClose();
    if (onLogout) onLogout();
  };

  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Logo>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main',
              width: 40,
              height: 40,
              mr: 1
            }}
          >
            FL
          </Avatar>
          {!isMobile && (
            <Typography variant="h6" noWrap component="div">
              {title}
            </Typography>
          )}
        </Logo>
        
        {isMobile && (
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        )}
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex' }}>
          <Tooltip title="Notificações">
            <IconButton 
              color="inherit"
              onClick={handleNotificationsOpen}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Perfil">
            <IconButton
              onClick={handleUserMenuOpen}
              color="inherit"
              sx={{ ml: 1 }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: 'primary.dark'
                }}
              >
                {user?.displayName?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
        
        {/* Menu de usuário */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleUserMenuClose}
          PaperProps={{
            elevation: 3,
            sx: { minWidth: 200 }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              {user?.displayName || 'Usuário'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email || 'usuario@exemplo.com'}
            </Typography>
          </Box>
          
          <MenuItem onClick={handleUserMenuClose}>
            <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
            Perfil
          </MenuItem>
          
          <MenuItem onClick={handleUserMenuClose}>
            <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
            Configurações
          </MenuItem>
          
          <MenuItem onClick={handleLogout}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
            Sair
          </MenuItem>
        </Menu>
        
        {/* Menu de notificações */}
        <Menu
          anchorEl={notificationsAnchorEl}
          open={Boolean(notificationsAnchorEl)}
          onClose={handleNotificationsClose}
          PaperProps={{
            elevation: 3,
            sx: { minWidth: 280, maxWidth: 320 }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Notificações
            </Typography>
          </Box>
          
          <MenuItem onClick={handleNotificationsClose}>
            <Box sx={{ py: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Novo cliente na fila
              </Typography>
              <Typography variant="caption" color="text.secondary">
                João Silva entrou na fila há 5 minutos
              </Typography>
            </Box>
          </MenuItem>
          
          <MenuItem onClick={handleNotificationsClose}>
            <Box sx={{ py: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Tempo de espera alto
              </Typography>
              <Typography variant="caption" color="text.secondary">
                O tempo médio de espera está acima de 15 minutos
              </Typography>
            </Box>
          </MenuItem>
          
          <MenuItem onClick={handleNotificationsClose}>
            <Box sx={{ py: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Relatório diário disponível
              </Typography>
              <Typography variant="caption" color="text.secondary">
                O relatório de ontem está pronto para visualização
              </Typography>
            </Box>
          </MenuItem>
          
          <Box sx={{ px: 2, py: 1, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
            <Typography 
              variant="body2" 
              color="primary" 
              sx={{ cursor: 'pointer', fontWeight: 500 }}
              onClick={handleNotificationsClose}
            >
              Ver todas
            </Typography>
          </Box>
        </Menu>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
