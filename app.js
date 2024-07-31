setFolderEventListeners();
setModalEventListeners();

function setModalEventListeners() {
    const openModalButtons = document.querySelectorAll('[data-modal-target]');
    const closeModalButtons = document.querySelectorAll('[data-close-button]');

    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = document.querySelector(button.dataset.modalTarget);
            openModal(modal);
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });
}

function openModal(modal) {
    if (modal == null) return;
    modal.classList.add('active');
}

function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove('active');
}

let Ordner = [];
let currentFolderID =''

function handleKeyDown(event) { //Der Code wird dann ausgeführt, wenn ich enter drücke beim input zum Erstellen von Ordnern
    if (event.key === 'Enter') {
        addOrdner();
        const modal = document.querySelector('.modal.active');
        closeModal(modal);
    }
}

function handleKeyDownToDos(event) { //Der Code wird ausgeführt, wenn ich enter drücke beim input zum Erstellen von To-Dos
    if (event.key === 'Enter') {
        addTodos(currentFolderID);
        todosHTML(currentFolderID);
    }
}

function addOrdner() {
    const inputOrdnerElement = document.querySelector('.inputOrdner');
    const inputOrdnerValue = inputOrdnerElement.value.trim(); //trim entfernt Leerzeichen am Anfang und am Ende

    if (inputOrdnerValue !== '') { //wenn man da doch nichts hinschreibt wäre es schlecht wenn sich aber trotzdem ein ordner erstellen würde, welcher einfach kein name hat 
        const newOrdner = {
            id: generateUniqueId(),
            ordnerName: inputOrdnerValue,
            todos: []
        };

        Ordner.push(newOrdner);

        inputOrdnerElement.value = ""; //dadurch ist der input dann wieder leer

        ordnerHTML(); // die Funktion lädt dann den ganzen Code auf die Website, wodurch man den hinzugefügten Ordner sieht

    }
}

function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function ordnerHTML() {
    let allHTML = '';
    
    Ordner.forEach((ordner, index) => { // Der Index sorgt dafür, dass die modal Id bei jedem Code anders ist, da sich der index bei jedem Durchlauf verädnert
        const modalId = `editModal-${index}`; //warum ist das nicht einfach nur der index: EIndeutigkeit der ID und bessere Lesbarkeit
        let html = `
            <div class="ordnerBar ordnerBar-${ordner.id}" data-folder-name="${ordner.ordnerName}" data-folder-id="${ordner.id}">
                <p class="nameOrdner">${ordner.ordnerName}</p>
                <div class="editOrdner">
                    <div class="modal" id="${modalId}">
                        <button data-close-button class="QuitButton trashButton" data-folder-trash="${ordner.ordnerName}" data-trash-id="${ordner.id}">
                            <img class="trashBild" src="Bilder/trash white.svg" alt="">
                        </button>
                    </div>
                    <button data-modal-target="#${modalId}" class="editButton">
                        <img class="ellipsis-vertical_Button" src="Bilder/elipsis white.svg" alt="">
                    </button>
                </div>
            </div>
        `;
        allHTML += html;
    });

    document.querySelector('.Ordner').innerHTML = allHTML;

    setFolderEventListeners(); //warum ist der code hier was macht er: Dadurch wird durch klicken, der currentOrdner gespeichert und beim klicken werden modals geöffnet
    setModalEventListeners();  // Hinzufügen von Event-Listenern nach jeder Aktualisierung
}

function setFolderEventListeners() { // in dieser funktion sind jetzt verschiedene codes vorhanden die dafür sorgen, dass wenn ich irgendwelche buttons drücke, etwas passiert
    document.querySelectorAll('.ordnerBar').forEach((div) => {
        div.addEventListener('click', () => {
            currentFolderID = div.dataset.folderId; // Sicherstellen, dass folderId korrekt zugewiesen wird
            currentFolder = div.dataset.folderName;
            

            todosHTML(currentFolderID); // Zeigt die Todos für den aktuellen Ordner an
            document.querySelector('.ordnerName').innerText = `${currentFolder}:`;

            document.querySelectorAll('.ordnerBar').forEach(folder => {
                folder.style.backgroundColor = ""; // Rücksetzen der Hintergrundfarbe
            });

            div.style.backgroundColor = "rgb(71, 69, 69)";
        });
    });

    document.querySelectorAll('.trashButton').forEach((button) => {
        button.addEventListener('click', () => {
            const folderName = button.dataset.folderTrash;
            folderID = button.dataset.trashId
            removeFromOrdner(folderID);

            if (folderName === currentFolder) {
                currentFolder = ''; // Reset des currentFolder
                document.querySelector('.ordnerName').innerText = '';
            }

            const container = document.querySelector(`.ordnerBar-${folderID}`);
            if (container) {
                container.remove();
            }
        });
    });

    document.querySelectorAll('.trashButtonTodo')
    .forEach((button) => {
        button.addEventListener('click', () => {
            const currentTodoID = button.dataset.todoId;
            
            const currentFolderID = button.dataset.folderTrash; // Hinzugefügt

            removeFromTodo(currentTodoID, currentFolderID); // currentFolder hinzugefügt

           
            const container = document.querySelector(`.To-do[data-todo-id="${currentTodoID}"]`)
            
            if (container) {
                container.remove();
            }
        });
    });

    document.querySelectorAll('.checkbox')
    .forEach((input) => {
        input.addEventListener('click', () => {
            currentFolderID = input.dataset.ordnerId;
            currentTodoID = input.dataset.todoId;
            
            checkBox(currentFolderID, currentTodoID)
        })
    })
}



function checkBox(currentFolderID, currentTodoID) {
    const folder = Ordner.find(folder => folder.id === currentFolderID);
    const todo = folder.todos.find(todo => todo.id === currentTodoID)
    todo.checkbox = !todo.checkbox 
    
    
    const todoElement = document.querySelector(`.To-do[data-todo-id="${currentTodoID}"] .todoName`);

    todoElement.classList.toggle('completed'); //dadurch wird eine css-klasse hinzugefpgt und somit wird die todo durchgestrichen
        
}

function todoFilter(currentFolder) {
    All = document.querySelector('.buttonAll')
    
    if (All) {
        todosHTML()
    }
    
}

function removeFromOrdner(folderID) {
    const newOrdner = Ordner.filter(ordner => ordner.id !== folderID);
    Ordner = newOrdner;

    // Leeren des Ordnernamens, wenn der gelöschte Ordner aktuell ausgewählt ist
    if (document.querySelector('.ordnerName').innerText.startsWith(currentFolder)) {
        document.querySelector('.ordnerName').innerText = '';
    }

    // Aktualisiere die Anzeige
    ordnerHTML();
}

function removeFromTodo(currentTodoID, currentFolderID) {
    const newTodos = [];
    const folder = Ordner.find(folder => folder.id === currentFolderID); //das braucht man, um genau den ordner zu finden in dem die todos gelöscht werden sollen 

    folder.todos.forEach((todo) => { //hier nutzt man dann folder 
        
        if (todo.id !== currentTodoID) {
            newTodos.push(todo); //irgendwas stimmt hier nicht 
        }
        
    });

    folder.todos = newTodos;
}

function addTodos(currentFolderID) {
    const inputTodoElement = document.querySelector('.addNewCard');
    const inputTodoValue = inputTodoElement.value;
    console.log(Ordner)

    if (inputTodoValue !== '') {
        const folder = Ordner.find(folder => folder.id === currentFolderID);

        if (folder) {
            const newTodo = {
                id: generateUniqueId(),
                name: inputTodoValue,
                checkbox: false // Checkbox ist initial nicht aktiviert
            };
            folder.todos.push(newTodo);
            inputTodoElement.value = '';
            todosHTML(currentFolderID); // Verwende die ID, um die Todos zu aktualisieren
        } else {
            console.error("Fehler: Kein Ordner-Objekt mit dieser ID gefunden.");
        }
    }
}

function todosHTML(currentFolderID) {
    let allTodoHTML = '';
    const folder = Ordner.find(folder => folder.id === currentFolderID);
    if (folder) { 
        folder.todos.forEach((todo, index) => {
            const modalId = `editmodal-${index}`;
            let html = `
            <div class="To-do To-do-${index}" data-todo-id="${todo.id}">
                <div class="divEins">
                    <input class="checkbox" type="checkbox" data-ordner-id="${currentFolderID}" data-todo-id="${todo.id}" ${todo.checkbox ? 'checked' : ''}>
                    <p class="todoName ${todo.checkbox ? 'completed' : ''}" data-todo-id="${todo.id}">
                        ${todo.name}
                    </p>
                </div>
                <div class="divdrei">
                    <div class="modal" id="${modalId}">
                        <button data-close-button class="QuitButton renameButtonTodo">
                            <img class="renameBild" src="Bilder/oen to square white.svg" alt="">
                        </button>
                        <button data-close-button class="QuitButton trashButtonTodo" data-todo-id="${todo.id}" data-folder-trash="${currentFolderID}">
                            <img class="trashBild" src="Bilder/trash white.svg" alt="">
                        </button>
                    </div>
                    <button data-modal-target="#${modalId}" class="elipsis_to-do">
                        <img class="bild" src="Bilder/elipsis white.svg" alt="">
                    </button>
                </div>
            </div>
            `;
            allTodoHTML += html;
        });
    }
    document.querySelector('.To-Dos').innerHTML = allTodoHTML;
    setFolderEventListeners();
    setModalEventListeners();  // Hinzufügen von Event-Listenern nach jeder Aktualisierung
}

// Initiales Setzen der Todos für den aktuell ausgewählten Ordner
todosHTML();
