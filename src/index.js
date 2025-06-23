console.log('before fetch');

// define global array to hold posts
let allPosts = [ ];

// intial fetch declaration once the DOM is fully loaded
// 
document.addEventListener("DOMContentLoaded", () => {
//console.log(fetch('http://localhost:3000/posts'));
fetch('http://localhost:3000/posts')
    .then(res => res.json())
    .then(posts => {
        // assigning of fetrched posts to global array
        allPosts = posts;
        retrievePosts(posts);
        fetchOnePost(4);
    });
}

);

function loadOutputDiv(post){
    
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
                    <span class="inline-block">
                        <a onclick="" class="cursor-pointer underline text-blue-900">edit</a>
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
                    <a href="" class="m-1 inline-block">${post.post_title}</a>
                    <span class="inline-block"><span>${post.author}</span>
                        <span class="pl-2">${dateCreated}</span></span>
                    <span class="block">
                        <a onclick="" class="cursor-pointer underline text-blue-900">edit</a>
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
                                    <button type="button" class="bg-blue-600 text-white m-2 px-3 py-1 rounded text-sm">
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
            let thePosts = allPosts.filter(post => post.id !== id);
            // posts = posts.filter(post => post.id !== id);
            console.log("after remove post " + thePosts);
            retrievePosts(thePosts);

        }).catch(err => console.log('Error deleting post '+err)); // forwards any errors to console.log

    }
}



window.deletePost = deletePost;
window.formatToCustomDate = formatToCustomDate;
window.fetchOnePost = fetchOnePost;