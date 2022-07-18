import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'


const PORT = process.env.PORT || 5000
const MONGO_URL = 'mongodb+srv://admin:54321@cluster0.uygwq.mongodb.net/todos?retryWrites=true&w=majority'

mongoose.connect(MONGO_URL).then(()=>console.log('Data base started')).catch(err=>console.log(`Data base no started ${err}`))
const ToDos = mongoose.model('ToDos', {title:String, complited:Boolean})

const app = express()
app.use(express.json())
app.use(cors({origin: "*"}))


app.get('/api/get', (req, res)=>{
    ToDos.find()
    .then(data=>{
        res.setHeader("Access-Control-Allow-Origin", "*")
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Max-Age", "1800");
        res.setHeader("Access-Control-Allow-Headers", "content-type");
        res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
        res.json(data)})
    .catch(err=>res.json(err))
})

app.post('/api/post', (req,res)=>{
    const items = {
        title: req.body.title,
        complited: false
    }
    const newToDo = new ToDos(items)
    newToDo.save()
    res.json(newToDo)
})

app.options('/api/del', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
   res.writeHead(200);
   res.end();
});
app.delete('/api/del', (req,res)=>{
    ToDos.findByIdAndRemove(req.body.id).exec()
    res.send(`${req.body.id} deleted`)
})


app.options('/api/put', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    res.writeHead(200);
   res.end();
});
app.patch('/api/put', (req, res)=>{
    ToDos.findById(req.body.id, (err, todo)=>{
        if(err){
            res.send(`${req.body.id} not found`)
        }
        todo.complited = req.body.complited
        todo.save()
        res.json({
            id: req.body.id,
            complited: req.body.complited
        })
    })
})

app.listen(PORT, (err)=>{
    if(err){
        console.log(`Server not started ${err}`);
    }
    console.log(`Server started on port ${PORT}`);
})
