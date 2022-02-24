import styles from "./ChoicesList.module.css";
import Choice from "./UI/Choice";

const ChoicesList = (props) => {
  let highestVote = 0;
  props.pollChoices.forEach((e) => {
    if (e.voteCount > highestVote) highestVote = e.voteCount;
  });

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
          />
        );
      })}
    </ul>
  );
};

export default ChoicesList;
