import React from "react";
import Radium from "radium";
import { HOME } from "../App";
import Loading from "../components/Loading";
import PostContent from "../components/PostContent";
import PostVotes from "../components/PostVotes";

const ListPage = ({
  subreddit,
  posts,
  votes,
  refreshHandler,
  subredditHandler,
  voteHandler,
  selectPostHandler
}) => {
  return (
    <main style={{ padding: "0 0 0.25rem 0.25rem" }}>
      {subreddit !== HOME && (
        <button
          onClick={subredditHandler(HOME)}
          style={{ marginRight: "1rem", cursor: "pointer" }}
        >
          {`< Home (r/all)`}
        </button>
      )}
      <h1 style={{ display: "inline-block", verticalAlign: "middle" }}>
        {subreddit === HOME ? "Home (r/all)" : subreddit}
      </h1>
      {posts ? (
        <>
          <button
            onClick={refreshHandler}
            style={{ marginLeft: "1rem", cursor: "pointer" }}
          >
            refresh
          </button>
          <table>
            <tbody>
              {posts.map((p, i) => (
                <PostRow
                  key={p.id}
                  post={p}
                  votes={votes}
                  index={i}
                  subredditHandler={subredditHandler}
                  voteHandler={voteHandler}
                  selectPostHandler={selectPostHandler}
                />
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <Loading />
      )}
    </main>
  );
};

const PostRow = Radium(function PostRow({
  post,
  votes,
  index,
  subredditHandler,
  voteHandler,
  selectPostHandler
}) {
  const tdStyle = {
    verticalAlign: "top",
    textAlign: "center",
    paddingRight: "0.25rem"
  };

  return (
    <tr>
      <td style={tdStyle}>
        <strong
          style={{
            display: "block",
            marginTop: "18px",
            color: "gray"
          }}
        >
          {index + 1}
        </strong>
      </td>
      <td style={tdStyle}>
        <PostVotes post={post} votes={votes} voteHandler={voteHandler} />
      </td>
      <td style={tdStyle}>
        <PostContent
          {...post}
          subredditHandler={subredditHandler}
          selectPostHandler={selectPostHandler}
        />
      </td>
    </tr>
  );
});

export default ListPage;
