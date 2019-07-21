import React, { useEffect, useState } from "react";
import { getListData, getPostData } from "./services";
import ListView from "./pages/List";
import DetailView from "./pages/Detail";

export const HOME = "/r/all";
const initialState = {
  subreddit: HOME,
  posts: undefined,
  selectedPostPermalink: undefined,
  post: undefined,
  votes: [], // { id: `post id`, type: enum("up", "down") }
  comments: [] // { id: `comment id`, text: `comment text`, created_utc: unix timestamp }
};

const App = () => {
  const [state, setState] = useState(initialState);
  const update = chunk =>
    setState(currentState => ({
      ...currentState,
      ...chunk
    }));

  useEffect(() => {
    getListData(state.subreddit).then(posts => update({ posts }));
  }, [state.subreddit, Boolean(state.posts)]);

  useEffect(() => {
    if (state.selectedPostPermalink) {
      getPostData(state.selectedPostPermalink).then(post => update({ post }));
    }
  }, [state.selectedPostPermalink]);

  return render(state, {
    refreshHandler: e => update({ posts: undefined }),
    subredditChangeHandler: subreddit => e =>
      update({ posts: undefined, subreddit }),
    voteHandler: id => type => e =>
      setState(currentState => {
        const previousVote = currentState.votes.find(v => v.id === id);

        if (previousVote) {
          if (type === previousVote.type) {
            return {
              ...currentState,
              votes: currentState.votes.filter(v => v.id !== id)
            };
          }

          return {
            ...currentState,
            votes: currentState.votes.map(v =>
              v.id === id ? { ...v, type } : v
            )
          };
        }

        return {
          ...currentState,
          votes: currentState.votes.concat([{ id, type }])
        };
      }),
    selectPostHandler: selectedPostPermalink => e =>
      update({ selectedPostPermalink, post: undefined }),
    subredditSelectFromPostHandler: subreddit => e =>
      update({
        selectedPostPermalink: undefined,
        post: undefined,
        posts: undefined,
        subreddit
      }),
    commentHandler: id => ({ text, created_utc }) =>
      setState(currentState => ({
        ...currentState,
        comments: currentState.comments.concat([{ id, text, created_utc }])
      }))
  });
};

const render = (
  { subreddit, posts, selectedPostPermalink, post, votes, comments },
  {
    refreshHandler,
    subredditChangeHandler,
    voteHandler,
    selectPostHandler,
    subredditSelectFromPostHandler,
    commentHandler
  }
) => {
  if (Boolean(selectedPostPermalink)) {
    return (
      <DetailView
        post={post}
        votes={votes}
        comments={comments}
        voteHandler={voteHandler}
        backHandler={selectPostHandler(undefined)}
        subredditHandler={subredditSelectFromPostHandler}
        commentHandler={commentHandler}
      />
    );
  }

  return (
    <ListView
      subreddit={subreddit}
      posts={posts}
      votes={votes}
      refreshHandler={refreshHandler}
      subredditChangeHandler={subredditChangeHandler}
      voteHandler={voteHandler}
      selectPostHandler={selectPostHandler}
    />
  );
};

export default App;
