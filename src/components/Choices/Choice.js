import { useContext, useState, useEffect } from "react";
import Cookies from "universal-cookie";
import styles from "./Choice.module.css";
import VoteButton from "../UI/VoteButton";
import { PollContext } from "../Poll";

const { REACT_APP_BACKEND_URL } = process.env;

const Choice = (props) => {
  const ctx = useContext(PollContext);
  let gapValue;
  const cookies = new Cookies();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (props.allLoad) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [props.allLoad]);

  const onVoteHandler = () => {
    // Store data showing the client already voted on this choice
    const prevDataObject = cookies.get(ctx.id);
    const dataObject = { ...prevDataObject };
    dataObject[props.choiceId] = true;
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 2);
    cookies.set(ctx.id, dataObject, {
      path: "/",
      expires: expiryDate,
      sameSite: "strict",
    });
    setIsLoading(true);
    props.loadAll();
    fetch(`${REACT_APP_BACKEND_URL}/vote/${ctx.id}/${props.choiceId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 201) {
          dataObject[props.choiceId] = false;
          cookies.set(ctx.id, dataObject, {
            path: "/",
            expires: expiryDate,
            sameSite: "strict",
          });
          alert(`Operation failed with error code ${res.status}`);
          ctx.onChange();
        }
        return res.json();
      })
      .then((res) => {
        gapValue = "0.7";
        setTimeout(() => {
          setIsLoading(false);
          props.unloadAll();
        }, 300);
        ctx.onChange();
      });
  };

  const onUnVoteHandler = () => {
    // Store local data for unvoting
    const prevDataObject = cookies.get(ctx.id);
    const dataObject = { ...prevDataObject };
    dataObject[props.choiceId] = false;
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 2);
    cookies.set(ctx.id, dataObject, {
      path: "/",
      expires: expiryDate,
      sameSite: "strict",
    });
    // ctx.onChange();
    setIsLoading(true);
    props.loadAll();
    fetch(`${REACT_APP_BACKEND_URL}/unvote/${ctx.id}/${props.choiceId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 201) {
          dataObject[props.choiceId] = true;
          cookies.set(ctx.id, dataObject, {
            path: "/",
            expires: expiryDate,
            sameSite: "strict",
          });
          alert(`Operation failed with error code ${res.status}`);
          ctx.onChange();
        }
        return res.json();
      })
      .then((res) => {
        setTimeout(() => {
          setIsLoading(false);
          props.unloadAll();
        }, 500);
        ctx.onChange();
      });
  };

  let isActive;

  if (!ctx.isActive) {
    isActive = false;
  } else {
    if (props.canMultipleVote || !props.alreadyVoted) {
      isActive = true;
    } else {
      if (props.choiceId === props.votedId) {
        isActive = true;
      } else {
        isActive = false;
      }
    }
  }

  if (props.voteCount === 0) {
    gapValue = "0";
  }

  let voteBarFill;
  if (props.highestVote > 0) {
    voteBarFill = Math.round((props.voteCount / props.highestVote) * 100) + "%";
  } else {
    voteBarFill = "0%";
  }

  return (
    <li className={styles.ListItem}>
      <div className={styles.TopContainer}>
        <div className={styles.NameContainer}>{props.choiceName}</div>
        <VoteButton
          onVote={onVoteHandler}
          onUnVote={onUnVoteHandler}
          pollId={ctx.id}
          choiceId={props.choiceId}
          isActive={isActive}
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
