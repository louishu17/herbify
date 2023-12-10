import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    h3: {
      color: '#05353B',
    },
    h4: {
      color: '#05353B',
    },
    h5: {
      color: '#05353B',
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#05353B', // Default color
          '&:hover': {
            color: '#05353B', // Color on hover
            opacity: 0.8,
          },
          '&.Mui-selected': {
            color: '#05353B', // Color when selected
            fontWeight: 'bold', // Makes selected tab bolder
          },
        },
        
      },
    },
    MuiTabs: {
      styleOverrides: { 
          indicator: {
          backgroundColor: '#05353B', // Set the indicator color to green
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          borderRadius: '20px',
          color: 'white',
          backgroundColor: '#05353B!important',
          '&:hover': {
            backgroundColor: '#05353B',
          },
        },
        outlined: {
          borderRadius: '20px',
          color: '#05353B',
          borderColor: '#05353B',
          '&:hover': {
            borderColor: '#05353B',
          },
        },
      },
    },
  },
});

export default theme;
