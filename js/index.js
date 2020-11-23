document.addEventListener("DOMContentLoaded", function() {
    fetch('http://localhost:3000/books')
    .then(resource => resource.json())
    .then((data) => {
        data.forEach(myFunc)
        function myFunc(value){
          addBookToList(value)
        }
      })
});

function addBookToList(book) {
    const bookLI = document.createElement('li')
    bookLI.innerText = book.title
    bookLI.dataset.bookId = book.id
    const bookList = document.querySelector('#list')
    bookList.appendChild(bookLI)

    bookLI.addEventListener('click', function(event) {
        showBook(book)
    })
}

function showBook(book) {
    const bookShowPanel = document.querySelector('#show-panel')
    removeAllChildNodes(bookShowPanel)

    const bookPic = document.createElement('img')
    bookPic.src = book.img_url
    
    const bookTitle = document.createElement('h1')
    bookTitle.innerText = book.title

    const bookSubtitle = document.createElement('h1')
    bookSubtitle.innerText = book.subtitle

    const bookAuthor = document.createElement('h1')
    bookAuthor.innerText = book.author

    const bookDescription = document.createElement('p')
    bookDescription.innerText = book.description

    const bookUsers = document.createElement('ul')

    book.users.forEach(addUserToPage)

    function addUserToPage(value){
        const bookUser = document.createElement('li')
        bookUser.innerText = value.username
        if (value.username === "pouros") {
            bookUser.id = 'target'
        }
        bookUsers.appendChild(bookUser)
    }

    function removeUserFromPage(){
        const bookUser = bookUsers.querySelector('#target')
        bookUsers.removeChild(bookUser)
    }
    

    // const bookShowPanel = document.querySelector('#show-panel')
    bookShowPanel.appendChild(bookPic)
    bookShowPanel.appendChild(bookTitle)
    bookShowPanel.appendChild(bookSubtitle)
    bookShowPanel.appendChild(bookAuthor)
    bookShowPanel.appendChild(bookDescription)
    bookShowPanel.appendChild(bookUsers)
        if (document.querySelector('#target')){
            const unlikeButton = document.createElement('button')
            unlikeButton.innerText = "Unlike"

            
            unlikeButton.addEventListener('click', function(event){
                fetch(`http://localhost:3000/books/${book.id}`, {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    },
                    body: JSON.stringify({
                        "users": removeUserFromArray(book)
                    })
                })
                .then(function(response) {
                    return response.json
                })
                .then(function(object) {
                    removeUserFromPage()
                })
            })

            bookShowPanel.appendChild(unlikeButton)
        } else {
            const likeButton = document.createElement('button')
            likeButton.innerText = "Like"
        
            likeButton.addEventListener('click', function(event) {
                // console.log(book)
                fetch(`http://localhost:3000/books/${book.id}`, {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    },
                    body: JSON.stringify({
                        "users": pushUserToArray(book)
                    })
                })
                .then(function(response) {
                    return response.json
                })
                .then(function(object) {
                    addUserToPage({"id":1, "username":"pouros"})
                })
            })
            
            bookShowPanel.appendChild(likeButton)
        }
    // let button = document.querySelector('button')
    // let clicked = false;
    // const buttonSwitch = (button) => {
    //     clicked =! clicked;
    //     if(clicked) {
    //         button.innerText = 'Unlike';
    //     } else {
    //         button.innerText = 'Like';
    //     }
    // }
    
    // buttonSwitch(button)
        
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function pushUserToArray(book){
    book.users.push({"id":1, "username":"pouros"})
    return book.users
}

function removeUserFromArray(book){
    book.users.pop()
    return book.users
}