import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu'; // Ensure you import the MenuIcon
import { UserAuth } from "../auth/page"; 

const Navbar = () => {
  const { user, logOut } = UserAuth();

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
<AppBar position="static" sx={{ backgroundColor: '#fafafa', color: '#000' }}>
  <Toolbar sx={{ justifyContent: "space-between" }}>
    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
      <MenuIcon />
    </IconButton>
    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
      RizzGPT
    </Typography>
    {user ? (
      <>
        <Typography variant="body1" sx={{ marginRight: 2 }}>
          {user.displayName || 'Welcome!'}
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </>
    ) : (
      <Button color="inherit">Login</Button> // Assuming you have a login mechanism
    )}
  </Toolbar>
</AppBar>

  );
};

export default Navbar;
