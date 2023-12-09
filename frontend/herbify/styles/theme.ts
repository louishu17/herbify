import { createTheme } from '@mui/material/styles';


const theme = createTheme({
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            '&': {
              borderRadius: '20px',
              color: 'white',
              backgroundColor: '#05353B!important',
              '&:hover': {
                backgroundColor: '#05353B',
              },
            },
          },
        },
      },
    },
  });
  

export default theme;

