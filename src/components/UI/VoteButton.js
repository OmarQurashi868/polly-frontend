import { useState, useEffect, useCallback } from "react";
import Cookies from "universal-cookie";
import styles from "./VoteButton.module.css";
import { motion } from "framer-motion";

const VoteButton = (props) => {
  const [voteState, setVoteState] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const onChangeHandler = useCallback(() => {
    isChanged ? setIsChanged(false) : setIsChanged(true);
  }, [isChanged]);

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      onChangeHandler();
    }, 5000);
    return () => {
      clearInterval(refreshInterval);
    };
  }, [onChangeHandler]);

  // Check if client already voted on this choice
  useEffect(() => {
    const cookies = new Cookies();
    if (cookies.get(props.pollId) != null) {
      if (cookies.get(props.pollId)[props.choiceId] === true) {
        setVoteState(true);
      } else {
        setVoteState(false);
      }
    }
  }, [props.pollId, props.choiceId, isChanged]);

  const voteHandler = () => {
    setVoteState(true);
    props.onVote();
  };

  const unVoteHandler = () => {
    setVoteState(false);
    props.onUnVote();
  };

  let content;

  if (!props.isActive) {
    content = null;
  } else if (voteState) {
    content = (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className={styles.MotionDiv}
      >
        <button onClick={unVoteHandler} className={styles.UnVoteButton}>
          -
        </button>
      </motion.div>
    );
  } else {
    content = (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className={styles.MotionDiv}
      >
        <button onClick={voteHandler} className={styles.VoteButton}>
          +
        </button>
      </motion.div>
    );
  }

  // if (!voteState) {
  //   content = (
  //     <button onClick={voteHandler} className={styles.VoteButton}>
  //       +
  //     </button>
  //   );
  // } else {
  //   content = (
  //     <button onClick={unVoteHandler} className={styles.UnVoteButton}>
  //       -
  //     </button>
  //   );
  // }

  return content;
};

export default VoteButton;
