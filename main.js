const fetchData = async () => {

  const initialURL = "http://wpheadress.local/graphql";
  console.log(initialURL);

  try {
    //①WP query の情報取得
    const resJson = await getAllQueryData(initialURL);
    const nodesRes = resJson.data.posts.nodes;
    console.log(resJson);
    //console.log(resJson.data.posts.nodes);

    //②WP タイトル の情報取得
    const titles = await getPostsNodesData(nodesRes, 'title');
    console.log(titles);

    //③WP 本文 の情報取得
    const contents = await getPostsNodesData(nodesRes, 'content');
    console.log(contents);

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

//WP  投稿データ の情報取得 関数
function getPostsNodesData(data, propertyName) {
  return new Promise((resolve, reject) => {
      //console.log(data);
      const datas = data.map(post => post[propertyName]);
      resolve(datas);
  });
}