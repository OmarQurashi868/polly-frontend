import { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Poll.module.css";
import Card from "./UI/Card";
import Navbar from "./UI/Navbar";
import Choice from "./UI/Choice";

const { REACT_APP_BACKEND_URL } = process.env;

const Poll = () => {
  const { id } = useParams();
  const [pollQuestion, setPollQuestion] = useState();
  const [pollName, setPollName] = useState();
  const [errorState, setErrorState] = useState();
  const [pollChoices, setPollChoices] = useState([]);
  const [pollVoteCounts, setPollVoteCounts] = useState([]);
  const [choiceId, setChoiceId] = useState([]);

  useEffect(() => {
    fetch(`${REACT_APP_BACKEND_URL}/${id}`, {
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
        setPollQuestion(res.question);
        setPollName(res.name);
        setPollChoices(res.choices.map(choice => choice.name));
        setPollVoteCounts(res.choices.map(choice => choice.voteCount));
        setChoiceId(res.choices.map(choice => choice._id));
      });
  }, []);

  let finalChoices = [];
  for (let i = 0; i < pollChoices.length; i++) {
    // aaa
    finalChoices.push(<Choice key={choiceId[i]}choiceName={pollChoices[i]} voteCount={pollVoteCounts[i]} />);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className={styles.MotionDiv}
    >
      <Navbar CreateButton />
      <Card className={styles.Container}>
        {errorState ? (
          <div className={styles.ErrorText}>
            Poll with ID <span className={styles.Italics}>{id}</span> was not found!
          </div>
        ) : (
          <Fragment>
            <div>
              <div className={styles.PollQuestion}>{pollQuestion}</div>
              <div className={styles.PollNameText}>
                Asked by <span className={styles.Italics}>{pollName}</span>
              </div>
            </div>
            <div className={styles.ChoicesContainer}>
              {finalChoices}
              </div>
          </Fragment>
        )}
      </Card>
    </motion.div>
  );
};

export default Poll;
