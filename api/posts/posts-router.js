// implement your posts router here

//Imports
const express = require('express')
const Post = require('./posts-model') //Object W/ Methods


//Instance; Instantiate
const router = express.Router() //Miniature Instance Of Server W/ Router


//Endpoints
router.get('/', (req, res) => {
  Post.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res.status(500).json({
        message: "The posts information could not be retrieved",
        error: error.message
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
      res.status(500).json({
        message: "The post information could not be retrieved",
        error: error.message
      });
    });
});

router.post('/', (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" });
    } else {
        Post.insert({ title, contents })
            .then(({id}) => {
                return Post.findById(id)
            })
            .then(post => {
                res.status(201).json(post)
            })
            .catch(error => {
                res.status(500).json({
                    message: "There was an error while saving the post to the database",
                    error: error.message
                })
            })
    }    
});

router.put('/:id', (req, res) => {
    const { title, contents } = req.body
    if (!title || ! contents) {
        res.status(400).json({ 
            message: "Please provide title and contents for the post" });
    } else {
        Post.findById(req.params.id)
            .then(exists => {
                if(!exists) {
                    res.status(404).json({ 
                        message: "The post with the specified ID does not exist" });
                } else {
                    return Post.update(req.params.id, req.body)
                }
            })
            .then(data => {
                if(data) {
                    return Post.findById(req.params.id)
                }
            })
            .then(post => {
                if(post) {
                    res.status(200).json(post)
                }
            })
            .catch(error => {
                res.status(500).json({
                    message: 'Error updating the post',
                    error: error.message
                });
            })
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            await Post.remove(req.params.id)
            res.status(200).json(post)
        }
    } catch (error) {
        res.status(500).json({
            message: "The post could not be removed",
            error: error.message
        });
    }
                    // Post.remove(req.params.id)
                    //     .then(post => {
                    //         if (post) {
                    //             res.status(200).json(post);
                    //         } else {
                    //             res.status(404).json({ message: "The post with the specified ID does not exist" });
                    //         }
                    //     })
                    //     .catch(error => {
                    //         res.status(500).json({
                    //             message: "The post could not be removed",
                    //             error: error.message
                    //         });
                    //     });
});

router.get('/:id/comments', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            const messages = await Post.findPostComments(req.params.id)
            res.status(200).json(messages)
            res.status(404).json({ message: "The post with the specified ID does not exist"})
        }
    } catch (error) {
      res.status(500).json({
        message: 'The comments information could not be retrieved',
        error: error.message,
      })
    }
});


//Exports; Exposing
module.exports = router