// -----------------------------
// Shopping List with Autocomplete
// -----------------------------

interface ShoppingItem {
  title: string;
  done: boolean;
}

// DOM elements
const form = document.querySelector('.form') as HTMLFormElement;
const input = document.getElementById('actionInput') as HTMLInputElement;
const countButton = document.querySelector('.count') as HTMLButtonElement;
const listSection = document.querySelector('.list') as HTMLElement;
const langSelect = document.getElementById('langSelect') as HTMLSelectElement;
const suggestionsContainer = document.getElementById('suggestions') as HTMLUListElement;
const footerTitle = document.querySelector('.footerTitle') as HTMLElement;

// Shoping list
const ul = document.createElement('ul');
ul.className = 'shoppingList';
listSection.appendChild(ul);

// Updating from the storage
const savedItems = JSON.parse(localStorage.getItem('shoppingList') || '[]') as ShoppingItem[];
savedItems.forEach(item => addItem(item.title, false, item.done));

// -----------------------------
//Handel hints
// -----------------------------
input.addEventListener('input', async () => {
  const query = input.value.toLowerCase().trim();
  const lang = langSelect.value;

  if (!query) {
    suggestionsContainer.innerHTML = '';
    return;
  }

  try {
    const response = await fetch(`/api/suggestions?query=${encodeURIComponent(query)}&lang=${lang}`);
    if (!response.ok) throw new Error('Network error');

    const suggestions: string[] = await response.json();
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
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    suggestionsContainer.innerHTML = '';
  }
});

// -----------------------------
//Handel adding element
// -----------------------------
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

// -----------------------------
// Adding element to the list
// -----------------------------
function addItem(title: string, save: boolean, done = false): void {
  const li = document.createElement('li');
  li.className = 'shoppingItem';
  if (done) li.classList.add('done');

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
  if (save) saveToLocalStorage();
}

// -----------------------------
// Updating numbering
// -----------------------------
function updateAllNumbers(): void {
  const items = ul.querySelectorAll('li');
  items.forEach((li, index) => {
    const numberBtn = li.querySelector('.numberBtn') as HTMLButtonElement;
    numberBtn.textContent = (index + 1).toString();
  });
}
// -----------------------------
// Clear list
// -----------------------------
const clearButton = document.getElementById('clearButton') as HTMLButtonElement;

if (clearButton) {
  clearButton.addEventListener('click', () => {
    ul.innerHTML = '';
    localStorage.removeItem('shoppingList');
    updateCounter();
    suggestionsContainer.innerHTML = '';
  });
} else {
  console.warn('❗ clearButton not found in the DOM');
}



// -----------------------------
// Updating counter
// -----------------------------
function updateCounter(): void {
  const totalItems = ul.querySelectorAll('li').length;
  countButton.textContent = totalItems.toString();
}

// -----------------------------
//Save to localStorage
// -----------------------------
function saveToLocalStorage(): void {
  const items: ShoppingItem[] = Array.from(ul.querySelectorAll('li')).map(li => {
    const title = li.childNodes[2]?.textContent?.trim() ?? '';
    const checkbox = li.querySelector('.buyCheckbox') as HTMLInputElement;
    return { title, done: checkbox?.checked || false };
  });
  localStorage.setItem('shoppingList', JSON.stringify(items));
}


// -----------------------------
//Footer
// -----------------------------
const p = document.createElement('p');
p.className = 'date';
p.textContent = `© ${new Date().getFullYear()} Created by Maryna Arnaut`;
footerTitle.appendChild(p);
