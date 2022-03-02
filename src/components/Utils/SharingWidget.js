import styles from "./SharingWidget.module.css";
import Card from "../UI/Card";

const SharingWidget = (props) => {
  return <Card>{props.pollId}</Card>;
};

export default SharingWidget;
