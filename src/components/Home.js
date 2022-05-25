import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import { motion } from "framer-motion";

const { REACT_APP_BACKEND_URL } = process.env;

function Home() {
  let navigate = useNavigate();

  useEffect(() => {
    if (
      window.location.pathname !== "/" &&
      window.location.pathname !== "/newpoll" &&
      !window.location.pathname.startsWith("/poll")
    ) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    console.log("Waking up backend...");
    fetch(`${REACT_APP_BACKEND_URL}/wakeup`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log("Backend is up and running!");
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className={styles.MotionDiv}
    >
      <div className={styles.TitleContainer}>
        <div className={styles.Title}>Polly </div>
        <div className={styles.ArtContainer}>
          <img
            alt="Cute bee"
            className={styles.Image}
            src={require("../files/bigbee.png")}
          />
          Art by Asia
        </div>
      </div>
      <span className={styles.Subtitle}>
        Create instant, customizable polls with ease
      </span>
      <Link to="/newpoll" className={styles.Link}>
        CREATE POLL
      </Link>
      <footer className={styles.Footer}>
        Designed and developed by Omar Qurashi (OmarQurashi868@gmail.com)
      </footer>
      <div className={styles.FooterLink}>
        <a
          href="https://github.com/OmarQurashi868/polly-frontend"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://github.com/OmarQurashi868/polly-frontend
        </a>
      </div>
    </motion.div>
  );
}

export default Home;
