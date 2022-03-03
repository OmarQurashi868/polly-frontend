import {
  useEffect,
  useState,
  Fragment,
  createContext,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./AdminPoll.module.css";
import Card from "./UI/Card";
import Navbar from "./UI/Navbar";
import AdminChoicesList from "./Admin/AdminChoicesList";
import AdminNewChoice from "./Admin/AdminNewChoice";
import Timer from "./Utils/Timer";

const { REACT_APP_BACKEND_URL } = process.env;

export const AdminPollContext = createContext();

const Poll = () => {
  const { id } = useParams();
  const [pollData, setPollData] = useState({
    question: "question",
    name: "name",
    canAddChoices: false,
    canMultipleVote: false,
    isStarted: true,
    isEnded: false,
    startDate: new Date(),
    isActive: true,
    choices: [],
  });
  const [errorState, setErrorState] = useState(null);
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
        setPollData((prevData) => {
          let newData = { ...prevData };
          newData.question = res.question;
          newData.name = res.name;
          newData.canAddChoices = res.canAddChoices;
          newData.canMultipleVote = res.canMultipleVote;
          newData.isStarted = res.isStarted;
          newData.isEnded = res.isEnded;
          newData.startDate = new Date(res.startDate);
          if (res.endDate) newData.endDate = new Date(res.endDate);
          newData.isActive = res.isStarted && !res.isEnded;
          newData.choices = res.choices;
          return newData;
        });
      });
  }, [id, onChangeHandler]);

  const ContextPackage = {
    id: id,
    onChange: onChangeHandler,
    isActive: pollData.isActive,
  };

  let timerData = {
    isStarted: pollData.isStarted,
    isEnded: pollData.isEnded,
    startDate: pollData.startDate,
  };
  if (pollData.endDate) timerData.endDate = pollData.endDate;

  let isTimed = false;

  if (!pollData.isStarted || pollData.endDate) {
    isTimed = true;
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
            Poll with ID <span className={styles.Italics}>{id}</span> was not
            found!
          </div>
        ) : (
          <Fragment>
            <div className={styles.PollInfoContainer}>
              {isTimed && <Timer timerData={timerData} />}
              <div className={styles.SmallText}>Viewing poll as admin</div>
              <div className={styles.PollQuestion}>{pollData.question}</div>
              <div className={styles.PollNameText}>
                {pollData.name && (
                  <Fragment>
                    Asked by{" "}
                    <span className={styles.Italics}>{pollData.name}</span>
                  </Fragment>
                )}
              </div>
            </div>
            <AdminPollContext.Provider value={ContextPackage}>
              <AdminChoicesList
                pollChoices={pollData.choices}
                canMultipleVote={pollData.canMultipleVote}
              />
              {pollData.isActive && <AdminNewChoice />}
            </AdminPollContext.Provider>
          </Fragment>
        )}
      </Card>
    </motion.div>
  );
};

export default Poll;