const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks', auth, async (req, res) => {
    const _id = req.user._id
    const filter = {
        owner: _id,
    }

    if (req.query.completed) {
        filter.completed = req.query.completed === 'true'
    }

    const sort = {}
    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1: 1
    }

    try {
        const tasks = await Task.find(filter).sort(sort).limit(parseInt(req.query.limit)).skip(parseInt(req.query.skip))
        res.send(tasks)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _taskId = req.params.id
    try {
        const task = await Task.findOne({_id:_taskId, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (e) {
        return res.status(500).send(e)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates!!' })
    }
    try {
        // const task = await Task.findById(req.params.id)
        const task = await Task.findOne({_id:req.params.id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) =>  {
            task[update] = req.body[update]
        })
        await task.save()     
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})



router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete({id: req.params.id, owner: req.user._id})
        if (!task) {
            return res.status(404).send('Task Id not found')
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router;