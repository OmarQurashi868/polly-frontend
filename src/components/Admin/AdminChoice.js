import { useContext, useState, useEffect } from "react";
import styles from "./AdminChoice.module.css";
import DeleteButton from "./DeleteButton";
import { AdminPollContext } from "../AdminPoll";

const Choice = (props) => {
  const ctx = useContext(AdminPollContext);
  let gapValue;

  const { REACT_APP_BACKEND_URL } = process.env;

  if (props.voteCount === 0) {
    gapValue = "0";
  }

  let voteBarFill;
  if (props.highestVote > 0) {
    voteBarFill = Math.round((props.voteCount / props.highestVote) * 100) + "%";
  } else {
    voteBarFill = "0%";
  }

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (props.allLoad) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [props.allLoad]);

  const onClickHandler = () => {
    setIsLoading(true);
    props.loadAll();

    fetch(`${REACT_APP_BACKEND_URL}/remove/${ctx.id}/${props.choiceId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 201) {
          alert(`Operation failed with error code ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        setTimeout(() => {
          setIsLoading(false);
          props.unloadAll();
        }, 500);
        // setIsLoading(false);
        // props.unloadAll();
        ctx.onChange();
      });
  };

  return (
    <li className={styles.ListItem}>
      <div className={styles.TopContainer}>
        <div className={styles.NameContainer}>{props.choiceName}</div>
        <DeleteButton
          isLastChoice={props.isLastChoice}
          onClick={onClickHandler}
          isLoading={isLoading}
        />
      </div>
      <div className={styles.BotContainer} style={{ gap: gapValue }}>
        <div className={styles.VoteBar} style={{ width: voteBarFill }} />
        <div className={styles.VoteCountContainer}>{props.voteCount}</div>
      </div>
    </li>
  );
};

export default Choice;
