export const getVoteValue = ({ post, votes }) => {
  const { id, ups, downs } = post;
  const userVote = votes.find(v => v.id === id);
  const userVoteType = userVote ? userVote.type : undefined;
  const userVoteValue =
    userVoteType === "up" ? 1 : userVoteType === "down" ? -1 : 0;

  return ups + downs + userVoteValue;
};

export const timeAgo = d => {
  const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
  const date = new Date(d);
  const now = new Date();
  const yesterday = new Date(now.valueOf() - DAY_IN_MS);
  const secondsAgo = Math.round((now.valueOf() - date.valueOf()) / 1000);
  const minutesAgo = Math.round(secondsAgo / 60);
  const hoursAgo = Math.round(minutesAgo / 60);
  const isToday = now.toDateString() === date.toDateString();
  const isYesterday = yesterday.toDateString() === date.toDateString();
  const isThisYear = now.getFullYear() === date.getFullYear();
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours() % 12;
  const ampm = hours >= 12 ? "pm" : "am";
  const _minutes = date.getMinutes();
  const minutes = _minutes < 10 ? `0${_minutes}` : _minutes;

  if (secondsAgo < 3) {
    return "just now";
  }

  if (secondsAgo < 10) {
    return "a few seconds ago";
  }

  if (secondsAgo < 60) {
    return `${secondsAgo} seconds ago`;
  }

  if (secondsAgo < 90) {
    return "about a minute ago";
  }

  if (minutesAgo < 60) {
    return `${minutesAgo} minutes ago`;
  }

  if (hoursAgo < 12) {
    return `${hoursAgo} hours ago`;
  }

  if (isToday) {
    return `Today at ${hours}:${minutes}${ampm}`;
  }

  if (isYesterday) {
    return `Yesterday at ${hours}:${minutes}${ampm}`;
  }

  if (isThisYear) {
    return `${month} ${day} at ${hours}:${minutes}${ampm}`;
  }

  return `${month} ${day}, ${year} at ${hours}:${minutes}${ampm}`;
};

// https://stackoverflow.com/a/9609450/4838706
export const decodeHTMLEntities = (() => {
  // this prevents any overhead from creating the object each time
  const element = document.createElement("div");
  const decodeEntities = str => {
    if (str && typeof str === "string") {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, "");
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gim, "");
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = "";
    }

    return str;
  };

  return decodeEntities;
})();
