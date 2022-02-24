import { useContext } from "react";
import styles from "./Choice.module.css";
import VoteButton from "./VoteButton";
import { PollContext } from "../Poll";

const { REACT_APP_BACKEND_URL } = process.env;

const Choice = (props) => {
  const ctx = useContext(PollContext);
  const onVoteHandler = () => {
      fetch(`${REACT_APP_BACKEND_URL}/vote/${ctx}/${props.choiceId}`)
  };

  return (
    <li className={styles.ListItem}>
      <div className={styles.TopContainer}>
        {props.choiceName}
        <VoteButton onVote={onVoteHandler} />
      </div>
      <div className={styles.BotContainer}>{props.voteCount}</div>
    </li>
  );
};

export default Choice;
