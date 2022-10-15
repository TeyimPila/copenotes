import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Box, FormControl, FormHelperText, InputLabel, MenuItem, Select} from "@mui/material";

const NewUserDialog = ({ isOpen, onClose, onSubmit, onChange, values, error = '' }) => {

  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} fullWidth>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '29ch' },
            }}
            style={{
              flex: 1,
              justifyContent: 'space-between'
            }}
            noValidate
          >
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              value={values.email}
              variant="outlined"
              onChange={(e) => onChange({ name: 'email', value: e.target.value })}
            />
            <FormControl sx={{ mt: 2, minWidth: 10 }}>
              <InputLabel htmlFor="language">Language</InputLabel>
              <Select
                defaultValue={'en'}
                // autoFocus
                value={values.locale}
                onChange={(e) => onChange({ name: 'locale', value: e.target.value })}
                label="maxWidth"
                inputProps={{
                  name: 'language',
                  id: 'language',
                }}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
              </Select>
            </FormControl>
          {error?.trim() && <FormHelperText error>{error}</FormHelperText>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default NewUserDialog