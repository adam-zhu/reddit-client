import React, { useCallback, useState } from "react";
import Radium from "radium";
import Loading from "../components/Loading";
import PostVotes from "../components/PostVotes";
import PostContent from "../components/PostContent";
import { getVoteValue, timeAgo, decodeHTMLEntities } from "../utils";

const DetailPage = ({
  post,
  votes,
  comments,
  backHandler,
  voteHandler,
  subredditHandler,
  commentHandler
}) => {
  return (
    <main style={{ padding: "0.25rem" }}>
      <button
        onClick={backHandler}
        style={{ margin: "1rem 1rem 1rem 0", cursor: "pointer" }}
      >
        {`< back`}
      </button>
      <Content
        post={post}
        votes={votes}
        comments={comments}
        voteHandler={voteHandler}
        subredditHandler={subredditHandler}
        commentHandler={commentHandler}
      />
    </main>
  );
};

const Content = ({
  post,
  votes,
  comments,
  voteHandler,
  subredditHandler,
  commentHandler
}) => {
  if (!post) {
    return <Loading />;
  }

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ flexGrow: 0, marginRight: "0.5rem" }}>
          <PostVotes post={post} votes={votes} voteHandler={voteHandler} />
        </div>
        <div style={{ flexGrow: 1 }}>
          <PostContent {...post} subredditChangeHandler={subredditHandler} />
        </div>
      </div>
      <br />
      {post.comments.map(c => (
        <Comment
          key={c.id}
          {...c}
          votes={votes}
          comments={comments}
          voteHandler={voteHandler}
          commentHandler={commentHandler}
        />
      ))}
    </div>
  );
};

const Comment = ({
  id,
  body_html,
  replies,
  depth,
  created_utc,
  author,
  ups,
  downs,
  count,
  votes,
  comments,
  voteHandler,
  commentHandler
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isReplying, setIsReplying] = useState(false);

  if (typeof count === "number") {
    return count > 0 ? (
      <em style={{ color: "gray", fontSize: "0.6rem" }}>
        {count} more repl{count === 1 ? "y" : "ies"}
      </em>
    ) : null;
  }

  const voterWidth = "14px";
  const userReplies = comments.filter(c => c.id === id).reverse();
  const commentReplySaveHandler = ({ text, created_utc }) => {
    setIsReplying(false);
    commentHandler(id)({ text, created_utc });
  };

  return (
    <div
      style={{
        padding: `0.25rem`,
        margin:
          depth === 0
            ? "0 0 0.5rem 0"
            : `0.25rem 0.25rem 0.25rem calc(0.25rem + ${voterWidth})`,
        border: "1px solid gainsboro",
        background: depth % 2 === 0 ? "white" : "whitesmoke",
        fontSize: "0.8rem"
      }}
    >
      <div>
        {isExpanded && votes && voteHandler && (
          <CommentVoter
            id={id}
            votes={votes}
            width={voterWidth}
            voteHandler={voteHandler}
          />
        )}
        <div
          style={{
            display: "inline-block",
            verticalAlign: "top",
            paddingLeft: "0.25rem",
            width: `calc(100% - ${voterWidth} - 0.25rem)`
          }}
        >
          <button
            onClick={e => setIsExpanded(!isExpanded)}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              padding: 0,
              cursor: "pointer"
            }}
          >
            {isExpanded ? `[-]` : `[+]`}{" "}
          </button>
          &nbsp;
          {author ? (
            <a
              href={`https://reddit.com/user/${author}`}
              style={{
                color: "steelblue",
                textDecoration: "none"
              }}
            >
              <strong>{author}</strong>
            </a>
          ) : (
            <strong>USER</strong>
          )}
          &nbsp;
          {votes && (
            <strong>
              {getVoteValue({ post: { id, ups, downs }, votes })} points
            </strong>
          )}
          &nbsp;
          <span style={{ color: "gray" }}>{timeAgo(created_utc * 1000)}</span>
        </div>
        {isExpanded && (
          <>
            <div
              style={{
                display: "inline-block",
                verticalAlign: "top",
                paddingLeft: "0.25rem",
                width: `calc(100% - ${voterWidth} - 0.25rem)`
              }}
              dangerouslySetInnerHTML={{
                __html: decodeHTMLEntities(body_html)
              }}
            />
            {!isReplying ? (
              <button
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: "gray",
                  marginLeft: `calc(${voterWidth} + 0.25rem)`,
                  marginBottom: "0.25rem"
                }}
                onClick={e => setIsReplying(true)}
              >
                <strong>reply</strong>
              </button>
            ) : (
              <div
                style={{
                  width: `calc(100% - ${voterWidth} - 0.25rem)`,
                  marginLeft: `calc(${voterWidth} + 0.25rem)`
                }}
              >
                <ReplyForm
                  id={id}
                  saveHandler={commentReplySaveHandler}
                  cancelHandler={e => setIsReplying(false)}
                />
              </div>
            )}
            {userReplies.map(r => (
              <UserReply
                key={`user-comment-${r.id}`}
                {...r}
                depth={depth + 1}
                voterWidth={voterWidth}
              />
            ))}
            {replies.map(r => (
              <Comment
                key={r.id}
                {...r}
                votes={votes}
                comments={comments}
                voteHandler={voteHandler}
                commentHandler={commentHandler}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

const CommentVoter = Radium(function CommentVoter({
  id,
  votes,
  width,
  voteHandler
}) {
  const userVote = votes.find(v => v.id === id);
  const userVoteType = userVote ? userVote.type : undefined;
  const voteButtonStyle = {
    display: "block",
    border: "none",
    outline: "none",
    padding: 0,
    margin: 0,
    width,
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
      alt={`Upvote comment ${id}`}
      onClick={voteHandler(id)("up")}
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
      alt={`Upvote comment ${id}`}
      onClick={voteHandler(id)("down")}
    />
  );

  return (
    <div
      style={{
        display: "inline-block",
        textAlign: "center",
        float: "left"
      }}
    >
      {upvoteButton}
      {downvoteButton}
    </div>
  );
});

const ReplyForm = ({ saveHandler, cancelHandler }) => {
  const [replyText, setReplyText] = useState("");
  const autofocusRef = useCallback(node => {
    if (node !== null) {
      node.focus();
    }
  }, []);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();

        saveHandler({
          text: replyText,
          created_utc: new Date().valueOf()
        });
      }}
      style={{
        display: "inline-block",
        textAlign: "right"
      }}
    >
      <textarea
        value={replyText}
        placeholder="reply"
        onChange={e => setReplyText(e.target.value)}
        ref={autofocusRef}
        style={{
          width: "30rem",
          padding: "0.25rem"
        }}
      />
      <br />
      <button onClick={cancelHandler}>Cancel</button>
      &nbsp;
      <button type="submit">Save</button>
    </form>
  );
};

const UserReply = ({ text, created_utc, depth, voterWidth }) => {
  return (
    <div
      style={{
        padding: `0.25rem`,
        margin:
          depth === 0
            ? "0 0 0.5rem 0"
            : `0.25rem 0.25rem 0.25rem calc(0.25rem + ${voterWidth})`,
        border: "1px solid gainsboro",
        background: "azure",
        fontSize: "0.8rem"
      }}
    >
      <strong>you replied {timeAgo(created_utc)}:</strong>
      <br />
      <p>{text}</p>
    </div>
  );
};

export default DetailPage;
