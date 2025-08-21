import React from 'react';
import { Box } from '@mui/material';
import Lottie from 'lottie-react';
import dogAnimation from '/public/Animation - 1750357612691.json';

const AnimatedDog = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: -40,
        left: 0,
        width: '100px',
        height: '100px',
        animation: 'moveRight 18s linear infinite',
        '@keyframes moveRight': {
          '0%': {
            transform: 'translateX(-100px)'
          },
          '100%': {
            transform: 'translateX(calc(100vw + 100px))'
          }
        }
      }}
    >
      <Lottie
        animationData={dogAnimation}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice'
        }}
      />
    </Box>
  );
};

export default AnimatedDog; 