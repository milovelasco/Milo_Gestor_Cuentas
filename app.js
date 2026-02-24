/* ============================================================
   GESTOR CUENTAS — Application Logic (app.js)
   ============================================================ */

// ============================================================
// STATE
// ============================================================
const STORAGE_KEY = 'gestorCuentas_v1';

let state = {
    months: {},       // { "2026-02": { groups: [...], sueldo: 0 } }
    currentMonth: '',
};

// Helpers
function pad(n) { return String(n).padStart(2, '0'); }
function monthKey(date) { return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`; }
function uid() { return '_' + Math.random().toString(36).slice(2, 9); }

// ============================================================
// INITIAL DEMO DATA (mirrors the Excel image)
// ============================================================
const DEMO_GROUPS = [
    {
        id: uid(), name: 'El Tabor', color: '#f97316',
        items: [
            { id: uid(), name: 'Dividendo', amount: 306200, status: 'PAGADO' },
            { id: uid(), name: 'Gasto Común', amount: 135000, status: 'PAGADO' },
            { id: uid(), name: 'Luz', amount: 18278, status: 'PAGADO' },
            { id: uid(), name: 'Gas', amount: 24000, status: 'PAGADO' },
            { id: uid(), name: 'Agua', amount: 41830, status: 'PAGADO' },
            { id: uid(), name: 'Derecho Aseo', amount: 0, status: 'Pendiente' },
        ]
    },
    {
        id: uid(), name: 'P. Hurtado', color: '#f59e0b',
        items: [
            { id: uid(), name: 'Dividendo', amount: 0, status: 'PAGADO' },
            { id: uid(), name: 'Gasto Común', amount: 0, status: 'Suspendido' },
            { id: uid(), name: 'Agua', amount: 0, status: 'Suspendido' },
            { id: uid(), name: 'Gas', amount: 0, status: 'Suspendido' },
            { id: uid(), name: 'Contribución', amount: 40000, status: 'Pendiente' },
            { id: uid(), name: 'Corredora', amount: 43202, status: 'PAGADO' },
        ]
    },
    {
        id: uid(), name: 'Isidro', color: '#f59e0b',
        items: [
            { id: uid(), name: 'Dividendo', amount: 0, status: 'PAGADO' },
        ]
    },
    {
        id: uid(), name: 'Alescapri', color: '#8b5cf6',
        items: [
            { id: uid(), name: 'Arriendo', amount: 456849, status: 'PAGADO' },
            { id: uid(), name: 'Gasto Común', amount: 35000, status: 'PAGADO' },
            { id: uid(), name: 'Luz', amount: 37200, status: 'PAGADO' },
            { id: uid(), name: 'Agua', amount: 45900, status: 'PAGADO' },
            { id: uid(), name: 'Gas', amount: 50000, status: 'Pendiente' },
        ]
    },
    {
        id: uid(), name: 'Banco Scotía', color: '#0ea5e9',
        items: [
            { id: uid(), name: 'Mantención cuenta', amount: 7944, status: 'PAGADO' },
            { id: uid(), name: 'Netflix', amount: 12800, status: 'PAGADO' },
            { id: uid(), name: 'Prime', amount: 0, status: 'Suspendido' },
            { id: uid(), name: 'YouTube', amount: 5000, status: 'PAGADO' },
            { id: uid(), name: 'Spotify', amount: 8250, status: 'PAGADO' },
            { id: uid(), name: 'Apple TV', amount: 0, status: 'Suspendido' },
            { id: uid(), name: 'Zapatos', amount: 6900, status: 'PAGADO' },
            { id: uid(), name: 'Max', amount: 0, status: 'Pendiente' },
            { id: uid(), name: 'Copec Benisho', amount: 78000, status: 'PAGADO' },
            { id: uid(), name: 'Copec Paralina', amount: 0, status: 'Suspendido' },
            { id: uid(), name: 'OEI Seguros', amount: 60194, status: 'PAGADO' },
            { id: uid(), name: 'Mercado Libre 25/2', amount: 2208, status: 'PAGADO' },
            { id: uid(), name: 'Mercado Libre 26/2', amount: 2238, status: 'PAGADO' },
            { id: uid(), name: 'Mercado Libre 28/2', amount: 4831, status: 'PAGADO' },
            { id: uid(), name: 'Mercado Libre 03/3', amount: 2296, status: 'PAGADO' },
            { id: uid(), name: 'Mercado Libre 03/6', amount: 9159, status: 'PAGADO' },
            { id: uid(), name: 'Mercado Libre 26/8', amount: 4127, status: 'PAGADO' },
            { id: uid(), name: 'Claro', amount: 23267, status: 'PAGADO' },
            { id: uid(), name: 'ML 26/08', amount: 8242, status: 'PAGADO' },
            { id: uid(), name: 'Avance en cuotas', amount: 215134, status: 'PAGADO' },
        ]
    },
    {
        id: uid(), name: 'Banco Estado', color: '#14b8a6',
        items: [
            { id: uid(), name: 'Mantención cuenta', amount: 10764, status: 'PAGADO' },
            { id: uid(), name: 'Mantención tarjeta', amount: 5177, status: 'PAGADO' },
            { id: uid(), name: 'Avance efectivo 01/09', amount: 35200, status: 'PAGADO' },
            { id: uid(), name: 'Luis Portales 01/13', amount: 15200, status: 'PAGADO' },
            { id: uid(), name: 'Paris 01/10', amount: 89199, status: 'PAGADO' },
            { id: uid(), name: 'Avance talará 02/06', amount: 62204, status: 'PAGADO' },
            { id: uid(), name: 'Luis Portales 12/13', amount: 56173, status: 'PAGADO' },
            { id: uid(), name: 'H. Economy 1/24', amount: 59520, status: 'PAGADO' },
            { id: uid(), name: 'TUCAN 10/12', amount: 57484, status: 'PAGADO' },
            { id: uid(), name: 'Mercado Libre 10/12', amount: 326427, status: 'PAGADO' },
        ]
    },
    {
        id: uid(), name: 'Tempo', color: '#10b981',
        items: [
            { id: uid(), name: 'Mantención Tarjeta', amount: 1732, status: 'PAGADO' },
            { id: uid(), name: 'Mercadolibre 08/12', amount: 7478, status: 'PAGADO' },
            { id: uid(), name: 'Codehouse 38/12', amount: 22372, status: 'PAGADO' },
            { id: uid(), name: 'RedSalud 02/03', amount: 16268, status: 'PAGADO' },
            { id: uid(), name: 'Mercadolibre 04/12', amount: 18325, status: 'PAGADO' },
            { id: uid(), name: 'Mercadolibre 03/02', amount: 10515, status: 'PAGADO' },
            { id: uid(), name: 'Cinamo', amount: 109890, status: 'PAGADO' },
            { id: uid(), name: 'Clinicpet', amount: 21900, status: 'PAGADO' },
            { id: uid(), name: 'Mercadolibre 01/06', amount: 9998, status: 'PAGADO' },
            { id: uid(), name: 'Desayun 02/10', amount: 6751, status: 'PAGADO' },
            { id: uid(), name: 'Mercadolibre 01/08', amount: 1101, status: 'PAGADO' },
            { id: uid(), name: 'Mercadolibre 01/06', amount: 11606, status: 'PAGADO' },
            { id: uid(), name: 'Mercadolibre 09/06', amount: 3329, status: 'PAGADO' },
            { id: uid(), name: 'SKY 05/12', amount: 54165, status: 'PAGADO' },
        ]
    },
    {
        id: uid(), name: 'Emilia', color: '#ec4899',
        items: [
            { id: uid(), name: 'Estudio Emilia', amount: 50000, status: 'Suspendido' },
            { id: uid(), name: 'Locomoción Emilia', amount: 50000, status: 'Pendiente' },
        ]
    },
    {
        id: uid(), name: 'Jano', color: '#0ea5e9',
        items: [
            { id: uid(), name: 'Bajlez Jano', amount: 64201, status: 'PAGADO' },
            { id: uid(), name: 'Tempo 1/2', amount: 8070, status: 'PAGADO' },
            { id: uid(), name: 'Tempo 1/8', amount: 11328, status: 'PAGADO' },
            { id: uid(), name: 'Tempo 8/21', amount: 22814, status: 'PAGADO' },
            { id: uid(), name: 'Tempo 1/6', amount: 14668, status: 'PAGADO' },
            { id: uid(), name: 'Falalella Jano', amount: 142000, status: 'PAGADO' },
            { id: uid(), name: 'T. Casual Oscar', amount: 198259, status: 'PAGADO' },
            { id: uid(), name: 'Tenis Amanda', amount: 45000, status: 'PAGADO' },
            { id: uid(), name: 'Tenis Jano', amount: 50000, status: 'PAGADO' },
            { id: uid(), name: 'Torneos', amount: 38000, status: 'PAGADO' },
            { id: uid(), name: 'Diferencia positiva', amount: 0, status: 'PAGADO' },
            { id: uid(), name: 'Tempo 3/3', amount: 20000, status: 'PAGADO' },
        ]
    },
    {
        id: uid(), name: 'Gasto Casa', color: '#6366f1',
        items: [
            { id: uid(), name: 'Entel Emilio', amount: 50000, status: 'PAGADO' },
            { id: uid(), name: 'Autopista', amount: 5000, status: 'PAGADO' },
            { id: uid(), name: 'Viaje FC', amount: 350000, status: 'Pendiente' },
            { id: uid(), name: 'Mercadería Casa', amount: 100000, status: 'Pendiente' },
        ]
    },
];

// ============================================================
// HELPERS — MONTH
// ============================================================
function createMonthIfNeeded(key, groups = [], sueldo = 0, extraIngresos = []) {
    if (!state.months[key]) {
        state.months[key] = {
            groups: JSON.parse(JSON.stringify(groups)),
            sueldo,
            extraIngresos: JSON.parse(JSON.stringify(extraIngresos)),
        };
    } else if (!state.months[key].extraIngresos) {
        // migration: add field if missing (older saves)
        state.months[key].extraIngresos = [];
    }
}

function currentData() { return state.months[state.currentMonth]; }

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

// ============================================================
// FORMAT
// ============================================================
const FMT = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
function fmt(n) { return FMT.format(n || 0); }

function parseCurrency(str) {
    if (typeof str === 'number') return str;
    const s = String(str).replace(/[^0-9,.-]/g, '').replace(',', '.');
    return parseFloat(s) || 0;
}

// ============================================================
// MONTH NAVIGATION
// ============================================================
const MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function getDateFromKey(key) {
    const [y, m] = key.split('-').map(Number);
    return new Date(y, m - 1, 1);
}

function renderMonthLabel() {
    const d = getDateFromKey(state.currentMonth);
    document.getElementById('currentMonthLabel').textContent =
        `${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`;
}

function bindMonthNav() {
    document.getElementById('prevMonth').addEventListener('click', () => {
        const d = getDateFromKey(state.currentMonth);
        d.setMonth(d.getMonth() - 1);
        state.currentMonth = monthKey(d);
        createMonthIfNeeded(state.currentMonth);
        save();
        renderAll();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        const d = getDateFromKey(state.currentMonth);
        d.setMonth(d.getMonth() + 1);
        state.currentMonth = monthKey(d);
        createMonthIfNeeded(state.currentMonth);
        save();
        renderAll();
    });
}

// ============================================================
// RENDER
// ============================================================
function renderAll() {
    renderMonthLabel();
    renderGroups();
    renderIngresos();
    updateSummaryCards();
}

function renderGroups() {
    const container = document.getElementById('groupsContainer');
    const data = currentData();

    if (!data.groups.length) {
        container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <h2>Sin grupos aún</h2>
        <p>Hacé clic en <strong>"+ Nuevo Grupo"</strong> para comenzar a organizar tus cuentas, o importá tu archivo Excel.</p>
      </div>`;
        return;
    }

    container.innerHTML = '';
    data.groups.forEach(group => {
        container.appendChild(buildGroupCard(group));
    });
}

function buildGroupCard(group) {
    const div = document.createElement('div');
    div.className = 'group-card';
    div.dataset.groupId = group.id;

    const groupTotal = group.items.reduce((s, i) => s + (i.amount || 0), 0);
    const paidTotal = group.items.filter(i => i.status === 'PAGADO').reduce((s, i) => s + (i.amount || 0), 0);

    div.innerHTML = `
    <div class="group-header" onclick="toggleGroup('${group.id}')">
      <div class="group-header-left">
        <div class="group-color-dot" style="background:${group.color}; color:${group.color}"></div>
        <span class="group-name" style="color:${group.color}">${escapeHtml(group.name)}</span>
        <span class="group-toggle">▾</span>
      </div>
      <div style="display:flex;align-items:center;gap:12px">
        <span class="group-total">${fmt(groupTotal)}</span>
        <div class="group-actions" onclick="event.stopPropagation()">
          <button class="btn-icon" title="Editar grupo" onclick="openEditGroup('${group.id}')">✏️</button>
          <button class="btn-icon danger" title="Eliminar grupo" onclick="deleteGroup('${group.id}')">🗑️</button>
        </div>
      </div>
    </div>
    <div class="group-body">
      <table class="items-table">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Monto</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="tbody-${group.id}">
          ${group.items.map(item => buildItemRow(group.id, item)).join('')}
          <tr class="add-item-row">
            <td colspan="4">
              <button class="add-item-btn" onclick="openAddItem('${group.id}')">
                <span style="font-size:16px">＋</span> Agregar ítem
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="group-footer">
      <span>${group.items.length} ítem${group.items.length !== 1 ? 's' : ''} · Pagado: <strong style="color:var(--status-paid)">${fmt(paidTotal)}</strong></span>
      <span class="group-footer-total">${fmt(groupTotal)}</span>
    </div>`;

    return div;
}

function buildItemRow(groupId, item) {
    const statusClass = `status-${item.status.replace(' ', '_')}`;
    const amount = item.amount || 0;
    return `
    <tr class="item-row" data-item-id="${item.id}">
      <td class="item-name">${escapeHtml(item.name)}</td>
      <td class="item-amount">${amount ? fmt(amount) : '<span style="color:var(--text-muted)">—</span>'}</td>
      <td class="item-status-cell">
        <span class="status-badge status-${item.status}" onclick="cycleStatus('${groupId}','${item.id}')">
          ${statusIcon(item.status)} ${item.status}
        </span>
      </td>
      <td class="item-row-actions">
        <button class="btn-icon" onclick="openEditItem('${groupId}','${item.id}')" title="Editar">✏️</button>
        <button class="btn-icon danger" onclick="deleteItem('${groupId}','${item.id}')" title="Eliminar">🗑️</button>
      </td>
    </tr>`;
}

function statusIcon(s) {
    if (s === 'PAGADO') return '✅';
    if (s === 'Pendiente') return '⏳';
    return '🚫';
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// ============================================================
// SUMMARY CARDS
// ============================================================
function updateSummaryCards() {
    const data = currentData();
    if (!data) return;

    let total = 0, pagado = 0, pendiente = 0;
    data.groups.forEach(g => {
        g.items.forEach(i => {
            const a = i.amount || 0;
            total += a;
            if (i.status === 'PAGADO') pagado += a;
            if (i.status === 'Pendiente') pendiente += a;
        });
    });

    const sueldo = data.sueldo || 0;
    const extraTotal = (data.extraIngresos || []).reduce((s, ing) => s + (ing.amount || 0), 0);
    const totalIngresos = sueldo + extraTotal;
    const diff = totalIngresos - total;

    document.getElementById('summaryTotal').textContent = fmt(total);
    document.getElementById('summarySueldo').textContent = fmt(sueldo);
    document.getElementById('summaryIngresos').textContent = fmt(totalIngresos);
    document.getElementById('summaryPositivos').textContent = fmt(pagado);
    document.getElementById('summaryPendientes').textContent = fmt(pendiente);

    const diffEl = document.getElementById('summaryDiff');
    diffEl.textContent = fmt(diff);
    diffEl.className = 'card-value' + (diff < 0 ? ' negative' : '');
}

function bindSueldo() {
    document.getElementById('summarySueldo').addEventListener('blur', function () {
        const raw = this.textContent.replace(/[^0-9]/g, '');
        const val = parseInt(raw) || 0;
        currentData().sueldo = val;
        save();
        updateSummaryCards();
    });
    document.getElementById('summarySueldo').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); this.blur(); }
    });
}

// ============================================================
// INGRESOS EXTRA — Render
// ============================================================
function renderIngresos() {
    const data = currentData();
    const ings = data.extraIngresos || [];
    const tbody = document.getElementById('ingresosTbody');
    const empty = document.getElementById('ingresosEmpty');
    const subtitle = document.getElementById('ingresosSubtitle');
    const totalEl = document.getElementById('ingresosTotal');

    const total = ings.reduce((s, ing) => s + (ing.amount || 0), 0);
    totalEl.textContent = fmt(total);
    subtitle.textContent = `${ings.length} fuente${ings.length !== 1 ? 's' : ''} adicional${ings.length !== 1 ? 'es' : ''}`;

    tbody.innerHTML = ings.map(ing => `
        <tr class="item-row ingreso-row" data-ingreso-id="${ing.id}">
          <td class="item-name">${escapeHtml(ing.name)}</td>
          <td class="item-amount">${fmt(ing.amount || 0)}</td>
          <td class="item-row-actions">
            <button class="btn-icon" onclick="openEditIngreso('${ing.id}')" title="Editar">✏️</button>
            <button class="btn-icon danger" onclick="deleteIngreso('${ing.id}')" title="Eliminar">🗑️</button>
          </td>
        </tr>`).join('');

    empty.classList.toggle('show', ings.length === 0);
    // hide table header + body if empty
    const tbl = document.querySelector('.ingresos-table');
    if (tbl) tbl.style.display = ings.length === 0 ? 'none' : 'table';
}

// ============================================================
// INGRESOS EXTRA — CRUD
// ============================================================
let _editingIngresoId = null;

function openAddIngreso() {
    _editingIngresoId = null;
    document.getElementById('ingresoNameInput').value = '';
    document.getElementById('ingresoAmountInput').value = '';
    document.getElementById('ingresoModalTitle').textContent = 'Nuevo Ingreso Extra';
    openModal('ingresoModal');
    setTimeout(() => document.getElementById('ingresoNameInput').focus(), 80);
}

function openEditIngreso(id) {
    const data = currentData();
    const ing = (data.extraIngresos || []).find(i => i.id === id);
    if (!ing) return;
    _editingIngresoId = id;
    document.getElementById('ingresoNameInput').value = ing.name;
    document.getElementById('ingresoAmountInput').value = ing.amount || '';
    document.getElementById('ingresoModalTitle').textContent = 'Editar Ingreso Extra';
    openModal('ingresoModal');
    setTimeout(() => document.getElementById('ingresoNameInput').focus(), 80);
}

function saveIngreso() {
    const name = document.getElementById('ingresoNameInput').value.trim();
    const amount = parseFloat(document.getElementById('ingresoAmountInput').value) || 0;
    if (!name) { showToast('Ingresá una descripción', 'error'); return; }

    const data = currentData();
    if (!data.extraIngresos) data.extraIngresos = [];

    if (_editingIngresoId) {
        const ing = data.extraIngresos.find(i => i.id === _editingIngresoId);
        if (ing) { ing.name = name; ing.amount = amount; }
        showToast('Ingreso actualizado ✓', 'success');
    } else {
        data.extraIngresos.push({ id: uid(), name, amount });
        showToast('Ingreso agregado ✓', 'success');
    }
    save();
    closeModal('ingresoModal');
    renderIngresos();
    updateSummaryCards();
}

function deleteIngreso(id) {
    const data = currentData();
    data.extraIngresos = (data.extraIngresos || []).filter(i => i.id !== id);
    save();
    renderIngresos();
    updateSummaryCards();
    showToast('Ingreso eliminado', 'info');
}

function toggleIngresosPanel() {
    const body = document.getElementById('ingresosBody');
    const toggle = document.getElementById('toggleIngresos');
    body.classList.toggle('hidden');
    toggle.classList.toggle('collapsed');
}

// ============================================================
// GROUP TOGGLE
// ============================================================
function toggleGroup(groupId) {
    const el = document.querySelector(`.group-card[data-group-id="${groupId}"]`);
    if (el) el.classList.toggle('collapsed');
}

// ============================================================
// GROUP CRUD
// ============================================================
let _editingGroupId = null;
let _selectedColor = '#6366f1';

function openAddGroup() {
    _editingGroupId = null;
    _selectedColor = '#6366f1';
    document.getElementById('groupNameInput').value = '';
    document.getElementById('groupModalTitle').textContent = 'Nuevo Grupo';
    document.querySelectorAll('.color-opt').forEach(el => {
        el.classList.toggle('selected', el.dataset.color === _selectedColor);
    });
    openModal('groupModal');
}

function openEditGroup(groupId) {
    const data = currentData();
    const group = data.groups.find(g => g.id === groupId);
    if (!group) return;
    _editingGroupId = groupId;
    _selectedColor = group.color;
    document.getElementById('groupNameInput').value = group.name;
    document.getElementById('groupModalTitle').textContent = 'Editar Grupo';
    document.querySelectorAll('.color-opt').forEach(el => {
        el.classList.toggle('selected', el.dataset.color === group.color);
    });
    openModal('groupModal');
}

function saveGroup() {
    const name = document.getElementById('groupNameInput').value.trim();
    if (!name) { showToast('Ingresá un nombre para el grupo', 'error'); return; }

    const data = currentData();
    if (_editingGroupId) {
        const g = data.groups.find(g => g.id === _editingGroupId);
        if (g) { g.name = name; g.color = _selectedColor; }
        showToast('Grupo actualizado ✓', 'success');
    } else {
        data.groups.push({ id: uid(), name, color: _selectedColor, items: [] });
        showToast('Grupo creado ✓', 'success');
    }
    save();
    closeModal('groupModal');
    renderAll();
}

function deleteGroup(groupId) {
    if (!confirm('¿Eliminar este grupo y todos sus ítems?')) return;
    const data = currentData();
    data.groups = data.groups.filter(g => g.id !== groupId);
    save();
    renderAll();
    showToast('Grupo eliminado', 'info');
}

function bindColorPicker() {
    document.getElementById('colorPicker').addEventListener('click', e => {
        const opt = e.target.closest('.color-opt');
        if (!opt) return;
        _selectedColor = opt.dataset.color;
        document.querySelectorAll('.color-opt').forEach(el => el.classList.remove('selected'));
        opt.classList.add('selected');
    });
}

// ============================================================
// ITEM CRUD
// ============================================================
let _editingGroupForItem = null;
let _editingItemId = null;
let _selectedStatus = 'PAGADO';

function openAddItem(groupId) {
    _editingGroupForItem = groupId;
    _editingItemId = null;
    _selectedStatus = 'PAGADO';
    document.getElementById('itemNameInput').value = '';
    document.getElementById('itemAmountInput').value = '';
    document.getElementById('itemModalTitle').textContent = 'Nuevo Ítem';
    setStatusButtons('PAGADO');
    openModal('itemModal');
}

function openEditItem(groupId, itemId) {
    const data = currentData();
    const group = data.groups.find(g => g.id === groupId);
    const item = group && group.items.find(i => i.id === itemId);
    if (!item) return;

    _editingGroupForItem = groupId;
    _editingItemId = itemId;
    _selectedStatus = item.status;

    document.getElementById('itemNameInput').value = item.name;
    document.getElementById('itemAmountInput').value = item.amount || '';
    document.getElementById('itemModalTitle').textContent = 'Editar Ítem';
    setStatusButtons(item.status);
    openModal('itemModal');
}

function saveItem() {
    const name = document.getElementById('itemNameInput').value.trim();
    const amount = parseFloat(document.getElementById('itemAmountInput').value) || 0;

    if (!name) { showToast('Ingresá una descripción', 'error'); return; }

    const data = currentData();
    const group = data.groups.find(g => g.id === _editingGroupForItem);
    if (!group) return;

    if (_editingItemId) {
        const item = group.items.find(i => i.id === _editingItemId);
        if (item) { item.name = name; item.amount = amount; item.status = _selectedStatus; }
        showToast('Ítem actualizado ✓', 'success');
    } else {
        group.items.push({ id: uid(), name, amount, status: _selectedStatus });
        showToast('Ítem agregado ✓', 'success');
    }

    save();
    closeModal('itemModal');
    renderAll();
}

function deleteItem(groupId, itemId) {
    const data = currentData();
    const group = data.groups.find(g => g.id === groupId);
    if (!group) return;
    group.items = group.items.filter(i => i.id !== itemId);
    save();
    renderAll();
    showToast('Ítem eliminado', 'info');
}

function cycleStatus(groupId, itemId) {
    const order = ['PAGADO', 'Pendiente', 'Suspendido'];
    const data = currentData();
    const group = data.groups.find(g => g.id === groupId);
    const item = group && group.items.find(i => i.id === itemId);
    if (!item) return;
    const idx = order.indexOf(item.status);
    item.status = order[(idx + 1) % order.length];
    save();
    renderAll();
}

function setStatusButtons(status) {
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.status === status);
    });
    _selectedStatus = status;
}

function bindStatusSelector() {
    document.getElementById('statusSelector').addEventListener('click', e => {
        const btn = e.target.closest('.status-btn');
        if (!btn) return;
        setStatusButtons(btn.dataset.status);
    });
}

// ============================================================
// MODALS
// ============================================================
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function bindEvents() {
    document.getElementById('addGroupBtn').addEventListener('click', openAddGroup);

    document.getElementById('saveGroupModal').addEventListener('click', saveGroup);
    document.getElementById('cancelGroupModal').addEventListener('click', () => closeModal('groupModal'));
    document.getElementById('closeGroupModal').addEventListener('click', () => closeModal('groupModal'));

    document.getElementById('saveItemModal').addEventListener('click', saveItem);
    document.getElementById('cancelItemModal').addEventListener('click', () => closeModal('itemModal'));
    document.getElementById('closeItemModal').addEventListener('click', () => closeModal('itemModal'));

    // Ingresos Extra
    document.getElementById('addIngresoBtn').addEventListener('click', openAddIngreso);
    document.getElementById('toggleIngresos').addEventListener('click', toggleIngresosPanel);
    document.getElementById('saveIngresoModal').addEventListener('click', saveIngreso);
    document.getElementById('cancelIngresoModal').addEventListener('click', () => closeModal('ingresoModal'));
    document.getElementById('closeIngresoModal').addEventListener('click', () => closeModal('ingresoModal'));
    // Allow Enter key in ingreso modal
    document.getElementById('ingresoAmountInput').addEventListener('keydown', e => {
        if (e.key === 'Enter') saveIngreso();
    });

    // Close on overlay click
    document.querySelectorAll('.modal-overlay').forEach(el => {
        el.addEventListener('click', e => { if (e.target === el) closeModal(el.id); });
    });

    // Import Excel
    document.getElementById('importExcel').addEventListener('change', handleImport);

    // Export Excel
    document.getElementById('exportExcel').addEventListener('click', handleExport);

    bindMonthNav();
    bindSueldo();
    bindColorPicker();
    bindStatusSelector();
}

// ============================================================
// INIT — runs after DOM + all scripts are parsed
// ============================================================
document.addEventListener('DOMContentLoaded', function init() {
    const initDate = new Date(2026, 1, 1);
    state.currentMonth = monthKey(initDate);

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            state.months = parsed.months || {};
            if (!state.months[state.currentMonth] || !state.months[state.currentMonth].groups.length) {
                createMonthIfNeeded(state.currentMonth, DEMO_GROUPS, 3000000);
            }
        } catch (e) {
            createMonthIfNeeded(state.currentMonth, DEMO_GROUPS, 3000000);
        }
    } else {
        createMonthIfNeeded(state.currentMonth, DEMO_GROUPS, 3000000);
    }

    save();
    renderAll();
    bindEvents();
});

// ============================================================
// EXCEL IMPORT (SheetJS)
// ============================================================
function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
        try {
            const wb = XLSX.read(evt.target.result, { type: 'array' });
            const ws = wb.Sheets[wb.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

            const groups = [];
            let currentGroup = null;
            const colors = ['#f97316', '#8b5cf6', '#0ea5e9', '#10b981', '#ec4899', '#f59e0b', '#6366f1', '#14b8a6', '#ef4444'];
            let colorIdx = 0;

            // Simple heuristic: row with 1-2 non-empty cells = group header, 2+ cells = item
            rows.forEach(row => {
                const cells = row.map(c => String(c).trim()).filter(Boolean);
                if (!cells.length) return;

                const colA = String(row[0] || '').trim();
                const colB = String(row[1] || '').trim();
                const colC = String(row[2] || '').trim();

                // Detect group header (colored cells with group name and no explicit amount)
                const amountB = parseCurrency(colB);
                const amountC = parseCurrency(colC || colB);

                if (colA && !colB && !colC) {
                    // Likely a group header
                    currentGroup = { id: uid(), name: colA, color: colors[colorIdx++ % colors.length], items: [] };
                    groups.push(currentGroup);
                } else if (colA && currentGroup) {
                    // item row
                    const name = colA;
                    const amount = parseCurrency(colB) || parseCurrency(colC);
                    let status = 'Pendiente';
                    const statusStr = String(row[3] || row[2] || '').trim().toUpperCase();
                    if (statusStr.includes('PAGADO') || statusStr.includes('PAGO')) status = 'PAGADO';
                    if (statusStr.includes('SUSPENDIDO') || statusStr.includes('SUSP')) status = 'Suspendido';
                    currentGroup.items.push({ id: uid(), name, amount, status });
                } else if (colA && !currentGroup) {
                    // No group yet - create generic group
                    currentGroup = { id: uid(), name: 'Importados', color: colors[0], items: [] };
                    groups.push(currentGroup);
                    const amount = parseCurrency(colB);
                    let status = 'Pendiente';
                    currentGroup.items.push({ id: uid(), name: colA, amount, status });
                }
            });

            if (groups.length) {
                currentData().groups = groups;
                save();
                renderAll();
                showToast(`Excel importado: ${groups.length} grupo(s) ✓`, 'success');
            } else {
                showToast('No se encontraron datos válidos en el Excel', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Error al leer el archivo Excel', 'error');
        }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
}

// ============================================================
// EXCEL EXPORT (SheetJS)
// ============================================================
function handleExport() {
    const data = currentData();
    const d = getDateFromKey(state.currentMonth);
    const label = `${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`;

    const rows = [[label, '', '', '']];
    rows.push(['', '', '', '']);
    rows.push(['Grupo / Descripción', 'Monto', 'Estado', '']);

    data.groups.forEach(group => {
        const total = group.items.reduce((s, i) => s + (i.amount || 0), 0);
        rows.push([group.name.toUpperCase(), '', '', '']);
        group.items.forEach(item => {
            rows.push(['  ' + item.name, item.amount || 0, item.status, '']);
        });
        rows.push(['PAGADO', total, '', '']);
        rows.push(['', '', '', '']);
    });

    // Totals
    const totalAll = data.groups.reduce((s, g) => s + g.items.reduce((ss, i) => ss + (i.amount || 0), 0), 0);
    rows.push(['', '', '', '']);
    rows.push(['TOTAL GENERAL', totalAll, '', '']);
    rows.push(['Sueldo', data.sueldo || 0, '', '']);
    rows.push(['Diferencia', (data.sueldo || 0) - totalAll, '', '']);

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, label);
    XLSX.writeFile(wb, `GestorCuentas_${state.currentMonth}.xlsx`);
    showToast('Excel exportado ✓', 'success');
}

// ============================================================
// TOAST
// ============================================================
let toastTimer = null;
function showToast(msg, type = 'info') {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.className = `toast show ${type}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}
