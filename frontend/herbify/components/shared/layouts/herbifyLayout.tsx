// HerbifyLayout.jsx
import React from 'react';
import { Box } from '@mui/material';

interface HerbifyLayoutProps {
    children: React.ReactNode;
}

const HerbifyLayout = ({ children }: HerbifyLayoutProps) => {
    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#FFE8D7',
            }}
        >
              {/* Plates at the bottom-right corner */}
              <Box
                  component="img"
                  src={'assets/bottom_left_plate.png'}
                  sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '18%', // Adjust size as needed
                      filter: 'drop-shadow(2px 4px 20px rgba(0, 0, 0, 0.4))'
                  }}
                  alt="Plates"
              />

              <Box
                  component="img"
                  src={'assets/top_left_plate.png'}
                  sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '18%',
                      filter: 'drop-shadow(2px 4px 20px rgba(0, 0, 0, 0.4))'
                  }}
                  alt="Plates"
              />

              <Box
                  component="img"
                  src={'assets/top_right_plate.png'}
                  sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '18%',
                      filter: 'drop-shadow(2px 4px 20px rgba(0, 0, 0, 0.4))'
                  }}
                  alt="Plates"
              />
            
            {/* Content */}
            {children}
        </Box>
    );
};

export default HerbifyLayout;
