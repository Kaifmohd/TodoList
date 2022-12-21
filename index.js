//Using express
const express = require('express');
//bodyparser
const bodyParser = require('body-parser');
//mongodb --- mongoose
const db = require('./config/mongoose');
//making use of express functionality 
const Tasks=require('./models/task');
const app = express();
//port number
const port = 8000;

//setting up ejs template
app.set('view engine','ejs');
//adding ejs and showing the path for the views folder
app.set('views','./views');

app.use(bodyParser.urlencoded({ extended: true }));
//using assets for static files like js and css
app.use(express.static('assets'));

app.get('/' , function(req,res){
    Tasks.find({},function(err,tasks){
        if(err){
            console.log("Error in fetching tasks");
        }
        res.render('index',{
            title:'TODO List App',
            tasks: tasks
        });
    });
});

app.post('/add-task', function(req,res){
    Tasks.create({
        task: req.body.task,
        date: req.body.date,
        category:req.body.category
    }, function(err, newTask){
        if(err){
            console.log("Error in creating a task");
            return;
        }
        return res.redirect('back');
    });
});

app.get('/delete-task',function(req,res){
    console.log(req.query);
    const id = req.query;
    const count = Object.keys(id).length;
    for(let i=0;i<count;i++){
        Tasks.findByIdAndDelete(Object.keys(id)[i],function(err){
            if(err){
                console.log('Error in deleting the task from DB');
            }
            
        });
        console.log('Task Deleted');
    }
    return res.redirect('back');
});


app.listen(port, function(err){
    if(err){
        console.log(err);
    }
    console.log(`Connection established on port: ${port}`);
});