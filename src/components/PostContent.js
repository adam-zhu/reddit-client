import React from "react";
import Radium from "radium";
import { timeAgo } from "../utils";
import { URL_ROOT } from "../services";

const PostContent = ({
  title,
  thumbnail,
  permalink,
  domain,
  url,
  created_utc,
  author,
  subreddit,
  subreddit_name_prefixed,
  num_comments,
  selectPostHandler,
  subredditChangeHandler
}) => {
  const isRedditLink = url.indexOf(URL_ROOT) === 0;
  const thumbnailWidth = "70px";
  const thumbnailMargin = "6px";
  const hoverStyle = {
    ":hover": { cursor: "pointer", textDecoration: "underline" }
  };
  const hasSelectPostHandler = typeof selectPostHandler === "function";
  const [commentsClickHandler, commentsHoverStyle] = hasSelectPostHandler
    ? [selectPostHandler(permalink), hoverStyle]
    : [undefined, {}];
  const resolveTitleProps = () => {
    const style = {
      textDecoration: "none"
    };

    if (isRedditLink) {
      if (hasSelectPostHandler) {
        return {
          style: {
            ...style,
            color: "blue",
            cursor: "pointer"
          },
          onClick: commentsClickHandler
        };
      }

      return {
        style
      };
    }

    return {
      style: {
        ...style,
        cursor: "pointer"
      },
      href: url
    };
  };

  return (
    <div style={{ textAlign: "left", fontSize: "0.8rem" }}>
      <Thumbnail
        src={thumbnail}
        url={url}
        title={title}
        permalink={permalink}
        width={thumbnailWidth}
        selectPostHandler={selectPostHandler}
      />
      <span
        key="thumbnail-margin"
        style={{ display: "inline-block", width: thumbnailMargin }}
      />
      <div
        style={{
          display: "inline-block",
          verticalAlign: "top",
          width: `calc(100% - ${thumbnailWidth} - ${thumbnailMargin})`
        }}
      >
        <div>
          <h2
            style={{
              display: "inline",
              margin: "0 0 1rem 0",
              fontSize: "1rem",
              fontWeight: 500
            }}
          >
            <a {...resolveTitleProps()}>{title}</a>
            &nbsp;&nbsp;
          </h2>
          <span key="domain" style={{ color: "gray", fontSize: "0.6rem" }}>
            ({domain})
          </span>
        </div>
        <span key="meta">
          submitted {timeAgo(created_utc * 1000)} by{" "}
          <a
            href={`https://reddit.com/user/${author}`}
            style={{
              color: "steelblue",
              textDecoration: "none",
              ":hover": { textDecoration: "underline" }
            }}
          >
            <strong key="author">{author}</strong>
          </a>{" "}
          to{" "}
          <span
            key="subreddit"
            onClick={subredditChangeHandler(`/r/${subreddit}`)}
            style={{
              color: "steelblue",
              ...hoverStyle
            }}
          >
            {subreddit_name_prefixed}
          </span>
        </span>
        <br />
        <strong
          key="comment-count"
          onClick={commentsClickHandler}
          style={[
            {
              color: "gray"
            },
            commentsHoverStyle
          ]}
        >
          {num_comments} comments
        </strong>
      </div>
    </div>
  );
};

const Thumbnail = Radium(function Thumbnail({
  src,
  title,
  url,
  permalink,
  width,
  selectPostHandler
}) {
  const isRedditLink = url.indexOf(URL_ROOT) === 0;
  const hasSelectPostHandler = typeof selectPostHandler === "function";
  const resolveProps = () => {
    const style = {
      display: "inline-block",
      width
    };

    if (isRedditLink) {
      if (hasSelectPostHandler) {
        return {
          style: {
            ...style,
            cursor: "pointer"
          },
          onClick: selectPostHandler(permalink),
          title
        };
      }

      return {
        style,
        title
      };
    }

    return {
      style,
      href: url
    };
  };

  return (
    <a {...resolveProps()}>
      {src.indexOf("https://") === 0 ? (
        <img src={src} style={{ width: "100%", height: "auto" }} alt={title} />
      ) : (
        <div
          style={{
            width: "100%",
            height: "50px",
            backgroundImage: `url("https://www.redditstatic.com/sprite-reddit.e5NqNKsOkdA.png")`,
            backgroundPosition: src === "self" ? "0px -448px" : "0px -229px",
            backgroundRepeat: "no-repeat",
            backgroundSize: "70px 856px"
          }}
          alt={title}
        />
      )}
    </a>
  );
});

export default Radium(PostContent);
