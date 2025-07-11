// -----------------------------
// Shopping List with Autocomplete
// -----------------------------

interface ShoppingItem {
  title: string;
  done: boolean;
}

// DOM елементи
const form = document.querySelector('.form') as HTMLFormElement;
const input = document.getElementById('actionInput') as HTMLInputElement;
const countButton = document.querySelector('.count') as HTMLButtonElement;
const listSection = document.querySelector('.list') as HTMLElement;
const langSelect = document.getElementById('langSelect') as HTMLSelectElement;
const suggestionsContainer = document.getElementById('suggestions') as HTMLUListElement;
const footerTitle = document.querySelector('.footerTitle') as HTMLElement;

// Список покупок
const ul = document.createElement('ul');
ul.className = 'shopingList';
listSection.appendChild(ul);

// Відновлення зі сховища
const savedItems = JSON.parse(localStorage.getItem('shoppingList') || '[]') as ShoppingItem[];
savedItems.forEach(item => addItem(item.title, false, item.done));

// -----------------------------
// Обробка підказок
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
// Обробка додавання елементу
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
// Додавання елемента до списку
// -----------------------------
function addItem(title: string, save: boolean, done = false): void {
  const li = document.createElement('li');
  li.className = 'shopingItem';
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
// Оновлення нумерації
// -----------------------------
function updateAllNumbers(): void {
  const items = ul.querySelectorAll('li');
  items.forEach((li, index) => {
    const numberBtn = li.querySelector('.numberBtn') as HTMLButtonElement;
    numberBtn.textContent = (index + 1).toString();
  });
}

// -----------------------------
// Оновлення лічильника
// -----------------------------
function updateCounter(): void {
  const totalItems = ul.querySelectorAll('li').length;
  countButton.textContent = totalItems.toString();
}

// -----------------------------
// Збереження в localStorage
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
// Футер
// -----------------------------
const p = document.createElement('p');
p.className = 'date';
p.textContent = `© ${new Date().getFullYear()} Created by Maryna Arnaut`;
footerTitle.appendChild(p);
