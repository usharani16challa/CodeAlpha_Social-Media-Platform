const API = "http://localhost:5000/api";

async function createPost() {
  const content = document.getElementById("content").value;
  const author = document.getElementById("userId").value;

  const res = await fetch(`${API}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, author })
  });

  const data = await res.json();
  alert(data.message || "Post created!");
  loadPosts();
}

async function loadPosts() {
  const res = await fetch(`${API}/posts`);
  const posts = await res.json();

  const container = document.getElementById("posts");
  container.innerHTML = '';

  posts.forEach(post => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${post.content}</strong></p>
      <button onclick="likePost('${post._id}')">Like</button>
      <input type="text" id="comment-${post._id}" placeholder="Comment..." />
      <button onclick="addComment('${post._id}')">Comment</button>
      <button onclick="followAuthor('${post.author}')">Follow Author</button>
      <button onclick="unfollowAuthor('${post.author}')">Unfollow Author</button>
      <hr />
    `;
    container.appendChild(div);
  });
}

async function likePost(postId) {
  const userId = document.getElementById("userId").value;

  if (!userId) {
    alert("Enter your User ID before liking.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });

    const data = await res.json();
    alert(data.message || "Liked!");
  } catch (err) {
    console.error("Like error:", err);
    alert("Server error while liking");
  }
}

async function addComment(postId) {
  const userId = document.getElementById("userId").value;
  const content = document.getElementById(`comment-${postId}`).value;
  await fetch(`${API}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId, userId, content })
  });
  alert("Comment added!");
}

async function followAuthor(authorId) {
  const currentUserId = document.getElementById("userId").value;
  const res = await fetch(`${API}/users/${currentUserId}/follow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetUserId: authorId })
  });
  const data = await res.json();
  alert(data.message);
}

async function unfollowAuthor(authorId) {
  const currentUserId = document.getElementById("userId").value;
  const res = await fetch(`${API}/users/${currentUserId}/unfollow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetUserId: authorId })
  });
  const data = await res.json();
  alert(data.message);
}

loadPosts();