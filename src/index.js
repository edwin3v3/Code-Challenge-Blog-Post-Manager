console.log('before fetch');

// intial fetch declaration once the DOM is fully loaded
// 
document.addEventListener("DOMContentLoaded", () => {
//console.log(fetch('http://localhost:3000/posts'));
fetch('http://localhost:3000/posts')
    .then(res => res.json())
    .then(posts => retrievePosts(posts));
});
   
console.log('after fetch');


// Create one post item
function createPostItem(post) {
 

  return `

        <div class="p-3 flex m-1 space-x-1">
                <div class="m-1"><img src="${post.image}" alt="" class="object-cover w-[150px]"></div>
                <div class="p-1">
                    <a href="" class="m-1 inline-block">${post.post_title}</a>
                    <span class="inline-block"><span>${post.author}</span>
                        <span class="pl-2">${post.time_stamp}</span></span>
                    <span class="block">
                        <a onclick="" class="cursor-pointer">edit</a>
                        <a onclick="" class="ml-2 cursor-pointer">del</a></span>
                </div>

        </div>
    `;
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

    if(posts.length === 0){

        postsOuter.innerHTML = "";
        postsOuter.style.height = '0px';
        emptyState.style.display = "block";
        postsCount.textContent = "0 posts";
    }
    else{
        postsCount.textContent = `${posts.length} Posts`;
        emptyState.style.display = 'none';
        
        // Calls another function
        // createPostItem function - which fills Post Title, Author & Date
        postsList.innerHTML = posts.map(post => createPostItem(post)).join('');

    }
}