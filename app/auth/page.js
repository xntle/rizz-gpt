// pages/SignUp.js
"use client";
import { React, useContext, createContext, useState, useEffect } from "react";
import { Grid, Box, Typography, Button } from "@mui/material";
import Script from 'next/script';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase/firebase"; 
import { useRouter } from "next/navigation";

// Context for Authentication
const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userUid, setUserUid] = useState("");
  const [loading, setLoading] = useState(true); 
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser || null);
        setUserUid(currentUser?.uid || "");
      } else {
        setUser("");
        setUserUid("");
      }
      setLoading(false); // Set loading to false after checking authentication state
    });
    return () => unsubscribe();
  }, []);

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

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut, userUid, loading }}>
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

  useEffect(() => {
    if (user) {
      router.push("/"); 
    }
  }, [user, router]);


  const handleSignUp = async () => {
    try {
      await googleSignIn();
      router.push("/"); // Redirect to the homepage
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <>
          <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
        `}
      </Script>

    
    <Grid container sx={{ height: "100vh" }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <video
          autoPlay
          loop
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "16px",
          }}
        >
          <source src="/giphy.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Grid>

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
        <Box sx={{ maxWidth: 500, textAlign: "center" }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ textAlign: "left", fontFamily: 'Helvetica', fontWeight: 'bold' }}
          >
            RizzGPT
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ textAlign: "left", fontFamily: 'Helvetica'}}>
            Got no rizz? RizzGPT has got you covered. Designed for those who
            need a little extra help in rizzing. Whether you're looking to
            impress someone new or just want to enhance your skills, this AI
            offers clever comebacks and smooth lined to elevate your game. With
            RizzGPT, you'll always have the perfect thing to say.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 4, width: "100%", bgcolor: '#ffd43b', color: '#000', 
            fontWeight: 'bold', 
            textTransform: 'none',
            fontFamily: 'Helvetica',            
            '&:hover': {
              bgcolor: '#ffecb3' // Lighter background on hover
            }}}
            onClick={handleSignUp}
            textTransform="none"

          >
            Get Started
          </Button>
        </Box>
      </Grid>
    </Grid>
    </>
  );
}
