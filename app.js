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

function openModal(modal) {
    if (modal == null) return;
    modal.classList.add('active');
}

function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove('active');
}



let Todos = [];

function handleKeyDown(event) {
    if (event.key === 'Enter') {
        addTodos();
    }
}

function addTodos() {
    let todoText = document.querySelector('.addNewCard').value;

    let html = `<div class="To-do">
        <div class="divEins">
            <input class="checkbox" type="checkbox">
            <p class="todoName"> ${todoText} </p>
        </div>
        <div>
            <button class="elipsis_to-do"><img class="bild" src="Bilder/elipsis white.svg" alt=""></button>
        </div>
    </div>`;

    // Neues Todo zur Liste hinzufügen
    Todos.push(html);

    // HTML-Elemente der Todos aktualisieren
    document.querySelector('.To-Dos').innerHTML = Todos.join('');
}








