// Biomedical Waste (BMW) Dashboard: a daily log of hospital biomedical waste by ward and
// colour category, stored in this browser (localStorage), with charts and CSV import/export.
const SVG_NS = "http://www.w3.org/2000/svg";
const STORE_KEY = "bmwDashboard.v1";
const ALL_WARDS = "All wards";

// Stacking order (bottom to top) keeps yellow and red apart for colour-blind readers.
const CATS = [
  { key: "yellow", name: "Yellow", color: "var(--cat-yellow)" },
  { key: "blue", name: "Blue", color: "var(--cat-blue)" },
  { key: "red", name: "Red", color: "var(--cat-red)" },
  { key: "white", name: "White (sharps)", color: "var(--cat-white)", hatch: true }
];
const PERIODS = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
  { label: "All", days: null }
];

const state = { entries: [], sample: false, period: 30, ward: ALL_WARDS, showAll: false };

// ---------- dates ----------
function todayStr() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}
function addDays(str, n) {
  const d = new Date(str + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function daysBetween(a, b) {
  return Math.round((new Date(b + "T00:00:00Z") - new Date(a + "T00:00:00Z")) / 86400000);
}
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtDate(str, withYear) {
  const [y, m, d] = str.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]}` + (withYear ? ` ${y}` : "");
}
function normaliseDate(s) {
  s = String(s || "").trim();
  let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/); // DD-MM-YYYY
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  return null;
}

// ---------- numbers ----------
const fmtKg = n => (n == null || isNaN(n)) ? "n/a" : n.toLocaleString("en-IN", { maximumFractionDigits: n >= 100 ? 0 : 1 });
const fmtPct = p => (p == null || isNaN(p)) ? "n/a" : (p * 100).toFixed(1) + "%";
const entryTotal = e => CATS.reduce((s, c) => s + (e[c.key] || 0), 0);

// ---------- storage ----------
function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY));
    if (saved && Array.isArray(saved.entries)) {
      state.entries = saved.entries;
      state.sample = !!saved.sample;
      return;
    }
  } catch (e) { /* storage unavailable: fall through to sample data */ }
  state.entries = sampleEntries();
  state.sample = true;
}
function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ entries: state.entries, sample: state.sample }));
  } catch (e) {
    setStatus("Could not save in this browser. Export CSV to keep your data.");
  }
}
function upsert(entry) {
  const i = state.entries.findIndex(e => e.date === entry.date && e.ward.toLowerCase() === entry.ward.toLowerCase());
  if (i >= 0) state.entries[i] = entry; else state.entries.push(entry);
  return i >= 0;
}

// ---------- sample data ----------
function sampleEntries() {
  let seed = 20261004;
  const rand = () => { // mulberry32
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  // Per occupied bed per day (kg) for wards, per day (kg) for OT / lab.
  const wards = [
    { ward: "Medicine", beds: 50, y: 0.22, r: 0.12, w: 0.025, b: 0.008 },
    { ward: "Surgery", beds: 42, y: 0.30, r: 0.14, w: 0.03, b: 0.01 },
    { ward: "Obstetrics & Gynaecology", beds: 34, y: 0.38, r: 0.12, w: 0.03, b: 0.008 },
    { ward: "ICU", beds: 11, y: 0.65, r: 0.45, w: 0.09, b: 0.03 },
    { ward: "Paediatrics", beds: 22, y: 0.18, r: 0.10, w: 0.02, b: 0.006 },
    { ward: "Operation Theatre", beds: 0, y: 18, r: 8, w: 1.5, b: 0.8, quietSunday: true },
    { ward: "Laboratory", beds: 0, y: 6, r: 3, w: 0.6, b: 1.2, quietSunday: true }
  ];
  const end = todayStr(), out = [];
  for (let k = 89; k >= 0; k--) {
    const date = addDays(end, -k);
    const sunday = new Date(date + "T00:00:00Z").getUTCDay() === 0;
    wards.forEach(p => {
      if (p.ward === "Laboratory" && rand() < 0.04) return; // occasional missed entry
      const jitter = () => 0.8 + rand() * 0.4;
      const occ = p.beds ? Math.round(p.beds * (0.85 + rand() * 0.2)) : null;
      const base = p.beds ? occ : (p.quietSunday && sunday ? 0.3 : 1);
      const kg = f => Math.round(f * base * jitter() * 10) / 10;
      out.push({ date, ward: p.ward, yellow: kg(p.y), red: kg(p.r), white: kg(p.w), blue: kg(p.b), beds: occ });
    });
  }
  return out;
}

// ---------- filtering ----------
function latestDate() {
  return state.entries.reduce((m, e) => e.date > m ? e.date : m, "") || todayStr();
}
function earliestDate() {
  return state.entries.reduce((m, e) => !m || e.date < m ? e.date : m, "") || todayStr();
}
function range() {
  const end = latestDate();
  const start = state.period ? addDays(end, -(state.period - 1)) : earliestDate();
  return { start, end, days: daysBetween(start, end) + 1 };
}
function filtered(start, end) {
  return state.entries.filter(e => e.date >= start && e.date <= end &&
    (state.ward === ALL_WARDS || e.ward === state.ward));
}
function sumCats(entries) {
  const s = { total: 0 };
  CATS.forEach(c => { s[c.key] = entries.reduce((a, e) => a + (e[c.key] || 0), 0); s.total += s[c.key]; });
  return s;
}

// ---------- svg helpers ----------
function el(tag, attrs = {}, parent) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) node.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(node);
  return node;
}
function addHatch(svg, id) {
  const defs = el("defs", {}, svg);
  const pat = el("pattern", { id, width: 4, height: 4, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, defs);
  el("rect", { width: 4, height: 4, style: "fill: var(--cat-white)" }, pat);
  el("line", { x1: 0, y1: 0, x2: 0, y2: 4, style: "stroke: var(--hatch); stroke-width: 1.5" }, pat);
}
const catFill = (c, hatchId) => c.hatch ? `fill: url(#${hatchId})` : `fill: ${c.color}`;

function niceTicks(max, count = 4) {
  if (!(max > 0)) max = 1;
  const raw = max / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= raw);
  const ticks = [];
  for (let t = 0; t <= Math.ceil(max / step) * step + step / 2; t += step) ticks.push(t);
  return ticks;
}
function topRounded(x, top, w, bottom, r) {
  r = Math.min(r, w / 2, bottom - top);
  return `M${x},${bottom}V${top + r}Q${x},${top} ${x + r},${top}H${x + w - r}Q${x + w},${top} ${x + w},${top + r}V${bottom}Z`;
}
function rightRounded(x, y, w, h, r) {
  r = Math.min(r, h / 2, w);
  return `M${x},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x}Z`;
}
function makeTooltip(container) {
  const tip = document.createElement("div");
  tip.className = "tooltip";
  container.appendChild(tip);
  return {
    show(html, x, y) {
      tip.innerHTML = html;
      tip.style.display = "block";
      const w = tip.offsetWidth;
      let left = x + 14;
      if (left + w > container.clientWidth) left = x - w - 14;
      tip.style.left = Math.max(0, left) + "px";
      tip.style.top = Math.max(0, y - tip.offsetHeight / 2) + "px";
    },
    hide() { tip.style.display = "none"; }
  };
}
function breakdownHtml(title, s, extra = "") {
  const rows = CATS.slice().reverse().map(c =>
    `<div class="row"><i class="sw ${c.key}"></i>${c.name}<em>${fmtKg(s[c.key])} kg</em></div>`).join("");
  return `<b>${title}</b>${rows}<div class="row"><strong>Total</strong><em><strong>${fmtKg(s.total)} kg</strong></em></div>${extra}`;
}

// ---------- charts ----------
function renderDailyChart(r) {
  const box = document.getElementById("dailyChart");
  box.innerHTML = "";
  const days = [];
  for (let i = 0; i < r.days; i++) {
    const date = addDays(r.start, i);
    const es = filtered(date, date);
    days.push({ date, s: sumCats(es), n: es.length });
  }
  if (!days.some(d => d.n)) { box.innerHTML = `<div class="empty">No entries in this period.</div>`; return; }

  const w = box.clientWidth, h = box.clientHeight;
  const M = { top: 12, right: 8, bottom: 28, left: 44 };
  const svg = el("svg", { viewBox: `0 0 ${w} ${h}`, role: "img", "aria-label": "Daily biomedical waste by colour category" }, box);
  const hatchId = "hatch-daily";
  addHatch(svg, hatchId);
  const tip = makeTooltip(box);

  const ticks = niceTicks(Math.max(...days.map(d => d.s.total)));
  const yMax = ticks[ticks.length - 1];
  const innerW = w - M.left - M.right, innerH = h - M.top - M.bottom;
  const band = innerW / days.length;
  const barW = Math.max(1, Math.min(36, band * 0.7));
  const gap = barW >= 6 ? 1 : 0; // 2px surface gap between stacked segments when bars are wide enough
  const y = v => M.top + innerH - v / yMax * innerH;
  const cx = i => M.left + band * i + band / 2;

  ticks.forEach(t => {
    el("line", { x1: M.left, x2: w - M.right, y1: y(t), y2: y(t), style: "stroke: var(--grid)" }, svg);
    el("text", { x: M.left - 8, y: y(t) + 4, "text-anchor": "end" }, svg).textContent = t.toLocaleString("en-IN");
  });
  const every = Math.ceil(days.length / Math.max(2, Math.floor(innerW / 64)));
  days.forEach((d, i) => {
    if ((days.length - 1 - i) % every === 0) {
      el("text", { x: cx(i), y: h - 8, "text-anchor": "middle" }, svg).textContent = fmtDate(d.date);
    }
  });

  days.forEach((d, i) => {
    const g = el("g", {}, svg);
    if (!d.n) {
      el("circle", { cx: cx(i), cy: y(0) - 4, r: 2, style: "fill: var(--text-muted)" }, g);
    } else {
      let acc = 0;
      const visible = CATS.filter(c => d.s[c.key] > 0);
      visible.forEach((c, k) => {
        const top = y(acc + d.s[c.key]), bottom = y(acc);
        acc += d.s[c.key];
        const isTop = k === visible.length - 1;
        const t = top + (isTop ? 0 : gap), b = bottom - (k === 0 ? 0 : gap);
        if (b - t <= 0) return;
        const x = cx(i) - barW / 2;
        el("path", { d: isTop ? topRounded(x, t, barW, b, 4) : `M${x},${t}H${x + barW}V${b}H${x}Z`, style: catFill(c, hatchId) }, g);
      });
    }
    const hit = el("rect", { x: cx(i) - band / 2, y: M.top, width: band, height: innerH, style: "fill: transparent" }, svg);
    const show = () => {
      g.setAttribute("opacity", "0.75");
      const html = d.n ? breakdownHtml(fmtDate(d.date, true), d.s,
        state.ward === ALL_WARDS ? `<div class="row" style="color:var(--text-secondary)">${d.n} ward${d.n > 1 ? "s" : ""} reported</div>` : "")
        : `<b>${fmtDate(d.date, true)}</b>No entry logged`;
      tip.show(html, cx(i), M.top + innerH / 2);
    };
    const hide = () => { g.removeAttribute("opacity"); tip.hide(); };
    hit.addEventListener("mouseenter", show);
    hit.addEventListener("touchstart", show, { passive: true });
    hit.addEventListener("mouseleave", hide);
  });
  el("line", { x1: M.left, x2: w - M.right, y1: y(0), y2: y(0), style: "stroke: var(--baseline)" }, svg);
  document.getElementById("dailyNote").textContent = days.some(d => !d.n) ? "kg per day · dot = no entry" : "kg per day";
}

function renderWardChart(r) {
  const box = document.getElementById("wardChart");
  box.innerHTML = "";
  const all = state.entries.filter(e => e.date >= r.start && e.date <= r.end);
  const names = [...new Set(all.map(e => e.ward))];
  const rows = names.map(n => ({ ward: n, s: sumCats(all.filter(e => e.ward === n)) }))
    .sort((a, b) => b.s.total - a.s.total);
  if (!rows.length) { box.innerHTML = `<div class="empty">No entries in this period.</div>`; return; }

  const rowH = 30, w = box.clientWidth, labelW = Math.min(150, w * 0.35), valueW = 64;
  const h = rows.length * rowH + 4;
  box.style.height = h + "px";
  const svg = el("svg", { viewBox: `0 0 ${w} ${h}`, role: "img", "aria-label": "Biomedical waste by ward" }, box);
  const hatchId = "hatch-ward";
  addHatch(svg, hatchId);
  const tip = makeTooltip(box);
  const max = rows[0].s.total || 1;
  const trackW = w - labelW - valueW - 8;

  rows.forEach((row, i) => {
    const yTop = i * rowH + 6, barH = 16;
    const dim = state.ward !== ALL_WARDS && row.ward !== state.ward;
    const g = el("g", dim ? { opacity: 0.35 } : {}, svg);
    let name = row.ward;
    const label = el("text", { x: 0, y: yTop + 12, class: "label" }, g);
    label.textContent = name;
    while (label.getComputedTextLength && label.getComputedTextLength() > labelW - 8 && name.length > 4) {
      name = name.slice(0, -1);
      label.textContent = name.trimEnd() + "…";
    }
    let acc = 0;
    const visible = CATS.filter(c => row.s[c.key] > 0);
    visible.forEach((c, k) => {
      const x0 = labelW + acc / max * trackW;
      acc += row.s[c.key];
      const x1 = labelW + acc / max * trackW;
      const isEnd = k === visible.length - 1;
      const x = x0 + (k === 0 ? 0 : 1), wd = x1 - x0 - (k === 0 ? 0 : 1) - (isEnd ? 0 : 1);
      if (wd <= 0) return;
      el("path", { d: isEnd ? rightRounded(x, yTop, wd, barH, 4) : `M${x},${yTop}H${x + wd}V${yTop + barH}H${x}Z`, style: catFill(c, hatchId) }, g);
    });
    el("text", { x: w, y: yTop + 12, "text-anchor": "end", class: "value" }, g).textContent = fmtKg(row.s.total) + " kg";
    const hit = el("rect", { x: 0, y: i * rowH, width: w, height: rowH, style: "fill: transparent; cursor: pointer" }, svg);
    hit.addEventListener("mouseenter", () => tip.show(breakdownHtml(row.ward, row.s), labelW + acc / max * trackW, yTop + 8));
    hit.addEventListener("mouseleave", () => tip.hide());
    hit.addEventListener("click", () => { state.ward = state.ward === row.ward ? ALL_WARDS : row.ward; renderAll(); });
  });
}

function renderCatSplit(s) {
  const box = document.getElementById("catSplit");
  if (!s.total) { box.innerHTML = `<div class="empty">No entries in this period.</div>`; return; }
  box.innerHTML = CATS.map(c => {
    const share = s[c.key] / s.total;
    const fill = c.hatch ? "repeating-linear-gradient(45deg, var(--cat-white) 0 3px, var(--hatch) 3px 4px)" : c.color;
    return `<div class="cat-row">
      <span class="name"><i class="sw ${c.key}"></i>${c.name}</span>
      <div class="cat-track"><div class="cat-fill" style="width:${(share * 100).toFixed(2)}%; background:${fill}"></div></div>
      <span class="cat-val">${fmtKg(s[c.key])} kg · ${fmtPct(share)}</span></div>`;
  }).join("");
}

// ---------- KPIs ----------
function renderKpis(r) {
  const cur = filtered(r.start, r.end);
  const s = sumCats(cur);
  const loggedDays = new Set(cur.map(e => e.date)).size;
  const perDay = loggedDays ? s.total / loggedDays : null;

  // Previous period of equal length, for comparison.
  let delta = "<span>no earlier period to compare</span>";
  if (state.period) {
    const prev = filtered(addDays(r.start, -r.days), addDays(r.start, -1));
    const pDays = new Set(prev.map(e => e.date)).size;
    if (pDays && perDay != null) {
      const pPerDay = sumCats(prev).total / pDays;
      const d = (perDay - pPerDay) / pPerDay;
      delta = `<span class="${d >= 0 ? "up" : "down"}">${d >= 0 ? "▲" : "▼"} ${fmtPct(Math.abs(d))}</span> vs previous ${r.days} days`;
    }
  }

  const bedEntries = cur.filter(e => e.beds > 0);
  const bedDays = bedEntries.reduce((a, e) => a + e.beds, 0);
  const perBed = bedDays ? bedEntries.reduce((a, e) => a + entryTotal(e), 0) / bedDays : null;

  const tiles = [
    { label: `Total waste, ${fmtDate(r.start)} – ${fmtDate(r.end, true)}`, value: `${fmtKg(s.total)} <small>kg</small>`,
      delta: `<span>${loggedDays} of ${r.days} days logged</span>` },
    { label: "Average per logged day", value: perDay == null ? "n/a" : `${fmtKg(perDay)} <small>kg/day</small>`, delta },
    { label: "Per occupied bed per day", value: perBed == null ? "n/a" : `${perBed.toFixed(2)} <small>kg</small>`,
      delta: `<span>${perBed == null ? "enter occupied beds to calculate" : "wards that reported beds"}</span>` },
    { label: "Yellow category share", value: s.total ? fmtPct(s.yellow / s.total) : "n/a",
      delta: `<span>White (sharps): ${s.total ? fmtPct(s.white / s.total) : "n/a"}</span>` }
  ];
  document.getElementById("kpis").innerHTML = tiles.map(t =>
    `<div class="card"><div class="kpi-label">${t.label}</div><div class="kpi-value">${t.value}</div><div class="kpi-delta">${t.delta}</div></div>`
  ).join("");
}

// ---------- log table ----------
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}
function renderLog(r) {
  const rows = filtered(r.start, r.end).slice()
    .sort((a, b) => b.date.localeCompare(a.date) || a.ward.localeCompare(b.ward));
  const limit = state.showAll ? rows.length : 30;
  const head = `<thead><tr><th>Date</th><th>Ward</th>${CATS.map(c => `<th>${c.name}</th>`).join("")}<th>Total kg</th><th>Beds</th><th class="no-print"></th></tr></thead>`;
  const body = rows.slice(0, limit).map(e => {
    const idx = state.entries.indexOf(e);
    return `<tr><td>${fmtDate(e.date, true)}</td><td>${escapeHtml(e.ward)}</td>${CATS.map(c => `<td>${fmtKg(e[c.key] || 0)}</td>`).join("")}
      <td class="total">${fmtKg(entryTotal(e))}</td><td>${e.beds || "–"}</td>
      <td class="no-print"><button class="btn link" type="button" data-edit="${idx}">Edit</button><button class="btn link" type="button" data-del="${idx}">Delete</button></td></tr>`;
  }).join("");
  document.getElementById("logTable").innerHTML = head + `<tbody>${body || `<tr><td colspan="9">No entries in this period.</td></tr>`}</tbody>`;
  document.getElementById("logNote").textContent = `${rows.length} entr${rows.length === 1 ? "y" : "ies"} · newest first`;
  const more = document.getElementById("showAll");
  more.hidden = rows.length <= limit;
  more.textContent = `Show all ${rows.length} rows`;
}

document.getElementById("logTable").addEventListener("click", ev => {
  const del = ev.target.getAttribute("data-del"), edit = ev.target.getAttribute("data-edit");
  if (del != null) {
    const e = state.entries[+del];
    if (e && confirm(`Delete the entry for ${e.ward} on ${fmtDate(e.date, true)}?`)) {
      state.entries.splice(+del, 1);
      save(); renderAll();
    }
  } else if (edit != null) {
    const e = state.entries[+edit], f = document.getElementById("entryForm");
    if (!e) return;
    f.date.value = e.date; f.ward.value = e.ward; f.beds.value = e.beds || "";
    CATS.forEach(c => { f[c.key].value = e[c.key] || ""; });
    f.scrollIntoView({ behavior: "smooth", block: "center" });
    msg(`Editing ${e.ward}, ${fmtDate(e.date, true)}. Save to replace it.`);
  }
});
document.getElementById("showAll").addEventListener("click", () => { state.showAll = true; renderLog(range()); });

// ---------- filters ----------
function renderFilters() {
  const pf = document.getElementById("periodFilter");
  pf.innerHTML = "";
  PERIODS.forEach(p => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = p.label;
    b.setAttribute("aria-pressed", String(p.days === state.period));
    b.addEventListener("click", () => { state.period = p.days; state.showAll = false; renderAll(); });
    pf.appendChild(b);
  });
  const wards = [...new Set(state.entries.map(e => e.ward))].sort();
  if (state.ward !== ALL_WARDS && !wards.includes(state.ward)) state.ward = ALL_WARDS;
  document.getElementById("wardFilter").innerHTML = [ALL_WARDS, ...wards]
    .map(w => `<option${w === state.ward ? " selected" : ""}>${escapeHtml(w)}</option>`).join("");
  document.getElementById("wardList").innerHTML = wards.map(w => `<option value="${escapeHtml(w)}">`).join("");
}
document.getElementById("wardFilter").addEventListener("change", e => { state.ward = e.target.value; state.showAll = false; renderAll(); });

function renderAll() {
  document.getElementById("sampleBanner").hidden = !state.sample;
  renderFilters();
  const r = range();
  renderKpis(r);
  renderDailyChart(r);
  renderWardChart(r);
  renderCatSplit(sumCats(filtered(r.start, r.end)));
  renderLog(r);
}

// ---------- entry form ----------
function msg(text) { document.getElementById("formMsg").textContent = text; }
function setStatus(text) { document.getElementById("status").textContent = text; }

function startOwnLog() {
  if (!state.sample) return false;
  state.entries = [];
  state.sample = false;
  return true;
}

document.getElementById("entryForm").addEventListener("submit", ev => {
  ev.preventDefault();
  const f = ev.target;
  const entry = { date: f.date.value, ward: f.ward.value.trim(), beds: f.beds.value ? Math.round(+f.beds.value) : null };
  CATS.forEach(c => { entry[c.key] = f[c.key].value ? Math.round(+f[c.key].value * 100) / 100 : 0; });
  if (!entry.date || !entry.ward) { msg("Please enter a date and a ward."); return; }
  if (CATS.some(c => entry[c.key] < 0)) { msg("Weights cannot be negative."); return; }
  if (!entryTotal(entry)) { msg("Enter the weight for at least one category."); return; }
  const cleared = startOwnLog();
  const replaced = upsert(entry);
  save();
  state.ward = ALL_WARDS;
  renderAll();
  CATS.forEach(c => { f[c.key].value = ""; });
  f.beds.value = "";
  msg((cleared ? "Sample data cleared; your log has started. " : "") +
    `${replaced ? "Updated" : "Saved"} ${entry.ward}, ${fmtDate(entry.date, true)}: ${fmtKg(entryTotal(entry))} kg.`);
});

document.getElementById("clearSample").addEventListener("click", () => {
  startOwnLog(); save(); renderAll();
  msg("Sample data cleared. Add your first entry.");
});

// ---------- CSV ----------
function splitCsvLine(line) {
  const out = []; let cur = "", q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') q = false;
      else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out.map(s => s.trim());
}
function parseCsv(text) {
  const lines = text.replace(/^﻿/, "").split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) throw new Error("the file needs a header row and at least one data row");
  const header = splitCsvLine(lines[0]).map(h => h.toLowerCase());
  const col = word => header.findIndex(h => h.includes(word));
  const idx = { date: col("date"), ward: col("ward") >= 0 ? col("ward") : col("dep"), beds: col("bed") };
  CATS.forEach(c => { idx[c.key] = col(c.key); });
  if (idx.date < 0 || idx.ward < 0) throw new Error("header must include 'date' and 'ward' columns");
  if (CATS.every(c => idx[c.key] < 0)) throw new Error("header must include at least one of yellow, red, white, blue");
  const entries = [], bad = [];
  lines.slice(1).forEach((line, n) => {
    const cells = splitCsvLine(line);
    const date = normaliseDate(cells[idx.date]);
    const ward = (cells[idx.ward] || "").trim();
    if (!date || !ward) { bad.push(n + 2); return; }
    const num = i => { const v = i >= 0 ? parseFloat(cells[i]) : NaN; return isNaN(v) || v < 0 ? 0 : v; };
    const e = { date, ward, beds: idx.beds >= 0 && cells[idx.beds] ? Math.round(num(idx.beds)) || null : null };
    CATS.forEach(c => { e[c.key] = num(idx[c.key]); });
    entries.push(e);
  });
  if (!entries.length) throw new Error("no valid rows found");
  return { entries, bad };
}

document.getElementById("csvInput").addEventListener("change", ev => {
  const file = ev.target.files[0];
  if (!file) return;
  file.text().then(text => {
    const { entries, bad } = parseCsv(text);
    startOwnLog();
    let replaced = 0;
    entries.forEach(e => { if (upsert(e)) replaced++; });
    save();
    state.ward = ALL_WARDS;
    state.period = null;
    renderAll();
    setStatus(`Imported ${entries.length} rows` + (replaced ? ` (${replaced} replaced)` : "") +
      (bad.length ? `; skipped line${bad.length > 1 ? "s" : ""} ${bad.slice(0, 5).join(", ")}${bad.length > 5 ? "…" : ""}` : ""));
  }).catch(err => setStatus("Import failed: " + err.message))
    .finally(() => { ev.target.value = ""; });
});

document.getElementById("exportCsv").addEventListener("click", () => {
  const q = s => /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  const rows = state.entries.slice().sort((a, b) => a.date.localeCompare(b.date) || a.ward.localeCompare(b.ward));
  const csv = ["date,ward,yellow_kg,red_kg,white_kg,blue_kg,occupied_beds"]
    .concat(rows.map(e => [e.date, q(e.ward), e.yellow || 0, e.red || 0, e.white || 0, e.blue || 0, e.beds || ""].join(",")))
    .join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = `biomedical_waste_${todayStr()}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

document.getElementById("printBtn").addEventListener("click", () => window.print());

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { const r = range(); renderDailyChart(r); renderWardChart(r); }, 150);
});

load();
document.getElementById("entryForm").date.value = todayStr();
renderAll();
