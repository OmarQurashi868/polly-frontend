import { useState, useEffect } from "react";
import styles from "./DeleteButton.module.css";

const DeleteButton = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [buttonStyles, setButtonStyles] = useState(`${styles.Button}`);

  const { REACT_APP_BACKEND_URL } = process.env;

  useEffect(() => {
    if (props.allLoad) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [props.allLoad]);

  const onClickHandler = () => {
    setButtonStyles(`${styles.Button} ${styles.Disabled}`);
    setIsLoading(true);
    props.loadAll();

    fetch(`${REACT_APP_BACKEND_URL}/remove/${props.pollId}/${props.choiceId}`, {
      method: "DELETE",
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
        props.unloadAll();
        props.onChange();
        setIsLoading(false);
        setButtonStyles(`${styles.Button}`);
      });
  };

  return (
    <button className={buttonStyles} onClick={onClickHandler}>
      {!isLoading ? (
        <img alt="Delete choice" src={require("../../files/delete.png")} />
      ) : (
        <div className={styles.Loader} />
      )}
    </button>
  );
};

export default DeleteButton;
