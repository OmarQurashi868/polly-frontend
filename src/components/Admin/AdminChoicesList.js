import { useContext } from "react";
import Cookies from "universal-cookie";
import styles from "./AdminChoicesList.module.css";
import AdminChoice from "./AdminChoice";
import { AdminPollContext } from "../AdminPoll";

const ChoicesList = (props) => {
  const voteValues = props.pollChoices.map((e) => e.voteCount);
  const highestVote = Math.max(...voteValues);
  const cookies = new Cookies();

  const ctx = useContext(AdminPollContext);

  let alreadyVoted = false;
  let votedId = "0";

  if (!props.canMultipleVote) {
    const votedChoices = cookies.get(ctx.id);

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

  let isLastChoice = false;

  if (props.pollChoices.length === 1) {
    isLastChoice = true;
  }

  return (
    <ul className={styles.ChoicesContainer}>
      {props.pollChoices.map((e) => {
        return (
          <AdminChoice
            key={e._id}
            choiceId={e._id}
            choiceName={e.name}
            voteCount={e.voteCount}
            highestVote={highestVote}
            canMultipleVote={props.canMultipleVote}
            votedId={votedId}
            alreadyVoted={alreadyVoted}
            isLastChoice={isLastChoice}
          />
        );
      })}
    </ul>
  );
};

export default ChoicesList;
