import { useContext, useState, useRef, useEffect } from "react";
import styles from "./NewChoice.module.css";
import { PollContext } from "../Poll";
import { motion } from "framer-motion";

const { REACT_APP_BACKEND_URL } = process.env;

const NewChoice = () => {
  const ctx = useContext(PollContext);
  const [inputState, setInputState] = useState(false);
  const [errorState, setErrorState] = useState();
  const choiceRef = useRef();

  const onButtonClickHandler = () => {
    setInputState(true);
  };

  useEffect(() => {
    if (document.getElementById("newChoice")) {
      document.getElementById("newChoice").scrollIntoView();
    }
  }, [inputState]);

  const onCancelHandler = () => {
    setInputState(false);
  };

  const onAddChoiceHandler = () => {
    if (choiceRef.current.value.length < 1) {
      setErrorState("Choice needs to have at least one character");
    } else {
      const NewChoiceData = {
        pollData: {
          choices: {
            name: choiceRef.current.value,
          },
        },
      };

      fetch(`${REACT_APP_BACKEND_URL}/add/${ctx.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(NewChoiceData),
      })
        .then((res) => {
          if (res.status !== 201) {
            alert(`Voting failed with error code ${res.status}`);
          }
          return res.json();
        })
        .then((res) => {
          choiceRef.current.value = "";
          setInputState(false);
          ctx.onChange();
        });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className={styles.MotionDiv}
    >
      {errorState && <div className={styles.Error}>{errorState}</div>}
      {inputState && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={styles.MotionDiv}
        >
          <div className={styles.TextContainer}>Add new choice:</div>
          <input
            id="newChoice"
            type="text"
            placeholder="New Choice"
            ref={choiceRef}
            autoComplete="off"
            className={styles.NewInput}
            autoFocus
          />
          <div className={styles.ButtonContainer}>
            <button
              onClick={onCancelHandler}
              className={styles.NewChoiceButton}
            >
              Cancel
            </button>
            <button
              onClick={onAddChoiceHandler}
              className={styles.NewChoiceButton}
            >
              Submit
            </button>
          </div>
        </motion.div>
      )}
      {!inputState && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={styles.MotionDiv}
        >
          <button
            onClick={onButtonClickHandler}
            className={styles.NewChoiceButton}
          >
            +
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NewChoice;
