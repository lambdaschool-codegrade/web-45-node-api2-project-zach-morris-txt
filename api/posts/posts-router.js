// implement your posts router here

//Imports
const express = require('express')
const Post = require('./posts-model') //Object W/ Methods


//Instance; Instantiate
const router = express.Router() //Miniature Instance Of Server W/ Router


//Endpoints
router.get('/', (req, res) => {
  Post.find(req.query)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "The posts information could not be retrieved",
      });
    });
});

router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "The post information could not be retrieved",
      });
    });
});

router.post('/', (req, res) => {
  Post.insert(req.body)
    .then(post => {
        if (!req.body.title || !req.body.contents) {
            res.status(400).json({ message: "Please provide title and contents for the post" });
        } else {
            res.status(201).json(post);
        }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "There was an error while saving the post to the database",
      });
    });
});

router.put('/:id', (req, res) => {
  const changes = req.body;
  Post.update(req.params.id, changes)
    .then(post => {
        if (!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" });
        } else if (!req.body.title || !req.body.contents) {
            res.status(400).json({ message: "Please provide title and contents for the post" });
        } else {
            res.status(200).json(post);
        }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error updating the post',
      });
    });
});

router.delete('/:id', (req, res) => {
    Post.remove(req.params.id)
    .then(post => {
        if (post) {
          res.status(200).json(post);
        } else {
          res.status(404).json({ message: "The post with the specified ID does not exist" });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          message: "The post could not be removed",
        });
      });
});

router.get('/:id/comments', async (req, res) => {
    try {
      const { id } = req.params
      const comments = await Post.findPostComments(id)
      if (comments.length) {
        res.status(200).json(comments)
      } else {
        res.status(404).json({ message: 'The post with the specified ID does not exist'})
      }
    } catch (err) {
      res.status(500).json({
        custom: 'The comments information could not be retrieved',
        message: err.message,
      })
    }
});


//Exports; Exposing
module.exports = router