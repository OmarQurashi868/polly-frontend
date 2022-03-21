import styles from "./DeleteButton.module.css";

const DeleteButton = (props) => {
  let content;
  if (props.isLastChoice) {
    content = null;
  } else if (!props.isLoading) {
    content = (
      <button className={styles.Button} onClick={props.onClick}>
        <img alt="Delete choice" src={require("../../files/delete.png")} />
      </button>
    );
  } else {
    content = (
      <button
        className={`${styles.Button} ${styles.Disabled}`}
        onClick={props.onClick}
      >
        <div className={styles.Loader} />
      </button>
    );
  }

  return content;
};

export default DeleteButton;
