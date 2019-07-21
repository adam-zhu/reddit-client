export const URL_ROOT = `https://www.reddit.com`;

export const getListData = async subreddit => {
  const response = await fetch(`${URL_ROOT}${subreddit}.json`);
  const responseData = await response.json();
  const formatter = rawData =>
    rawData.data.children.map(c => ({
      ...c.data
    }));

  return formatter(responseData);
};

export const getPostData = async permalink => {
  const formattedPermalink = permalink.slice(0, permalink.length - 1);
  const response = await fetch(`${URL_ROOT}${formattedPermalink}.json`);
  const [postData, commentData] = await response.json();
  const postFormatter = rawData => rawData.data.children[0].data;
  const commentFormatter = rawData => {
    const commentContentFormatter = c => ({
      ...c.data,
      replies: c.data.replies ? commentFormatter(c.data.replies) : []
    });

    return rawData.data.children.map(commentContentFormatter);
  };

  return {
    ...postFormatter(postData),
    comments: commentFormatter(commentData)
  };
};
