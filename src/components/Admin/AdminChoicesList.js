import { useState, useEffect } from "react";
import styles from "./AdminChoicesList.module.css";
import AdminChoice from "./AdminChoice";

const ChoicesList = (props) => {
  const voteValues = props.pollChoices.map((e) => e.voteCount);
  const highestVote = Math.max(...voteValues);

  const [allLoad, setAllLoad] = useState(false);
  const [isLastChoice, setIsLastChoice] = useState(true);

  useEffect(() => {
    if (props.pollChoices.length < 2) {
      setIsLastChoice(true);
    } else {
      setIsLastChoice(false);
    }
  }, [props.pollChoices])

  const loadAll = () => {
    setAllLoad(true);
  };
  const unloadAll = () => {
    setAllLoad(false);
  };

  if (props.pollChoices.length < 1) {
    return <div className={styles.Italics}> No choices available</div>;
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
