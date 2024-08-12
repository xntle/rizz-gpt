'use client'

import { Box, Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';

// app/about/page.js
export default function RizzGPT() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Send me what they said and I'll generate u some rizz?",
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
      <Box width="100%" mt={4} p={2} textAlign="center">
          <Stack direction="row" spacing={2} mt={2}>
            <TextField
              label="Type your message..."
              variant="outlined"
              fullWidth
            />
            <Button variant="contained" color="primary">Send</Button>
          </Stack>
        </Box>
);
}
