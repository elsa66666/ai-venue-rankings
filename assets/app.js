const state = {
  venues: [],
  filtered: [],
  activeTab: "all",
  view: window.matchMedia("(max-width: 680px)").matches ? "card" : "table"
};

const els = {
  tabs: document.querySelectorAll(".tab"),
  search: document.querySelector("#searchInput"),
  type: document.querySelector("#typeFilter"),
  field: document.querySelector("#fieldFilter"),
  ccf: document.querySelector("#ccfFilter"),
  jcr: document.querySelector("#jcrFilter"),
  cas: document.querySelector("#casFilter"),
  sort: document.querySelector("#sortSelect"),
  upcomingOnly: document.querySelector("#upcomingOnly"),
  rollingOnly: document.querySelector("#rollingOnly"),
  viewToggle: document.querySelector("#viewToggle"),
  resultCount: document.querySelector("#resultCount"),
  tableView: document.querySelector("#tableView"),
  cardView: document.querySelector("#cardView"),
  venueTable: document.querySelector("#venueTable"),
  emptyState: document.querySelector("#emptyState")
};

async function init() {
  try {
    const [conferenceRes, journalRes] = await Promise.all([
      fetch("data/conferences.json"),
      fetch("data/journals.json")
    ]);
    const conferences = await conferenceRes.json();
    const journals = await journalRes.json();
    state.venues = [...conferences, ...journals];
    populateFieldFilter();
    bindEvents();
    render();
  } catch (error) {
    els.emptyState.classList.remove("hidden");
    els.emptyState.textContent = "Unable to load data files. If opened from local disk, try a simple static server.";
    console.error(error);
  }
}

function bindEvents() {
  els.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      state.activeTab = tab.dataset.tab;
      els.tabs.forEach((item) => item.classList.toggle("active", item === tab));
      els.type.value = state.activeTab === "all" ? "" : state.activeTab;
      render();
    });
  });

  [els.search, els.type, els.field, els.ccf, els.jcr, els.cas, els.sort, els.upcomingOnly, els.rollingOnly]
    .forEach((el) => el.addEventListener("input", render));

  els.viewToggle.addEventListener("click", () => {
    state.view = state.view === "table" ? "card" : "table";
    render();
  });
}

function populateFieldFilter() {
  const fields = [...new Set(state.venues.flatMap((venue) => venue.field || []))].sort();
  fields.forEach((field) => {
    const option = document.createElement("option");
    option.value = field;
    option.textContent = field;
    els.field.appendChild(option);
  });
}

function render() {
  state.filtered = state.venues
    .filter(matchesFilters)
    .sort(sortVenues);

  els.resultCount.textContent = state.filtered.length;
  renderTable();
  renderCards();
  updateView();
  els.emptyState.classList.toggle("hidden", state.filtered.length > 0);
}

function matchesFilters(venue) {
  const query = els.search.value.trim().toLowerCase();
  const searchable = [
    venue.abbr,
    venue.full_name,
    ...(venue.field || []),
    venue.note,
    venue.publisher,
    venue.location
  ].join(" ").toLowerCase();

  if (query && !searchable.includes(query)) return false;
  if (els.type.value && venue.type !== els.type.value) return false;
  if (els.field.value && !(venue.field || []).includes(els.field.value)) return false;
  if (els.ccf.value && normalizeUnknown(venue.ccf_rank) !== els.ccf.value) return false;
  if (els.jcr.value && normalizeUnknown(venue.jcr_quartile) !== els.jcr.value) return false;
  if (els.cas.value && normalizeUnknown(venue.cas_partition) !== els.cas.value) return false;
  if (els.upcomingOnly.checked && !isUpcoming(venue.deadline)) return false;
  if (els.rollingOnly.checked && venue.submission_mode !== "rolling" && venue.submission_cycle !== "rolling") return false;
  return true;
}

function sortVenues(a, b) {
  const sortBy = els.sort.value;
  if (sortBy === "ccf") return rankValue(a.ccf_rank) - rankValue(b.ccf_rank) || a.abbr.localeCompare(b.abbr);
  if (sortBy === "abbr") return a.abbr.localeCompare(b.abbr);
  if (sortBy === "impact") return impactValue(b.impact_factor) - impactValue(a.impact_factor) || a.abbr.localeCompare(b.abbr);
  return dateValue(a.deadline) - dateValue(b.deadline) || a.abbr.localeCompare(b.abbr);
}

function renderTable() {
  els.venueTable.innerHTML = state.filtered.map((venue) => `
    <tr>
      <td>${typeBadge(venue.type)}</td>
      <td><strong>${escapeHtml(venue.abbr)}</strong></td>
      <td>${escapeHtml(venue.full_name)}</td>
      <td>${fieldBadges(venue.field)}</td>
      <td>${ccfBadge(venue.ccf_rank)}</td>
      <td>${dateCell(venue, "conference_date")}</td>
      <td>${dateCell(venue, "abstract_deadline")}</td>
      <td>${deadlineText(venue)}</td>
      <td>${dateCell(venue, "notification_date")}</td>
      <td>${partitionBadges(venue)}</td>
      <td><a href="${escapeAttr(venue.website)}" target="_blank" rel="noopener">Official</a></td>
      <td>${escapeHtml(venue.note || "")}</td>
    </tr>
  `).join("");
}

function renderCards() {
  els.cardView.innerHTML = state.filtered.map((venue) => `
    <article class="venue-card">
      <div class="card-top">
        <div>
          ${typeBadge(venue.type)}
          <h2>${escapeHtml(venue.abbr)}</h2>
        </div>
        ${ccfBadge(venue.ccf_rank)}
      </div>
      <p><strong>${escapeHtml(venue.full_name)}</strong></p>
      <div class="meta">
        <span>${fieldBadges(venue.field)}</span>
        <span><strong>Conference date:</strong> ${dateCell(venue, "conference_date")}</span>
        <span><strong>Abstract:</strong> ${dateCell(venue, "abstract_deadline")}</span>
        <span><strong>Submission:</strong> ${deadlineText(venue)}</span>
        <span><strong>Notification:</strong> ${dateCell(venue, "notification_date")}</span>
        <span><strong>Partition / JCR:</strong> ${partitionBadges(venue)}</span>
        <span><a href="${escapeAttr(venue.website)}" target="_blank" rel="noopener">Official website</a></span>
      </div>
      <p>${escapeHtml(venue.note || "")}</p>
    </article>
  `).join("");
}

function updateView() {
  const card = state.view === "card";
  els.tableView.classList.toggle("hidden", card);
  els.cardView.classList.toggle("hidden", !card);
  els.viewToggle.textContent = card ? "Table view" : "Card view";
  els.viewToggle.setAttribute("aria-pressed", String(card));
}

function deadlineText(venue) {
  if (venue.type === "journal") return escapeHtml(venue.submission_mode || "Unknown");
  const deadline = venue.submission_deadline || venue.deadline || "TBD";
  if (deadline === "TBD") return "TBD";
  const days = daysUntil(deadline);
  const status = days < 0 ? "Past deadline" : `Due in ${days} days`;
  return `${escapeHtml(deadline)} <span class="badge ${days < 0 ? "unknown" : "q2"}">${status}</span>`;
}

function dateCell(venue, key) {
  if (venue.type === "journal") return "N/A";
  return escapeHtml(venue[key] || "TBD");
}

function isUpcoming(deadline) {
  return deadline && deadline !== "TBD" && daysUntil(deadline) >= 0;
}

function daysUntil(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(`${dateString}T00:00:00`);
  return Math.ceil((deadline - today) / 86400000);
}

function dateValue(dateString) {
  if (!dateString || dateString === "TBD") return Number.MAX_SAFE_INTEGER;
  return new Date(`${dateString}T00:00:00`).getTime();
}

function rankValue(rank) {
  return { A: 1, B: 2, C: 3, None: 4, Unknown: 5 }[normalizeUnknown(rank)] || 6;
}

function impactValue(value) {
  const numeric = Number.parseFloat(value);
  return Number.isFinite(numeric) ? numeric : -1;
}

function normalizeUnknown(value) {
  return value || "Unknown";
}

function typeBadge(type) {
  return `<span class="badge type-${type}">${type === "conference" ? "Conference" : "Journal"}</span>`;
}

function ccfBadge(rank) {
  const value = normalizeUnknown(rank);
  return `<span class="badge ccf-${value.toLowerCase()}">CCF-${escapeHtml(value)}</span>`;
}

function fieldBadges(fields = []) {
  return `<span class="badge-list">${fields.map((field) => `<span class="badge">${escapeHtml(field)}</span>`).join("")}</span>`;
}

function partitionBadges(venue) {
  const badges = [];
  if (venue.cas_partition) badges.push(`<span class="badge cas-${partitionClass(venue.cas_partition)}">CAS ${escapeHtml(venue.cas_partition)}</span>`);
  if (venue.jcr_quartile) badges.push(`<span class="badge ${venue.jcr_quartile.toLowerCase()}">${escapeHtml(venue.jcr_quartile)}</span>`);
  return badges.length ? `<span class="badge-list">${badges.join("")}</span>` : "N/A";
}

function partitionClass(value) {
  return value.match(/[1-4]/)?.[0] || "unknown";
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

init();
