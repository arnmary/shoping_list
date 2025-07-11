"use strict";
const form = document.querySelector('.form');
const input = document.getElementById('actionInput');
const countButton = document.querySelector('.count');
const listSection = document.querySelector('.list');
const langSelect = document.getElementById('langSelect');
const suggestionsContainer = document.createElement('ul');
suggestionsContainer.className = 'suggestionsList';
input.parentElement.appendChild(suggestionsContainer);
const ul = document.createElement('ul');
ul.className = 'shopingList';
listSection.appendChild(ul);
const savedItems = JSON.parse(localStorage.getItem('shoppingList') || '[]');
savedItems.forEach(item => addItem(item.title, false, item.done));
input.addEventListener('input', async () => {
    const query = input.value.toLowerCase().trim();
    const lang = langSelect.value;
    if (!query) {
        suggestionsContainer.innerHTML = '';
        return;
    }
    try {
        const response = await fetch(`/api/suggestions?query=${encodeURIComponent(query)}&lang=${lang}`);
        if (!response.ok)
            throw new Error('Network error');
        const suggestions = await response.json();
        suggestionsContainer.innerHTML = '';
        suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            li.className = 'suggestionItem';
            li.addEventListener('click', () => {
                input.value = suggestion;
                suggestionsContainer.innerHTML = '';
                input.focus();
            });
            suggestionsContainer.appendChild(li);
        });
    }
    catch (error) {
        console.error('Error fetching suggestions:', error);
        suggestionsContainer.innerHTML = '';
    }
});
form.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value.trim();
    if (text === '') {
        alert('Type text please');
        return;
    }
    const duplicateExists = Array.from(ul.querySelectorAll('li')).some(li => {
        const content = li.textContent?.replace(/^(\d+)?\s*|\s*X$/g, '').trim().toLowerCase();
        return content === text.toLowerCase();
    });
    if (duplicateExists) {
        alert('This item already exists in the list!');
        return;
    }
    addItem(text, true);
    input.value = '';
    suggestionsContainer.innerHTML = '';
    input.focus();
});
function addItem(title, save, done = false) {
    const li = document.createElement('li');
    li.className = 'shopingItem';
    if (done)
        li.classList.add('done');
    const numberBtn = document.createElement('button');
    numberBtn.className = 'numberBtn';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'buyCheckbox';
    checkbox.checked = done;
    checkbox.addEventListener('change', () => {
        li.classList.toggle('done', checkbox.checked);
        saveToLocalStorage();
    });
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.className = 'deleteBtn';
    deleteBtn.addEventListener('click', () => {
        ul.removeChild(li);
        updateAllNumbers();
        updateCounter();
        saveToLocalStorage();
    });
    li.appendChild(numberBtn);
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(' ' + title));
    li.appendChild(deleteBtn);
    ul.appendChild(li);
    updateAllNumbers();
    updateCounter();
    if (save)
        saveToLocalStorage();
}
function updateAllNumbers() {
    const items = ul.querySelectorAll('li');
    items.forEach((li, index) => {
        const numberBtn = li.querySelector('.numberBtn');
        numberBtn.textContent = (index + 1).toString();
    });
}
function updateCounter() {
    const totalItems = ul.querySelectorAll('li').length;
    countButton.textContent = totalItems.toString();
}
function saveToLocalStorage() {
    const items = Array.from(ul.querySelectorAll('li')).map(li => {
        const title = li.childNodes[2]?.textContent?.trim() ?? '';
        const checkbox = li.querySelector('.buyCheckbox');
        return { title, done: checkbox?.checked || false };
    });
    localStorage.setItem('shoppingList', JSON.stringify(items));
}
const footerTitle = document.querySelector('.footerTitle');
const p = document.createElement('p');
p.className = 'date';
p.textContent = `© ${new Date().getFullYear()} Created by Maryna Arnaut`;
footerTitle.appendChild(p);
//# sourceMappingURL=index.js.map