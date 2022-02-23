import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./NewPoll.module.css";
import Card from "./UI/Card";
import Navbar from "./UI/Navbar";
import Button from "./UI/Button";

const { REACT_APP_BACKEND_URL } = process.env;

const NewPoll = () => {
  let navigate = useNavigate();
  const questionRef = useRef();
  const [errorState, setErrorState] = useState(null);
  const [choiceExists, setChoiceExists] = useState(false);
  const [choiceCount, setChoiceCount] = useState(1);
  const [choiceInput] = useState([]);
  let choices = [];
  let statusCode;

  const onFormSubmit = (event) => {
    event.preventDefault();
    if (questionRef.current.value.length < 3) {
      setErrorState("Question must be 3 characters or more");
    } else if (!choiceExists) {
      setErrorState("You need at least one choice");
    } else {
      setErrorState(null);

      const choicesData = [];

      // choices.forEach((choice) => {
      //   console.log(event.target[3]);
      //   choicesData.push({
      //     name: choiceInput[choice.key],
      //   });
      // });

      for (let i = 0; i < choices.length; i++) {
        if (event.target[i + 2].value.length > 0) {
          choicesData.push({
            name: event.target[i + 2].value,
          });
        }
      }

      const pollData = {
        pollData: {
          question: questionRef.current.value,
          name: event.target.name.value,
          choices: choicesData,
        },
      };

      fetch(REACT_APP_BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pollData),
      })
        .then((res) => {
          statusCode = res.status;
          return res.json()
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

  const choiceChangeHandler = (event) => {
    if (!choiceExists) setChoiceExists(true);

    if (event.target.id === `choice${choiceCount - 1}`) {
      setChoiceCount(choiceCount + 1);
    }

    // if (event.target.id === ("choice" + String(choices.length))) {
    //   setChoices((prevChoices) => {
    //     const choiceId = "choice" + String(choices.length + 1);
    //     const updatedChoices = [...prevChoices];
    //     updatedChoices.push(
    //       <input
    //         key={choices.length}
    //         id={choiceId}
    //         type="text"
    //         autoComplete="off"
    //         placeholder="Choice"
    //         onChange={choiceChangeHandler}
    //       />
    //     );
    //     return updatedChoices;
    //   });
    //   console.log(choices.length)
    // }
  };

  // const [choices, setChoices] = useState([
  //   <input
  //     key="0"
  //     id="choice1"
  //     type="text"
  //     autoComplete="off"
  //     placeholder="Choice"
  //     onChange={choiceChangeHandler}
  //   />,
  // ]);

  for (let i = 0; i < choiceCount; i++) {
    choices.push(
      <input
        key={i}
        id={`choice${i}`}
        name={`choice${i}`}
        type="text"
        autoComplete="off"
        placeholder="Choice"
        onChange={choiceChangeHandler}
        value={choiceInput[i]}
      />
    );
  }

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
        <form className={styles.Form} onSubmit={onFormSubmit}>
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
          <div className={styles.Container}>
            <label>Question:</label>
            <input
              id="question"
              type="text"
              placeholder="What do you want to ask?"
              ref={questionRef}
              autoComplete="off"
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
            {choices}
          </div>

          <Button type="submit" className={styles.Button}>
            Create
          </Button>
        </form>
      </Card>
      <Card>Options</Card>
    </motion.div>
  );
};

export default NewPoll;
