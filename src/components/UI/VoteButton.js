import styles from "./VoteButton.module.css";

const VoteButton = (props) => {
  return <button onClick={props.onVote}>VoteButton</button>;
};

export default VoteButton;
