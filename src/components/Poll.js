import {
  useEffect,
  useState,
  Fragment,
  createContext,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Poll.module.css";
import Card from "./UI/Card";
import Navbar from "./UI/Navbar";
import ChoicesList from "./Choices/ChoicesList";
import NewChoice from "./Choices/NewChoice";

const { REACT_APP_BACKEND_URL } = process.env;

export const PollContext = createContext();

const Poll = () => {
  const { id } = useParams();
  const [pollChoices, setPollChoices] = useState([]);
  const [pollData, setPollData] = useState({});
  const [canAddChoices, setCanAddChoices] = useState(false);
  const [canMultipleVote, setCanMultipleVote] = useState(false);
  const [isStarted, setIsStarted] = useState(true);
  const [isEnded, setIsEnded] = useState(false);
  const [startDate, setStartDate] = useState(Date.now());
  const [endDate, setEndDate] = useState();
  const [isActive, setIsActive] = useState(true);

  const [errorState, setErrorState] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

  const onChangeHandler = useCallback(() => {
    isChanged ? setIsChanged(false) : setIsChanged(true);
  }, [isChanged]);

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
          newData["question"] = res.question;
          newData["name"] = res.name;
          return newData;
        });
        setStartDate(new Date(res.startDate));
        if (res.endDate) setEndDate(new Date(res.endDate));
        setIsStarted(res.isStarted);
        setIsEnded(res.isEnded);
        setIsActive(res.isStarted && !res.isEnded);
        setCanAddChoices(res.canAddChoices);
        setCanMultipleVote(res.canMultipleVote);
        setPollChoices(res.choices);
      });
  }, [id, onChangeHandler]);

  const ContextPackage = {
    id: id,
    onChange: onChangeHandler,
    isActive: isActive,
  };

  let headerContent;
  let timer;

  const timeConvert = (msTime) => {
    let seconds = Math.floor(msTime / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24;

    let dayPhrase = "";
    let hourPhrase = "";
    let minutePhrase = "";

    if (days > 0) {
      if (days === 1) {
        dayPhrase = `${days} day and `;
      } else {
        dayPhrase = `${days} days and `;
      }
    }
    if (hours > 0 && days > 0) {
      hourPhrase = `${hours} `;
    } else if (hours > 0 && days <= 0) {
      hourPhrase = `${hours}:`;
      if (minutes < 10) {
        minutePhrase = `0${minutes} `;
      } else {
        minutePhrase = `${minutes} `;
      }
    } else {
      if (minutes < 10) {
        minutePhrase = `0${minutes} `;
      } else {
        minutePhrase = `${minutes} `;
      }
    }

    let endPhrase = "";

    if (hours > 0) {
      if (hours === 1 && minutes === 0) {
        endPhrase = `hour`;
      } else {
        endPhrase = `hours`;
      }
    } else if (minutes > 0) {
      endPhrase = `minutes`;
    }

    return `${dayPhrase}${hourPhrase}${minutePhrase}${endPhrase}`;
  };

  if (!isStarted) {
    headerContent = `This poll starts at ${startDate.toLocaleTimeString()}, ${startDate.toLocaleDateString()}`;
    timer = `${timeConvert(startDate - Date.now()).toLocaleString()} remaining`;
  } else if (endDate) {
    if (!isEnded) {
      headerContent = `This poll ends at  ${endDate.toLocaleTimeString()}, ${endDate.toLocaleDateString()}`;
      timer = `${timeConvert(endDate - Date.now())} remaining`;
    } else {
      headerContent = `This poll ended at  ${endDate.toLocaleTimeString()}, ${endDate.toLocaleDateString()}`;
      timer = `${timeConvert(Date.now() - endDate)} ago`;
    }
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
      {!errorState && (
        <Card>
          <div>Sharing here</div>
          <div>{headerContent}</div>
          <div className={styles.TimerContainer}>{timer}</div>
        </Card>
      )}
      <Card className={styles.Container}>
        {errorState ? (
          <div className={styles.ErrorText}>
            Poll with ID <span className={styles.Italics}>{id}</span> was not
            found!
          </div>
        ) : (
          <Fragment>
            <div className={styles.PollInfoContainer}>
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
            <PollContext.Provider value={ContextPackage}>
              <ChoicesList
                pollChoices={pollChoices}
                canMultipleVote={canMultipleVote}
              />
              {canAddChoices && isActive && <NewChoice />}
            </PollContext.Provider>
          </Fragment>
        )}
      </Card>
    </motion.div>
  );
};

export default Poll;
