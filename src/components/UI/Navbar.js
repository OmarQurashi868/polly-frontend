import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";

const Navbar = (props) => {
  return (
    <div className={styles.Navbar}>
      <Link to="/" className={styles.Link}>
        Polly
      </Link>
      {props.CreateButton && (
        <Link to="/newpoll" className={styles.Button}>
          NEW POLL
        </Link>
      )}
    </div>
  );
};

export default Navbar;
