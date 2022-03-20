import { useContext } from "react";
import styles from "./AdminChoice.module.css";
import DeleteButton from "./DeleteButton";
import { AdminPollContext } from "../AdminPoll";

const Choice = (props) => {
  const ctx = useContext(AdminPollContext);
  let gapValue;

  if (props.voteCount === 0) {
    gapValue = "0";
  }

  let voteBarFill;
  if (props.highestVote > 0) {
    voteBarFill = Math.round((props.voteCount / props.highestVote) * 100) + "%";
  } else {
    voteBarFill = "0%";
  }

  return (
    <li className={styles.ListItem}>
      <div className={styles.TopContainer}>
        <div className={styles.NameContainer}>{props.choiceName}</div>
        {!props.isLastChoice && (
          <DeleteButton pollId={ctx.id} choiceId={props.choiceId} onChange={ctx.onChange}/>
        )}
      </div>
      <div className={styles.BotContainer} style={{ gap: gapValue }}>
        <div className={styles.VoteBar} style={{ width: voteBarFill }} />
        <div className={styles.VoteCountContainer}>{props.voteCount}</div>
      </div>
    </li>
  );
};

export default Choice;
