// BMW Data Dashboard: renders KPIs, charts and a table from BMW_DATA (bmw_data.js).
const SVG_NS = "http://www.w3.org/2000/svg";
const TOTAL = "Group total";

const state = {
  brands: BMW_DATA.brands.slice(),
  rows: BMW_DATA.rows.slice(),
  source: BMW_DATA.source,
  selected: TOTAL
};

// ---------- helpers ----------
const fmtFull = n => (n == null || isNaN(n)) ? "n/a" : Math.round(n).toLocaleString("en-US");
function fmtShort(n) {
  if (n == null || isNaN(n)) return "n/a";
  const a = Math.abs(n);
  if (a >= 1e6) return (n / 1e6).toFixed(a >= 1e7 ? 1 : 2).replace(/\.?0+$/, "") + "M";
  if (a >= 1e3) return (n / 1e3).toFixed(a >= 1e5 ? 0 : 1).replace(/\.0$/, "") + "K";
  return String(Math.round(n));
}
const fmtPct = p => (p == null || isNaN(p)) ? "n/a" : (p * 100).toFixed(1) + "%";

function total(row) {
  return state.brands.reduce((s, b) => s + (Number(row[b]) || 0), 0);
}
function valueOf(row, key) {
  if (key === TOTAL) return total(row);
  const v = row[key];
  return v == null || v === "" ? null : Number(v);
}

function el(tag, attrs = {}, parent) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) node.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(node);
  return node;
}

function niceTicks(min, max, count = 4) {
  if (min === max) { max = min + 1; }
  const raw = (max - min) / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= raw);
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let t = lo; t <= hi + step / 2; t += step) ticks.push(t);
  return ticks;
}

function makeTooltip(container) {
  const tip = document.createElement("div");
  tip.className = "tooltip";
  container.appendChild(tip);
  return {
    show(html, x, y) {
      tip.innerHTML = html;
      tip.style.display = "block";
      const w = tip.offsetWidth, cw = container.clientWidth;
      let left = x + 12;
      if (left + w > cw) left = x - w - 12;
      tip.style.left = Math.max(0, left) + "px";
      tip.style.top = Math.max(0, y - tip.offsetHeight - 8) + "px";
    },
    hide() { tip.style.display = "none"; }
  };
}

// ---------- charts ----------
const MARGIN = { top: 12, right: 12, bottom: 28, left: 48 };

function drawAxes(svg, w, h, ticks, y, years, x) {
  ticks.forEach(t => {
    el("line", { x1: MARGIN.left, x2: w - MARGIN.right, y1: y(t), y2: y(t), stroke: "var(--grid)", "stroke-width": 1 }, svg);
    el("text", { x: MARGIN.left - 8, y: y(t) + 4, "text-anchor": "end" }, svg).textContent = fmtShort(t);
  });
  years.forEach((yr, i) => {
    el("text", { x: x(i), y: h - 8, "text-anchor": "middle" }, svg).textContent = yr;
  });
}

function renderLineChart() {
  const box = document.getElementById("lineChart");
  box.innerHTML = "";
  const w = box.clientWidth, h = box.clientHeight;
  const svg = el("svg", { viewBox: `0 0 ${w} ${h}`, role: "img", "aria-label": `${state.selected} deliveries per year` }, box);
  const tip = makeTooltip(box);

  const pts = state.rows.map(r => ({ year: r.year, v: valueOf(r, state.selected) }));
  const vals = pts.map(p => p.v).filter(v => v != null);
  if (!vals.length) return;
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const pad = (hi - lo) * 0.15 || hi * 0.1;
  const ticks = niceTicks(Math.max(0, lo - pad), hi + pad);
  const yMin = ticks[0], yMax = ticks[ticks.length - 1];
  const innerW = w - MARGIN.left - MARGIN.right, innerH = h - MARGIN.top - MARGIN.bottom;
  const step = pts.length > 1 ? innerW / (pts.length - 1) : 0;
  const x = i => MARGIN.left + (pts.length > 1 ? i * step : innerW / 2);
  const y = v => MARGIN.top + innerH - (v - yMin) / (yMax - yMin) * innerH;

  drawAxes(svg, w, h, ticks, y, pts.map(p => p.year), x);

  let d = "", pen = false;
  pts.forEach((p, i) => {
    if (p.v == null) { pen = false; return; }
    d += (pen ? "L" : "M") + x(i) + "," + y(p.v);
    pen = true;
  });
  el("path", { d, fill: "none", stroke: "var(--series-1)", "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" }, svg);
  pts.forEach((p, i) => {
    if (p.v == null) return;
    el("circle", { cx: x(i), cy: y(p.v), r: 4, fill: "var(--series-1)", stroke: "var(--surface)", "stroke-width": 2 }, svg);
  });
  // Direct label on the latest point only.
  const last = pts.length - 1;
  if (pts[last].v != null) {
    // Put the label on the side away from the incoming segment.
    const falling = last > 0 && pts[last - 1].v != null && pts[last - 1].v > pts[last].v;
    el("text", { x: x(last) - 6, y: y(pts[last].v) + (falling ? 18 : -10), "text-anchor": "end", style: "fill: var(--text-secondary); font-weight: 600" }, svg).textContent = fmtShort(pts[last].v);
  }

  // Hover layer: crosshair + tooltip on nearest year.
  const cross = el("line", { y1: MARGIN.top, y2: MARGIN.top + innerH, stroke: "var(--baseline)", "stroke-width": 1, visibility: "hidden" }, svg);
  const hot = el("circle", { r: 6, fill: "var(--series-1)", stroke: "var(--surface)", "stroke-width": 2, visibility: "hidden" }, svg);
  const overlay = el("rect", { x: MARGIN.left - step / 2, y: 0, width: innerW + step, height: h, fill: "transparent" }, svg);
  const move = evt => {
    const rect = svg.getBoundingClientRect();
    const px = (evt.touches ? evt.touches[0].clientX : evt.clientX) - rect.left;
    const i = Math.max(0, Math.min(pts.length - 1, Math.round(step ? (px - MARGIN.left) / step : 0)));
    const p = pts[i];
    cross.setAttribute("x1", x(i)); cross.setAttribute("x2", x(i));
    cross.setAttribute("visibility", "visible");
    if (p.v == null) { hot.setAttribute("visibility", "hidden"); }
    else {
      hot.setAttribute("cx", x(i)); hot.setAttribute("cy", y(p.v));
      hot.setAttribute("visibility", "visible");
    }
    const prev = i > 0 ? pts[i - 1].v : null;
    const yoy = prev && p.v != null ? (p.v - prev) / prev : null;
    tip.show(`<b>${p.year}</b>${fmtFull(p.v)} units<br><span>vs prior year: ${yoy == null ? "n/a" : (yoy >= 0 ? "+" : "") + fmtPct(yoy)}</span>`,
      x(i), p.v == null ? MARGIN.top + innerH / 2 : y(p.v));
  };
  const leave = () => { cross.setAttribute("visibility", "hidden"); hot.setAttribute("visibility", "hidden"); tip.hide(); };
  overlay.addEventListener("mousemove", move);
  overlay.addEventListener("touchstart", move, { passive: true });
  overlay.addEventListener("touchmove", move, { passive: true });
  overlay.addEventListener("mouseleave", leave);
}

function barPath(x, top, w, base) {
  const r = Math.min(4, w / 2, base - top);
  return `M${x},${base}V${top + r}Q${x},${top} ${x + r},${top}H${x + w - r}Q${x + w},${top} ${x + w},${top + r}V${base}Z`;
}

function renderBevChart() {
  const box = document.getElementById("bevChart");
  box.innerHTML = "";
  const w = box.clientWidth, h = box.clientHeight;
  const svg = el("svg", { viewBox: `0 0 ${w} ${h}`, role: "img", "aria-label": "Electric (BEV) deliveries per year" }, box);
  const tip = makeTooltip(box);

  const pts = state.rows.map(r => ({ year: r.year, v: valueOf(r, "BEV"), t: total(r) }));
  const vals = pts.map(p => p.v).filter(v => v != null);
  if (!vals.length) {
    el("text", { x: w / 2, y: h / 2, "text-anchor": "middle" }, svg).textContent = "No BEV data";
    return;
  }
  const ticks = niceTicks(0, Math.max(...vals));
  const yMax = ticks[ticks.length - 1];
  const innerW = w - MARGIN.left - MARGIN.right, innerH = h - MARGIN.top - MARGIN.bottom;
  const band = innerW / pts.length;
  const barW = Math.min(48, band * 0.6);
  const x = i => MARGIN.left + band * i + band / 2;
  const y = v => MARGIN.top + innerH - v / yMax * innerH;
  const base = y(0);

  drawAxes(svg, w, h, ticks, y, pts.map(p => p.year), x);
  el("line", { x1: MARGIN.left, x2: w - MARGIN.right, y1: base, y2: base, stroke: "var(--baseline)", "stroke-width": 1 }, svg);

  const lastIdx = pts.map(p => p.v != null).lastIndexOf(true);
  pts.forEach((p, i) => {
    if (p.v == null) {
      el("text", { x: x(i), y: base - 6, "text-anchor": "middle" }, svg).textContent = "n/a";
      return;
    }
    const bar = el("path", { d: barPath(x(i) - barW / 2, y(p.v), barW, base), fill: "var(--series-1)" }, svg);
    if (i === lastIdx) {
      el("text", { x: x(i), y: y(p.v) - 6, "text-anchor": "middle", style: "fill: var(--text-secondary); font-weight: 600" }, svg).textContent = fmtShort(p.v);
    }
    // Hit target spans the whole band, taller than the bar.
    const hit = el("rect", { x: x(i) - band / 2, y: MARGIN.top, width: band, height: innerH, fill: "transparent" }, svg);
    const show = () => {
      bar.setAttribute("opacity", "0.8");
      tip.show(`<b>${p.year}</b>${fmtFull(p.v)} BEV units<br><span>${fmtPct(p.t ? p.v / p.t : null)} of group deliveries</span>`, x(i), y(p.v));
    };
    const hide = () => { bar.removeAttribute("opacity"); tip.hide(); };
    hit.addEventListener("mouseenter", show);
    hit.addEventListener("touchstart", show, { passive: true });
    hit.addEventListener("mouseleave", hide);
  });
}

// ---------- KPIs, mix, table ----------
function deltaHtml(cur, prev, label) {
  if (cur == null || !prev) return `<span>${label}: n/a</span>`;
  const d = (cur - prev) / prev;
  const cls = d >= 0 ? "up" : "down";
  const arrow = d >= 0 ? "▲" : "▼";
  return `<span class="${cls}">${arrow} ${fmtPct(Math.abs(d))}</span> ${label}`;
}

function renderKpis() {
  const rows = state.rows;
  const last = rows[rows.length - 1], prev = rows[rows.length - 2];
  const sel = state.selected;
  const cur = valueOf(last, sel), before = prev ? valueOf(prev, sel) : null;
  const peak = rows.reduce((best, r) => {
    const v = valueOf(r, sel);
    return v != null && (best == null || v > best.v) ? { v, year: r.year } : best;
  }, null);
  const bev = valueOf(last, "BEV"), bevPrev = prev ? valueOf(prev, "BEV") : null;
  const share = bev != null && total(last) ? bev / total(last) : null;
  const sharePrev = bevPrev != null && prev && total(prev) ? bevPrev / total(prev) : null;
  const sharePts = share != null && sharePrev != null ? ((share - sharePrev) * 100).toFixed(1) : null;

  const tiles = [
    { label: `${sel} deliveries, ${last.year}`, value: fmtFull(cur), delta: deltaHtml(cur, before, `vs ${prev ? prev.year : "prior"}`) },
    { label: `Peak year (${sel})`, value: peak ? String(peak.year) : "n/a", delta: `<span>${peak ? fmtFull(peak.v) + " units" : ""}</span>` },
    { label: `BEV deliveries, ${last.year}`, value: fmtFull(bev), delta: deltaHtml(bev, bevPrev, `vs ${prev ? prev.year : "prior"}`) },
    { label: `BEV share of group, ${last.year}`, value: fmtPct(share),
      delta: sharePts == null ? "<span>vs prior: n/a</span>" :
        `<span class="${sharePts >= 0 ? "up" : "down"}">${sharePts >= 0 ? "▲ +" : "▼ "}${sharePts} pts</span> vs ${prev.year}` }
  ];
  document.getElementById("kpis").innerHTML = tiles.map(t =>
    `<div class="card"><div class="kpi-label">${t.label}</div><div class="kpi-value">${t.value}</div><div class="kpi-delta">${t.delta}</div></div>`
  ).join("");
}

function renderMix() {
  const last = state.rows[state.rows.length - 1];
  const t = total(last);
  document.getElementById("mixTitle").textContent = `Brand mix, ${last.year}`;
  document.getElementById("mix").innerHTML = state.brands.map(b => {
    const v = valueOf(last, b) || 0;
    const s = t ? v / t : 0;
    return `<div class="mix-row" title="${b}: ${fmtFull(v)} units">
      <span>${b}</span>
      <div class="mix-track"><div class="mix-fill" style="width:${(s * 100).toFixed(2)}%"></div></div>
      <span class="mix-val">${fmtPct(s)}</span></div>`;
  }).join("");
}

function columns() {
  const cols = state.brands.slice();
  cols.push(TOTAL);
  if (state.rows.some(r => r.BEV != null)) cols.push("BEV");
  return cols;
}

function renderTable() {
  const cols = columns();
  const head = `<thead><tr><th>Year</th>${cols.map(c => `<th>${c}</th>`).join("")}</tr></thead>`;
  const body = state.rows.map(r =>
    `<tr><td>${r.year}</td>${cols.map(c => `<td>${fmtFull(valueOf(r, c))}</td>`).join("")}</tr>`
  ).join("");
  document.getElementById("dataTable").innerHTML = head + `<tbody>${body}</tbody>`;
}

function renderFilter() {
  const wrap = document.getElementById("brandFilter");
  if (!state.brands.includes(state.selected)) state.selected = TOTAL;
  wrap.innerHTML = "";
  [TOTAL, ...state.brands].forEach(b => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = b;
    btn.setAttribute("aria-pressed", String(b === state.selected));
    btn.addEventListener("click", () => { state.selected = b; renderAll(); });
    wrap.appendChild(btn);
  });
}

function renderAll() {
  if (!state.rows.length) return;
  renderFilter();
  document.getElementById("lineTitle").textContent = `${state.selected} deliveries per year`;
  document.getElementById("source").textContent = `Source: ${state.source}.`;
  renderKpis();
  renderLineChart();
  renderBevChart();
  renderMix();
  renderTable();
}

// ---------- CSV import / export ----------
function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) throw new Error("CSV needs a header row and at least one data row.");
  const header = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
  const yearIdx = header.findIndex(h => h.toLowerCase() === "year");
  if (yearIdx < 0) throw new Error("CSV header must include a 'year' column.");
  const bevIdx = header.findIndex(h => h.toLowerCase() === "bev");
  const brands = header.filter((h, i) => i !== yearIdx && i !== bevIdx && h.toLowerCase() !== TOTAL.toLowerCase());
  const rows = lines.slice(1).map(line => {
    const cells = line.split(",").map(c => c.trim().replace(/^"|"$/g, ""));
    const row = { year: Number(cells[yearIdx]), BEV: null };
    header.forEach((h, i) => {
      if (i === yearIdx || h.toLowerCase() === TOTAL.toLowerCase()) return;
      const num = cells[i] === "" || cells[i] == null ? null : Number(cells[i].replace(/[^0-9.\-]/g, ""));
      row[i === bevIdx ? "BEV" : h] = num == null || isNaN(num) ? null : num;
    });
    return row;
  }).filter(r => !isNaN(r.year)).sort((a, b) => a.year - b.year);
  if (!rows.length) throw new Error("No rows with a numeric year found.");
  return { brands, rows };
}

document.getElementById("csvInput").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const status = document.getElementById("status");
  file.text().then(text => {
    const parsed = parseCsv(text);
    state.brands = parsed.brands;
    state.rows = parsed.rows;
    state.source = `imported file “${file.name}”`;
    status.textContent = `Loaded ${parsed.rows.length} rows from ${file.name}`;
    renderAll();
  }).catch(err => { status.textContent = "Import failed: " + err.message; })
    .finally(() => { e.target.value = ""; });
});

document.getElementById("exportCsv").addEventListener("click", () => {
  const cols = state.brands.concat(state.rows.some(r => r.BEV != null) ? ["BEV"] : []);
  const csv = ["year," + cols.join(",")]
    .concat(state.rows.map(r => r.year + "," + cols.map(c => r[c] == null ? "" : r[c]).join(",")))
    .join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = "bmw_data.csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { renderLineChart(); renderBevChart(); }, 150);
});

renderAll();
