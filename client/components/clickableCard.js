import styles from "../styles/Home.module.css";

const Card = ({header, body, link = '#'}) => {
   return (
     <a href={link} className={styles.card}>
       <h2>{header}</h2>
       <p>{body}</p>
     </a>
   )
}

export default Card