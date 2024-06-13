
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define the Post schema and model
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model('Post', postSchema);

// Routes

// GET /posts - return all posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET /posts/:id - return the post with the given id
app.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).send('Post not found');
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// DELETE /posts/:id - delete the post with the given id
app.delete('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (post) {
      res.send('Post deleted');
    } else {
      res.status(404).send('Post not found');
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST /posts - create a new post
app.post('/posts', async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
