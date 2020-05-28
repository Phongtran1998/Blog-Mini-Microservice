import express from 'express';
import bodyParser from 'body-parser';
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios';

const app = express();

const commentsByPostId = {};

app.use(cors());
app.use(bodyParser.json());

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ commentId, content });

  commentsByPostId[req.params.id] = comments;
  await axios.post('http://localhost:4005/events', {
    type: 'Comment Created',
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: 'pending'
    }
  });

  res.status(201).send(comments);
});

app.post('/events', (req, res) => {
  const event = req.body;
  console.log('Received event: ', event.type);
  res.end();
});

app.listen(4001, () => {
  console.log('Listening on 4001');
});
