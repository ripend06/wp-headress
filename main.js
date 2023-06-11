const fetchData = async () => {

  const initialURL = "http://wpheadress.local/graphql";
  console.log(initialURL);

  try {
    // ①WPGraphQL の情報取得
    const resJson = await getAllQueryData(initialURL);
    const nodesRes = resJson.data.posts.nodes;
    console.log(resJson);
    //console.log(resJson.data.posts.nodes);
    console.log(nodesRes);

    // ②post自作オブジェクト作成
    const postsData = getPostsData(nodesRes);
    console.log(postsData);

    // ③post自作オブジェクトをview側で表示
    viewPostData(postsData);

  } catch (error) {
    console.error(error);
  }
};

fetchData();

// WPGraphQL 取得関数
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
                content
                date
                title
                categories(where: { parent: null }) {
                  nodes {
                    name
                    children {
                      nodes {
                        name
                      }
                    }
                  }
                }
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

// 日付をフォーマットする関数
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}.${month}.${day}`;
}
// 使用例
// const formattedDate = formatDate("2023-06-06T12:34:56");
// console.log(formattedDate); // 出力: 2023.06.06


// post自作オブジェクト作成関数
function getPostsData(data) {
  return data.map((post) => {

    //カテゴリオブジェクト作成
    const categories = post.categories.nodes.map((category) => {
      const children = category.children.nodes.map((child) => child.name); // 子カテゴリ名の配列を取得
      return {
        name: category.name,
        children: children,
      };
    });

    return {
      title: post.title,
      content: post.content,
      date: formatDate(post.date), // 日付をフォーマット
      categories: categories,
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

    // タイトル表示
    const titleElement = document.createElement("h2");
    titleElement.textContent = postData.title;
    postElement.appendChild(titleElement);

    // 日付出力
    const dateElement = document.createElement("p");
    dateElement.textContent = postData.date;
    postElement.appendChild(dateElement);

    // 本文出力
    const contentElement = document.createElement("p");
    contentElement.textContent = postData.content;
    postElement.appendChild(contentElement);

    // 親カテゴリ＋子カテゴリ表示
    const categoriesElement = document.createElement("div");
    categoriesElement.classList.add("categories");

    postData.categories.forEach((category) => {
      const categoryElement = document.createElement("div");
      categoryElement.classList.add("category");

      const categoryNameElement = document.createElement("p");
      categoryNameElement.textContent = "カテゴリ: " + category.name;
      categoryElement.appendChild(categoryNameElement);

      // 子カテゴリがある場合の処理
      if (category.children.length > 0) {
        const childrenElement = document.createElement("div");
        childrenElement.classList.add("children");

        category.children.forEach((child) => {
          const childElement = document.createElement("p");
          childElement.textContent = "子カテゴリ: " + child;
          childrenElement.appendChild(childElement);
        });

        categoryElement.appendChild(childrenElement);
      }

      categoriesElement.appendChild(categoryElement);
    });

    postElement.appendChild(categoriesElement);

    // 全項目view側に挿入
    postContainerElement.appendChild(postElement);
  });
};