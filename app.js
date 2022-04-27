const express = require ('express');
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose')
const ejs = require('ejs');



const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));


mongoose.connect('mongodb://localhost:27017/wikiDB', { 
useNewUrlParser: true,
useUnifiedTopology: true,
useFindAndModify: false,
useCreateIndex: true});

const articleSchema ={
    title:String,
    content:String
};

const Article = mongoose.model('Article',articleSchema);

app.route('/articles')

     .get((req,res)=>{
        Article.find((err,founndArticles)=>{
        if(!err){
           res.send(founndArticles); 
        }else {
            res.send(err);
        }
     })
   })

    .post((req,res)=>{
     const newArticle = new Article ({
        title: req.body.title,
        content:req.body.content
        })
        newArticle.save((err)=>{
        if(!err){
            res.send("Successfully Addded a new article");
        } else {
            res.send(err);
        }
      })
    })


    .delete((req,res)=>{
     Article.deleteMany((err)=>{
        if(!err){
            res.send("succesfully deleted");
        }else {
            res.send(err);
        }
    })
});



app.route('/articles/:articleTitle')

.get((req,res)=>{
    Article.findOne({title:req.params.articleTitle },(err,foundArticle)=>{
        if(foundArticle) {
            res.send(foundArticle)
        } else{
            res.send("No Articles Found..!!")
        }
    });
})

.put((req,res)=>{
Article.update(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    {overwrite:true},
    function(err){
        if(!err){
            res.send("sucesfully updated")
        } else {
            res.send (err)
        }
    }
)
})
.patch((req,res)=>{
    Article.update(
        {title:req.params.articleTitle},
        {$set:req.body},
        
        function(err){
            if(!err){
                res.send("sucesfully updated")
            } else {
                res.send (err)
            }
        }
    )
    });




app.listen(3000,()=>{
    console.log("port listening on server on 3000");
})