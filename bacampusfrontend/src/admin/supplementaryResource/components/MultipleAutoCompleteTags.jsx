import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

export const MultipleAutoComplete = ({ tags, onTagIdSelecting }) => {
  const [selectedTagIds, setSelectedTagIds] = useState([]);

  const getTagById = (tagId) => {
    return tags.find((tag) => tag.id === tagId) || null;
  };

  const handleSelect = (event, value) => {
    setSelectedTagIds(value.map((tag) => tag.id));
    onTagIdSelecting(value.map((tag) => tag.id));
  };

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={tags}
        getOptionLabel={(tag) => tag.name}
        value={selectedTagIds.map(getTagById)} // Değişiklik burada
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
