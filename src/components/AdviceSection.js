import React, { useState, useEffect } from 'react';
import { Typography, Box, Fade } from '@material-ui/core';

const quotes = [
  "Завжди міряй взуття під настрій — не навпаки.",
  "Комфорт — це не розкіш. Це стандарт.",
  "Кросівки не зроблять тебе кращим, але точно додадуть впевненості.",
  "Твоє взуття — перше, що помічають. І останнє, що забувають.",
  "Стиль починається знизу — саме з взуття.",
];

const AdviceSection = () => {
  const [index, setIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % quotes.length);
        setFadeIn(true);
      }, 400);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box style={{ textAlign: 'center', margin: '40px 0' }}>
      <Fade in={fadeIn} timeout={400}>
        <Typography variant="h6" style={{ fontStyle: 'italic', color: '#777' }}>
          "{quotes[index]}"
        </Typography>
      </Fade>
    </Box>
  );
};

export default AdviceSection;
