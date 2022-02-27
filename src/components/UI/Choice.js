import { useContext } from "react";
import styles from "./Choice.module.css";
import VoteButton from "./VoteButton";
import { PollContext } from "../Poll";

const { REACT_APP_BACKEND_URL } = process.env;

const Choice = (props) => {
  const ctx = useContext(PollContext);
  const onVoteHandler = () => {
    fetch(`${REACT_APP_BACKEND_URL}/vote/${ctx.id}/${props.choiceId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 201) {
          alert(`Voting failed with error code ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        // STORE LOCAL STORAGE
        const prevDataObject = JSON.parse(localStorage.getItem(ctx.id));
        const dataObject = { ...prevDataObject };
        dataObject[props.choiceId] = true;
        localStorage.setItem(ctx.id, JSON.stringify(dataObject));

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
          alert(`Unvoting failed with error code ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        // STORE LOCAL STORAGE
        const prevDataObject = JSON.parse(localStorage.getItem(ctx.id));
        const dataObject = { ...prevDataObject };
        dataObject[props.choiceId] = false;
        localStorage.setItem(ctx.id, JSON.stringify(dataObject));

        ctx.onChange();
      });
  };

  return (
    <li className={styles.ListItem}>
      <div className={styles.TopContainer}>
        <div className={styles.NameContainer}>{props.choiceName}</div>
        <VoteButton
          onVote={onVoteHandler}
          onUnVote={onUnVoteHandler}
          pollId={ctx.id}
          choiceId={props.choiceId}
        />
      </div>
      <div className={styles.BotContainer}>{props.voteCount}</div>
    </li>
  );
};

export default Choice;
