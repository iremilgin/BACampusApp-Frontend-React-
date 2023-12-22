import { React, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Stack } from "@mui/material";

export const ComboBox = ({ classrooms, onClassroomIdChange }) => {
  const [value, setValue] = useState(
    classrooms.map((classroom) => classroom.name)[0]
  );
  const [inputValue, setInputValue] = useState("");

  return (
     <Stack spacing={3} sx={{ width: 600 }}>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          if (newValue) {
            const selectedClassroom = classrooms.find(
              (classroom) => classroom.name === newValue
            );
            onClassroomIdChange(selectedClassroom.id);
          }
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        id="id"
        options={classrooms.map((classroom) => classroom.name)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Sınıflar" />}
      />
    </Stack>
  );
};
