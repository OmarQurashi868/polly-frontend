import { useState } from "react";
import styles from "./AdminSharingWidget.module.css";
import Card from "../UI/Card";
import Button from "../UI/Button";

const SharingWidget = (props) => {
  let tempUrl = window.location.href
  if (tempUrl.endsWith("/")) {
    tempUrl = tempUrl.slice(0, -1);
  } 
  const [url] = useState(tempUrl.slice(0, tempUrl.lastIndexOf("/")));

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

  return (
    <Card>
      <div className={styles.SharingWidget}>
        Sharing link (non-admin):
        <div className={styles.Container}>
          <input readOnly type="text" id="link" name="link" value={`${url}`} />
          <Button onClick={copyText} className={styles.Button}>
            {/* {window.innerWidth > 768 ? `Copy` : `Select`} */}
            Select
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SharingWidget;
