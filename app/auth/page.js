// pages/SignUp.js
"use client";
import { React, useContext, createContext, useState, useEffect } from "react";
import { Grid, Box, Typography, Button } from "@mui/material";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase/firebase"; // Adjust the path based on your project structure
import { useRouter } from "next/navigation";

// Context for Authentication
const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userUid, setUserUid] = useState("");

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setUserUid(result.user.uid);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserUid("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserUid(currentUser.uid);
      } else {
        setUser("");
        setUserUid("");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut, userUid }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};

export default function SignUp() {
    const { user, googleSignIn } = UserAuth();
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      await googleSignIn();
      router.push("/"); // Redirect to the homepage
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundImage: `url('https://giphy.com/gifs/cets-cetsoncreck-ceticatures-uo3AgTGYuESuDw2mTw')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 2,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      ></Grid>

      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          height: "100%",
        }}
      >
        <Box sx={{ maxWidth: 400, textAlign: "center" }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to RizzGPT
          </Typography>
          <Typography variant="body1" gutterBottom>
            Here you can provide a brief explanation about your chatbot, its
            features, and how it can benefit the users. This is a placeholder
            text for you to customize.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 4 }}
            onClick={handleSignUp}
          >
            Get Started
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
