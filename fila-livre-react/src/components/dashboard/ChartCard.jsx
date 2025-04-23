import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import CustomCard from '../common/CustomCard';

// Componente para exibir gráficos no dashboard
// Suporta diferentes tipos de gráficos e tamanhos

const ChartContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  minHeight: 250,
  display: 'flex',
  flexDirection: 'column',
}));

const ChartCard = ({
  title,
  subtitle,
  children,
  headerAction,
  className,
  sx = {},
}) => {
  return (
    <CustomCard
      title={title}
      subtitle={subtitle}
      headerAction={headerAction}
      sx={{ ...sx }}
    >
      <ChartContainer>
        {children || (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'text.secondary',
            }}
          >
            <Typography variant="body2">
              Dados do gráfico não disponíveis
            </Typography>
          </Box>
        )}
      </ChartContainer>
    </CustomCard>
  );
};

export default ChartCard;
