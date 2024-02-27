import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import { fileURLToPath } from "url";
import path from "path";
import { rmSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));


const posts = [
    { id: 1, title: 'First Post', content: 'This is the content of the first post.' },
    { id: 2, title: 'Second Post', content: 'This is the content of the second post.' }
];

//const postIdToFind = 2;
//const post = posts.find(post => post.id === postIdToFind);

//console.log(post);

app.get("/", (req,res)=>{
    res.render("index.ejs", { posts: posts});
})
app.get("/write", (req,res)=>{
    res.render("write.ejs");
})
app.get("/edit", (req,res)=>{
    res.render("edit.ejs");
})
app.get("/read", (req, res)=>{
    res.render("read.ejs");
})

app.post("/read", (req,res)=>{
      // Extract the ID from the form input submitted by the user
      const postId = parseInt(req.body.id); // Assuming the input name is "id" and it's a number

      // Search for a post in the "posts" array based on the provided ID
      const foundPost = posts.find(post => post.id === postId);
  
      // Render the "read" view with the found post or an error message
      if (foundPost) {
          res.render("read", { title: JSON.stringify(foundPost.title), content: JSON.stringify(foundPost.content)});
      } else {
          res.render("read", { error: "Post not found" });
      }

})

app.post("/post", (req,res)=>{
    const title= req.body.title;
    const content = req.body.content;
    const newPost={
        id: posts.length +1,
        title: title,
        content: content
    }
    posts.push(newPost);
    res.redirect("/");
})

app.post("/edit", (req,res)=>{
   const postId = parseInt(req.body.id);
   const updatedTitle = req.body.title;
   const updatedContent = req.body.content;
   const postToUpdate= posts.find(post => post.id === postId);
   if (postToUpdate) {
    // Update the post's title and content
    postToUpdate.title = updatedTitle;
    postToUpdate.content = updatedContent;
    res.redirect("/"); // Redirect to the homepage after updating
} else {
    // Handle the case where the post with the provided ID is not found
    res.status(404).send("Post not found");
}
})


app.listen(port, ()=>{
    console.log("Listening to port: " + port);
});
