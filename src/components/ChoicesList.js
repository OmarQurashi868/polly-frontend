import styles from "./ChoicesList.module.css";
import Choice from "./UI/Choice";

const ChoicesList = (props) => {
  return (
    <ul className={styles.ChoicesContainer}>
      {props.pollChoices.map((e) => {
        return (
          <Choice key={e._id} choiceName={e.name} voteCount={e.voteCount} />
        );
      })}
    </ul>
  );
};

export default ChoicesList;
