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

function handleKeyDown(event) { //Der Code wird dann ausgeführt, wenn ich enter drücke beim input zum Erstellen von Ordnern
    if (event.key === 'Enter') {
        addOrdner();
        const modal = document.querySelector('.modal.active');
        closeModal(modal);
    }
}

function handleKeyDownToDos(event) { //Der Code wird ausgeführt, wenn ich enter drücke beim input zum Erstellen von To-Dos
    if (event.key === 'Enter') {
        addTodos(currentFolder);
        todosHTML(currentFolder);
    }
}

function addOrdner() {
    const inputOrdnerElement = document.querySelector('.inputOrdner');
    const inputOrdnerValue = inputOrdnerElement.value.trim(); //trim entfernt Leerzeichen am Anfang und am Ende

    if (inputOrdnerValue !== '') { //wenn man da doch nichts hinschreibt wäre es schlecht wenn sich aber trotzdem ein ordner erstellen würde, welcher einfach kein name hat 
        const newOrdner = {
            ordnerName: inputOrdnerValue,
            todos: []
        };

        Ordner.push(newOrdner);

        inputOrdnerElement.value = ""; //dadurch ist der input dann wieder leer

        ordnerHTML(); // die Funktion lädt dann den ganzen Code auf die Website, wodurch man den hinzugefügten Ordner sieht

    }
}

function ordnerHTML() {
    let allHTML = '';
    
    Ordner.forEach((ordner, index) => { // Der Index sorgt dafür, dass die modal Id bei jedem Code anders ist, da sich der index bei jedem Durchlauf verädnert
        const modalId = `editModal-${index}`; //warum ist das nicht einfach nur der index: EIndeutigkeit der ID und bessere Lesbarkeit
        let html = `
            <div class="ordnerBar ordnerBar-${ordner.ordnerName}" data-folder-name="${ordner.ordnerName}">
                <p class="nameOrdner">${ordner.ordnerName}</p>
                <div class="editOrdner">
                    <div class="modal" id="${modalId}">
                        <button data-close-button class="QuitButton trashButton" data-folder-trash="${ordner.ordnerName}">
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
            currentFolder = div.dataset.folderName;
            todosHTML(currentFolder); // Zeige die Todos des ausgewählten Ordners an
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
            removeFromOrdner(folderName);

            if (folderName === currentFolder) {
                currentFolder = ''; // Reset des currentFolder
                document.querySelector('.ordnerName').innerText = '';
            }

            const container = document.querySelector(`.ordnerBar-${folderName}`);
            if (container) {
                container.remove();
            }
        });
    });

    document.querySelectorAll('.trashButtonTodo')
    .forEach((button) => {
        button.addEventListener('click', () => {
            const currentTodo = button.dataset.todoName;
            
            const currentFolder = button.dataset.folderTrash; // Hinzugefügt

            removeFromTodo(currentTodo, currentFolder); // currentFolder hinzugefügt

           
            const container = document.querySelector(`.To-do[data-todo-name="${currentTodo}"]`)
            
            if (container) {
                container.remove();
            }
        });
    });

    document.querySelectorAll('.checkbox')
    .forEach((input) => {
        input.addEventListener('click', () => {
            currentFolder = input.dataset.ordnerName;
            currentTodo = input.dataset.todoName;
            
            checkBox(currentFolder, currentTodo)
        })
    })
}

function checkBox(currentFolder, currentTodo) {
    const folder = Ordner.find(folder => folder.ordnerName === currentFolder);
    const todo = folder.todos.find(todo => todo.name === currentTodo)
    todo.checkbox = !todo.checkbox
    
    
    const todoElement = document.querySelector(`.To-do[data-todo-name="${currentTodo}"] .todoName`);

    todoElement.classList.toggle('completed'); //dadurch wird eine css-klasse hinzugefpgt und somit wird die todo durchgestrichen
        
}

function todoFilter(currentFolder) {
    const folder = Ordner.find(folder => folder.ordnerName === currentFolder);
    All = document.querySelector('.buttonAll')
    
    if (All) {
        todosHTML()
    }
    
}

function removeFromOrdner(currentFolder) {
    const newOrdner = Ordner.filter(ordner => ordner.ordnerName !== currentFolder);
    Ordner = newOrdner;

    // Leeren des Ordnernamens, wenn der gelöschte Ordner aktuell ausgewählt ist
    if (document.querySelector('.ordnerName').innerText.startsWith(currentFolder)) {
        document.querySelector('.ordnerName').innerText = '';
    }

    // Aktualisiere die Anzeige
    ordnerHTML();
}

function removeFromTodo(currentTodo, currentFolder) {
    const newTodos = [];
    const folder = Ordner.find(folder => folder.ordnerName === currentFolder); //das braucht man, um genau den ordner zu finden in dem die todos gelöscht werden sollen 

    folder.todos.forEach((todo) => { //hier nutzt man dann folder 
        
        if (todo.name !== currentTodo) {
            newTodos.push(todo); //irgendwas stimmt hier nicht 
            console.log(todo)
        }
        
    });

    folder.todos = newTodos;
}

function addTodos(currentFolder) {
    const inputTodoElement = document.querySelector('.addNewCard');
    const inputTodoValue = inputTodoElement.value;

    if (inputTodoValue !== '') {
        const folder = Ordner.find(folder => folder.ordnerName === currentFolder);

        if (folder) {
            const newTodo = {
                name: inputTodoValue,
                checkbox: false //weil erstmal wurde die checkbox nicht aktiviert und somit auf false
            }
            folder.todos.push(newTodo);
            inputTodoElement.value = '';
            todosHTML(currentFolder); //dadurch wird es auf die seite projiziert
        }
    }
    
}

function todosHTML(currentFolder) {
    let allTodoHTML = '';
    const folder = Ordner.find(folder => folder.ordnerName === currentFolder);
    if (folder) { 
        folder.todos.forEach((todo, index) => {
            const modalId = `editmodal-${index}`;
            let html = `
            <div class="To-do To-do-${index}" data-todo-name="${todo.name}">
                <div class="divEins">
                    <input class="checkbox" type="checkbox" data-ordner-name="${currentFolder}" data-todo-name="${todo.name}" ${todo.checkbox ? 'checked' : ''}>
                    <p class="todoName" data-todo-name="${todo.name}" ${todo.checkbox ? 'class="completed"' : ''}>
                        ${todo.name}
                    </p>
                </div>
                <div class="divdrei">
                    <div class="modal" id="${modalId}">
                        <button data-close-button class="QuitButton renameButtonTodo">
                            <img class="renameBild" src="Bilder/oen to square white.svg" alt="">
                        </button>
                        <button data-close-button class="QuitButton trashButtonTodo" data-todo-name="${todo.name}" data-folder-trash="${currentFolder}">
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
