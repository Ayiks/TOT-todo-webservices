// import { createServer } from 'http';
// // const http = require('http');
// const server = createServer((request, response)=>{
//     console.log('Hello World');
//     response.end(`${request.url}\n${request.method}\n${request.httpVersion}`);
// });


// //create a doorway(port) for the server.
// server.listen(3000,()=>{
//     console.log('listening on port 3000');
//     console.log('Url: http://localhost:3000/');
// });
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import TodoModel from './schemas/todo_schemas.js'
dotenv.config();

const app = express();
app.use(express.json());
const port = 5000;

const db = process.env.DB_URL;

// mongoose.connect('mongodb://localhost/todo_db', {

//     useUnifiedTopology: true,
// }).then(() => {
//     console.log('Connected to mongoDB')
// }).catch((err) => {
//     console.log(err);
// })

mongoose.connect(db, {
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to mongoDB😎')
}).catch((err) => {
    console.log(err);
})

//get all todos
// app.get('/todos', (req,res)=>{
//     return res.status(200).json({
//         message: 'Get all todos'
//     })
// })
app.get('/todos', async (req, res) => {
    const todoModel = await TodoModel.find({});
    if (todoModel) {
        return res.status(200).json({
            status: true,
            message: 'Todos fetched successfully',
            data: todoModel
        })
    } else {
        return res.status(400).json({
            status: false,
            message: 'Todods not found'
        })
    }
})

//get 1 todo
app.get('/todos/:id', async (req, res) => {
    const { id } = req.params;

    const todoModel = await TodoModel.findById(id);
    if (todoModel) {
        return res.status(200).json({
            status: true,
            message: 'Todos fetched successfully',
            data: todoModel
        })
    } else {
        return res.status(400).json({
            status: false,
            message: 'Todods not found'
        })
    }
})

//create a todo
app.post('/todos', async (req, res) => {
    const {title, description,date_time} = req.body;

    const todoModel = await TodoModel.create({
        title,
        description,
        date_time
       // ...req.body
    })
    if (todoModel) {
        return res.status(200).json({
            status: true,
            message: 'Todos created successfully',
            data: todoModel
        })
    } else {
        return res.status(400).json({
            status: false,
            message: 'Todos failed to create'
        })
    }
})

//update a todo
app.patch('/todos/:id',async (req, res) => {
    const {id} = req.params;
    const {status} = req.body;

    const todoModel = await TodoModel.updateOne({status:status}).where({_id:id});

    if (todoModel) {
        return res.status(201).json({
            status: true,
            message: 'Todos marked has completed',
            data: todoModel
        })
    } else {
        return res.status(400).json({
            status: false,
            message: 'Todos marked failed'
        })
    }
})

//delete a todo
app.delete('/todos/:id', async (req, res) => {
    const todoModel = await TodoModel.findByIdAndDelete(req.params.id);
    if (todoModel) {
        return res.status(201).json({
            status: true,
            message: 'Todos deleted successfully',
            data: todoModel
        })
    } else {
        return res.status(400).json({
            status: false,
            message: 'Failed to delete todos'
        })
    }
    
})

app.get('/', (request, response) => {
    return response.status(200).json({
        message: 'Welcome to the Todo aPI'
    })
})

app.listen(port, () => console.log(`Example app Listening on port ${port}!`));

