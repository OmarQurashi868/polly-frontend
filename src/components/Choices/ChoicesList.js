import { useContext } from "react";
import styles from "./ChoicesList.module.css";
import Choice from "./Choice";
import { PollContext } from "../Poll";

const ChoicesList = (props) => {
  const voteValues = props.pollChoices.map((e) => e.voteCount);
  const highestVote = Math.max(...voteValues);

  const ctx = useContext(PollContext);
  let alreadyVoted = false;
  let votedId = "0";

  if (!props.canMultipleVote) {
    const votedChoices = JSON.parse(localStorage.getItem(ctx.id));

    if (votedChoices) {
      for (const choice in votedChoices) {
        if (votedChoices[choice] === true) {
          alreadyVoted = true;
          votedId = choice;
          break;
        }
      }
    } else {
      alreadyVoted = false;
    }
  }

  return (
    <ul className={styles.ChoicesContainer}>
      {props.pollChoices.map((e) => {
        return (
          <Choice
            key={e._id}
            choiceId={e._id}
            choiceName={e.name}
            voteCount={e.voteCount}
            highestVote={highestVote}
            canMultipleVote={props.canMultipleVote}
            votedId={votedId}
            alreadyVoted={alreadyVoted}
          />
        );
      })}
    </ul>
  );
};

export default ChoicesList;
