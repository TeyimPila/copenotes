import styles from '../styles/Home.module.css'
import Card from "../components/clickableCard";
import Layout from "../components/layout";

const Home = () => {
  return (
    <Layout title='Welcome home'>
      <h1 className={styles.title}>
        Welcome to Cope Notes Control Panel
      </h1>

      <p className={styles.description}>
        From here, you have full control. Roll up your sleeves!!
      </p>

      <div className={styles.grid}>
        <Card
          header='Users &rarr;'
          body='View and manage the users in the system'
          link={'/users'}
        />
        <Card
          header='Messages &rarr;'
          body='View and manage the users in the system'
          link={'/messages'}
        />
        <Card
          header='Configuration &rarr;'
          body='View and manage application configurations'
          link='/config'
        />
      </div>
    </Layout>
  )
}

export default Home
