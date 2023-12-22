import  {React,useState} from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';


export const MultipleAutoComplete = ({ students, onStudentIdSelecting }) => {
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const handleSelect = (event, value) => {
    setSelectedStudentIds(value.map(student => student.id));
    onStudentIdSelecting(value.map(student => student.id));
  };

  return (
     <Stack spacing={3} sx={{ width: '90%' }}>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={students}
        getOptionLabel={(student) => student.firstName + " " + student.lastName}
        value={students.filter(student => selectedStudentIds.includes(student.id))}
        onChange={handleSelect}
        filterSelectedOptions
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label="Öğrenci Ekle"
          />
        )}
      />
    </Stack>
  );
}
