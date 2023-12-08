import React, { useState, useContext } from 'react';
import { Container, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { NewRecipeContext } from '@/lib/createRecipePage/newRecipeContext';

export const TimeForm: React.FC = () => {
  const {hours, setHours} = useContext(NewRecipeContext);
  const {minutes, setMinutes } = useContext(NewRecipeContext);

  const handleHourChange = (event: SelectChangeEvent<number>) => {
    setHours(parseInt(event.target.value as string, 10));
  };

  const handleMinuteChange = (event: SelectChangeEvent<number>) => {
    setMinutes(parseInt(event.target.value as string, 10));
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4">Time</Typography>
      <FormControl fullWidth style={{paddingBottom: 10}}>
        <InputLabel>Hours</InputLabel>
        <Select
          value={hours}
          onChange={handleHourChange}
        >
          {Array.from({ length: 11 }, (_, i) => (
            <MenuItem key={i} value={i}>{i}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Minutes</InputLabel>
        <Select
          value={minutes}
          onChange={handleMinuteChange}
        >
          {[0, 15, 30, 45].map((minute) => (
            <MenuItem key={minute} value={minute}>{minute}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Container>
  );
};
