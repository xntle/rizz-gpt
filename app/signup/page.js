import { Box, Button, Stack, TextField } from '@mui/material';
import React from 'react';

export default function SignUp(){
    return (
      <Box width="400px" mt={4}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" fullWidth>
          Sign In
        </Button>
        <p>Don't have an account? Sign up</p>
      </Box>
  );
}
