import React from "react";
import Radium from "radium";

const PostVotes = ({ post, votes, voteHandler }) => {
  const userVote = votes.find(v => v.id === post.id);
  const userVoteType = userVote ? userVote.type : undefined;
  const userVoteValue =
    userVoteType === "up" ? 1 : userVoteType === "down" ? -1 : 0;
  const value = post.ups + post.downs + userVoteValue;
  const voteButtonStyle = {
    border: "none",
    outline: "none",
    padding: 0,
    margin: 0,
    width: "14px",
    height: "15px",
    cursor: "pointer",
    backgroundImage: `url("https://www.redditstatic.com/sprite-reddit.e5NqNKsOkdA.png")`,
    backgroundRepeat: "no-repeat"
  };
  const upvoteButton = (
    <button
      style={[
        voteButtonStyle,
        {
          backgroundPosition:
            userVoteType === "up" ? "-105px -1654px" : "-84px -1654px"
        }
      ]}
      alt={`Upvote ${post.title}`}
      onClick={voteHandler(post.id)("up")}
    />
  );
  const downvoteButton = (
    <button
      style={[
        voteButtonStyle,
        {
          backgroundPosition:
            userVoteType === "down" ? "-63px -1654px" : "-42px -1654px"
        }
      ]}
      alt={`Upvote ${post.title}`}
      onClick={voteHandler(post.id)("down")}
    />
  );

  return (
    <div
      style={{
        display: "inline-block",
        textAlign: "center"
      }}
    >
      {upvoteButton}
      <div
        style={{
          marginBottom: ".25rem",
          color:
            userVoteType === "up"
              ? "#FF8B60"
              : userVoteType === "down"
              ? "#9494FF"
              : "#888"
        }}
      >
        <strong>
          {value > 10000 ? `${Math.round(value / 100) / 10}k` : value}
        </strong>
      </div>
      {downvoteButton}
    </div>
  );
};

export default Radium(PostVotes);
