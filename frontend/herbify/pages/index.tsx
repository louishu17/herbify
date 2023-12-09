// import FeedPage from "./feed";
// import { useRouter } from "next/router";
// import { withAuth } from '@/lib/authCheck';

// export const getServerSideProps = withAuth();

// export default function HomePage() {
//   const router = useRouter();
//   //router.push("/feed");
//   return <FeedPage/>;
// }

import React from 'react';
import { Typography, Button, Stack, Box } from '@mui/material';
import { useRouter } from 'next/router';
import PageTransition from '@/components/shared/pageTransition';
import HerbifyLayout from '@/components/shared/layouts/herbifyLayout';

const LandingPage: React.FC = () => {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
};

const handleRegisterClick = () => {
    router.push('/register');
};

    return (
      <PageTransition>
        <HerbifyLayout>
            {/* Fork and Knife at the sides */}
            <Box
                component="img"
                src={'/assets/fork.svg'}
                sx={{
                    position: 'absolute',
                    top: '50%', // Position at half the height of the screen
                    left: '17%', // Adjust the percentage to place it correctly
                    transform: 'translateY(-50%)', // Center vertically
                    width: '3.3%', // Adjust size as needed
                    filter: 'drop-shadow(2px 4px 5px rgba(0, 0, 0, 0.3))'
                }}
                alt="Fork"
            />
            <Box
                component="img"
                src={'/assets/knife.svg'}
                sx={{
                    position: 'absolute',
                    top: '50%', // Position at half the height of the screen
                    right: '18%', // Adjust the percentage to place it correctly
                    transform: 'translateY(-50%)', // Center vertically
                    width: '2.5%', // Adjust size as needed
                    filter: 'drop-shadow(2px 4px 5px rgba(0, 0, 0, 0.3))'
                }}
                alt="Knife"
            />

            

              {/* Logo and Catchphrase */}
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', my: 4 }}>
                <img src={'/icons/herbify-logo.svg'} alt="Herbify Logo" style={{ width: '20%', height: 'auto' }} />
              </Box>
              <Typography variant="h4" sx={{ textAlign: 'center' }}>
                  Herbify: Stirring Up Culinary Connections
              </Typography>

              {/* Buttons */}
              <Stack direction="row" spacing={2} style={{paddingTop: 20}}>
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: '20px',
                      color: '#05353B', 
                      borderColor: '#05353B', 
                      '&:hover': {
                        borderColor: '#05353B', 
                      },
                    }}
                    onClick={handleLoginClick}
                  >
                      Login
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleRegisterClick}
                  >
                    Register
                  </Button>
              </Stack>
          </HerbifyLayout>
        </PageTransition>
    );
};

export default LandingPage;
