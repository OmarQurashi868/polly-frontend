import styles from "./Choice.module.css"

const Choice = (props) => {
    return <li className={styles.ListItem}>{props.choiceName} votes {props.voteCount}</li>
};

export default Choice;