const saveBtn = document.getElementById("btn-save");
const printbtn = document.getElementById("btn-print")
const newdocumentBtn = document.getElementById("new-document-btn");
const closeSlideBtn = document.getElementById("closeButton");
let noteArray = getLocalStorage();
let noteToView;
let inputTitle = document.getElementById("input-Title");



const barThemeListBtn = document.getElementById("bar-themelist-btn");
const defaultthemelistbtn = document.getElementById("default-themelist-btn");
const hallowenthemelistbtn = document.getElementById("hallowen-themelist-btn");
const birthdaythemelistbtn = document.getElementById("birthday-themelist-btn");
const christmasthemelistbtn = document.getElementById("christmas-themelist-btn");


const themeDroplistMenu = document.getElementById("themListMenu");

let themelistopen = false;

let selectedTheme;



createNote(noteArray);

window.onclick = function (event) {
    //Toggle from non-favorite to favorite
    if (event.target.className === 'far fa-star') {
        event.target.className = ('fas fa-star');
        event.target.style.color = ('yellow');
        noteToViewFav = findObject(event.target.parentElement.parentElement.id, noteArray);
        toggleFavorite(noteToViewFav);


        //Toggle from favorite to non-favorite
    } else if (event.target.className === 'fas fa-star') {
        event.target.className = ('far fa-star');
        event.target.style.color = ('black');
        noteToViewFav = findObject(event.target.parentElement.parentElement.id, noteArray);
        toggleFavorite(noteToViewFav);


        //If documents are selected open in the editor and put title
    } else if (event.target.parentElement.classList.contains('document-handler-item')) {

        cleanThemes();
        noteToView = findObject(event.target.parentElement.id, noteArray);
        selectedTheme = noteToView.classTheme;
        quill.root.classList.add(selectedTheme);
        quill.setContents(noteToView.textContent);
        inputTitle.value = (noteToView.title);
        noteToView = event.target.parentElement.id;
        closeSlide();

        //If the traschcan button is pressed, delete the attached document
    } else if (event.target.className === 'fas fa-trash-alt') {
        noteToView = findObject(event.target.parentElement.parentElement.id, noteArray);
        removeNote(noteToView, noteArray);
        noteToView = "";

    }
}



/*theme list in mobile version*/
defaultthemelistbtn.onclick = function () {
    cleanThemes();
    selectedTheme = 'defaultTheme';
    quill.root.classList.add(selectedTheme);
}

hallowenthemelistbtn.onclick = function () {
    cleanThemes();
    selectedTheme = 'halloweenTheme';
    quill.root.classList.add(selectedTheme);
}

christmasthemelistbtn.onclick = function () {
    cleanThemes();
    selectedTheme = 'christmasTheme';
    quill.root.classList.add(selectedTheme);
}

birthdaythemelistbtn.onclick = function () {
    cleanThemes();
    selectedTheme = 'birthdayTheme';
    quill.root.classList.add(selectedTheme);
}

//theme list drop list
barThemeListBtn.onclick= function(){

    if (themelistopen == true) {
        themeDroplistMenu.className = "themListMenuClose";
        themelistopen =false;
    }else {
        themelistopen = true;
        themeDroplistMenu.className = "themListMenuOpen";
    }
}


/* removes all the themes from the quill*/
function cleanThemes() {
    quill.root.classList.remove('christmasTheme')
    quill.root.classList.remove('halloweenTheme')
    quill.root.classList.remove('defaultTheme')
    quill.root.classList.remove('birthdayTheme')
}






/* Uppdates the document handler view by putting the innerHTML to empty and the create the notes again
 */
function updateView() {
    document.getElementById("document-handler-container").innerHTML = "";
    createNote(noteArray);
}

/* Saves new document if noteToView is true it updates existing note
 */
saveBtn.onclick = function () {

    if (noteToView) {
        updateNote();
    } else {
        saveNote();
        createNote(noteArray);
        updateView();
    }
}

closeSlideBtn.onclick = function () {
    closeSlide();
}

/*
Opens the slide bar
*/
function openSlide() {
    document.querySelector('#folderSlide').className = 'folder-slide-open';
}
/*
Closes the slide bar
*/
function closeSlide() {
    document.querySelector('#folderSlide').className = 'folder-slide-close';

}

/*
New dokument clears the title and the text editor text
*/
newdocumentBtn.addEventListener('click', function () {
    clearForm();
    cleanThemes();
    selectedTheme = "defaultTheme";
})

/*
Print out the note
*/
printbtn.addEventListener('click', function () {
    print()
})

/*
Creates new id
Check if ls is empty, id starts with 1,
if ls not empty, give id the next number from the lates id.
@return {number} a new id
*/
function createID() {
    let newID;
    if (localStorage.length === 0 || noteArray.length === 0) {
        newID = 1;
    } else {
        let arrayLastID = noteArray[noteArray.length - 1].id;
        arrayLastID++;
        newID = arrayLastID
    }
    return newID;
}

/*
Scan local storage and send the content back if it exist otherwise create a new array
@return {string[]} A string from localstorage
*/
function getLocalStorage() {
    let noteArray;
    if (localStorage.length === 0) {
        noteArray = [];
    } else {
        noteArray = JSON.parse(localStorage.getItem('notes'))
    }
    return noteArray;
}

/*
 sets local storage with the main array
*/

function setLocalStorage(array) {
    localStorage.setItem('notes', JSON.stringify(array))
}

/*
Makes Title shorter and add ... (dots)
@return {string} a shorter title
*/

function shortTitle(title) {
    let shortendTitle = title.length;
    if (shortendTitle > 8) {
        title = title.slice(0, 8) + "...";
    }
    return title;
}

/*
Gets the date of today and formats it
@return {number} the todays date the note was created.
*/
function today(date) {

    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    date = dd + '/' + mm + '/' + yyyy;
    return date;
}


/*
Creates a document item
@param {Array from ls}
*/

function createNote(array) {

    //sorts the array by favorite
    array.sort((a, b) => b.favorite - a.favorite);

    for (let i = 0; i < array.length; i++) {
        id = array[i].id;
        title = array[i].title;
        textContent = array[i].textContent;
        favorite = array[i].favorite;
        date = array[i].date;
        theme = array[i].classTheme;
        let divDocumentHandlerItem = document.createElement('div');
        let divDocumentImage = document.createElement('div');
        let divDocumentTitle = document.createElement('div');
        let divDocumentTime = document.createElement('div');
        let documentTitle = document.createTextNode(shortTitle(title));
        let documentTime = document.createTextNode(date);
        let trashcanIcon = document.createElement('i');
        let trashcanButton = document.createElement('a');
        let starIcon = document.createElement('i');
        let starButton = document.createElement('a');

        divDocumentHandlerItem.id = id;
        divDocumentHandlerItem.className = "document-handler-item ";
        divDocumentTitle.className = "item-title";
        divDocumentTime.className = "item-time";
        divDocumentImage.className = "img-document";


        if (favorite) {
            starIcon.className = 'fas fa-star';
            starIcon.style.color = 'yellow';
        } else {
            starIcon.className = 'far fa-star';
        }

        trashcanIcon.className = "fas fa-trash-alt";
        starButton.appendChild(starIcon);
        divDocumentHandlerItem.appendChild(starButton);
        divDocumentTitle.appendChild(documentTitle);
        divDocumentTime.appendChild(documentTime);

        divDocumentHandlerItem.appendChild(divDocumentTitle);



        divDocumentHandlerItem.appendChild(divDocumentImage);

        divDocumentHandlerItem.appendChild(divDocumentTime);
        trashcanButton.appendChild(trashcanIcon);
        divDocumentHandlerItem.appendChild(trashcanButton);

        document.getElementById("document-handler-container").appendChild(divDocumentHandlerItem);
    }
}

//Saves the note
function saveNote() {
    let newNote = {};
    let newNoteID = createID();
    noteToView = newNoteID;
    newNote.id = newNoteID;
    newNote.title = inputTitle.value;
    newNote.textContent = quill.getContents(); //here we get the content from the editor!
    newNote.date = today(new Date);
    newNote.favorite = false;
    newNote.classTheme = selectedTheme;
    noteArray.push(newNote);
    setLocalStorage(noteArray);
}

//update the values of title och textcontent
function updateNote() {
    objectID = findObject(noteToView, noteArray);
    objectID.title = inputTitle.value;
    objectID.textContent = quill.getContents(); //here we get the content from the editor!
    objectID.classTheme = selectedTheme;
    setLocalStorage(noteArray);
    updateView();
}

//clears the form
function clearForm() {
    inputTitle.value = "";
    quill.setContents([]);
    noteToView = "";
    updateView();
}

//finds object in the array
function findObject(key, array) {
    let parsedKey = parseInt(key);
    for (let i = 0; i < array.length; i++) {
        if (array[i].id === parsedKey) {
            return array[i];
        }
    }
}

//Take out the object from the array and save local storage
function removeNote(objectID, array) {
    array.splice(array.indexOf(objectID), 1)
    setLocalStorage(array)
    updateView();
}

//See if the value of favorite is true of false and save it to the local storage
function toggleFavorite(objectID) {
    if (objectID.favorite === false) {
        objectID.favorite = true;
    } else {
        objectID.favorite = false;
    }
    setLocalStorage(noteArray);
    updateView();
}
