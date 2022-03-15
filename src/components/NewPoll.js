import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import styles from "./NewPoll.module.css";
import Card from "./UI/Card";
import Navbar from "./UI/Navbar";
import Button from "./UI/Button";

const { REACT_APP_BACKEND_URL } = process.env;

const NewPoll = () => {
  let navigate = useNavigate();
  const cookies = new Cookies();

  const [choices, setChoices] = useState([
    {
      key: 0,
      id: "choice0",
      choiceName: "choice0",
    },
  ]);
  const [choiceExists, setChoiceExists] = useState(false);

  const [questionError, setQuestionError] = useState([]);
  const questionErrors = [
    {
      code: 1,
      message: "Question must be 3 characters or more",
    },
    {
      code: 2,
      message: "You need at least one choice",
    },
  ];

  const [dateError, setDateError] = useState([]);
  const dateErrors = [
    {
      code: 1,
      message: "Dates cannot be left empty for selected properties",
    },
    {
      code: 2,
      message: "Dates cannot be set to before the current time",
    },
    {
      code: 3,
      message: "End date cannot be before start date",
    },
  ];

  let statusCode;

  const addQuestionError = (errCode) => {
    setQuestionError((prevErrors) => {
      let questionErrAlreadyExists = false;

      prevErrors.forEach((e) => {
        if (e.code === errCode) {
          questionErrAlreadyExists = true;
        }
      });

      let updatedErrors = [...prevErrors];
      let errorObj = {};
      if (!questionErrAlreadyExists) {
        for (const error of questionErrors) {
          if (error.code === errCode) {
            errorObj = error;
          }
        }
        if (errorObj) updatedErrors.push(errorObj);
      }

      return updatedErrors;
    });
  };

  const addOptionError = (errCode) => {
    setDateError((prevErrors) => {
      let dateErrAlreadyExists = false;

      prevErrors.forEach((e) => {
        if (e.code === errCode) {
          dateErrAlreadyExists = true;
        }
      });

      let updatedErrors = [...prevErrors];
      let errorObj = {};
      if (!dateErrAlreadyExists) {
        for (const error of dateErrors) {
          if (error.code === errCode) {
            errorObj = error;
          }
        }
        if (errorObj) updatedErrors.push(errorObj);
      }

      return updatedErrors;
    });
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
    const startAtObj = document.getElementById("startAt");
    const endAtObj = document.getElementById("endAt");
    let passedErrorCheck = true;

    // Check question and choice
    if (event.target.question.value.length < 3 || !choiceExists) {
      passedErrorCheck = false;
      if (event.target.question.value.length < 3) {
        addQuestionError(1);
      }
      if (!choiceExists) {
        addQuestionError(2);
      }
    }

    // Check start date
    if (startAtObj && startAtObj.checked) {
      if (document.getElementById("startDate").value.length < 1) {
        // setOptionError("Dates cannot be left empty for selected properties");
        passedErrorCheck = false;
        addOptionError(1);
      } else if (
        new Date(document.getElementById("startDate").value)
          .toISOString()
          .substring(0, 16) < new Date().toISOString().substring(0, 16)
      ) {
        // setOptionError("Dates cannot be set to before the current time");
        passedErrorCheck = false;
        addOptionError(2);
      }
    }

    // Check end date
    if (endAtObj && endAtObj.checked) {
      if (document.getElementById("endDate").value.length < 1) {
        // setOptionError("Dates cannot be left empty for selected properties");
        passedErrorCheck = false;
        addOptionError(1);
      } else if (
        new Date(document.getElementById("endDate").value)
          .toISOString()
          .substring(0, 16) < new Date().toISOString().substring(0, 16)
      ) {
        // setOptionError("Dates cannot be set to before the current time");
        passedErrorCheck = false;
        addOptionError(2);
      } else if (
        document.getElementById("startDate").value.length > 1 &&
        new Date(document.getElementById("endDate").value)
          .toISOString()
          .substring(0, 16) <
          new Date(document.getElementById("startDate").value)
            .toISOString()
            .substring(0, 16)
      ) {
        // setOptionError("End date cannot be before start date");
        passedErrorCheck = false;
        addOptionError(3);
      }
    }

    // Create poll
    if (passedErrorCheck) {
      setQuestionError([]);

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

      if (startAtObj && startAtObj.checked) {
        pollData.pollData.startDate = new Date(
          document.getElementById("startDate").value
        );
      }

      if (endAtObj && endAtObj.checked) {
        pollData.pollData.endDate = new Date(
          document.getElementById("endDate").value
        );
      }

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
          const expiryDate = new Date();
          expiryDate.setMonth(expiryDate.getMonth() + 2);
          cookies.set(`${res._id}-adminLink`, res.adminLink, {
            path: "/",
            expires: expiryDate,
            sameSite: "strict",
          });

          if (statusCode === 201) {
            navigate(`/poll/${res._id}`);
          } else {
            console.log(res);
          }
        });
    }
  };

  const questionChangeHandler = (event) => {
    if (event.target.value.length >= 3) {
      setQuestionError((prevErrors) => {
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
          setQuestionError((prevErrors) => {
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

  const dateChangeHandler = () => {
    setDateError([]);
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
          <div className={styles.FormHeader}>New poll</div>
          <div>
            {questionError &&
              questionError.map((e) => {
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
          </div>
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  key={e.key}
                >
                  <input
                    key={e.key}
                    id={e.id}
                    name={e.choiceName}
                    type="text"
                    autoComplete="off"
                    placeholder="Choice"
                    onChange={choiceChangeHandler}
                  />
                </motion.div>
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
          {dateError && (
            <div className={styles.Error}>
              {dateError.map((e) => {
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
            </div>
          )}
          <div className={styles.OptionContainer}>
            <input
              type="checkbox"
              id="canAddChoices"
              name="canAddChoices"
              className={styles.CheckBox}
            />
            Users can add new choices
          </div>
          <div className={styles.OptionContainer}>
            <input
              type="checkbox"
              id="canMultipleVote"
              name="canMultipleVote"
              className={styles.CheckBox}
            />
            Users can vote on multiple choices
          </div>
          <div className={styles.OptionContainer}>
            <input
              type="checkbox"
              id="startAt"
              name="startAt"
              className={styles.CheckBox}
            />
            Start at
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              onChange={dateChangeHandler}
            />
          </div>
          <div className={styles.OptionContainer}>
            <input
              type="checkbox"
              id="endAt"
              name="endAt"
              className={styles.CheckBox}
            />
            End at
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              onChange={dateChangeHandler}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default NewPoll;
