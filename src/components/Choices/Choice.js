import { useContext } from "react";
import Cookies from "universal-cookie";
import styles from "./Choice.module.css";
import VoteButton from "../UI/VoteButton";
import { PollContext } from "../Poll";

const { REACT_APP_BACKEND_URL } = process.env;

const Choice = (props) => {
  const ctx = useContext(PollContext);
  let gapValue;
  const cookies = new Cookies();

  const onVoteHandler = () => {
    fetch(`${REACT_APP_BACKEND_URL}/vote/${ctx.id}/${props.choiceId}`, {
      method: "PATCH",
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

        gapValue = "0.7";

        ctx.onChange();
      });
  };

  const onUnVoteHandler = () => {
    fetch(`${REACT_APP_BACKEND_URL}/unvote/${ctx.id}/${props.choiceId}`, {
      method: "PATCH",
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
