function dateKey(date) {
  const year = date.getFullYear(), month = String(date.getMonth() + 1).padStart(2, "0"), day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function offsetDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return dateKey(date);
}
const seedData = {
  inventory: [
    { id: 1, name: "Silla Tiffany blanca", category: "Mobiliario", type: "Silla", color: "Blanco", dimensions: "40 × 40 × 92 cm", quantity: 120, price: 4500, icon: "▤" },
    { id: 2, name: "Mesa redonda 10 puestos", category: "Mobiliario", type: "Mesa", color: "Blanco", dimensions: "150 cm diámetro", quantity: 18, price: 28000, icon: "◉" },
    { id: 3, name: "Mantel satín verde salvia", category: "Textiles", type: "Mantel", color: "Verde salvia", dimensions: "3 × 3 m", quantity: 24, price: 12000, icon: "▱" },
    { id: 4, name: "Arco orgánico de globos", category: "Decoración", type: "Estructura", color: "Personalizable", dimensions: "2.4 × 2.2 m", quantity: 6, price: 85000, icon: "⌒" }
  ],
  quotes: [
    { id: "ET-002", client: "Andrés Restrepo", email: "andres.r@email.com", event: "Cumpleaños", date: offsetDate(7), value: 980000, status: "Enviada", payment: "Pendiente", items: "30 sillas Tiffany, 4 mesas redondas" },
    { id: "ET-001", client: "Valentina Ríos", email: "valentina.rios@email.com", event: "Matrimonio", date: offsetDate(3), value: 2450000, status: "Enviada", payment: "Abonado", items: "60 sillas Tiffany, 8 mesas redondas" }
  ],
  reservations: [
    { id: "RS-002", quoteId: "ET-002", client: "Andrés Restrepo", event: "Cumpleaños", date: offsetDate(7), status: "Confirmada", payment: "Pendiente", value: 980000, items: [{ itemId: 1, name: "Silla Tiffany blanca", quantity: 30, unitPrice: 4500 }, { itemId: 2, name: "Mesa redonda 10 puestos", quantity: 4, unitPrice: 28000 }] },
    { id: "RS-001", quoteId: "ET-001", client: "Valentina Ríos", event: "Matrimonio", date: offsetDate(3), status: "Confirmada", payment: "Abonado", value: 2450000, items: [{ itemId: 1, name: "Silla Tiffany blanca", quantity: 60, unitPrice: 4500 }, { itemId: 2, name: "Mesa redonda 10 puestos", quantity: 8, unitPrice: 28000 }] }
  ],
  revenue: [3.1, 4.6, 3.8, 6.1, 5.3, 7.2]
};
const storageKey = "eventtech-prototype-v1";
let state = loadState();
const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const monthNames = ["May", "Jun", "Jul", "Ago", "Sep", "Oct"];
const paymentOptions = ["Pendiente", "Abonado", "Pagado"];
const iconPaths = {
  dashboard: '<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="10" width="8" height="11" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/>',
  inventory: '<path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="m4 12 8 4 8-4M4 17l8 4 8-4"/><path d="M4 7v10m16-10v10M12 11v10"/>',
  quote: '<path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v5h5M9 13h6m-6 4h6"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M7 3v4m10-4v4M3 10h18"/><path d="m8 15 2 2 5-5"/>',
  payments: '<rect x="3" y="5" width="18" height="15" rx="2.5"/><path d="M3 9h18m-13-8h11a2 2 0 0 1 2 2v2"/><path d="M16 14h2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  trend: '<path d="M4 17 10 11l4 4 6-8"/><path d="M14 7h6v6"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 13h4"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 1 1 4.5 1.5c-.8.9-2.1 1.2-2.1 2.7m0 3.3h.01"/>',
  spark: '<path d="m12 2 1.8 7.2L21 12l-7.2 1.8L12 21l-1.8-7.2L3 12l7.2-2.8L12 2Z"/><path d="m19 14 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z"/>',
  chair: '<path d="M6 11V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5M5 12h14v5H5zM7 17l-1 4m12-4 1 4"/>',
  table: '<circle cx="12" cy="8" r="6"/><path d="M5 8h14m-7 6v7m-4 0h8"/>',
  textile: '<path d="m4 5 8-2 8 2-2 14-6 2-6-2L4 5Z"/><path d="M8 4 9 19m7-15-1 15M5 10h14"/>',
  arch: '<path d="M4 21V11a8 8 0 0 1 16 0v10"/><path d="M4 15h4m8 0h4M4 21h16"/>',
  units: '<path d="m3 7 9-4 9 4-9 4-9-4Z"/><path d="m3 12 9 4 9-4M3 17l9 4 9-4"/>',
  categories: '<path d="M20 13 11 22l-9-9V4a2 2 0 0 1 2-2h9l9 9a2 2 0 0 1-2 2Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  money: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M7 9H6m12 6h-1"/>'
};
function iconSvg(name, className = "ui-icon") {
  const paths = iconPaths[name] || iconPaths.spark;
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;
}
let selectedCalendarDate = offsetDate(3);
let calendarCursor = new Date(`${selectedCalendarDate}T12:00:00`);
calendarCursor.setDate(1);

function loadState() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return structuredClone(seedData);
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed.inventory) || !Array.isArray(parsed.quotes) || !Array.isArray(parsed.revenue)) throw new Error("Datos guardados con formato inválido");
    if (!Array.isArray(parsed.reservations)) parsed.reservations = structuredClone(seedData.reservations);
    parsed.inventory.forEach(item => { if (typeof item.dimensions !== "string") item.dimensions = "No especificadas"; });
    parsed.quotes.forEach(quote => { if (quote.payment === "Abono parcial") quote.payment = "Abonado"; });
    parsed.reservations.forEach(reservation => {
      if (reservation.payment === "Abono parcial") reservation.payment = "Abonado";
      if (!Array.isArray(reservation.items)) reservation.items = [];
      if (reservation.quoteId && !parsed.quotes.some(quote => quote.id === reservation.quoteId)) delete reservation.quoteId;
    });
    return parsed;
  } catch (error) {
    console.error("No se pudieron cargar los datos guardados de EventTech.", error);
    return structuredClone(seedData);
  }
}
function saveState() {
  try { localStorage.setItem(storageKey, JSON.stringify(state)); }
  catch (error) { console.error("No se pudieron guardar los datos de EventTech.", error); showToast("No se pudieron guardar los cambios en este navegador."); }
}
function formatMoney(value) { return currency.format(value || 0); }
function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`));
}
function initials(name) { return name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase(); }
function statusClass(status) { return `status-${status.toLowerCase().replaceAll(" ", "-")}`; }
function badge(status) { return `<span class="status-badge ${statusClass(status)}">${status}</span>`; }
function paymentBadge(record) {
  const isOverdue = record.payment === "Pendiente" && record.date < dateKey(new Date());
  return badge(isOverdue ? "En mora" : record.payment);
}
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2800);
}
function getStats() {
  const financialRecords = [...state.quotes, ...state.reservations.filter(reservation => !reservation.quoteId)];
  const payments = financialRecords.reduce((result, record) => {
    const value = Number(record.value || reservationValue(record));
    const received = record.payment === "Pagado" ? value : record.payment === "Abonado" || record.payment === "Abono parcial" ? Math.round(value * 0.35) : 0;
    result.received += received; result.pending += value - received;
    result.pendingCount += record.payment === "Pendiente" ? 1 : 0;
    result.partialCount += record.payment === "Abonado" || record.payment === "Abono parcial" ? 1 : 0;
    result.paidCount += record.payment === "Pagado" ? 1 : 0;
    return result;
  }, { received: 0, pending: 0, pendingCount: 0, partialCount: 0, paidCount: 0 });
  return { ...payments, quoteCount: state.quotes.length, reservations: state.reservations.filter(reservation => reservation.status !== "Cancelada").length };
}
function renderDashboard() {
  const stats = getStats();
  document.getElementById("metricQuotes").textContent = stats.quoteCount;
  document.getElementById("metricReservations").textContent = stats.reservations;
  document.getElementById("metricPending").textContent = formatMoney(stats.pending);
  document.getElementById("metricReceived").textContent = formatMoney(stats.received);
  document.getElementById("pendingCount").textContent = `${stats.pendingCount + stats.partialCount} por cobrar`;
  const revenueChart = document.getElementById("revenueChart");
  revenueChart.innerHTML = "";
  const period = Number(document.getElementById("chartPeriod").value || 6);
  const values = state.revenue.slice(-period);
  values.forEach((value, index) => {
    const group = document.createElement("div"); group.className = "bar-group";
    const pair = document.createElement("div"); pair.className = "bar-pair";
    const target = document.createElement("span"); target.className = "bar target"; target.style.height = `${Math.max(4, 6.5 / 8 * 100)}%`;
    const bar = document.createElement("span"); bar.className = "bar"; bar.style.height = `${Math.max(4, value / 8 * 100)}%`; bar.title = `${monthNames[6 - period + index]}: ${formatMoney(value * 1000000)}`;
    pair.append(target, bar);
    const label = document.createElement("span"); label.className = "bar-label"; label.textContent = monthNames[6 - period + index];
    group.append(pair, label); revenueChart.append(group);
  });
  const total = stats.pendingCount + stats.partialCount + stats.paidCount;
  document.getElementById("donutCount").textContent = total;
  const paidPercent = total ? stats.paidCount / total * 100 : 0;
  const partialPercent = total ? stats.partialCount / total * 100 : 0;
  document.getElementById("paymentDonut").style.background = `conic-gradient(#17b5aa 0 ${paidPercent}%,#f1b24d ${paidPercent}% ${paidPercent + partialPercent}%,#aaa0df ${paidPercent + partialPercent}% 100%)`;
  document.getElementById("paymentLegend").innerHTML = `<div><i style="background:#17b5aa"></i><span>Pagado</span><strong>${stats.paidCount}</strong></div><div><i style="background:#f1b24d"></i><span>Abonado</span><strong>${stats.partialCount}</strong></div><div><i style="background:#aaa0df"></i><span>Pendiente</span><strong>${stats.pendingCount}</strong></div>`;
  document.getElementById("paymentInsight").textContent = stats.pendingCount ? `${stats.pendingCount} pagos pendientes` : "¡Todo al día!";
  document.getElementById("recentQuotes").innerHTML = [...state.quotes].slice(0, 4).map(quote => `<tr><td><div class="client-cell"><span class="client-avatar">${initials(quote.client)}</span><span><span class="client-name">${escapeHtml(quote.client)}</span><span class="client-sub">${quote.id}</span></span></div></td><td>${escapeHtml(quote.event)}</td><td>${formatDate(quote.date)}</td><td class="price-cell">${formatMoney(quote.value)}</td><td>${badge(quote.status)}</td><td><button class="row-action" data-action="quote-detail" data-id="${quote.id}" aria-label="Ver opciones de ${escapeHtml(quote.client)}" title="Ver opciones">⋮</button></td></tr>`).join("");
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
function setOptions(id, values, firstLabel) {
  const select = document.getElementById(id), previous = select.value;
  select.innerHTML = `<option value="">${firstLabel}</option>` + values.sort().map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("");
  select.value = values.includes(previous) ? previous : "";
}
function reservationsForDate(date) {
  return state.reservations.filter(reservation => reservation.date === date && reservation.status !== "Cancelada");
}
function reservedQuantity(itemId, date, excludedReservationId = "") {
  return reservationsForDate(date).filter(reservation => reservation.id !== excludedReservationId)
    .reduce((total, reservation) => total + reservation.items.reduce((sum, line) => sum + (String(line.itemId) === String(itemId) ? Number(line.quantity) : 0), 0), 0);
}
function availableQuantity(itemId, date) {
  const item = state.inventory.find(record => String(record.id) === String(itemId));
  return item ? Math.max(0, Number(item.quantity) - reservedQuantity(itemId, date)) : 0;
}
function itemPickerMarkup(prefix, date) {
  return `<div class="item-picker" data-picker="${prefix}">${state.inventory.map(item => {
    const available = availableQuantity(item.id, date);
    return `<div class="picker-item"><label><input type="checkbox" data-item-check="${prefix}" value="${item.id}" ${available ? "" : "disabled"}><span class="picker-item-name">${escapeHtml(item.name)}</span></label><span class="picker-availability" data-available-for="${item.id}">${available} disponibles</span><input type="number" class="picker-quantity" data-item-quantity="${prefix}" data-item-id="${item.id}" value="1" min="1" max="${available || 1}" disabled aria-label="Cantidad de ${escapeHtml(item.name)}"><strong class="picker-subtotal" data-item-subtotal="${item.id}">${formatMoney(item.price)}</strong><small class="picker-unit">/ día · ${formatMoney(item.price)}</small></div>`;
  }).join("")}</div><div class="quote-total"><span>Total estimado</span><strong id="${prefix}Total">${formatMoney(0)}</strong></div>`;
}
function selectedItems(prefix, date) {
  return [...document.querySelectorAll(`[data-item-check="${prefix}"]:checked`)].map(check => {
    const item = state.inventory.find(record => String(record.id) === check.value);
    const quantity = Number(document.querySelector(`[data-item-quantity="${prefix}"][data-item-id="${check.value}"]`).value);
    return { itemId: item.id, name: item.name, quantity, unitPrice: Number(item.price), subtotal: Number(item.price) * quantity };
  }).filter(line => line.quantity > 0 && line.quantity <= availableQuantity(line.itemId, date));
}
function updateItemPicker(prefix, date) {
  document.querySelectorAll(`[data-item-check="${prefix}"]`).forEach(check => {
    const available = availableQuantity(check.value, date);
    const quantityInput = document.querySelector(`[data-item-quantity="${prefix}"][data-item-id="${check.value}"]`);
    const item = state.inventory.find(record => String(record.id) === check.value);
    check.disabled = available === 0;
    if (available === 0) check.checked = false;
    quantityInput.max = String(Math.max(available, 1));
    if (Number(quantityInput.value) > available) quantityInput.value = String(Math.max(available, 1));
    quantityInput.disabled = !check.checked || available === 0;
    const availabilityLabel = document.querySelector(`[data-available-for="${check.value}"]`);
    availabilityLabel.textContent = available ? `${available} disponibles` : "Sin disponibilidad";
    availabilityLabel.classList.toggle("unavailable", available === 0);
    document.querySelector(`[data-item-subtotal="${check.value}"]`).textContent = formatMoney(check.checked ? item.price * Number(quantityInput.value) : item.price);
  });
  const total = selectedItems(prefix, date).reduce((sum, line) => sum + line.subtotal, 0);
  document.getElementById(`${prefix}Total`).textContent = formatMoney(total);
}
function reservationValue(reservation) {
  return reservation.items.reduce((sum, line) => sum + Number(line.subtotal || Number(line.unitPrice) * Number(line.quantity)), 0) || Number(reservation.value || 0);
}
function renderInventory() {
  setOptions("filterCategory", [...new Set(state.inventory.map(item => item.category))], "Categoría: Todas");
  setOptions("filterType", [...new Set(state.inventory.map(item => item.type))], "Tipo: Todos");
  setOptions("filterColor", [...new Set(state.inventory.map(item => item.color))], "Color: Todos");
  const search = document.getElementById("inventorySearch").value.trim().toLowerCase();
  const category = document.getElementById("filterCategory").value, type = document.getElementById("filterType").value, color = document.getElementById("filterColor").value;
  const items = state.inventory.filter(item => item.name.toLowerCase().includes(search) && (!category || item.category === category) && (!type || item.type === type) && (!color || item.color === color));
  document.getElementById("inventoryCount").textContent = items.length;
  document.getElementById("inventoryRows").innerHTML = items.length ? items.map(item => `<tr><td><span class="item-icon">${iconSvg(itemIcon(item))}</span><span class="item-name">${escapeHtml(item.name)}</span></td><td>${escapeHtml(item.category)}</td><td>${escapeHtml(item.type)}</td><td>${escapeHtml(item.color)}</td><td>${escapeHtml(item.dimensions || "No especificadas")}</td><td class="${item.quantity < 6 ? "stock-low" : "stock-ok"}">${item.quantity} uds.</td><td class="price-cell">${formatMoney(item.price)}</td><td>${badge(item.quantity ? "Disponible" : "Agotado")}</td></tr>`).join("") : '<tr><td class="empty-state" colspan="8">No se encontraron artículos. Prueba con otros filtros.</td></tr>';
  const totalUnits = state.inventory.reduce((sum, item) => sum + Number(item.quantity), 0);
  document.getElementById("inventorySummary").innerHTML = miniStat("inventory", "Artículos registrados", state.inventory.length) + miniStat("units", "Unidades disponibles", totalUnits) + miniStat("clock", "Referencias por agotarse", state.inventory.filter(item => item.quantity < 6).length) + miniStat("categories", "Categorías", new Set(state.inventory.map(item => item.category)).size);
}
function itemIcon(item) {
  const value = `${item.type} ${item.name} ${item.category}`.toLowerCase();
  if (/silla|chair/.test(value)) return "chair";
  if (/mesa|table/.test(value)) return "table";
  if (/mantel|textil|tela/.test(value)) return "textile";
  if (/arco|estructura/.test(value)) return "arch";
  return "inventory";
}
function miniStat(icon, label, value) { return `<div class="mini-stat"><span class="mini-stat-icon">${iconSvg(icon)}</span><div><span>${label}</span><strong>${value}</strong></div></div>`; }
function renderQuotes() {
  const search = document.getElementById("quoteSearch").value.trim().toLowerCase();
  const quotes = [...state.quotes].filter(quote => `${quote.client} ${quote.id} ${quote.event}`.toLowerCase().includes(search));
  const value = state.quotes.reduce((sum, quote) => sum + quote.value, 0);
  document.getElementById("quoteSummary").innerHTML = miniStat("quote", "Cotizaciones creadas", state.quotes.length) + miniStat("check", "Aprobadas", state.quotes.filter(q => q.status === "Aprobada").length) + miniStat("clock", "En seguimiento", state.quotes.filter(q => q.status === "Enviada").length) + miniStat("money", "Valor cotizado", formatMoney(value));
  document.getElementById("quoteRows").innerHTML = quotes.length ? quotes.map(quote => `<tr><td class="client-name">${quote.id}</td><td><div class="client-cell"><span class="client-avatar">${initials(quote.client)}</span><span class="client-name">${escapeHtml(quote.client)}</span></div></td><td>${escapeHtml(quote.event)}</td><td>${formatDate(quote.date)}</td><td class="price-cell">${formatMoney(quote.value)}</td><td>${paymentBadge(quote)}</td><td>${badge(quote.status)}</td><td><button class="row-action" data-action="quote-detail" data-id="${quote.id}" aria-label="Ver opciones de ${escapeHtml(quote.client)}" title="Ver opciones">⋮</button></td></tr>`).join("") : '<tr><td class="empty-state" colspan="8">No hay cotizaciones que coincidan.</td></tr>';
}
function renderReservations() {
  const search = document.getElementById("reservationSearch").value.trim().toLowerCase();
  const active = state.reservations.filter(reservation => reservation.status !== "Cancelada");
  const reservations = active.filter(reservation => `${reservation.client} ${reservation.event}`.toLowerCase().includes(search)).sort((a, b) => a.date.localeCompare(b.date));
  const itemCount = active.reduce((sum, reservation) => sum + reservation.items.reduce((lineSum, line) => lineSum + Number(line.quantity), 0), 0);
  document.getElementById("reservationSummary").innerHTML = miniStat("calendar", "Reservas activas", active.length) + miniStat("clock", "Próximos 30 días", active.filter(reservation => new Date(`${reservation.date}T12:00:00Z`) <= new Date(Date.now() + 30 * 86400000)).length) + miniStat("units", "Unidades comprometidas", itemCount) + miniStat("money", "Valor reservado", formatMoney(active.reduce((sum, reservation) => sum + reservationValue(reservation), 0)));
  document.getElementById("reservationRows").innerHTML = reservations.length ? reservations.map(reservation => `<tr><td><div class="client-cell"><span class="client-avatar">${initials(reservation.client)}</span><span class="client-name">${escapeHtml(reservation.client)}</span></div></td><td>${escapeHtml(reservation.event)}</td><td>${formatDate(reservation.date)}</td><td>${reservation.items.map(line => `${escapeHtml(line.name)} × ${line.quantity}`).join(", ")}</td><td class="price-cell">${formatMoney(reservationValue(reservation))}</td><td>${badge(reservation.status)}</td></tr>`).join("") : '<tr><td class="empty-state" colspan="6">No hay reservas que coincidan con la búsqueda.</td></tr>';
  renderCalendar();
}
function renderCalendar() {
  const view = document.getElementById("calendarView").value;
  const year = calendarCursor.getFullYear(), month = calendarCursor.getMonth();
  document.getElementById("calendarHeading").textContent = new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" }).format(calendarCursor);
  const selected = new Date(`${selectedCalendarDate}T12:00:00`);
  document.getElementById("calendarSubtitle").textContent = view === "day" ? "Disponibilidad y eventos de la fecha seleccionada" : "Disponibilidad por día · selecciona una fecha para ver el detalle";
  const weekdays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const dayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const dayCount = new Date(year, month + 1, 0).getDate();
  const grid = document.getElementById("calendarGrid");
  grid.innerHTML = view === "day"
    ? `<div class="calendar-weekday">${weekdays[(selected.getDay() + 6) % 7]}</div>`
    : weekdays.map(day => `<div class="calendar-weekday">${day}</div>`).join("");
  if (view === "day") {
    grid.classList.add("calendar-day-view");
    grid.innerHTML += calendarCell(selected, true);
  } else {
    grid.classList.remove("calendar-day-view");
    for (let index = 0; index < dayOffset; index++) grid.innerHTML += '<div class="calendar-cell calendar-outside" aria-hidden="true"></div>';
    for (let day = 1; day <= dayCount; day++) grid.innerHTML += calendarCell(new Date(year, month, day, 12), true);
  }
  renderSelectedDate();
}
function calendarCell(date, selectable) {
  const key = dateKey(date), reservations = reservationsForDate(key);
  const fullyBooked = reservations.some(reservation => reservation.items.some(line => availableQuantity(line.itemId, key) === 0));
  const status = fullyBooked ? "calendar-status-full" : reservations.length ? "calendar-status-busy" : "calendar-status-free";
  const itemCount = reservations.reduce((sum, reservation) => sum + reservation.items.reduce((subtotal, line) => subtotal + Number(line.quantity), 0), 0);
  const selected = key === selectedCalendarDate ? " selected" : "";
  const today = key === dateKey(new Date()) ? " today" : "";
  return `<button class="calendar-cell ${status}${selected}${today}" data-calendar-date="${key}" ${selectable ? "" : "disabled"}><span class="calendar-day-number">${date.getDate()}</span>${reservations.length ? `<span class="calendar-event-count">${reservations.length} evento${reservations.length > 1 ? "s" : ""}</span><span class="calendar-occupancy">${itemCount} uds.</span>` : '<span class="calendar-open-label">Libre</span>'}</button>`;
}
function renderSelectedDate() {
  const date = selectedCalendarDate, reservations = reservationsForDate(date);
  document.getElementById("selectedDateLabel").textContent = new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long" }).format(new Date(`${date}T12:00:00`));
  document.getElementById("selectedDayCount").textContent = reservations.length;
  const totalUnits = state.inventory.reduce((sum, item) => sum + availableQuantity(item.id, date), 0);
  const hasUnavailable = reservations.some(reservation => reservation.items.some(line => availableQuantity(line.itemId, date) === 0));
  const callout = document.getElementById("availabilityCallout");
  callout.className = `availability-callout ${hasUnavailable ? "callout-full" : reservations.length ? "callout-busy" : "callout-free"}`;
  callout.innerHTML = `<span>${hasUnavailable ? "!" : reservations.length ? "◷" : "✓"}</span><div><strong>${hasUnavailable ? "Artículos sin disponibilidad" : reservations.length ? "Hay reservas este día" : "Fecha disponible"}</strong><small>${totalUnits} unidades libres en el inventario para esta fecha</small></div>`;
  const events = document.getElementById("dayEvents");
  events.innerHTML = reservations.length ? reservations.map(reservation => `<article class="day-event"><div class="day-event-top"><strong>${escapeHtml(reservation.client)}</strong>${badge(reservation.status)}</div><span>${escapeHtml(reservation.event)} · ${formatMoney(reservationValue(reservation))}</span><ul>${reservation.items.map(line => `<li>${escapeHtml(line.name)} <b>× ${line.quantity}</b></li>`).join("")}</ul></article>`).join("") : '<p class="no-day-events">Todavía no hay eventos para esta fecha.</p>';
}
function renderPayments() {
  const search = document.getElementById("paymentSearch").value.trim().toLowerCase();
  const stats = getStats();
  document.getElementById("paymentSummary").innerHTML = miniStat("clock", "Saldo por cobrar", formatMoney(stats.pending)) + miniStat("payments", "Total recaudado", formatMoney(stats.received)) + miniStat("quote", "Pendientes", stats.pendingCount) + miniStat("check", "Abonados", stats.partialCount);
  const records = [...state.quotes.map(quote => ({ ...quote, kind: "quote" })), ...state.reservations.filter(reservation => !reservation.quoteId).map(reservation => ({ ...reservation, id: reservation.id, kind: "reservation", value: reservationValue(reservation) }))];
  const filtered = records.filter(record => `${record.client} ${record.id} ${record.event}`.toLowerCase().includes(search));
  document.getElementById("paymentRows").innerHTML = filtered.length ? filtered.map(record => `<tr><td class="client-name">${record.id}</td><td><div class="client-cell"><span class="client-avatar">${initials(record.client)}</span><span class="client-name">${escapeHtml(record.client)}</span></div></td><td>${escapeHtml(record.event)}</td><td>${formatDate(record.date)}</td><td class="price-cell">${formatMoney(record.value)}</td><td>${paymentBadge(record)}</td><td><select class="payment-select" data-payment-id="${record.id}" data-payment-kind="${record.kind}" aria-label="Actualizar pago de ${escapeHtml(record.client)}">${paymentOptions.map(option => `<option${record.payment === option ? " selected" : ""}>${option}</option>`).join("")}</select></td></tr>`).join("") : '<tr><td class="empty-state" colspan="7">No hay pagos que coincidan.</td></tr>';
}
function renderAll() { renderDashboard(); renderInventory(); renderQuotes(); renderReservations(); renderPayments(); }
const pageLabels = { dashboard: "Resumen", inventario: "Inventario", cotizaciones: "Cotizaciones", reservas: "Calendario & reservas", pagos: "Pagos" };
function navigate(page) {
  if (!pageLabels[page]) return;
  document.querySelectorAll(".page-view").forEach(section => section.classList.toggle("active", section.id === `page-${page}`));
  document.querySelectorAll(".nav-link").forEach(button => button.classList.toggle("active", button.dataset.page === page));
  document.querySelectorAll(".bottom-nav-link").forEach(button => button.classList.toggle("active", button.dataset.page === page));
  document.getElementById("breadcrumbCurrent").textContent = pageLabels[page];
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("mobileScrim").classList.remove("show");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function showDialog(html) {
  const dialog = document.getElementById("appDialog");
  document.getElementById("dialogContent").innerHTML = html;
  if (!dialog.open) dialog.showModal();
}
function openQuoteForm() {
  showDialog(`<div class="dialog-body"><h2>Cotización rápida</h2><p>Elige cliente, fecha y artículos; el precio se calcula con la tarifa diaria del inventario.</p><form id="quoteForm"><div class="form-grid"><div class="form-field"><label for="quoteClient">Nombre del cliente *</label><input id="quoteClient" name="client" required placeholder="Ej. Mariana López"></div><div class="form-field"><label for="quoteEmail">Correo electrónico</label><input id="quoteEmail" name="email" type="email" placeholder="cliente@email.com"></div><div class="form-field"><label for="quoteEvent">Tipo de evento *</label><select id="quoteEvent" name="event" required><option value="">Selecciona</option><option>Matrimonio</option><option>Cumpleaños</option><option>Evento empresarial</option><option>Baby shower</option><option>Quince años</option><option>Grado</option><option>Otro evento</option></select></div><div class="form-field"><label for="quoteDate">Fecha del evento *</label><input id="quoteDate" name="date" type="date" value="${selectedCalendarDate}" required></div><div class="form-field full"><label>Artículos y cantidades *</label>${itemPickerMarkup("quote", selectedCalendarDate)}</div><div class="form-field"><label for="quoteStatus">Estado de la propuesta</label><select id="quoteStatus" name="status"><option>Enviada</option><option>Borrador</option></select></div></div><p class="form-hint">La disponibilidad se calcula para la fecha del evento. Las cotizaciones no bloquean inventario hasta crear una reserva.</p><div class="dialog-actions"><button type="button" class="button button-light" data-action="close-dialog">Cancelar</button><button type="submit" class="button button-primary">Guardar cotización</button></div></form></div>`);
  updateItemPicker("quote", selectedCalendarDate);
  document.getElementById("quoteDate").addEventListener("change", event => updateItemPicker("quote", event.target.value));
  document.getElementById("quoteForm").addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget), nextNumber = Math.max(0, ...state.quotes.map(q => Number(q.id.slice(3)) || 0)) + 1;
    const id = `ET-${String(nextNumber).padStart(3, "0")}`;
    const date = form.get("date"), lineItems = selectedItems("quote", date), checked = document.querySelectorAll('[data-item-check="quote"]:checked').length;
    if (!lineItems.length || lineItems.length !== checked) { showToast("Selecciona artículos y cantidades disponibles para la fecha."); return; }
    const value = lineItems.reduce((sum, line) => sum + line.subtotal, 0);
    state.quotes.unshift({ id, client: form.get("client").trim(), email: form.get("email").trim(), event: form.get("event"), date, value, status: form.get("status"), payment: "Pendiente", lineItems, items: lineItems.map(line => `${line.quantity} × ${line.name}`).join(", ") });
    saveState(); renderAll(); document.getElementById("appDialog").close(); showToast(`Cotización ${id} creada por ${formatMoney(value)}.`); navigate("cotizaciones");
  });
}
function quoteDetails(id) {
  const quote = state.quotes.find(item => item.id === id);
  if (!quote) return;
  const alreadyReserved = state.reservations.some(reservation => reservation.quoteId === quote.id && reservation.status !== "Cancelada");
  showDialog(`<div class="dialog-body"><div class="eyebrow"><span class="eyebrow-dot"></span> ${quote.id}</div><h2>${escapeHtml(quote.client)}</h2><p>Detalle de la cotización y seguimiento de pago.</p><div class="detail-grid"><div class="detail-cell"><span>Tipo de evento</span><strong>${escapeHtml(quote.event)}</strong></div><div class="detail-cell"><span>Fecha del evento</span><strong>${formatDate(quote.date)}</strong></div><div class="detail-cell"><span>Valor cotizado</span><strong>${formatMoney(quote.value)}</strong></div><div class="detail-cell"><span>Estado de propuesta</span><strong>${escapeHtml(quote.status)}</strong></div><div class="detail-cell"><span>Estado del pago</span><strong>${escapeHtml(quote.payment)}</strong></div><div class="detail-cell"><span>Correo</span><strong>${escapeHtml(quote.email || "No registrado")}</strong></div></div><div class="detail-items"><strong>Artículos solicitados</strong><br>${escapeHtml(quote.items || "Sin artículos especificados")}</div><div class="dialog-actions dialog-actions-wrap"><button class="button button-light" data-action="close-dialog">Cerrar</button><button class="button button-light" data-action="export-quote" data-id="${quote.id}">Exportar PDF / resumen</button>${alreadyReserved ? '<span class="reservation-created">Reserva creada ✓</span>' : `<button class="button button-primary" data-action="convert-reservation" data-id="${quote.id}">Crear reserva</button>`}</div></div>`);
}
function openReservationForm(quote = null) {
  const date = quote?.date || selectedCalendarDate;
  showDialog(`<div class="dialog-body"><h2>${quote ? "Confirmar reserva" : "Nueva reserva"}</h2><p>El sistema comprobará existencias comprometidas para la fecha del evento.</p><form id="reservationForm"><div class="form-grid"><div class="form-field"><label for="reservationClient">Nombre del cliente *</label><input id="reservationClient" name="client" required value="${escapeHtml(quote?.client || "")}" placeholder="Ej. Mariana López"></div><div class="form-field"><label for="reservationEvent">Tipo de evento *</label><select id="reservationEvent" name="event" required><option value="">Selecciona</option>${["Matrimonio","Cumpleaños","Evento empresarial","Baby shower","Quince años","Grado","Otro evento"].map(event => `<option${quote?.event === event ? " selected" : ""}>${event}</option>`).join("")}</select></div><div class="form-field"><label for="reservationDate">Fecha del evento *</label><input id="reservationDate" name="date" type="date" value="${date}" required></div><div class="form-field"><label>Estado</label><input value="Confirmada · bloquea inventario" disabled></div><div class="form-field full"><label>Artículos a reservar *</label>${itemPickerMarkup("reservation", date)}</div></div><div class="form-hint">Las cantidades disponibles ya descuentan otras reservas confirmadas para este día.</div><div class="dialog-actions"><button type="button" class="button button-light" data-action="close-dialog">Cancelar</button><button type="submit" class="button button-primary">Confirmar reserva</button></div></form></div>`);
  updateItemPicker("reservation", date);
  if (quote?.lineItems) {
    quote.lineItems.forEach(line => {
      const check = document.querySelector(`[data-item-check="reservation"][value="${line.itemId}"]`);
      const quantity = document.querySelector(`[data-item-quantity="reservation"][data-item-id="${line.itemId}"]`);
      if (check && !check.disabled && Number(line.quantity) <= Number(quantity.max)) {
        check.checked = true; quantity.disabled = false; quantity.value = String(line.quantity);
      }
    });
    updateItemPicker("reservation", date);
  }
  document.getElementById("reservationDate").addEventListener("change", event => updateItemPicker("reservation", event.target.value));
  document.getElementById("reservationForm").addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget), reservationDate = form.get("date");
    const lineItems = selectedItems("reservation", reservationDate), checked = document.querySelectorAll('[data-item-check="reservation"]:checked').length;
    if (!lineItems.length || lineItems.length !== checked) { showToast("Selecciona artículos y cantidades disponibles para la fecha."); return; }
    const conflict = lineItems.find(line => line.quantity > availableQuantity(line.itemId, reservationDate));
    if (conflict) { showToast(`No hay suficientes unidades de ${conflict.name} para esa fecha.`); updateItemPicker("reservation", reservationDate); return; }
    const value = lineItems.reduce((sum, line) => sum + line.subtotal, 0);
    const nextNumber = Math.max(0, ...state.reservations.map(reservation => Number(reservation.id.replace(/\D/g, "")) || 0)) + 1;
    const reservation = { id: `RS-${String(nextNumber).padStart(3, "0")}`, client: form.get("client").trim(), event: form.get("event"), date: reservationDate, status: "Confirmada", payment: quote?.payment || "Pendiente", value, items: lineItems, ...(quote ? { quoteId: quote.id } : {}) };
    state.reservations.push(reservation);
    if (quote) { quote.status = "Aprobada"; quote.date = reservationDate; quote.value = value; quote.lineItems = lineItems; quote.items = lineItems.map(line => `${line.quantity} × ${line.name}`).join(", "); }
    selectedCalendarDate = reservationDate;
    calendarCursor = new Date(`${reservationDate}T12:00:00`); calendarCursor.setDate(1);
    saveState(); renderAll(); document.getElementById("appDialog").close(); showToast(`Reserva ${reservation.id} confirmada. Inventario actualizado.`); navigate("reservas");
  });
}
function exportQuote(id) {
  const quote = state.quotes.find(item => item.id === id);
  if (!quote) return;
  const rows = quote.lineItems?.length ? quote.lineItems.map(line => `<tr><td>${escapeHtml(line.name)}</td><td>${line.quantity}</td><td>${formatMoney(line.unitPrice)}</td><td>${formatMoney(line.subtotal)}</td></tr>`).join("") : `<tr><td>${escapeHtml(quote.items || "Artículos por definir")}</td><td>—</td><td>—</td><td>${formatMoney(quote.value)}</td></tr>`;
  showDialog(`<div class="dialog-body printable-quote"><header class="print-brand"><strong>EventTech</strong><span>Gestión de eventos · Valle del Cauca, Colombia</span></header><div class="eyebrow"><span class="eyebrow-dot"></span> RESUMEN ${escapeHtml(quote.id)}</div><h2>Cotización para ${escapeHtml(quote.client)}</h2><p>Propuesta de alquiler para tu evento.</p><div class="detail-grid"><div class="detail-cell"><span>Evento</span><strong>${escapeHtml(quote.event)}</strong></div><div class="detail-cell"><span>Fecha</span><strong>${formatDate(quote.date)}</strong></div><div class="detail-cell"><span>Estado</span><strong>${escapeHtml(quote.status)}</strong></div><div class="detail-cell"><span>Correo</span><strong>${escapeHtml(quote.email || "No registrado")}</strong></div></div><div class="table-scroll print-table"><table><thead><tr><th>Artículo</th><th>Cantidad</th><th>Tarifa / día</th><th>Subtotal</th></tr></thead><tbody>${rows}</tbody></table></div><div class="print-total">Total estimado <strong>${formatMoney(quote.value)}</strong></div><p class="print-footnote">Cotización de demostración generada con EventTech. No constituye comprobante de pago.</p><div class="dialog-actions"><button class="button button-light" data-action="close-dialog">Cerrar</button><button class="button button-primary" data-action="print-document">Imprimir / Guardar como PDF</button></div></div>`);
}
function addInventoryItem() {
  showDialog(`<div class="dialog-body"><h2>Agregar artículo</h2><p>Incluye una referencia en el catálogo de inventario.</p><form id="itemForm"><div class="form-grid"><div class="form-field full"><label for="itemName">Nombre del artículo *</label><input id="itemName" name="name" required placeholder="Ej. Silla crossback"></div><div class="form-field"><label for="itemCategory">Categoría *</label><select id="itemCategory" name="category" required><option value="">Selecciona</option>${["Mobiliario","Textiles","Decoración","Menaje","Iluminación"].map(x => `<option>${x}</option>`).join("")}</select></div><div class="form-field"><label for="itemType">Tipo *</label><input id="itemType" name="type" required placeholder="Ej. Silla"></div><div class="form-field"><label for="itemColor">Color *</label><input id="itemColor" name="color" required placeholder="Ej. Natural"></div><div class="form-field"><label for="itemDimensions">Dimensiones</label><input id="itemDimensions" name="dimensions" placeholder="Ej. 40 × 40 × 90 cm"></div><div class="form-field"><label for="itemQuantity">Existencias reales *</label><input id="itemQuantity" name="quantity" type="number" min="0" required></div><div class="form-field full"><label for="itemPrice">Tarifa por día (COP) *</label><input id="itemPrice" name="price" type="number" min="0" step="500" required></div></div><div class="dialog-actions"><button type="button" class="button button-light" data-action="close-dialog">Cancelar</button><button type="submit" class="button button-primary">Agregar artículo</button></div></form></div>`);
  document.getElementById("itemForm").addEventListener("submit", event => {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    state.inventory.push({ id: Date.now(), name: form.get("name").trim(), category: form.get("category"), type: form.get("type").trim(), color: form.get("color").trim(), dimensions: form.get("dimensions").trim() || "No especificadas", quantity: Number(form.get("quantity")), price: Number(form.get("price")), icon: "▤" });
    saveState(); renderAll(); document.getElementById("appDialog").close(); showToast("Artículo agregado al inventario.");
  });
}
document.addEventListener("click", event => {
  const pageButton = event.target.closest("[data-page]");
  if (pageButton) { event.preventDefault(); navigate(pageButton.dataset.page); return; }
  const action = event.target.closest("[data-action]");
  if (!action) return;
  if (action.dataset.action === "new-quote") openQuoteForm();
  if (action.dataset.action === "new-reservation") openReservationForm();
  if (action.dataset.action === "add-item") addInventoryItem();
  if (action.dataset.action === "quote-detail") quoteDetails(action.dataset.id);
  if (action.dataset.action === "convert-reservation") {
    const quote = state.quotes.find(item => item.id === action.dataset.id);
    document.getElementById("appDialog").close();
    if (quote) openReservationForm(quote);
  }
  if (action.dataset.action === "export-quote") exportQuote(action.dataset.id);
  if (action.dataset.action === "print-document") window.print();
  if (action.dataset.action === "close-dialog") document.getElementById("appDialog").close();
  if (action.dataset.action === "go-payment") { document.getElementById("appDialog").close(); navigate("pagos"); }
  if (action.dataset.action === "help") showToast("Centro de ayuda: demo de EventTech para presentación académica.");
});
document.getElementById("inventorySearch").addEventListener("input", renderInventory);
["filterCategory", "filterType", "filterColor"].forEach(id => document.getElementById(id).addEventListener("change", renderInventory));
document.getElementById("clearFilters").addEventListener("click", () => {
  document.getElementById("inventorySearch").value = "";
  ["filterCategory", "filterType", "filterColor"].forEach(id => document.getElementById(id).value = "");
  renderInventory();
});
document.getElementById("quoteSearch").addEventListener("input", renderQuotes);
document.getElementById("reservationSearch").addEventListener("input", renderReservations);
document.getElementById("paymentSearch").addEventListener("input", renderPayments);
document.getElementById("chartPeriod").addEventListener("change", renderDashboard);
document.getElementById("calendarView").addEventListener("change", renderCalendar);
document.getElementById("calendarPrevious").addEventListener("click", () => {
  calendarCursor.setMonth(calendarCursor.getMonth() - 1);
  selectedCalendarDate = dateKey(new Date(calendarCursor.getFullYear(), calendarCursor.getMonth(), Math.min(new Date(`${selectedCalendarDate}T12:00:00`).getDate(), new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + 1, 0).getDate()), 12));
  renderCalendar();
});
document.getElementById("calendarNext").addEventListener("click", () => {
  calendarCursor.setMonth(calendarCursor.getMonth() + 1);
  selectedCalendarDate = dateKey(new Date(calendarCursor.getFullYear(), calendarCursor.getMonth(), Math.min(new Date(`${selectedCalendarDate}T12:00:00`).getDate(), new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + 1, 0).getDate()), 12));
  renderCalendar();
});
document.getElementById("calendarGrid").addEventListener("click", event => {
  const cell = event.target.closest("[data-calendar-date]");
  if (!cell) return;
  selectedCalendarDate = cell.dataset.calendarDate;
  calendarCursor = new Date(`${selectedCalendarDate}T12:00:00`);
  calendarCursor.setDate(1);
  renderCalendar();
});
document.addEventListener("change", event => {
  const check = event.target.closest("[data-item-check]");
  if (check) {
    const prefix = check.dataset.itemCheck;
    const quantity = document.querySelector(`[data-item-quantity="${prefix}"][data-item-id="${check.value}"]`);
    quantity.disabled = !check.checked;
    updateItemPicker(prefix, document.getElementById(prefix === "quote" ? "quoteDate" : "reservationDate").value);
  }
});
document.addEventListener("input", event => {
  const quantity = event.target.closest("[data-item-quantity]");
  if (!quantity) return;
  const prefix = quantity.dataset.itemQuantity;
  updateItemPicker(prefix, document.getElementById(prefix === "quote" ? "quoteDate" : "reservationDate").value);
});
document.addEventListener("change", event => {
  const select = event.target.closest("[data-payment-id]");
  if (!select) return;
  if (select.dataset.paymentKind === "reservation") {
    const reservation = state.reservations.find(item => item.id === select.dataset.paymentId);
    if (!reservation) return;
    reservation.payment = select.value;
    if (reservation.quoteId) {
      const linkedQuote = state.quotes.find(item => item.id === reservation.quoteId);
      if (linkedQuote) linkedQuote.payment = select.value;
    }
    saveState(); renderAll(); showToast(`Pago de ${reservation.client} actualizado a "${reservation.payment}".`);
    return;
  }
  const quote = state.quotes.find(item => item.id === select.dataset.paymentId);
  if (!quote) return;
  quote.payment = select.value;
  state.reservations.filter(reservation => reservation.quoteId === quote.id).forEach(reservation => { reservation.payment = select.value; });
  saveState(); renderAll(); showToast(`Pago de ${quote.client} actualizado a "${quote.payment}".`);
});
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.add("open"); document.getElementById("mobileScrim").classList.add("show");
});
document.getElementById("mobileScrim").addEventListener("click", () => {
  document.getElementById("sidebar").classList.remove("open"); document.getElementById("mobileScrim").classList.remove("show");
});
document.getElementById("todayDate").textContent = new Intl.DateTimeFormat("es-CO", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(new Date());
document.querySelector(".dashboard-heading .eyebrow").innerHTML = `<span class="eyebrow-dot"></span> ${new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date()).toLocaleUpperCase("es-CO")}`;
document.querySelectorAll("[data-icon]").forEach(element => {
  element.innerHTML = iconSvg(element.dataset.icon);
});
renderAll();
