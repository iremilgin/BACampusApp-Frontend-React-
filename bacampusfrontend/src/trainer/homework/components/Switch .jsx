import {React, useState}  from 'react';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export const ControlledSwitches = ({onSwitchChange}) => {
  const [checked, setChecked] = useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    onSwitchChange(event.target.checked);
  };
  
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography color={!checked?"red":"gray"}>Öğrenciye Ödev Oluştur</Typography>
          <Switch
            checked={checked}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
          />
       <Typography color={checked?"red":"gray"}>Sınıfa Ödev Oluştur</Typography> 
    </Stack>
  );
};
