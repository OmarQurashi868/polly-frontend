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
import ChoicesList from "./ChoicesList";

const { REACT_APP_BACKEND_URL } = process.env;

export const PollContext = createContext();

const Poll = () => {
  const { id } = useParams();
  const [pollQuestion, setPollQuestion] = useState();
  const [pollName, setPollName] = useState();
  const [errorState, setErrorState] = useState();
  const [pollChoices, setPollChoices] = useState([]);
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
        setPollQuestion(res.question);
        setPollName(res.name);
        setPollChoices(res.choices);
      });
  }, [id, onChangeHandler]);

  const ContextPackage = {
    id: id,
    onChange: onChangeHandler,
  };

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
              <div className={styles.PollQuestion}>{pollQuestion}</div>
              <div className={styles.PollNameText}>
                {pollName && (
                  <Fragment>
                    Asked by <span className={styles.Italics}>{pollName}</span>
                  </Fragment>
                )}
              </div>
            </div>
            <PollContext.Provider value={ContextPackage}>
              <ChoicesList pollChoices={pollChoices} />
            </PollContext.Provider>
          </Fragment>
        )}
      </Card>
    </motion.div>
  );
};

export default Poll;
