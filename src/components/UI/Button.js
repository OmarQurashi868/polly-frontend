import styles from "./Button.module.css";

const Button = (props) => {
    const classes = styles.Button + " " + props.className;
    return <button className={classes} onClick={props.onClick}>{props.children}</button>
};

export default Button;