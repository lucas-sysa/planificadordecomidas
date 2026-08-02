const STORAGE_KEY = 'planificadorComidasV1';
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwDWmFPCXaM2LixieIPm8qZbKgsmQDleS7a_rtsboehQFP9GVoej2w9KHbDk7wb6IB54g/exec'; // Recordá poner aquí tu URL de Apps Script

const days = ['Sábado', 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

const mealSuggestions = [
  'Pizza casera',
  'Pollo al horno con papas',
  'Tarta de pollo y verduras',
  'Milanesas con puré',
  'Arroz con carne y verduras',
  'Tortilla de papas con ensalada',
  'Hamburguesas caseras con papas',
  'Empanadas de carne',
  'Pastel de papas',
  'Tarta de jamón y queso',
  'Pollo salteado con arroz',
  'Carne al horno con verduras',
  'Omelette con ensalada',
  'Sándwiches calientes con ensalada'
];

const defaultItems = [
  { id: crypto.randomUUID(), name: 'Pollo', quantity: '2 kg', category: 'Carnicería', price: 18000, checked: false },
  { id: crypto.randomUUID(), name: 'Carne picada', quantity: '1,5 kg', category: 'Carnicería', price: 17000, checked: false },
  { id: crypto.randomUUID(), name: 'Milanesas', quantity: '1,5 kg', category: 'Carnicería', price: 22000, checked: false },
  { id: crypto.randomUUID(), name: 'Papas', quantity: '5 kg', category: 'Verdulería', price: 7500, checked: false },
  { id: crypto.randomUUID(), name: 'Cebolla', quantity: '2 kg', category: 'Verdulería', price: 3200, checked: false },
  { id: crypto.randomUUID(), name: 'Morrón', quantity: '4 unidades', category: 'Verdulería', price: 4800, checked: false },
  { id: crypto.randomUUID(), name: 'Tomate y lechuga', quantity: 'Para 3 ensaladas', category: 'Verdulería', price: 8500, checked: false },
  { id: crypto.randomUUID(), name: 'Arroz', quantity: '2 paquetes', category: 'Almacén', price: 4500, checked: false },
  { id: crypto.randomUUID(), name: 'Harina', quantity: '2 kg', category: 'Almacén', price: 3400, checked: false },
  { id: crypto.randomUUID(), name: 'Puré de tomate', quantity: '4 unidades', category: 'Almacén', price: 3600, checked: false },
  { id: crypto.randomUUID(), name: 'Huevos', quantity: '2 maples', category: 'Lácteos', price: 15000, checked: false },
  { id: crypto.randomUUID(), name: 'Queso y muzzarella', quantity: '1,5 kg', category: 'Lácteos', price: 22000, checked: false },
  { id: crypto.randomUUID(), name: 'Pan', quantity: 'Para la semana', category: 'Panadería', price: 9000, checked: false },
  { id: crypto.randomUUID(), name: 'Frutas', quantity: 'Surtidas', category: 'Verdulería', price: 16000, checked: false },
  { id: crypto.randomUUID(), name: 'Aceite y condimentos', quantity: 'Reposición', category: 'Almacén', price: 9000, checked: false }
];

let currentDate = new Date();

const state = loadState();

const els = {
  budgetInput: document.querySelector('#budgetInput'),
  peopleInput: document.querySelector('#peopleInput'),
  mealTypeInput: document.querySelector('#mealTypeInput'),
  weekInput: document.querySelector('#weekInput'),
  budgetDisplay: document.querySelector('#budgetDisplay'),
  estimatedDisplay: document.querySelector('#estimatedDisplay'),
  balanceDisplay: document.querySelector('#balanceDisplay'),
  perPersonDisplay: document.querySelector('#perPersonDisplay'),
  balanceCard: document.querySelector('#balanceCard'),
  menuGrid: document.querySelector('#menuGrid'),
  shoppingList: document.querySelector('#shoppingList'),
  emptyState: document.querySelector('#emptyState'),
  searchInput: document.querySelector('#searchInput'),
  categoryFilter: document.querySelector('#categoryFilter'),
  progressText: document.querySelector('#progressText'),
  progressFill: document.querySelector('#progressFill'),
  itemDialog: document.querySelector('#itemDialog'),
  itemForm: document.querySelector('#itemForm'),
  dialogTitle: document.querySelector('#dialogTitle'),
  editingId: document.querySelector('#editingId'),
  itemNameInput: document.querySelector('#itemNameInput'),
  itemQuantityInput: document.querySelector('#itemQuantityInput'),
  itemCategoryInput: document.querySelector('#itemCategoryInput'),
  itemPriceInput: document.querySelector('#itemPriceInput'),
  saveStatus: document.querySelector('#saveStatus'),
  calendarMonthLabel: document.querySelector('#calendarMonthLabel'),
  calendarGrid: document.querySelector('#calendarGrid'),
  prevMonthBtn: document.querySelector('#prevMonthBtn'),
  nextMonthBtn: document.querySelector('#nextMonthBtn')
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try { 
      const parsed = JSON.parse(saved);
      if (!parsed.monthlyMenu) parsed.monthlyMenu = {};
      return parsed;
    } catch (_) {}
  }

  return {
    budget: 200000,
    people: 4,
    mealType: 'Cena',
    week: getCurrentWeekValue(),
    menu: [
      'Pizza casera',
      'Pollo al horno con papas',
      'Tarta de pollo y verduras',
      'Milanesas con puré',
      'Arroz con carne y verduras',
      'Tortilla de papas con ensalada',
      'Hamburguesas caseras con papas'
    ],
    items: defaultItems,
    monthlyMenu: {}
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  els.saveStatus.textContent = 'Guardando...';
  
  clearTimeout(saveState.timer);
  saveState.timer = setTimeout(() => {
    els.saveStatus.textContent = 'Guardado local ✓';
    syncToGoogleSheet();
  }, 1000);
}

async function syncToGoogleSheet() {
  if (!WEB_APP_URL || WEB_APP_URL === 'https://script.google.com/macros/s/AKfycbwDWmFPCXaM2LixieIPm8qZbKgsmQDleS7a_rtsboehQFP9GVoej2w9KHbDk7wb6IB54g/exec') return;

  try {
    els.saveStatus.textContent = 'Sincronizando...';
    await fetch(WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    });
    els.saveStatus.textContent = 'Guardado en Sheet ✓';
    setTimeout(() => els.saveStatus.textContent = 'Guardado automático', 2000);
  } catch (err) {
    console.error('Error al sincronizar con Google Sheets:', err);
    els.saveStatus.textContent = 'Error al sincronizar';
  }
}

function getCurrentWeekValue() {
  const date = new Date();
  const temp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((temp - yearStart) / 86400000) + 1) / 7);
  return `${temp.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value || 0);
}

function renderAll() {
  els.budgetInput.value = state.budget;
  els.peopleInput.value = state.people;
  els.mealTypeInput.value = state.mealType;
  els.weekInput.value = state.week;
  renderMenu();
  renderShoppingList();
  renderCalendar();
  updateSummary();
}

function updateSummary() {
  const total = state.items.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const balance = Number(state.budget) - total;
  const perPerson = Number(state.budget) / Math.max(1, Number(state.people));

  els.budgetDisplay.textContent = formatCurrency(state.budget);
  els.estimatedDisplay.textContent = formatCurrency(total);
  els.balanceDisplay.textContent = formatCurrency(balance);
  els.perPersonDisplay.textContent = formatCurrency(perPerson);
  els.balanceCard.classList.toggle('warning', balance < 0);
}

function renderMenu() {
  els.menuGrid.innerHTML = '';
  const template = document.querySelector('#menuCardTemplate');

  days.forEach((day, index) => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector('.menu-card');
    const textarea = node.querySelector('textarea');
    node.querySelector('.day-badge').textContent = day;
    textarea.value = state.menu[index] || '';

    textarea.addEventListener('input', (event) => {
      state.menu[index] = event.target.value;
      saveState();
    });

    node.querySelector('.swap-btn').addEventListener('click', () => {
      const current = state.menu[index];
      const alternatives = mealSuggestions.filter(meal => meal !== current);
      state.menu[index] = alternatives[Math.floor(Math.random() * alternatives.length)];
      renderMenu();
      saveState();
    });

    els.menuGrid.appendChild(card);
  });
}

function renderShoppingList() {
  els.shoppingList.innerHTML = '';
  const search = els.searchInput.value.trim().toLowerCase();
  const category = els.categoryFilter.value;
  const template = document.querySelector('#shoppingItemTemplate');

  const filtered = state.items.filter(item => {
    const matchesText = item.name.toLowerCase().includes(search) || item.quantity.toLowerCase().includes(search);
    const matchesCategory = category === 'Todas' || item.category === category;
    return matchesText && matchesCategory;
  });

  filtered.forEach(item => {
    const node = template.content.cloneNode(true);
    const article = node.querySelector('.shopping-item');
    const check = node.querySelector('.item-check');

    article.classList.toggle('checked', item.checked);
    node.querySelector('.item-name').textContent = item.name;
    node.querySelector('.item-quantity').textContent = item.quantity;
    node.querySelector('.category-chip').textContent = item.category;
    node.querySelector('.item-price').textContent = formatCurrency(item.price);
    check.checked = item.checked;

    check.addEventListener('change', () => {
      item.checked = check.checked;
      saveState();
      renderShoppingList();
    });

    node.querySelector('.edit-btn').addEventListener('click', () => openDialog(item));
    node.querySelector('.delete-btn').addEventListener('click', () => {
      if (!confirm(`¿Eliminar ${item.name}?`)) return;
      state.items = state.items.filter(current => current.id !== item.id);
      saveState();
      renderShoppingList();
      updateSummary();
    });

    els.shoppingList.appendChild(article);
  });

  els.emptyState.classList.toggle('hidden', filtered.length > 0);
  updateProgress();
}

/* Lógica del Calendario Mensual */
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  els.calendarMonthLabel.textContent = `${monthNames[month]} ${year}`;
  els.calendarGrid.innerHTML = '';

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day empty';
    els.calendarGrid.appendChild(emptyCell);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dayCell = document.createElement('div');
    dayCell.className = 'calendar-day';

    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const dayNumber = document.createElement('span');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;

    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Comida...';
    textarea.value = state.monthlyMenu[dateKey] || '';

    textarea.addEventListener('input', (e) => {
      state.monthlyMenu[dateKey] = e.target.value;
      saveState();
    });

    dayCell.appendChild(dayNumber);
    dayCell.appendChild(textarea);
    els.calendarGrid.appendChild(dayCell);
  }
}

function updateProgress() {
  const total = state.items.length;
  const checked = state.items.filter(item => item.checked).length;
  const percentage = total ? Math.round((checked / total) * 100) : 0;
  els.progressText.textContent = `${checked} de ${total}`;
  els.progressFill.style.width = `${percentage}%`;
}

function openDialog(item = null) {
  els.itemForm.reset();
  els.editingId.value = item?.id || '';
  els.dialogTitle.textContent = item ? 'Editar producto' : 'Agregar producto';
  els.itemNameInput.value = item?.name || '';
  els.itemQuantityInput.value = item?.quantity || '';
  els.itemCategoryInput.value = item?.category || 'Almacén';
  els.itemPriceInput.value = item?.price ?? '';
  els.itemDialog.showModal();
  setTimeout(() => els.itemNameInput.focus(), 80);
}

function closeDialog() {
  els.itemDialog.close();
}

els.itemForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const id = els.editingId.value;
  const data = {
    id: id || crypto.randomUUID(),
    name: els.itemNameInput.value.trim(),
    quantity: els.itemQuantityInput.value.trim(),
    category: els.itemCategoryInput.value,
    price: Number(els.itemPriceInput.value),
    checked: false
  };

  if (!data.name || !data.quantity || Number.isNaN(data.price)) return;

  if (id) {
    const index = state.items.findIndex(item => item.id === id);
    data.checked = state.items[index]?.checked || false;
    state.items[index] = data;
  } else {
    state.items.push(data);
  }

  saveState();
  renderShoppingList();
  updateSummary();
  closeDialog();
});

els.budgetInput.addEventListener('input', (event) => {
  state.budget = Number(event.target.value || 0);
  updateSummary();
  saveState();
});

els.peopleInput.addEventListener('input', (event) => {
  state.people = Number(event.target.value || 1);
  updateSummary();
  saveState();
});

els.mealTypeInput.addEventListener('change', (event) => {
  state.mealType = event.target.value;
  saveState();
});

els.weekInput.addEventListener('change', (event) => {
  state.week = event.target.value;
  saveState();
});

els.prevMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

els.nextMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

els.searchInput.addEventListener('input', renderShoppingList);
els.categoryFilter.addEventListener('change', renderShoppingList);

document.querySelector('#addItemBtn').addEventListener('click', () => openDialog());
document.querySelector('#closeDialogBtn').addEventListener('click', closeDialog);
document.querySelector('#cancelDialogBtn').addEventListener('click', closeDialog);

document.querySelector('#generateMenuBtn').addEventListener('click', () => {
  const shuffled = [...mealSuggestions].sort(() => Math.random() - 0.5);
  state.menu = shuffled.slice(0, 7);
  renderMenu();
  saveState();
});

document.querySelector('#resetBtn').addEventListener('click', () => {
  if (!confirm('¿Querés borrar los cambios y volver al plan inicial?')) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
});

renderAll();
