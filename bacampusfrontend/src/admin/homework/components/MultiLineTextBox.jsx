import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


export const MultiLineTextBox = () => {
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
         <div>
         <TextField
          id="outlined-multiline-static"
          label="Açıklama"
          multiline
          rows={4}
          
        />
         </div>
    </Box>
  )
}
