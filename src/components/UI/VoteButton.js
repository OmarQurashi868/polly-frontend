import styles from "./VoteButton.module.css";

const VoteButton = (props) => {
  return (
    <button onClick={props.onVote} className={styles.VoteButton}>
      +
    </button>
  );
};

export default VoteButton;
