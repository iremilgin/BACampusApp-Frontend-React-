import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

export const MultipleAutoCompleteEducation = ({ educations, onEducationIdSelecting }) => {
  const [selectedEducationIds, setSelectedEducationIds] = useState([]);

  const getEducationById = (educationId) => {
    return educations.find((education) => education.id === educationId) || null;
  };

  const handleSelect = (event, value) => {
    setSelectedEducationIds(value.map((education) => education.id));
    onEducationIdSelecting(value.map((education) => education.id));
  };

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Autocomplete
        multiple
        id="educations-outlined"
        options={educations}
        getOptionLabel={(education) => education.name}
        value={selectedEducationIds.map(getEducationById)} // Değişiklik burada
        onChange={handleSelect}
        filterSelectedOptions
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label="Eğitim Ekle"
          />
        )}
      />
    </Stack>
  );
};
