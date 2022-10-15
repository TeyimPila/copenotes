import styles from '../../styles/Home.module.css'
import Card from "../../components/clickableCard";
import Layout from "../../components/layout";

const ConfigDashboard = () => {
  return (
    <Layout title='Welcome home'>
      <h1 className={styles.title}>
        Welcome to the Config Control Panel
      </h1>

      <p className={styles.description}>
        From here, you change application configurations
      </p>

      <p>
        With more time, I would implement controls for configurations such as
      </p>
      <ul>
        <li>Letting and admin modify the interval that messages get sent out in</li>
        <li>Letting and admin pause sending of messages. For example in case we notice a problem with deliveries</li>
        <li>Restart the sending of messages</li>
      </ul>
    </Layout>
  )
}

export default ConfigDashboard

export async function getServerSideProps({ req, res }) {

  return {
    props: { messages: [] },
  }
}

