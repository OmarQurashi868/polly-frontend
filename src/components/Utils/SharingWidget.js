import styles from "./SharingWidget.module.css";
import Card from "../UI/Card";
import Button from "../UI/Button";

const SharingWidget = (props) => {
  const url = window.location.href.slice(0, -6);

  const copyText = () => {
    const text = document.getElementById("link");
    text.select();
    // text.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(`${url}${props.pollId}`);
  };

  return (
    <Card>
      <div className={styles.SharingWidget}>
        Sharing link:{" "}
        <div className={styles.Container}>
          <input
            readOnly
            type="text"
            id="link"
            name="link"
            value={`${url}${props.pollId}`}
          />
          <Button onClick={copyText} className={styles.Button}>
            {window.innerWidth > 768 ? `Copy` : `Select`}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SharingWidget;
