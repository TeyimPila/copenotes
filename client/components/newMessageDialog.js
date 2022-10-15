import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Box, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextareaAutosize} from "@mui/material";

const NewMessageDialog = ({ isOpen, onClose, onSubmit, onChange, values, error = '' }) => {

  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} fullWidth>
        <DialogTitle>Create New Message</DialogTitle>
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
            <TextareaAutosize
              maxRows={4}
              minRows={4}
              aria-label="new message"
              placeholder="New Message"
              defaultValue=""
              style={{ width: '100%' }}
              onChange={(e) => onChange({ name: 'message', value: e.target.value })}
            />

            <FormControl sx={{ mt: 2, minWidth: 10 }}>
              <InputLabel htmlFor="language">Language</InputLabel>
              <Select
                defaultValue={'en'}
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

export default NewMessageDialog