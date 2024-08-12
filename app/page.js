'use client'

import { useState } from 'react';
import './globals.css';
import { Box, Button, Stack, TextField } from '@mui/material';
import React from 'react';

export default function Home() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100vw"
      height="100vh"
    >
      {/* First Section */}
      <Box width="400px" textAlign="center">
        <h1>rizzgpt</h1>
        <p>
          Got no rizz? RizzGPT has you covered! Designed for those who need a little extra help in rizzing. Whether you're looking to impress someone new or just want to enhance your texting skills, this AI offers clever comebacks and smooth lines to elevate your game. With RizzGPT, you'll always have the perfect thing to say.
        </p>
        <Button variant="contained" color="primary">Get Started</Button>
        <p>Already have an account? Sign in</p>
      </Box>
    </Box>
  );
}
