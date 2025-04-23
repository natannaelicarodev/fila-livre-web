import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import CustomCard from '../common/CustomCard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// Cartão de estatísticas para o dashboard
// Exibe um valor estatístico com ícone, título e tendência

const StyledAvatar = styled(Avatar)(({ theme, color = 'primary' }) => ({
  backgroundColor: theme.palette[color].light,
  color: theme.palette[color].dark,
}));

const TrendIndicator = styled(Box)(({ theme, isPositive }) => ({
  display: 'flex',
  alignItems: 'center',
  color: isPositive ? theme.palette.success.main : theme.palette.error.main,
  fontSize: '0.875rem',
  fontWeight: 500,
}));

const StatCard = ({
  title,
  value,
  icon,
  trend = null,
  color = 'primary',
  sx = {},
}) => {
  return (
    <CustomCard
      sx={{
        ...sx,
        '& .MuiCardContent-root': {
          padding: 3,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
            {value}
          </Typography>
          
          {trend && (
            <TrendIndicator isPositive={trend.isPositive}>
              {trend.isPositive ? (
                <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
              ) : (
                <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />
              )}
              {trend.value}%
            </TrendIndicator>
          )}
        </Box>
        
        <StyledAvatar color={color}>
          {icon}
        </StyledAvatar>
      </Box>
    </CustomCard>
  );
};

export default StatCard;
