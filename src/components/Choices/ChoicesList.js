import { useContext, useState } from "react";
import Cookies from "universal-cookie";
import styles from "./ChoicesList.module.css";
import Choice from "./Choice";
import { PollContext } from "../Poll";

const ChoicesList = (props) => {
  const voteValues = props.pollChoices.map((e) => e.voteCount);
  const highestVote = Math.max(...voteValues);
  const cookies = new Cookies();
  const [allLoad, setAllLoad] = useState(false);

  const loadAll = () => {
    setAllLoad(true);
  };
  const unloadAll = () => {
    setAllLoad(false);
  };

  const ctx = useContext(PollContext);

  let alreadyVoted = false;
  let votedId = "0";

  if (!props.canMultipleVote) {
    const votedChoices = cookies.get(ctx.id);

    if (votedChoices) {
      for (const choice in votedChoices) {
        if (
          votedChoices[choice] === true &&
          props.pollChoices.find((obj) => obj._id === choice)
        ) {
          alreadyVoted = true;
          votedId = choice;
          break;
        }
      }
    } else {
      alreadyVoted = false;
    }
  }

  if (props.pollChoices.length < 1) {
    return <div className={styles.Italics}> No choices available</div>;
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
            allLoad={allLoad}
            loadAll={loadAll}
            unloadAll={unloadAll}
          />
        );
      })}
    </ul>
  );
};

export default ChoicesList;
