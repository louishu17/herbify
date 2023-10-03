// components/Footer.tsx
import React from 'react';
import { Container, Typography, Theme } from '@mui/material';
import { useTheme } from '@emotion/react';



const Footer: React.FC = () => {

  return (
    <footer style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="textSecondary" align="center">
          &copy; {new Date().getFullYear()} herbify
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer;
