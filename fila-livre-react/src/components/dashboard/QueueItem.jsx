import React from 'react';
import { Box, Typography, Chip, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Componente para exibir um item da fila no dashboard e na página de fila
// Mostra informações do cliente, tempo de espera e status

const StyledListItem = styled(ListItem)(({ theme, isActive }) => ({
  padding: theme.spacing(2, 3),
  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
  borderLeft: isActive ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

const QueueItem = ({
  position,
  name,
  waitTime,
  joinedAt,
  isActive = false,
  onClick,
}) => {
  return (
    <StyledListItem isActive={isActive} button={Boolean(onClick)} onClick={onClick}>
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: isActive ? 'primary.main' : 'grey.400' }}>
          <PersonIcon />
        </Avatar>
      </ListItemAvatar>
      
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" component="span" sx={{ fontWeight: 500 }}>
              {name}
            </Typography>
            <Chip
              label={`#${position}`}
              size="small"
              color={isActive ? 'primary' : 'default'}
              variant={isActive ? 'filled' : 'outlined'}
            />
          </Box>
        }
        secondary={
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.875rem', color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {waitTime}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Entrou às {joinedAt}
            </Typography>
          </Box>
        }
      />
    </StyledListItem>
  );
};

export default QueueItem;
