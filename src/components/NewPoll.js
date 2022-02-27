import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./NewPoll.module.css";
import Card from "./UI/Card";
import Navbar from "./UI/Navbar";
import Button from "./UI/Button";

const { REACT_APP_BACKEND_URL } = process.env;

const NewPoll = () => {
  let navigate = useNavigate();
  const [choices, setChoices] = useState([
    {
      key: 0,
      id: "choice0",
      choiceName: "choice0",
    },
  ]);
  const [choiceExists, setChoiceExists] = useState(false);
  const [errorState, setErrorState] = useState([]);
  const questionError = {
    code: 1,
    message: "Question must be 3 characters or more",
  };
  const choiceError = {
    code: 2,
    message: "You need at least one choice",
  };

  let statusCode;

  const onFormSubmit = (event) => {
    event.preventDefault();
    if (event.target.question.value.length < 3 || !choiceExists) {
      if (event.target.question.value.length < 3) {
        setErrorState((prevErrors) => {
          let questionErrAlreadyExists = false;
          prevErrors.forEach((e) => {
            if (e.code === 1) {
              questionErrAlreadyExists = true;
            }
          });
          let updatedErrors = [...prevErrors];
          if (!questionErrAlreadyExists) {
            updatedErrors.push(questionError);
          }
          return updatedErrors;
        });
      }
      if (!choiceExists) {
        setErrorState((prevErrors) => {
          let choiceErrAlreadyExists = false;
          prevErrors.forEach((e) => {
            if (e.code === 2) {
              choiceErrAlreadyExists = true;
            }
          });
          let updatedErrors = [...prevErrors];
          if (!choiceErrAlreadyExists) {
            updatedErrors.push(choiceError);
          }
          return updatedErrors;
        });
      }
    } else {
      setErrorState();

      const choicesData = [];

      for (let i = 0; i < choices.length; i++) {
        if (event.target[i + 2].value.length > 0) {
          choicesData.push({
            name: event.target[i + 2].value,
          });
        }
      }

      let pollData = {
        pollData: {
          question: event.target.question.value,
          name: event.target.name.value,
          choices: choicesData,
        },
      };

      const canAddChoicesOjb = document.getElementById("canAddChoices");
      if (canAddChoicesOjb) {
        pollData.pollData.canAddChoices = canAddChoicesOjb.checked;
      }
      const canMultipleVoteOjb = document.getElementById("canMultipleVote");
      if (canMultipleVoteOjb) {
       pollData.pollData.canMultipleVote = canMultipleVoteOjb.checked;
      }

      console.log(pollData);

      fetch(REACT_APP_BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pollData),
      })
        .then((res) => {
          statusCode = res.status;
          return res.json();
        })
        .then((res) => {
          if (statusCode === 201) {
            console.log("Poll added successfully...");
            navigate(`/poll/${res._id}`);
          } else {
            console.log(res);
          }
        });
    }
  };

  const questionChangeHandler = (event) => {
    if (event.target.value.length >= 3) {
      setErrorState((prevErrors) => {
        let updatedErrors = [...prevErrors];
        for (let i = 0; i < prevErrors.length; i++) {
          if (prevErrors[i].code === 1) {
            updatedErrors.splice(i, 1);
          }
        }
        return updatedErrors;
      });
    }
  };

  const choiceChangeHandler = (event) => {
    if (event.target.id === "choice0") {
      if (event.target.value.length > 0) {
        if (!choiceExists) {
          setChoiceExists(true);
          setErrorState((prevErrors) => {
            let updatedErrors = [...prevErrors];
            for (let i = 0; i < prevErrors.length; i++) {
              if (prevErrors[i].code === 2) {
                updatedErrors.splice(i, 1);
              }
            }
            return updatedErrors;
          });
        }
      } else {
        setChoiceExists(false);
      }
    }

    if (event.target.id === `choice${choices.length - 1}`) {
      setChoices((prevChoices) => {
        const number = prevChoices.length;
        let updatedChoices = [...prevChoices];
        updatedChoices.push({
          key: number,
          id: `choice${number}`,
          choiceName: `choice${number}`,
        });
        return updatedChoices;
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
      <Navbar />
      <Card>
        <form className={styles.Form} onSubmit={onFormSubmit} id="pollForm">
          {errorState &&
            errorState.map((e) => {
              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={styles.Error}
                  key={e.code}
                >
                  {e.message}
                </motion.div>
              );
            })}
          <div className={styles.FormHeader}>New poll</div>
          <div className={styles.Container}>
            <label>Question:</label>
            <input
              id="question"
              name="question"
              type="text"
              placeholder="What do you want to ask?"
              autoComplete="off"
              onChange={questionChangeHandler}
            />
          </div>
          <div className={styles.Container}>
            <label>Name:</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="(optional)"
              autoComplete="off"
            />
          </div>
          <div className={styles.Container}>
            Choices:
            {choices.map((e) => {
              return (
                <input
                  key={e.key}
                  id={e.id}
                  name={e.choiceName}
                  type="text"
                  autoComplete="off"
                  placeholder="Choice"
                  onChange={choiceChangeHandler}
                />
              );
            })}
          </div>
          <Button type="submit" className={styles.Button}>
            Create
          </Button>
        </form>
      </Card>
      <Card>
        <div className={styles.OptionsForm} id="optionsForm">
          <div className={styles.FormHeader}>Options</div>
          <div className={styles.OptionContainer}>
            <input type="checkbox" id="canAddChoices" name="canAddChoices" />
            Users can add new choices
          </div>
          <div className={styles.OptionContainer}>
            <input
              type="checkbox"
              id="canMultipleVote"
              name="canMultipleVote"
            />
            Users can vote on multiple choices
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default NewPoll;
