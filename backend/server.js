const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors');

const multer = require('multer');
const path = require('path')
const fs= require('fs');
const app = express();
const PORT = 5000;
app.use(bodyParser.json());
app.use(cors());
const uploadPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadPath));


const storage = multer.diskStorage({
    destination: function (req,res,cb){
        const uploadDir = path.join(__dirname, 'uploads');
        fs.mkdir(uploadDir, {recursive: true},(err)=>{
            if(err)
                {
                    console.log('Error in creating folder', err);
                }
                cb(null,uploadDir)
        });
    },
    filename:function(req,file,cb)
    {
        cb(null, file.originalname);
    }
});
const upload = multer({storage});

mongoose.connect('mongodb://127.0.0.1:27017/posting')
.then(()=> console.log('MongoDB connected'))
.catch(err => console.error('mongoDB connection error:',err));

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    file:String,
    likes: {type: Number, default:0},
    comments : [{text:String}],
})
const Post = mongoose.model('Post',postSchema);

app.get('/api/posts', async(req,res)=>{
    try{
        const posts = await Post.find();
        res.json(posts);
    }
    catch(error)
    {
        res.status(500).json({error : 'Internal server Error'})
    }
});

app.post('/api/posts', upload.single('file'),async(req,res)=>{
    try{
        const {title, content} = req.body;
        const file = req.file ? req.file.filename : undefined;
        if(!title || !content)
            {
                return res.status(400).json({error: 'Title and content are required fields' });
            }
            const post = new Post({title,content,file});
            await post.save();
            res.status(201).json(post);
    }
    catch(error){
        console.error('Error creating post:', error);
        res.status(500).json({error: 'Internal Server Error'})

    }
})


app.post('/api/posts/like/:postId', async(req,res)=>{
    try{
        const postId = req.params.postId;
        const post = await Post.findById(postId);

        if(!post)
            {
                return res.status(404).json({ error: 'Post not found' });
            }
            post.likes +=1;
            await post.save()

            res.json(post);
    }
    catch(error)
    {
        console.error('Error Liking post:',error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.post('/api/posts/comment/:postId',async (req,res)=>{
    try
    {
        const postId = req.params.postId;
        const {text} = req.body;
        const post = await Post.findById(postId);

        if(!post)
            {
                return res.status(404).json({error: 'Post not found'});
            }
            post.comments.push({text});
            await post.save();

            res.json(post)

    }
    catch(error)
    {
        console.error('Error adding Comment:',error);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

app.post('/api/upload', upload.single('image'),(req,res)=>{
    if(!req.file)
        {
            return res.status(400).send('No files were uploaded.');
        }
        res.status(200).send('File uploaded successfully.');
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
