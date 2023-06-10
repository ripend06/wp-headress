const fetchData = async () => {

  const initialURL = "http://wpheadress.local/graphql";
  console.log(initialURL);

  try {
    //①WP query の情報取得
    const resJson = await getAllQueryData(initialURL);
    const nodesRes = resJson.data.posts.nodes;
    console.log(resJson);
    //console.log(resJson.data.posts.nodes);
    //console.log(nodesRes);

    // ②タイトルとコンテンツその他 の情報取得
    const postsData = getPostsData(nodesRes);
    console.log(postsData);

    // ③タイトルとコンテンツの表示
    viewPostData(postsData);

  } catch (error) {
    console.error(error);
  }
};

fetchData();

//WP query の情報取得 関数
function getAllQueryData(url) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            posts {
              nodes {
                title
                content
                date
              }
            }
          }
        `,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
        //console.log(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// タイトルと本文のオブジェクトを作成
function getPostsData(data) {
  return data.map((post) => {
    return {
      title: post.title,
      content: post.content,
      date: post.date,
    };
  });
}

// 記事の表示関数
const viewPostData = (postData) => {
  const postContainerElement = document.querySelector('#js-post-container');

  // タイトルと本文をforEachで追加
  postData.forEach((postData) => {
    const postElement = document.createElement("div");
    postElement.classList.add("post");

    const titleElement = document.createElement("h2");
    titleElement.textContent = postData.title;
    postElement.appendChild(titleElement);

    const dateElement = document.createElement("p");
    dateElement.textContent = postData.date;
    postElement.appendChild(dateElement);

    const contentElement = document.createElement("p");
    contentElement.textContent = postData.content;
    postElement.appendChild(contentElement);

    postContainerElement.appendChild(postElement);
  });
};