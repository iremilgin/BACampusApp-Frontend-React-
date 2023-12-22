import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

export const MultipleAutoCompleteEducationUpdate = ({ educations, onEducationIdSelecting, selectedEducations }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    const selectedEducationItems = educations.filter(education => selectedEducations.includes(education.id));
    setSelectedOptions(selectedEducationItems);
  }, [educations, selectedEducations]);

  const handleSelect = (event, value) => {
    setSelectedOptions(value);
    const selectedEducationIds = value.map(education => education.id);
    onEducationIdSelecting(selectedEducationIds);
  };

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Autocomplete
        multiple
        id="educations-outlined"
        options={educations}
        getOptionLabel={(education) => education.name}
        value={selectedOptions}
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
