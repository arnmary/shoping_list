// Shopping List app with suggestions and localStorage — TypeScript version
// -----------------------------------------------------------------------
// • Показує підказки (autocomplete) для різних мов
// • Зберігає список покупок у localStorage
// • Перевіряє на дублікати
// • Нумерує пункти автоматично
// • Дозволяє видаляти елементи
// -----------------------------------------------------------------------

// --------------------------------------------------
// Тип даних одного пункту списку
// --------------------------------------------------
interface ShoppingItem {
  title: string; // назва товару
  done: boolean; // чи куплено (можна розширити у майбутньому)
}

// --------------------------------------------------
// Основні елементи DOM
// --------------------------------------------------
const form = document.querySelector('.form') as HTMLFormElement;
const input = document.getElementById('actionInput') as HTMLInputElement;
const countButton = document.querySelector('.count') as HTMLButtonElement;
const listSection = document.querySelector('.list') as HTMLElement;
const langSelect = document.getElementById('langSelect') as HTMLSelectElement; // <select> мови

// --------------------------------------------------
// Контейнер для автопідказок під полем вводу
// --------------------------------------------------
const suggestionsContainer = document.createElement('ul');
suggestionsContainer.className = 'suggestionsList';
// Додаємо підказки безпосередньо під <input>
input.parentElement!.appendChild(suggestionsContainer);

// --------------------------------------------------
// Список покупок (<ul>) всередині секції .list
// --------------------------------------------------
const ul = document.createElement('ul');
ul.className = 'shopingList';
listSection.appendChild(ul);

// --------------------------------------------------
// Відновлення збережених даних із localStorage
// --------------------------------------------------
const savedItems = JSON.parse(localStorage.getItem('shoppingList') || '[]') as ShoppingItem[];
savedItems.forEach(item => addItem(item.title, false, item.done));


// --------------------------------------------------
// 1) Обробка вводу: надсилаємо запит за підказками
// --------------------------------------------------
input.addEventListener('input', async () => {
  const query = input.value.toLowerCase().trim();
  const lang = langSelect.value; // обрана мова

  if (!query) {
    // Порожній рядок → очищаємо підказки
    suggestionsContainer.innerHTML = '';
    return;
  }

  try {
    // Запит до нашого API з урахуванням мови
    const response = await fetch(`/api/suggestions?query=${encodeURIComponent(query)}&lang=${lang}`);
    if (!response.ok) throw new Error('Network error');

    const suggestions: string[] = await response.json();
    suggestionsContainer.innerHTML = '';

    // Відмалювати кожну підказку як <li>
    suggestions.forEach(suggestion => {
      const li = document.createElement('li');
      li.textContent = suggestion;
      li.className = 'suggestionItem';

      // При кліку переносимо текст у поле вводу
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

// --------------------------------------------------
// 2) Обробка форми <form> (додавання нового пункту)
// --------------------------------------------------
form.addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value.trim();

  if (text === '') {
    alert('Type text please');
    return;
  }

  // Перевірка на дублікати (беремо лише текстовий вузол, індекс 1)
  const duplicateExists = Array.from(ul.querySelectorAll('li')).some(li => {
  const content = li.textContent?.replace(/^(\d+)?\s*|\s*X$/g, '').trim().toLowerCase();
    return content === text.toLowerCase();
  });

  if (duplicateExists) {
    alert('This item already exists in the list!');
    return;
  }

  addItem(text, true); // true → треба зберегти у localStorage
  input.value = '';
  suggestionsContainer.innerHTML = '';
  input.focus();
});

// --------------------------------------------------
// 3) Додавання пункту до списку
// --------------------------------------------------
function addItem(title: string, save: boolean, done = false): void {
  const li = document.createElement('li');
  li.className = 'shopingItem';
  if (done) li.classList.add('done');

  // Кнопка з номером (заповнюється в updateAllNumbers)
  const numberBtn = document.createElement('button');
  numberBtn.className = 'numberBtn';
  
  // ✅ Чекбокс "куплено"
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'buyCheckbox';
  checkbox.checked = done;

  checkbox.addEventListener('change', () => {
    li.classList.toggle('done', checkbox.checked);
    saveToLocalStorage(); // зберегти статус
  });
  // Кнопка видалення "X"
  // const deleteBtn = document.createElement('button');
  // deleteBtn.textContent = 'X';
  // deleteBtn.className = 'deleteBtn';

  // Видалення елемента
   const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'X';
  deleteBtn.className = 'deleteBtn';

  deleteBtn.addEventListener('click', () => {
    ul.removeChild(li);
    updateAllNumbers();
    updateCounter();
    saveToLocalStorage();
  });

  // Формуємо <li>: [номер] [✓] назва [X]
  li.appendChild(numberBtn);
  li.appendChild(checkbox);
  li.appendChild(document.createTextNode(' ' + title));
  li.appendChild(deleteBtn);
  ul.appendChild(li);

  updateAllNumbers();
  updateCounter();

  if (save) saveToLocalStorage();
}

// --------------------------------------------------
// 4) Оновлення номерів біля кожного пункту
// --------------------------------------------------
function updateAllNumbers(): void {
  const items = ul.querySelectorAll('li');
  items.forEach((li, index) => {
    const numberBtn = li.querySelector('.numberBtn') as HTMLButtonElement;
    numberBtn.textContent = (index + 1).toString();
  });
}

// --------------------------------------------------
// 5) Оновлення глобального лічильника (кнопка count)
// --------------------------------------------------
function updateCounter(): void {
  const totalItems = ul.querySelectorAll('li').length;
  countButton.textContent = totalItems.toString();
}

// --------------------------------------------------
// 6) Зберегти поточний список у localStorage
// --------------------------------------------------
function saveToLocalStorage(): void {
  const items: ShoppingItem[] = Array.from(ul.querySelectorAll('li')).map(li => {
    const title = li.childNodes[2]?.textContent?.trim() ?? '';
    const checkbox = li.querySelector('.buyCheckbox') as HTMLInputElement;
    return { title, done: checkbox?.checked || false };
  });
  localStorage.setItem('shoppingList', JSON.stringify(items));
}

// --------------------------------------------------
// 7) Футер із поточним роком
// --------------------------------------------------
const footerTitle = document.querySelector('.footerTitle') as HTMLElement;
const p = document.createElement('p');
p.className = 'date';
p.textContent = `© ${new Date().getFullYear()} Created by Maryna Arnaut`;
footerTitle.appendChild(p);









