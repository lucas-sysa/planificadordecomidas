const STORAGE_KEY = 'planificadorComidasV1';

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

const mealCatalog = [
  { name: 'Tortilla de papas con ensalada', slot: 'both', costPerPerson: 1800, ingredients: 'Papas, huevos, cebolla y ensalada' },
  { name: 'Fideos con salsa y queso', slot: 'both', costPerPerson: 1600, ingredients: 'Fideos, puré de tomate, cebolla y queso' },
  { name: 'Arroz con pollo y verduras', slot: 'both', costPerPerson: 2400, ingredients: 'Pollo, arroz, cebolla, zanahoria y morrón' },
  { name: 'Milanesas con puré', slot: 'almuerzo', costPerPerson: 3100, ingredients: 'Milanesas, papas, leche o manteca' },
  { name: 'Pollo al horno con papas', slot: 'almuerzo', costPerPerson: 2700, ingredients: 'Pollo, papas, cebolla y condimentos' },
  { name: 'Hamburguesas caseras con ensalada', slot: 'both', costPerPerson: 2600, ingredients: 'Carne picada, pan, huevo y ensalada' },
  { name: 'Tarta de verduras y queso', slot: 'cena', costPerPerson: 2200, ingredients: 'Tapas de tarta, verduras, huevos y queso' },
  { name: 'Pizza casera', slot: 'cena', costPerPerson: 2100, ingredients: 'Harina, levadura, tomate y muzzarella' },
  { name: 'Sándwiches calientes con ensalada', slot: 'cena', costPerPerson: 1900, ingredients: 'Pan, jamón, queso, tomate y lechuga' },
  { name: 'Guiso de lentejas', slot: 'both', costPerPerson: 2000, ingredients: 'Lentejas, carne, papa, zanahoria y tomate' },
  { name: 'Pastel de papas', slot: 'both', costPerPerson: 2800, ingredients: 'Carne picada, papas, cebolla y huevo' },
  { name: 'Omelette de queso con ensalada', slot: 'cena', costPerPerson: 1500, ingredients: 'Huevos, queso y verduras' },
  { name: 'Empanadas caseras de carne', slot: 'both', costPerPerson: 2500, ingredients: 'Tapas, carne picada, cebolla y huevo' },
  { name: 'Pechugas salteadas con arroz', slot: 'almuerzo', costPerPerson: 2500, ingredients: 'Pechuga de pollo, arroz y verduras' }
];

const state = loadState();
let calendarCursor = new Date();
calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth(), 1);
let selectedDateKey = toDateKey(new Date());
let editingMeal = null;
let touchStartX = null;
let wheelLocked = false;

const els = {
  budgetInput: document.querySelector('#budgetInput'),
  peopleInput: document.querySelector('#peopleInput'),
  budgetDisplay: document.querySelector('#budgetDisplay'),
  estimatedDisplay: document.querySelector('#estimatedDisplay'),
  balanceDisplay: document.querySelector('#balanceDisplay'),
  perPersonDisplay: document.querySelector('#perPersonDisplay'),
  balanceCard: document.querySelector('#balanceCard'),
  saveStatus: document.querySelector('#saveStatus'),
  mealEntryForm: document.querySelector('#mealEntryForm'),
  mealDateInput: document.querySelector('#mealDateInput'),
  mealSlotInput: document.querySelector('#mealSlotInput'),
  mealNameInput: document.querySelector('#mealNameInput'),
  mealCostInput: document.querySelector('#mealCostInput'),
  saveMealBtn: document.querySelector('#saveMealBtn'),
  cancelMealEditBtn: document.querySelector('#cancelMealEditBtn'),
  mealFormMessage: document.querySelector('#mealFormMessage'),
  calendarGrid: document.querySelector('#calendarGrid'),
  calendarMonthLabel: document.querySelector('#calendarMonthLabel'),
  monthlyBudgetDisplay: document.querySelector('#monthlyBudgetDisplay'),
  monthlyActualDisplay: document.querySelector('#monthlyActualDisplay'),
  monthlyBalanceDisplay: document.querySelector('#monthlyBalanceDisplay'),
  monthlyBalanceCard: document.querySelector('#monthlyBalanceCard'),
  monthProgressText: document.querySelector('#monthProgressText'),
  monthProgressFill: document.querySelector('#monthProgressFill'),
  selectedDayTitle: document.querySelector('#selectedDayTitle'),
  selectedDayEntries: document.querySelector('#selectedDayEntries'),
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
  suggestionPeriodInput: document.querySelector('#suggestionPeriodInput'),
  suggestionStartDateInput: document.querySelector('#suggestionStartDateInput'),
  suggestionSlotsInput: document.querySelector('#suggestionSlotsInput'),
  generateSuggestionsBtn: document.querySelector('#generateSuggestionsBtn'),
  suggestionsEmpty: document.querySelector('#suggestionsEmpty'),
  suggestionsList: document.querySelector('#suggestionsList')
};

function loadState() {
  let savedState = null;
  try { savedState = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (_) {}
  const base = savedState || { budget: 200000, people: 4, items: defaultItems, mealsByDate: {}, suggestionPlan: [] };
  base.budget = Number(base.budget || 0);
  base.people = Number(base.people || 4);
  base.items = Array.isArray(base.items) ? base.items : defaultItems;
  base.mealsByDate = base.mealsByDate || {};
  base.suggestionPlan = Array.isArray(base.suggestionPlan) ? base.suggestionPlan : [];
  migrateLegacyMeals(base);
  return base;
}

function migrateLegacyMeals(base) {
  Object.values(base.mealsByDate).forEach(record => {
    ['almuerzo', 'cena'].forEach(slot => {
      const meal = record?.[slot];
      if (meal && meal.confirmed && !meal.actual) meal.actual = meal.suggestion || '';
    });
  });
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  els.saveStatus.textContent = 'Guardado ✓';
  clearTimeout(saveState.timer);
  saveState.timer = setTimeout(() => { els.saveStatus.textContent = 'Guardado automático'; }, 1100);
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fromDateKey(key) { return new Date(`${key}T12:00:00`); }
function formatCurrency(value) { return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(Number(value || 0)); }
function escapeHtml(text) { return String(text || '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }

function getRecord(key, create = false) {
  if (!state.mealsByDate[key] && create) {
    state.mealsByDate[key] = {
      almuerzo: { actual: '', cost: 0, confirmed: false },
      cena: { actual: '', cost: 0, confirmed: false }
    };
  }
  return state.mealsByDate[key];
}

function renderAll() {
  els.budgetInput.value = state.budget;
  els.peopleInput.value = state.people;
  els.mealDateInput.value = selectedDateKey;
  els.suggestionStartDateInput.value = selectedDateKey;
  updateSummary();
  renderCalendar();
  renderSelectedDay();
  renderShoppingList();
  renderSuggestions();
}

function updateSummary() {
  const estimated = state.suggestionPlan.reduce((sum, day) => sum + day.meals.reduce((mealSum, meal) => mealSum + Number(meal.cost || 0), 0), 0);
  const days = state.suggestionPlan.length || (els.suggestionPeriodInput?.value === 'week' ? 7 : 1);
  const referenceDate = fromDateKey(els.suggestionStartDateInput?.value || selectedDateKey);
  const daysInMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0).getDate();
  const periodBudget = (state.budget / Math.max(1, daysInMonth)) * days;
  const balance = periodBudget - estimated;
  const perPerson = state.budget / Math.max(1, state.people);
  els.budgetDisplay.textContent = formatCurrency(state.budget);
  els.estimatedDisplay.textContent = formatCurrency(estimated);
  els.balanceDisplay.textContent = formatCurrency(balance);
  els.perPersonDisplay.textContent = formatCurrency(perPerson);
  els.balanceCard.classList.toggle('warning', balance < 0);
}

function generateSuggestions() {
  const startKey = els.suggestionStartDateInput.value || selectedDateKey;
  const startDate = fromDateKey(startKey);
  const dayCount = els.suggestionPeriodInput.value === 'week' ? 7 : 1;
  const selectedSlots = els.suggestionSlotsInput.value === 'both' ? ['almuerzo', 'cena'] : [els.suggestionSlotsInput.value];
  const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
  const periodBudget = (state.budget / Math.max(1, daysInMonth)) * dayCount;
  const targetPerMeal = periodBudget / Math.max(1, dayCount * selectedSlots.length);
  const usedNames = new Set();
  const plan = [];

  for (let dayIndex = 0; dayIndex < dayCount; dayIndex += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + dayIndex);
    const meals = selectedSlots.map((slot, slotIndex) => {
      const candidates = mealCatalog
        .filter(meal => meal.slot === 'both' || meal.slot === slot)
        .map(meal => ({ ...meal, cost: Math.round((meal.costPerPerson * Math.max(1, state.people)) / 100) * 100 }))
        .sort((a, b) => {
          const aRepeat = usedNames.has(a.name) ? 1 : 0;
          const bRepeat = usedNames.has(b.name) ? 1 : 0;
          if (aRepeat !== bRepeat) return aRepeat - bRepeat;
          return Math.abs(a.cost - targetPerMeal) - Math.abs(b.cost - targetPerMeal);
        });
      const pickIndex = (dayIndex + slotIndex) % Math.min(3, candidates.length);
      const selected = candidates[pickIndex] || candidates[0];
      usedNames.add(selected.name);
      return { slot, name: selected.name, cost: selected.cost, ingredients: selected.ingredients };
    });
    plan.push({ date: toDateKey(date), meals });
  }

  state.suggestionPlan = plan;
  saveState();
  renderSuggestions();
  updateSummary();
}

function renderSuggestions() {
  const plan = state.suggestionPlan || [];
  els.suggestionsEmpty.classList.toggle('hidden', plan.length > 0);
  els.suggestionsList.innerHTML = '';
  if (!plan.length) return;

  plan.forEach(day => {
    const date = fromDateKey(day.date);
    const label = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
    const total = day.meals.reduce((sum, meal) => sum + Number(meal.cost || 0), 0);
    const article = document.createElement('article');
    article.className = 'suggestion-day';
    article.innerHTML = `
      <div class="suggestion-day-heading">
        <h3>${escapeHtml(label)}</h3>
        <span class="suggestion-day-total">Estimado: ${formatCurrency(total)}</span>
      </div>
      <div class="suggestion-meals">
        ${day.meals.map(meal => `
          <div class="suggestion-meal">
            <div class="suggestion-meal-header">
              <span>${meal.slot === 'almuerzo' ? '☀️ Almuerzo' : '🌙 Cena'}</span>
              <strong>${formatCurrency(meal.cost)}</strong>
            </div>
            <h4>${escapeHtml(meal.name)}</h4>
            <p>${escapeHtml(meal.ingredients)}</p>
            <button class="btn btn-secondary suggestion-use-btn" type="button" data-date="${day.date}" data-slot="${meal.slot}" data-name="${escapeHtml(meal.name)}" data-cost="${meal.cost}">Usar esta sugerencia</button>
          </div>`).join('')}
      </div>
      <p class="suggestion-note">Costo aproximado para ${state.people} persona${state.people === 1 ? '' : 's'}. Podés modificar el gasto real al registrarla.</p>`;
    els.suggestionsList.appendChild(article);
  });

  els.suggestionsList.querySelectorAll('.suggestion-use-btn').forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.date;
      els.mealDateInput.value = key;
      els.mealSlotInput.value = button.dataset.slot;
      els.mealNameInput.value = button.dataset.name;
      els.mealCostInput.value = button.dataset.cost;
      selectedDateKey = key;
      const date = fromDateKey(key);
      calendarCursor = new Date(date.getFullYear(), date.getMonth(), 1);
      renderCalendar();
      renderSelectedDay();
      els.mealNameInput.focus();
      window.scrollTo({ top: els.mealEntryForm.getBoundingClientRect().top + window.scrollY - 30, behavior: 'smooth' });
    });
  });
}

function getMonthlyTotal(year, month) {
  let total = 0;
  Object.entries(state.mealsByDate).forEach(([key, record]) => {
    const date = fromDateKey(key);
    if (date.getFullYear() !== year || date.getMonth() !== month) return;
    ['almuerzo', 'cena'].forEach(slot => {
      if (record?.[slot]?.confirmed) total += Number(record[slot].cost || 0);
    });
  });
  return total;
}

function renderCalendar() {
  els.calendarGrid.innerHTML = '';
  const year = calendarCursor.getFullYear();
  const month = calendarCursor.getMonth();
  els.calendarMonthLabel.textContent = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(calendarCursor);

  const monthlyTotal = getMonthlyTotal(year, month);
  const available = state.budget - monthlyTotal;
  const percent = state.budget > 0 ? Math.round((monthlyTotal / state.budget) * 100) : 0;
  els.monthlyBudgetDisplay.textContent = formatCurrency(state.budget);
  els.monthlyActualDisplay.textContent = formatCurrency(monthlyTotal);
  els.monthlyBalanceDisplay.textContent = formatCurrency(available);
  els.monthlyBalanceCard.classList.toggle('warning', available < 0);
  els.monthProgressText.textContent = `${percent}%`;
  els.monthProgressFill.style.width = `${Math.min(percent, 100)}%`;
  els.monthProgressFill.classList.toggle('warning', percent >= 80 && percent < 100);
  els.monthProgressFill.classList.toggle('danger', percent >= 100);

  const firstDay = new Date(year, month, 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - mondayOffset);
  const todayKey = toDateKey(new Date());

  for (let i = 0; i < 42; i += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    const key = toDateKey(date);
    const record = getRecord(key);
    const entries = ['almuerzo', 'cena'].filter(slot => record?.[slot]?.confirmed);
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'calendar-day';
    cell.classList.toggle('other-month', date.getMonth() !== month);
    cell.classList.toggle('today', key === todayKey);
    cell.classList.toggle('selected', key === selectedDateKey);
    cell.innerHTML = `<span class="calendar-date-number">${date.getDate()}</span>`;

    if (!entries.length) {
      cell.insertAdjacentHTML('beforeend', '<span class="calendar-empty">—</span>');
    } else {
      entries.forEach(slot => {
        const meal = record[slot];
        const icon = slot === 'almuerzo' ? '☀️' : '🌙';
        cell.insertAdjacentHTML('beforeend', `<span class="calendar-entry"><strong>${icon} ${slot === 'almuerzo' ? 'Almuerzo' : 'Cena'}</strong>${escapeHtml(meal.actual)} <span class="calendar-cost">· ${formatCurrency(meal.cost)}</span></span>`);
      });
    }

    cell.addEventListener('click', () => selectDate(key));
    els.calendarGrid.appendChild(cell);
  }
}

function selectDate(key) {
  selectedDateKey = key;
  const date = fromDateKey(key);
  calendarCursor = new Date(date.getFullYear(), date.getMonth(), 1);
  els.mealDateInput.value = key;
  renderCalendar();
  renderSelectedDay();
}

function renderSelectedDay() {
  const date = fromDateKey(selectedDateKey);
  els.selectedDayTitle.textContent = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  const record = getRecord(selectedDateKey);
  const entries = ['almuerzo', 'cena'].filter(slot => record?.[slot]?.confirmed);
  if (!entries.length) {
    els.selectedDayEntries.innerHTML = '<p class="selected-day-empty">Todavía no hay comidas registradas para este día.</p>';
    return;
  }
  const total = entries.reduce((sum, slot) => sum + Number(record[slot].cost || 0), 0);
  els.selectedDayEntries.innerHTML = entries.map(slot => {
    const meal = record[slot];
    const label = slot === 'almuerzo' ? '☀️ Almuerzo' : '🌙 Cena';
    return `<article class="day-entry-card"><div><span>${label}</span><strong>${escapeHtml(meal.actual)}</strong><small>${formatCurrency(meal.cost)}</small></div><div class="entry-actions"><button class="icon-btn edit-meal-btn" data-slot="${slot}" type="button" aria-label="Editar">✏️</button><button class="icon-btn delete-meal-btn" data-slot="${slot}" type="button" aria-label="Eliminar">🗑️</button></div></article>`;
  }).join('') + `<div class="day-total"><span>Total del día</span><strong>${formatCurrency(total)}</strong></div>`;

  els.selectedDayEntries.querySelectorAll('.edit-meal-btn').forEach(btn => btn.addEventListener('click', () => startMealEdit(selectedDateKey, btn.dataset.slot)));
  els.selectedDayEntries.querySelectorAll('.delete-meal-btn').forEach(btn => btn.addEventListener('click', () => deleteMeal(selectedDateKey, btn.dataset.slot)));
}

function startMealEdit(key, slot) {
  const meal = getRecord(key)?.[slot];
  if (!meal) return;
  editingMeal = { key, slot };
  els.mealDateInput.value = key;
  els.mealSlotInput.value = slot;
  els.mealNameInput.value = meal.actual;
  els.mealCostInput.value = meal.cost || '';
  els.saveMealBtn.textContent = 'Guardar cambios';
  els.cancelMealEditBtn.classList.remove('hidden');
  els.mealNameInput.focus();
  window.scrollTo({ top: els.mealEntryForm.getBoundingClientRect().top + window.scrollY - 30, behavior: 'smooth' });
}

function cancelMealEdit() {
  editingMeal = null;
  els.mealEntryForm.reset();
  els.mealDateInput.value = selectedDateKey;
  els.saveMealBtn.textContent = 'Guardar en el calendario';
  els.cancelMealEditBtn.classList.add('hidden');
}

function deleteMeal(key, slot) {
  const meal = getRecord(key)?.[slot];
  if (!meal || !confirm(`¿Eliminar ${slot === 'almuerzo' ? 'el almuerzo' : 'la cena'}: ${meal.actual}?`)) return;
  state.mealsByDate[key][slot] = { actual: '', cost: 0, confirmed: false };
  if (!state.mealsByDate[key].almuerzo.confirmed && !state.mealsByDate[key].cena.confirmed) delete state.mealsByDate[key];
  saveState();
  renderCalendar();
  renderSelectedDay();
}

els.mealEntryForm.addEventListener('submit', event => {
  event.preventDefault();
  const key = els.mealDateInput.value;
  const slot = els.mealSlotInput.value;
  const actual = els.mealNameInput.value.trim();
  const cost = Number(els.mealCostInput.value || 0);
  if (!key || !actual || cost < 0) return;

  if (editingMeal && (editingMeal.key !== key || editingMeal.slot !== slot)) {
    state.mealsByDate[editingMeal.key][editingMeal.slot] = { actual: '', cost: 0, confirmed: false };
  }
  const record = getRecord(key, true);
  record[slot] = { actual, cost, confirmed: true };
  selectedDateKey = key;
  const date = fromDateKey(key);
  calendarCursor = new Date(date.getFullYear(), date.getMonth(), 1);
  saveState();
  cancelMealEdit();
  els.mealDateInput.value = key;
  showFormMessage('Comida guardada en el calendario ✓');
  renderCalendar();
  renderSelectedDay();
});

function showFormMessage(message) {
  els.mealFormMessage.textContent = message;
  els.mealFormMessage.classList.remove('hidden');
  clearTimeout(showFormMessage.timer);
  showFormMessage.timer = setTimeout(() => els.mealFormMessage.classList.add('hidden'), 2200);
}

function changeMonth(delta) {
  calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + delta, 1);
  renderCalendar();
}

document.querySelector('#prevMonthBtn').addEventListener('click', () => changeMonth(-1));
document.querySelector('#nextMonthBtn').addEventListener('click', () => changeMonth(1));
els.cancelMealEditBtn.addEventListener('click', cancelMealEdit);
els.mealDateInput.addEventListener('change', event => {
  if (!event.target.value) return;
  selectedDateKey = event.target.value;
  const date = fromDateKey(selectedDateKey);
  calendarCursor = new Date(date.getFullYear(), date.getMonth(), 1);
  renderCalendar();
  renderSelectedDay();
});

els.calendarGrid.addEventListener('wheel', event => {
  if (wheelLocked || Math.abs(event.deltaY) < 10) return;
  event.preventDefault();
  wheelLocked = true;
  changeMonth(event.deltaY > 0 ? 1 : -1);
  setTimeout(() => { wheelLocked = false; }, 450);
}, { passive: false });
els.calendarGrid.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
els.calendarGrid.addEventListener('touchend', event => {
  if (touchStartX === null) return;
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 55) changeMonth(delta < 0 ? 1 : -1);
  touchStartX = null;
}, { passive: true });

els.budgetInput.addEventListener('input', event => { state.budget = Number(event.target.value || 0); updateSummary(); renderCalendar(); saveState(); });
els.peopleInput.addEventListener('input', event => { state.people = Number(event.target.value || 1); updateSummary(); renderSuggestions(); saveState(); });
els.generateSuggestionsBtn.addEventListener('click', generateSuggestions);
els.suggestionPeriodInput.addEventListener('change', updateSummary);
els.suggestionStartDateInput.addEventListener('change', updateSummary);

function renderShoppingList() {
  els.shoppingList.innerHTML = '';
  const search = els.searchInput.value.trim().toLowerCase();
  const category = els.categoryFilter.value;
  const template = document.querySelector('#shoppingItemTemplate');
  const filtered = state.items.filter(item => (item.name.toLowerCase().includes(search) || item.quantity.toLowerCase().includes(search)) && (category === 'Todas' || item.category === category));

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
    check.addEventListener('change', () => { item.checked = check.checked; saveState(); renderShoppingList(); });
    node.querySelector('.edit-btn').addEventListener('click', () => openDialog(item));
    node.querySelector('.delete-btn').addEventListener('click', () => {
      if (!confirm(`¿Eliminar ${item.name}?`)) return;
      state.items = state.items.filter(current => current.id !== item.id);
      saveState(); renderShoppingList(); updateSummary();
    });
    els.shoppingList.appendChild(article);
  });
  els.emptyState.classList.toggle('hidden', filtered.length > 0);
  updateProgress();
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
function closeDialog() { els.itemDialog.close(); }

els.itemForm.addEventListener('submit', event => {
  event.preventDefault();
  const id = els.editingId.value;
  const data = { id: id || crypto.randomUUID(), name: els.itemNameInput.value.trim(), quantity: els.itemQuantityInput.value.trim(), category: els.itemCategoryInput.value, price: Number(els.itemPriceInput.value), checked: false };
  if (!data.name || !data.quantity || Number.isNaN(data.price)) return;
  if (id) {
    const index = state.items.findIndex(item => item.id === id);
    data.checked = state.items[index]?.checked || false;
    state.items[index] = data;
  } else state.items.push(data);
  saveState(); renderShoppingList(); updateSummary(); closeDialog();
});

els.searchInput.addEventListener('input', renderShoppingList);
els.categoryFilter.addEventListener('change', renderShoppingList);
document.querySelector('#addItemBtn').addEventListener('click', () => openDialog());
document.querySelector('#closeDialogBtn').addEventListener('click', closeDialog);
document.querySelector('#cancelDialogBtn').addEventListener('click', closeDialog);
document.querySelector('#resetBtn').addEventListener('click', () => {
  if (!confirm('¿Querés borrar todos los datos y volver al plan inicial?')) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
});

renderAll();
