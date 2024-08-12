'use client'

import { Box, Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import withAuth from './protectedroute';
import Navbar from './components/navbar';
import Script from 'next/script';



function Home() {
  
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I’m your customer service agent from Rizz Co., widely known as the Rizz Master. I’m here and ready to help you enhance your charm and social finesse.",
    },
  ]);
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (!message.trim()) return; // Don't send empty messages

    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);

    setMessage(''); // Clear the input field

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    }
  };

  return (
    
    <>
   <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
        `}
      </Script>

    <Navbar></Navbar>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx ={{            
          bgcolor: '#fafafa', // A light grey background color
        }}
      >
        <Stack
          direction={"column"}
          width="95vw"
          height="80vh"
          p={2}
          spacing={3}
          borderRadius={4}
          sx={{
            bgcolor: '#ffffff', // A light grey background color
            border: '1px solid #ebebeb', // Rounded corners
            overflow: 'hidden', // Hides anything that goes outside the bounds
            boxSizing: 'border-box', // Includes padding and border in the width and height
            display: 'flex', // Uses flex layout to align children
            flexDirection: 'column', // Stacks children vertically
            justifyContent: 'center', // Centers children vertically
            alignItems: 'center', // Centers children horizontally
          }}
        >
          <Stack
            direction={"column"}
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === "assistant" ? "flex-start" : "flex-end"
                }
              >
                <Box
                  bgcolor={
                    message.role === "assistant"
                      ? "#ffd43b"
                      : "#ebebeb"
                  }
                  color="black"
                  borderRadius={4}
                  p={3}
                >
                  {message.content}
                </Box>
              </Box>
            ))}
          </Stack>
        </Stack>
        <Stack
  direction="row"
  spacing={2}
  sx={{
    mt: 2,
    width: '95vw',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
      <TextField
        label="Type your message"
        variant="outlined"
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{
          bgcolor: '#ffffff',
          border: '1px solid #ebebeb', // Rounded corners
          borderRadius: '16px',
          '.MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#fff',
            },
            '&:hover fieldset': {
              borderColor: '#fff',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#aaa',
            },
          },
        }}
      />
      <Button
        variant="contained"
        onClick={sendMessage}
        sx={{
          bgcolor: '#ffd43b',
          fontWeight: 'bold',
          '&:hover': {
            bgcolor: '#ffdf70',
          },
          color: '#000',
          height: '50px',
        }}
      >
        Send
      </Button>
</Stack>

      </Box>
    </>
  );
}
export default withAuth(Home);