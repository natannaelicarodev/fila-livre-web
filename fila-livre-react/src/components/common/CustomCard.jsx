import React from 'react';
import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// Cartão personalizado com base no MUI Card
// Suporta diferentes variantes, cabeçalho opcional e ações

const StyledCard = styled(Card)(({ theme, elevation }) => ({
  borderRadius: 12,
  boxShadow: elevation ? theme.shadows[elevation] : theme.shadows[1],
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: elevation ? theme.shadows[elevation + 1] : theme.shadows[2],
  },
}));

const CustomCard = ({
  title,
  subtitle,
  icon,
  children,
  headerAction,
  footer,
  elevation = 1,
  sx = {},
  ...props
}) => {
  return (
    <StyledCard elevation={elevation} sx={sx} {...props}>
      {(title || icon) && (
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {icon && <Box sx={{ mr: 1 }}>{icon}</Box>}
              <Typography variant="h6" component="div">
                {title}
              </Typography>
            </Box>
          }
          subheader={subtitle && <Typography color="text.secondary">{subtitle}</Typography>}
          action={headerAction}
          sx={{ pb: 0 }}
        />
      )}
      <CardContent sx={{ flexGrow: 1, pt: title ? 1 : 2 }}>
        {children}
      </CardContent>
      {footer && (
        <Box
          sx={{
            p: 2,
            pt: 0,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          {footer}
        </Box>
      )}
    </StyledCard>
  );
};

export default CustomCard;
