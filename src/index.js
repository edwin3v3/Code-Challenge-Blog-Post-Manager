console.log('before fetch');

// define global array to hold posts
let allPosts = [];

// open and close Dialogs
function openDialog() {
    document.getElementById('outerDialog').classList.remove('hidden');
}

function closeDialog() {
    document.getElementById('outerDialog').classList.add('hidden');
    
}

// function to edit a post

function editPost(id){
    if(confirm("EDIT: Are you sure?")){
        console.log('Post to be edited '+id);
        let post4Edit = allPosts.find(post => post.id === Number(id));
        console.log('post to be updated ' +post4Edit, post4Edit.id);

        loadEditForm(post4Edit); // function to populate the Edit Form
    }
}

// function to populate the Edit Form

function loadEditForm(post) {
    console.log('why not' +post.id);
  document.getElementById("post-id").value = post.id;
  document.getElementById("post-image").value = post.image;
  document.getElementById("post-title").value = post.post_title;
  document.getElementById("post-content").value = post.post_content;
  document.getElementById("post-author").value = post.author;

  // opens dialog with form which is populated as shown above

  openDialog();

 
}

// Add post or // Edit Post - Depending on the existence of post-id
function addPost(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const postId = formData.get("post-id");

    console.log('Are you real '+postId);

    // no longer necessary
    // // 1. Find highest existing post_id
    // const maxId = allPosts.length > 0
    //     ? Math.max(...allPosts.map(post => post.post_id))
    //     : 0;

    const postData = {
        //id: maxId + 1, // no longer necessary
        image: formData.get("post-image"),
        post_title: formData.get("post-title"),
        post_content: formData.get("post-content"),
        author: formData.get("post-author"),
        time_stamp: Date.now()

    };

    const thisPostItem = allPosts.find(post => post.id === Number(postId));
    console.log('try post item ' + thisPostItem);
    console.log('try post item ' + thisPostItem, typeof thisPostItem);
    if (thisPostItem) {
        thisPostItem.post_title = postData.post_title;
        thisPostItem.post_content = postData.post_content;
        thisPostItem.image = postData.image;
        thisPostItem.author = postData.author;
        thisPostItem.time_stamp = postData.time_stamp
    }

    // const postToBeUpdated = allPosts.find(post => post.id === postId);
    // console.log('this one '+postToBeUpdated);

    // console.log('Regarding update '+postToBeUpdated, postToBeUpdated.post_title);
    // if (postToBeUpdated) {
    //     postToBeUpdated.post_title = postData.post_title;
    //     postToBeUpdated.post_content = postData.post_content;
    // }
    console.log('Should contain post object '+postData.time_stamp);
    if(postId){
        // meaning we are dealing with an existing post in the form data.
        // therefore update

        fetch(`http://localhost:3000/posts/${postId}`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(postData)
        })
        .then(res => res.json())
        .then(updatedPost => {
            console.log('Post updated:', updatedPost);
            retrievePosts(allPosts); // refresh the DOM UI
            event.target.reset();
            document.getElementById("post-id").value = "";
            fetchOnePost(thisPostItem.id);

        });
    }else{
        // no existing post-id
        // therefore adding new post
        allPosts.push(postData); // add new post object to AllPosts array
        retrievePosts(allPosts); // refresh DOM UI
        event.target.reset(); // set form fields to nothing

        // push data to db.json
        savePost(postData); // External function specifically of pusihing tdat to to json

    }

 
    
}

function savePost(newPost) {
  fetch('http://localhost:3000/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newPost) // ✅ send your post object here
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to save post');
      }
      return res.json(); // ✅ parse the response
    })
    .then(savedPost => {
      console.log("Post saved:", savedPost);
      // Optionally update UI here
    })
    .catch(error => {
      console.error("Error saving post:", error.message);
    });
}





// intial fetch declaration once the DOM is fully loaded
// 
document.addEventListener("DOMContentLoaded", () => {
    let ex = document.getElementById('postForm').addEventListener('submit', addPost);
    console.log(ex);
    //console.log(fetch('http://localhost:3000/posts'));
    fetch('http://localhost:3000/posts')
        .then(res => res.json())
        .then(posts => {
            // assigning of fetrched posts to global array
            allPosts = posts;
            retrievePosts(posts);
            // default load

            const firstPost = allPosts[0];
            fetchOnePost(firstPost.id);
        });
});

function loadOutputDiv(post){
    // returns a html string
    
    console.log(post.time_stamp);
    let dateCreated = formatToCustomDate(post.time_stamp);
    console.log('date after format '+typeof dateCreated, dateCreated);
    //console.log('let us see '+fetchOnePost(id));
    //console.log('id value '+id);
    //outPutDiv.innerHTML = fetchOnePost(id);

    return `

            <div class="p-3 flex m-1 space-x-1">
                    
                <div class="m-1"><img src="${post.image}" alt="" class="object-cover w-[400px]"></div>
                <div class="p-1">
                    <span class="inline-block" style ="text-align:right;">
                        <a onclick="editPost(${post.id})" class="cursor-pointer underline text-blue-900">edit</a>
                        <a onclick="deletePost(${post.id})" class="ml-2 cursor-pointer text-red-800 underline">del</a>
                    </span>
                    <h2 class="m-1 block font-medium text-3xl">${post.post_title}</h2>
                    <span class="block">
                        <span>${post.author}</span>
                         <span class="pl-2">${dateCreated}</span>
                    </span>
                    <p>${post.post_content}</p>

                    
                </div>

        </div>
    `;

}

// loadDialog()

function loadDialog(){

    return `
            
    `;

}


   
console.log('after fetch');

// to load one post on the outPut Div

function fetchOnePost(id) {
  const outPutDiv = document.getElementById('outPutDiv');

  fetch(`http://localhost:3000/posts/${id}`, {
    method: 'GET'
  })
    .then(res => {
      if (!res.ok) {
        
        throw new Error('Failed to retrieve post');
      }
      return res.json(); 
    })
    .then(post => {
      console.log("Post retrieved:", post);
      // calls loadOutputDiv - to populate outPutDiv with content
      outPutDiv.innerHTML = loadOutputDiv(post); 
    })
    .catch(error => {
      console.error("Error retrieving post:", error.message);
    });
}


// Create one post item
function createPostItem(post) {
    
    //console.log(post.time_stamp);
    let dateCreated = formatToCustomDate(post.time_stamp);
    //console.log('date after format '+typeof dateCreated, dateCreated);


    return `

        <div class="p-3 flex m-1 space-x-1">
                <div class="m-1"><img src="${post.image}" alt="" class="object-cover w-[150px]"></div>
                <div class="p-1">
                    <a onclick="fetchOnePost(${post.id})" class="my-2 mx-0.5 inline-block text-[18px] font-medium leading-tight cursor-pointer">${post.post_title}</a>
                    <span class="inline-block"><span>${post.author}</span>
                        <span class="pl-2">${dateCreated}</span></span>
                    <span class="block">
                        <a onclick="editPost(${post.id})" class="cursor-pointer underline text-blue-900">edit</a>
                        <a onclick="deletePost(${post.id})" class="ml-2 cursor-pointer text-red-800 underline">del</a></span>
                </div>

        </div>
    `;
}

// generate the date to format 2025-jun-23

function formatToCustomDate(timestamp) {

  const date = new Date(Number(timestamp)); // Number() function to coerce the given timestamp into an actual number from string

  const year = date.getFullYear();

  const day = String(date.getDate());

  // Month names in lowercase 3-letter format
  const shortMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const month = shortMonths[date.getMonth()];

  return `${year}-${month}-${day}`;
}

// function to retrieve all blog post titles - and count how many they are...
// receives the data object... 

function retrievePosts(posts){

    // declare some variables to used in the DOM
    const emptyState = document.getElementById('emptyState');
    const postsList = document.getElementById('postsList');
    const postsCount = document.getElementById('postsCount');
    const postsOuter = document.getElementById('postsOuter');

    // What happens when there's no posts

    postsCount.innerHTML = `<div class="flex justify-between items-center">
                                    <span>${posts.length} Posts</span>
                                    <button type="button" onclick="openDialog()" class="bg-blue-600 text-white m-2 px-3 py-1 rounded text-sm">
                                    Create Post
                                    </button>
                                </div>`;

    if(posts.length === 0){

        postsOuter.innerHTML = "";
        postsOuter.style.height = '0px';
        emptyState.style.display = "block";
        postsCount.textContent = "0 posts";
    }
    else{
       
        emptyState.style.display = 'none';
        
        // Calls another function
        // createPostItem function - which fills Post Title, Author & Date
        postsList.innerHTML = posts.map(post => createPostItem(post)).join('');

    }
}

// Delete a Post
// delete posts in the DOM
// Also want to delete post in db.json
function deletePost(id) {
    console.log(typeof allPosts, allPosts);
    if (confirm("Are you sure you want to delete this post")) {
        // delete posts from json server
        fetch(`http://localhost:3000/posts/${id}`, {
            method: 'DELETE'
        }).then(res => {
            if (!res.ok) {
                // catch error
                throw new Error('Failed to detele post');
            }

            // This deletes post in the DOM

            console.log("post id " + id);
            let thePosts = allPosts.filter(post => post.id !== Number(id));
            // posts = posts.filter(post => post.id !== id);
            console.log("after remove post " + thePosts);
            retrievePosts(thePosts);

        }).catch(err => console.log('Error deleting post '+err)); // forwards any errors to console.log

    }
}




// make onclick functions global even on the html side
window.deletePost = deletePost;
window.addPost = addPost;
window.editPost = editPost;
window.formatToCustomDate = formatToCustomDate;
window.fetchOnePost = fetchOnePost;
window.openDialog = openDialog;
window.closeDialog = closeDialog;