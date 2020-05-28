import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  if (type === 'Post Created') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  } else if (type === 'Comment Created') {
    const { id, content, postId, status } = data;
    posts[postId].comments.push({ id, content, status });
  } else if (type === 'Comment Updated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
  console.log(posts);
  res.end();
});

app.listen(4002, () => {
  console.log('Listening on: 4002');
});
