import { useContext, useState, useRef, useEffect } from "react";
import styles from "./AdminNewChoice.module.css";
import { AdminPollContext } from "../AdminPoll";
import { motion } from "framer-motion";

const { REACT_APP_BACKEND_URL } = process.env;

const NewChoice = () => {
  const ctx = useContext(AdminPollContext);
  const [inputState, setInputState] = useState(false);
  const [errorState, setErrorState] = useState();
  const choiceRef = useRef();
  const [isLoading, setIsLoading] = useState(false)
  let buttonStyles = `${styles.NewChoiceButton}`;

  const onButtonClickHandler = () => {
    setInputState(true);
  };

  const inputChangeHandler = () => {
    if (choiceRef.current.value.length > 0) {
      if (errorState) {
        setErrorState();
      }
    }
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

      let alreadyExists = false;

      buttonStyles = `${styles.NewChoiceButton} ${styles.Disabled}`
      setIsLoading(true);

      fetch(`${REACT_APP_BACKEND_URL}/${ctx.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status !== 200) {
            setErrorState("Poll not found");
          }
          return res.json();
        })
        .then((res) => {
          let choices = res.choices;
          for (const choice of choices) {
            if (choice.name === choiceRef.current.value) {
              alreadyExists = true;
              setErrorState("Choice already exists");
            }
          }
        })
        .then(() => {
          if (!alreadyExists) {
            fetch(`${REACT_APP_BACKEND_URL}/add/${ctx.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(NewChoiceData),
            })
              .then((res) => {
                if (res.status !== 201) {
                  alert(`Operation failed with error code ${res.status}`);
                }
                return res.json();
              })
              .then((res) => {
                choiceRef.current.value = "";
                buttonStyles = `${styles.NewChoiceButton}`
                setIsLoading(false);
                setInputState(false);
                setErrorState();
                ctx.onChange();
              });
          }
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
      {errorState && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={styles.Error}
        >
          {errorState}
        </motion.div>
      )}
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
            onChange={inputChangeHandler}
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
              className={buttonStyles}
              id="submitButton"
            >
              {!isLoading ? "Submit" : <div className={styles.Loader} />}
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
