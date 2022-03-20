import { useState } from "react";
import styles from "./DeleteButton.module.css";

const DeleteButton = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  let buttonStyles = `${styles.Button}`;

  const { REACT_APP_BACKEND_URL } = process.env;

  const onClickHandler = () => {
    buttonStyles = `${styles.Button} ${styles.Disabled}`;
    setIsLoading(true);

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
        buttonStyles = `${styles.Button}`;
        setIsLoading(false);
        props.onChange();
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
