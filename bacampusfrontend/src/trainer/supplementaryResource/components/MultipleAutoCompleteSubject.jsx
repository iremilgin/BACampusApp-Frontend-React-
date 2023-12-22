import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import "../scss/subject-update.scss"

export const MultipleAutoCompleteSubject = ({ subjects, onSubjectIdSelecting }) => {
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

  const getSubjectById = (subjectId) => {
    return subjects.find((subject) => subject.subjectId === subjectId) || { subjectName: '', educationName: '' };
  };

  const handleSelect = (event, value) => {
    setSelectedSubjectIds(value.map((subject) => subject.subjectId));
    onSubjectIdSelecting(value.map((subject) => subject.subjectId));
  };

  const handleRemove = (event, removedValue) => {
    const updatedSelectedSubjectIds = selectedSubjectIds.filter((subjectId) => subjectId !== removedValue.subjectId);
    setSelectedSubjectIds(updatedSelectedSubjectIds);
    onSubjectIdSelecting(updatedSelectedSubjectIds);
  };

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Autocomplete
        multiple
        id="subjects-outlined"
        options={subjects}
        getOptionLabel={(subject) => (subject ? subject.subjectName : '')}
        value={selectedSubjectIds.map(getSubjectById)}
        onChange={handleSelect}
        onRemove={(event, removedValue) => handleRemove(event, removedValue)}
        filterSelectedOptions
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label="Konu Ekle"
            InputProps={{
              ...params.InputProps,
              style: { padding: '10px' },
            }}
          />
        )}
        renderOption={(props, option) => (
          <li {...props}>
            <span>{option.subjectName}</span>
            <span style={{ marginLeft: 30, color: 'gray', fontSize: '10px' }}>{option.educationName}</span>
          </li>
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            
            <Tooltip key={index} title={getSubjectById(option.subjectId).educationName} arrow>
              <div className='select-list-subject' {...getTagProps({ index })} style={{ display: 'flex', alignItems: 'center', padding: '5px', background: '#00000016', marginRight: '5px',borderTopLeftRadius:"16px", borderTopRightRadius:"16px", borderBottomRightRadius:"16px",borderBottomLeftRadius:"16px"}}>
                <span className='subjectName-select' style={{ marginRight: '5px' }}>{getSubjectById(option.subjectId).subjectName}</span>
                <svg onClick={() => handleRemove(null, option)} style={{color: "rgba(0, 0, 0, 0.26)"}} class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiChip-deleteIcon MuiChip-deleteIconMedium MuiChip-deleteIconColorDefault MuiChip-deleteIconFilledColorDefault css-i4bv87-MuiSvgIcon-root subject-hover" focusable="true" aria-hidden="true" viewBox="0 0 24 24" data-testid="CancelIcon"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>
              </div>
            </Tooltip>
          ))
        }
      />
    </Stack>
  );
};
