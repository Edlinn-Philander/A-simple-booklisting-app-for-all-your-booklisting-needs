//book class: Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//UI Class: Handle Ui tasks
class UI {
  static displayBooks() {
    const books = store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }
  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${book.title}</td> 
    <td>${book.author}</td> 
    <td>${book.isbn}</td> 
    <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>`;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }
  //this is the alert at the top of html file
  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = ` alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);

    //vanish in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

//store class: Handles storage
class store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static addBook(book) {
    const books = store.getBooks();

    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

//events: display books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//events:Add a book
document.querySelector("#book-form").addEventListener("submit", (event) => {
  //prevent default submit
  event.preventDefault();
  //get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  //validate
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    //instantiate book
    const book = new Book(title, author, isbn);

    //add book to ui
    UI.addBookToList(book);

    //add book to store
    store.addBook(book);

    //show success message
    UI.showAlert("book added", "success");

    //clear fields
    UI.clearFields();
  }
});

//event:Remove a book
document.querySelector("#book-list").addEventListener("click", (event) => {
  //remove book from ui
  UI.deleteBook(event.target);

  //remove book from the store

  store.removeBook(
    event.target.parentElement.previousElementSibling.textContent
  );

  //show success message
  UI.showAlert("book removed", "danger");
});
