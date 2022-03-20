import { Fragment, useState } from "react";
import Cookies from "universal-cookie";
import styles from "./SharingWidget.module.css";
import Card from "../UI/Card";
import Button from "../UI/Button";

const SharingWidget = (props) => {
  const cookies = new Cookies();
  const [url] = useState(window.location.href);

  const copyText = async () => {
    const text = document.getElementById("link");
    text.select();
    text.setSelectionRange(0, 99999);
    try {
      await navigator.clipboard.writeText(`${url}`);
    } catch (err) {
      console.log("Copy to clipboard failed, probably because the page is HTTP...");
    }
  };

  let adminLink;

  if (cookies.get(`${props.pollId}-adminLink`)) {
    adminLink = cookies.get(`${props.pollId}-adminLink`);
  }

  const navigateToAdmin = () => {
    window.open(`${url}/${adminLink}`, "_blank", "noopener,noreferrer");
  };

  return (
    <Card>
      <div className={styles.SharingWidget}>
        Sharing link:
        <div className={styles.Container}>
          <input readOnly type="text" id="link" name="link" value={`${url}`} />
          <Button onClick={copyText} className={styles.Button}>
            {/* {window.innerWidth > 768 ? `Copy` : `Select`} */}
            Select
          </Button>
        </div>
        {adminLink && (
          <Fragment>
            Admin Link:
            <div className={styles.Container}>
              <input
                readOnly
                type="text"
                id="link"
                name="link"
                value={`${url}/${adminLink}`}
              />
              <Button onClick={navigateToAdmin} className={styles.Button}>
                Go
              </Button>
            </div>
          </Fragment>
        )}
      </div>
    </Card>
  );
};

export default SharingWidget;
