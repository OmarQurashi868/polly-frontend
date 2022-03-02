import { useState, useEffect } from "react";
import styles from "./Timer.module.css";

const Timer = (props) => {
  const [, reRender] = useState({});

  useEffect(() => {
    setInterval(() => {
      reRender({});
    }, 15000)
  }, [])

  let headerContent;
  let timer;

  const timeConvert = (msTime) => {
    let seconds = Math.floor(msTime / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24;

    if (days < 1 && hours < 1 && minutes < 1) {
      return "Less than a minute";
    }

    let dayPhrase = "";
    let hourPhrase = "";
    let minutePhrase = "";

    if (days > 0) {
      if (days === 1) {
        dayPhrase = `${days} day and `;
      } else {
        dayPhrase = `${days} days and `;
      }
    }

    if (hours > 0) {
      hourPhrase = `${hours} `;
    } else {
      minutePhrase = `${minutes} `;
    }

    let endPhrase = "";

    if (hours > 0) {
      if (hours === 1) {
        endPhrase = `hour`;
      } else {
        endPhrase = `hours`;
      }
    } else if (minutes > 0) {
      if (minutes === 1) {
        endPhrase = `minute`;
      } else {
        endPhrase = `minutes`;
      }
    }

    return `${dayPhrase}${hourPhrase}${minutePhrase}${endPhrase}`;
  };

  let startDate = Date.now();
  let endDate = Date.now();

  // Format dates
  if (
    new Date().toLocaleDateString() ===
    props.timerData.startDate.toLocaleDateString()
  ) {
    startDate = props.timerData.startDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    startDate = `${props.timerData.startDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}, ${props.timerData.startDate.toLocaleDateString()}`;
  }

  if (props.timerData.endDate) {
    if (
      new Date().toLocaleDateString() ===
      props.timerData.endDate.toLocaleDateString()
    ) {
      endDate = props.timerData.endDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      endDate = `${props.timerData.endDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}, ${props.timerData.endDate.toLocaleDateString()}`;
    }
  }

  // Set phrase
  if (!props.timerData.isStarted) {
    headerContent = `Poll starts at ${startDate}`;
  } else if (props.timerData.endDate) {
    if (!props.timerData.isEnded) {
      headerContent = `Poll ends at ${endDate}`;
    } else {
      headerContent = `Poll ended at  ${endDate}`;
    }
  }

  if (!props.timerData.isStarted) {
    timer = `${timeConvert(props.timerData.startDate - Date.now())} remaining`;
  } else if (props.timerData.endDate) {
    if (!props.timerData.isEnded) {
      timer = `${timeConvert(props.timerData.endDate - Date.now())} remaining`;
    } else {
      timer = `${timeConvert(Date.now() - props.timerData.endDate)} ago`;
    }
  }

  return (
    <div className={styles.Container}>
      {headerContent}
      <div className={styles.TimerContainer}>{timer}</div>
    </div>
  );
};

export default Timer;
