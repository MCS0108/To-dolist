document.addEventListener('DOMContentLoaded', () => {
    setFolderEventListeners();
    setModalEventListeners();
});

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

function handleKeyDown(event) {
    if (event.key === 'Enter') {
        addOrdner();
        const modal = document.querySelector('.modal.active');
        closeModal(modal);
    }
}

function enter(event) {
    if (event.key === 'Enter') {
        addTodos(currentFolder);
        todosHTML(currentFolder);
    }
}

function addOrdner() {
    const inputOrdnerElement = document.querySelector('.inputOrdner');
    const inputOrdnerValue = inputOrdnerElement.value.trim();

    if (inputOrdnerValue !== '') {
        const newOrdner = {
            ordnerName: inputOrdnerValue,
            todos: []
        };

        Ordner.push(newOrdner);

        inputOrdnerElement.value = "";

        console.log(Ordner);

        ordnerHTML();
    }
}

function ordnerHTML() {
    let allHTML = '';
    Ordner.forEach((ordner, index) => {
        const modalId = `editModal-${index}`;
        let html = `
            <div class="ordnerBar" data-folder-name="${ordner.ordnerName}">
                <p class="nameOrdner">${ordner.ordnerName}</p>
                <div class="editOrdner">
                    <div class="modal" id="${modalId}">
                        <button data-close-button class="QuitButton renameButton">
                            <img class="renameBild" src="Bilder/oen to square white.svg" alt="">
                        </button>
                        <button data-close-button class="QuitButton trashButton">
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

    setFolderEventListeners();
    setModalEventListeners();  // Hinzufügen von Event-Listenern nach jeder Aktualisierung
}

function setFolderEventListeners() {
    document.querySelectorAll('.ordnerBar').forEach((div) => {
        div.addEventListener('click', () => {
            currentFolder = div.dataset.folderName
            todosHTML(currentFolder);
            document.querySelector('.ordnerName').innerHTML = `${currentFolder}:`;

            document.querySelectorAll('.ordnerBar').forEach(folder => {
                folder.style.backgroundColor = "";
            });

            div.style.backgroundColor = "rgb(71, 69, 69)";
        });
    });
}

function addTodos(currentFolder) {
    const inputTodoElement = document.querySelector('.addNewCard');
    const inputTodoValue = inputTodoElement.value;

    if (inputTodoValue !== '') {
        const folder = Ordner.find(folder => folder.ordnerName === currentFolder);
        console.log(folder);

        if (folder) {
            folder.todos.push(inputTodoValue);
            inputTodoElement.value = '';
            console.log(Ordner);
            todosHTML(currentFolder);
        }
    }
}

function todosHTML(currentFolder) {
    let allTodoHTML = '';
    const folder = Ordner.find(folder => folder.ordnerName === currentFolder);
    if (folder) {
        folder.todos.forEach((todo) => {
            let html = `
            <div class="To-do">
                    <div class="divEins">
                        <input class="checkbox" type="checkbox">
                        <p class="todoName">${todo}</p>
                    </div>
                    <div>
                        <button class="elipsis_to-do"><img class="bild" src="Bilder/elipsis white.svg" alt=""></button>
                    </div>
                </div>
            `;
            allTodoHTML += html;
        });
    }
    document.querySelector('.To-Dos').innerHTML = allTodoHTML;
}

// Initiales Setzen der Todos für den aktuell ausgewählten Ordner
todosHTML();



