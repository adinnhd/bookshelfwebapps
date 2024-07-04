const details = [];
const RENDER_EVENT = 'render-detail'
const searchBook = document.getElementById("searchBookTitle");
const booklist = document.getElementsByClassName("book_list");
const listItem = document.getElementsByClassName("item");
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

document.addEventListener('DOMContentLoaded', function(){
  alert('Welcome to Bookshelf Apps!')
})

document.addEventListener('DOMContentLoaded', function (){
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBook ();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
      }
});

function addBook (){
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookWriter = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;

    const checkbox = document.getElementById('inputBookIsComplete').checked;
    const generateID = generateId ();
    const bookDetail = generateBookDetail(generateID, bookTitle, bookWriter, bookYear, checkbox);
    details.push(bookDetail);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId (){
    return +new Date();
}

function generateBookDetail(id, title, writer, year, isComplete){
    return {
        id,
        title,
        writer,
        year,
        isComplete
    }
}

document.addEventListener(RENDER_EVENT,function(){
    console.log(details);
});

function makeBook (bookDetail){
    const textTitle = document.createElement('h2');
    textTitle.innerText = bookDetail.title;

    const textWriter = document.createElement('h3');
    textWriter.innerText = `Penulis : ${bookDetail.writer}`;

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun : ${bookDetail.year}`;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textWriter, textYear);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookDetail.id}`);

    //return container;

    if (bookDetail.isComplete){
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function(){
            undoBookFromFinished(bookDetail.id);
        })

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
 
        trashButton.addEventListener('click', function () {
            removeBookFromFinished(bookDetail.id);
    });
    container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function(){
            addBookToFinished(bookDetail.id);
        })
    container.append(checkButton);
    }
    return container;
}

function addBookToFinished (bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData()
  }

function findBook(bookId) {
    for (const bookItem of details) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }

function removeBookFromFinished(bookId) {
    const bookTarget = findBookIndex(bookId);
   
    if (bookTarget === -1) return;
   
    details.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
   
function findBookIndex(bookId) {
    for (const index in details) {
      if (details[index].id === bookId) {
        return index;
      }
    }
   
    return -1;
  } 

function undoBookFromFinished(bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }



searchBook.addEventListener('keyup', function(e){
    const listTerm = e.target.value.toLowerCase();
    for(let i = 0; i < listItem.length; i++){
        const text = listItem[i].textContent.toLowerCase();
        if(text.includes(listTerm)){
            listItem[i].style.display = "flex";
        } else {
            listItem[i].style.display = "none";
        }
    }
})


document.addEventListener(RENDER_EVENT,function(){
    const finishedBook = document.getElementById('completeBookshelfList');
    finishedBook.innerHTML = "";

    const unfinishedBook = document.getElementById('incompleteBookshelfList');
    unfinishedBook.innerHTML = "";

    for (const bookItem of details){
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete){
        unfinishedBook.append(bookElement);
        } else {
        finishedBook.append(bookElement);
        }
    }
});


function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(details);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

   
function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const book of data) {
        details.push(book);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

