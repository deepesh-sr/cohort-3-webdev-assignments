const { Router } = require("express");
const userMiddleware = require("../middleware/user");
const router = Router();
const {Todo} = require("../database/index.js");

// todo Routes
router.post('/',userMiddleware,async (req, res) => {
    // Implement todo creation logic
    try{
        const {title, description} = req.body;

        if(!title){
            return res.status(400).json({
                message : "Title is required"
            })
        }

        const todo = new Todo({
            title : title,
            description,
            userId : req.user.userId,
            completed : false
        })

        await todo.save();

        res.status(201).json({
            message : "Todo created succesfully",
            todo : todo
        })
    }catch(e){
        res.status(500).json({
            message : "Error creating todo",
            e : e.message
        })
    }
});

router.put('/:id', userMiddleware, async (req, res) => {
    try {
        const {id} = req.params;
        const {title, description, completed} = req.body;

        // Find the todo first
        const todo = await Todo.findOne({
            _id: id, 
            userId: req.user.userId
        });

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found or you don't have permission to update it"
            });
        }
        
        // Update fields if provided
        if (title !== undefined) todo.title = title;
        if (description !== undefined) todo.description = description;
        if (completed !== undefined) todo.completed = completed;

        // Save the updated todo
        await todo.save();

        // Return the updated todo
        res.status(200).json({
            message: "Todo updated successfully",
            todo: todo  // Include the updated todo
        });
    } catch (error) {
        console.error('PUT Error:', error); // Add logging
        res.status(500).json({
            message: "Error updating todo",
            error: error.message
        });
    }
});

router.delete('/', userMiddleware,async (req, res) => {
    // Implement delete todo logic
try{
    const todo = await Todo.findOneAndDelete({
        userId : req.user.userId
    })

    if(!todo){
        return res.status(404).json({
            message : "Todo not found or you don't have persmission to delete it"
        })
    }

    res.status(200).json({
        message : "Todo deleted successfully"
    })}catch(e){
        res.status(500).json({
            message : "Error deleting todo",
            error : error.message
        })
    }
});

router.delete('/:id', userMiddleware, async (req, res) => { // Add async
    try{
        const {id} = req.params;

        const todo = await Todo.findOneAndDelete({ // Add await
            _id : id, 
            userId : req.user.userId
        })

        if(!todo){
            return res.status(404).json({
                message : "Todo not found or you don't have persmission to delete it"
            })
        }

        res.status(200).json({
            message : "Todo deleted successfully"
        })}catch(e){
        res.status(500).json({
            message : "Error deleting todo",
            error : error.message
        })
    }
});


router.get('/', userMiddleware, async (req, res) => {
    // Implement fetching all todo logic
    try{
        const todo = await Todo.find({
            userId : req.user.userId
        })

        if (!todo) {
            return res.status(400).json({
                message : "Todo not found"
            })
        }
        return res.status(200).json({
            todo : todo
        })
    }catch(e){
        return res.status(400).json({
            message : e
        })
    }
});

router.get('/:id', userMiddleware,async (req, res) => {
    // Implement fetching todo by id logic
    try{
        const {id} = req.params;

        const todo = await Todo.findOne({
            _id : id,
            userId : req.user.userId
        })

        if ( !todo){
           return res.status(404).json({
                message : "Todo not found"
            })
        }

        res.status(200).json({
            todo : todo
        })
    }catch(e){
        res.status(500).json({
            error : e.message
        })
    }
});

module.exports = router;