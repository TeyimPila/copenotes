import styles from '../../styles/Home.module.css'
import Layout from "../../components/layout";
import {clientInstance, ssInstance} from "../../config/axios";
import {Avatar, Fab, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import CommentIcon from '@mui/icons-material/Comment';
import AddIcon from '@mui/icons-material/Add';
import NewMessageDialog from "../../components/newMessageDialog";
import {useState} from "react";

const MessageDashboard = ({ messages: existingMessages }) => {
  const [messages, setMessages] = useState(existingMessages)
  const [values, setValues] = useState({ message: '', locale: 'en' })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen)
  }

  const createNewMessage = async () => {
    setLoading(true)

    try {
      const { data = {}, } = await clientInstance.post('/messages', values)

      if (data.message?._id) {
        setMessages([...messages, data.message])
      }

    } catch (e) {
      console.error(e)
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
        Welcome Messages Control Panel
      </h1>

      <p className={styles.description}>
        From here, can can manage messages!!
      </p>

      <NewMessageDialog
        isOpen={isDialogOpen}
        onClose={toggleDialog}
        onSubmit={createNewMessage}
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
            New Message
          </Fab>
        </Grid>

        <List sx={{ width: '100%', marginTop: 2 }}>
          {messages.map(({ message, _id }) => {
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
                <ListItemText primary={message}/>
              </ListItem>
            );
          })}
        </List>
      </Grid>
    </Layout>
  )
}

export default MessageDashboard

export async function getServerSideProps({ req, res }) {

  const { data = [] } = await ssInstance.get('/messages') || {}

  // TODO: Add better error handling

  return {
    props: data,
  }
}

