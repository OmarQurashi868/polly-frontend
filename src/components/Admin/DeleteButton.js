import styles from "./DeleteButton.module.css";

const DeleteButton = (props) => {
  const classes = styles.Button + " " + props.className;
  return (
    <button className={classes} onClick={props.onClick}>
      <img alt="Delete choice" src={require("../../files/delete.png")} />
    </button>
  );
};

export default DeleteButton;
