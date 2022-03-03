import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { motion } from "framer-motion";

function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className={styles.MotionDiv}
    >
      <span className={styles.Title}>
        Polly{" "}
        <img alt="Cute bee" src={require("../files/bigbee.png")} />
      </span>
      <span className={styles.Subtitle}>
        Create instant, customizable polls right now
      </span>

      <Link to="/newpoll" className={styles.Link}>
        CREATE POLL
      </Link>

      <footer className={styles.Footer}>
        Designed and developed by Omar Qurashi (OmarQurashi868@gmail.com)
      </footer>
    </motion.div>
  );
}

export default Home;
