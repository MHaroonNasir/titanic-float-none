async function getUserIdByToken() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3000/token/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await response.json();
    const userId = data.userToken.user_id;
    return userId;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getUserInfo() {
  try {
    const userId = await getUserIdByToken();
    if (!userId) {
      throw new Error("User ID not found.");
    }
    const token = localStorage.getItem("token");
    const userDetailsResponse = await fetch(
      `http://localhost:3000/account/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const userDetails = await userDetailsResponse.json();
    const { username, email } = userDetails;
    document.getElementById("username").innerText = username.toUpperCase();
    document.getElementById("email").innerText = email;

    const userPostsResponse = await fetch(
      `http://localhost:3000/posts/user/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const userPosts = await userPostsResponse.json();
    const postsList = document.getElementById("user-posts");

    if (userPosts.length >= 1) {
      userPosts.forEach((post) => {
        const card = document.createElement("div");
        card.classList.add("card");
        const cardTitle = document.createElement("h3");
        cardTitle.classList.add("title");
        cardTitle.innerText = post.title;
        const cardContent = document.createElement("p");
        cardContent.classList.add("content");
        cardContent.innerText = post.content;
        const cardCategory = document.createElement("p");
        cardCategory.classList.add("category");
        cardCategory.innerText = `Category: ${post.category}`;
        const cardPostId = post.post_id;

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";

  

        deleteButton.addEventListener("click", async () => {
          if (confirm("Are you sure you want to delete this post?"))
            try {
              await fetch(`http://localhost:3000/posts/${cardPostId}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
              });
              card.remove();
            } catch (error) {
              console.error(error);
            }

        });

        card.appendChild(deleteButton);
        card.appendChild(cardCategory);
        card.appendChild(cardTitle);
        card.appendChild(cardContent);
        postsList.appendChild(card);
      });
    } else {
      const listItem = document.createElement("li");
      listItem.innerText = "No posts available";
      postsList.appendChild(listItem);
    }
  } catch (error) {}
}

async function getVolunteerPosts() {
  try {
    const userId = await getUserIdByToken();
    if (!userId) {
      throw new Error("User ID not found.");
    }
    const token = localStorage.getItem("token");
    const userVolunteerResponse = await fetch(
      `http://localhost:3000/volunteer/?user_id=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const volunteerPosts = await userVolunteerResponse.json();
    const volunteerLists = document.getElementById("volunteer-posts");
    if (volunteerPosts.length >= 1) {
      volunteerPosts.forEach((post) => {
        const card = document.createElement("div");
        card.classList.add("card");
        const cardTitle = document.createElement("h3");
        cardTitle.classList.add("title");
        cardTitle.innerText = post.title;
        const cardContent = document.createElement("p");
        cardContent.classList.add("content");
        cardContent.innerText = post.content;
        const cardCategory = document.createElement("p");
        cardCategory.classList.add("category");
        cardCategory.innerText = `Category: ${post.category}`;
        const cardPostId = post.volunteer_id;

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";

        deleteButton.addEventListener("click", async () => {
          if (confirm("Are you sure you want to delete this post?"))
            try {
              await fetch(`http://localhost:3000/volunteer/${cardPostId}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
              });
              card.remove();
            } catch (error) {
              console.error(error);
            }
        });

        card.appendChild(deleteButton);
        card.appendChild(cardCategory);
        card.appendChild(cardTitle);
        card.appendChild(cardContent);
        volunteerLists.appendChild(card);
      });
    } else {
      const listItem = document.createElement("li");
      listItem.innerText = "No posts available";
      volunteerLists.appendChild(listItem);
    }
  } catch (error) {
    console.error(error);
  }
}

getUserInfo();
getVolunteerPosts();

export { getUserIdByToken };
