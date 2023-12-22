import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

export const MultipleAutoComplete = ({ tags, onTagIdSelecting, selectedTags }) => {
  const handleSelect = (event, value) => {
    const selectedTagIds = value.map((tag) => tag.id);
    onTagIdSelecting(selectedTagIds);
  };

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={tags}
        getOptionLabel={(tag) => tag.name}
        value={tags.filter((tag) => selectedTags.includes(tag.id))}
        onChange={handleSelect}
        filterSelectedOptions
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label="Etiket Ekle"
          />
        )}
      />
    </Stack>
  );
};