import styles from "./AdminChoicesList.module.css";
import AdminChoice from "./AdminChoice";

const ChoicesList = (props) => {
  const voteValues = props.pollChoices.map((e) => e.voteCount);
  const highestVote = Math.max(...voteValues);

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
            isLastChoice={isLastChoice}
          />
        );
      })}
    </ul>
  );
};

export default ChoicesList;
