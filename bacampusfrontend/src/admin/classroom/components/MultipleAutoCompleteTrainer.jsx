import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

export const MultipleAutoComplete = ({ trainers, onTrainerIdSelecting }) => {
  const [selectedTrainerIds, setSelectedTrainerIds] = useState([]);

  const handleSelect = (event, value) => {
    setSelectedTrainerIds(value.map(trainer => trainer.id));
    onTrainerIdSelecting(value.map(trainer => trainer.id));
  };

  return (
    <Stack spacing={3} sx={{ width: '90%' }}>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={trainers}
        getOptionLabel={(trainer) => trainer.firstName + " " + trainer.lastName}
        value={trainers.filter(trainer => selectedTrainerIds.includes(trainer.id))}
        onChange={handleSelect}
        filterSelectedOptions
        freeSolo // Dropdown özelliğini kapatmak için freeSolo ekleniyor
        renderInput={(params) => (
          <TextField
            {...params}
            label="Eğitmen Ekle"
          />
        )}
      />
    </Stack>
  );
}
