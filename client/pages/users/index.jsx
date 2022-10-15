import styles from '../../styles/Home.module.css'
import Layout from "../../components/layout";
import axios from "../../config/axios";
import {Avatar, Fab, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import CommentIcon from '@mui/icons-material/Comment';
import AddIcon from '@mui/icons-material/Add';
import NewUserDialog from "../../components/newUserDialog";
import {useState} from "react";

const UserDashboard = ({ users: existingUsers }) => {
  const [users, setUsers] = useState(existingUsers)
  const [values, setValues] = useState({ email: '', locale: 'en' })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen)
  }

  const createNewUser = async () => {
    setLoading(true)

    try {
      const { data = {}, } = await axios.post('/users', values)

      if (data.user?._id) {
        setUsers([...users, data.user])
      }

    } catch (e) {
      setErrorMessage(e?.response?.data?.error)
      setLoading(false)
      return
    }
    toggleDialog()
  }

  const handleFormChange = ({ name, value }) => {
    setValues({ ...values, [name]: value })
  }

  return (
    <Layout title='Welcome home'>
      <h1 className={styles.title}>
        Welcome Users Control Panel
      </h1>

      <p className={styles.description}>
        From here, can can manage users!!
      </p>

      <NewUserDialog
        isOpen={isDialogOpen}
        onClose={toggleDialog}
        onSubmit={createNewUser}
        onChange={handleFormChange}
        values={values}
        error={errorMessage}
      />

      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{ width: '100%', maxWidth: '30%', bgcolor: 'background.paper' }}
      >

        <Grid
          container
          direction="row-reverse"
          sx={{ width: '100%' }}
        >
          <Fab color='primary' variant="extended" onClick={toggleDialog}>
            <AddIcon sx={{ mr: 1 }}/>
            New User
          </Fab>
        </Grid>

        <List sx={{ width: '100%', marginTop: 2 }}>
          {users.map(({ email, _id }) => {
            return (
              <ListItem
                key={_id}
                secondaryAction={
                  <IconButton edge="end" aria-label="comments">
                    <CommentIcon/>
                  </IconButton>
                }
                disablePadding
              >
                <ListItemAvatar>
                  <Avatar/>
                </ListItemAvatar>
                <ListItemText primary={email}/>
              </ListItem>
            );
          })}
        </List>
      </Grid>


    </Layout>
  )
}

export default UserDashboard

export async function getServerSideProps({ req, res }) {

  const { data = [] } = await axios.get('/users') || {}
  // TODO: Add better error handling
  return {
    props: data,
  }
}

