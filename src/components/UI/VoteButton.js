import { useState, useEffect } from "react";
import styles from "./VoteButton.module.css";

const VoteButton = (props) => {
  const [voteState, setVoteState] = useState(false);

  // Check if client already voted on this choice
  useEffect(() => {
    if (JSON.parse(localStorage.getItem(props.pollId)) != null) {
      if (
        JSON.parse(localStorage.getItem(props.pollId))[props.choiceId] === true
      ) {
        setVoteState(true);
      } else {
        setVoteState(false);
      }
    }
  }, [props.pollId, props.choiceId]);

  const voteHandler = () => {
    setVoteState(true);
    props.onVote();
  };

  const unVoteHandler = () => {
    setVoteState(false);
    props.onUnVote();
  };

  let content;

  if (!voteState) {
    content = (
      <button onClick={voteHandler} className={styles.VoteButton}>
        +
      </button>
    );
  } else {
    content = (
      <button onClick={unVoteHandler} className={styles.UnVoteButton}>
        -
      </button>
    );
  }

  return content;
};

export default VoteButton;
