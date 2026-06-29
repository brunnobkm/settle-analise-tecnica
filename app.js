/* ============================================================
   Análise Técnica · multi-tipo — shell único + mecânicas componíveis
   Mecânicas: produto = comparar/escolher SKU (matriz) · serviço/software = atende-não (checklist) · solução = seções
   ============================================================ */
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;
const clone = o => JSON.parse(JSON.stringify(o));
const ICO_OK = `<svg class="ico ok" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg>`;
const ICO_NO = `<svg class="ico no" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>`;
const ICO_ARROW = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11L11 5M6 5h5v5"/></svg>`;
const ICO_CHAT = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M3 4h10v7H8l-3 2v-2H3z"/></svg>`;
const ICO_PLUS = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 3v10M3 8h10"/></svg>`;
const ICO_TRASH = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.5 8h6l.5-8M6.5 7v3.5M9.5 7v3.5"/></svg>`;
const ICO_LINK = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6.7 9.3l2.6-2.6M7 4.6l1-1a2.4 2.4 0 0 1 3.4 3.4l-1 1M9 11.4l-1 1a2.4 2.4 0 0 1-3.4-3.4l1-1"/></svg>`;
const ICO_WARN = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2.5l6 11H2l6-11z"/><path d="M8 6.5v3.2"/><path d="M8 11.6v.01"/></svg>`;
const PIN_SVG = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M6 2.5h4l-.8 3.5 2.3 2H4.5l2.3-2L6 2.5z"/><path d="M8 8v5.5"/></svg>`;

const TIPO_LABEL = { produto: "Produto", servico: "Serviço", software: "Software", solucao: "Solução" };
const tipoChip = t => `<span class="badge tipo-${t}">${TIPO_LABEL[t]}</span>`;

/* ---------- matriz (produto) ---------- */
function matrixOf(holder) {
  if (!holder._m) {
    const s = clone(REQS); (holder.overrides || []).forEach(o => s[o.ri].cells[o.ci] = { st: o.st, v: o.v, c: o.c });
    // requisitos identificados no edital cujo valor não foi extraído → entram como linhas com placeholder
    NAO_ANALISADAS.forEach(req => s.push({ req, exig: "", naoExtraido: true, modulo: "—", origem: { doc: "Edital — Termo de Referência", pag: "—", trecho: "A IA identificou a exigência deste requisito no edital, mas não conseguiu extrair o valor automaticamente." }, cells: SKUS.map(() => ({ st: "ne", v: "—" })) }));
    holder._m = s;
  }
  return holder._m;
}
function scoresFor(specs) {
  return SKUS.map((sku, i) => {
    let ok = 0, evaluable = 0, ne = 0; const diverg = [];
    specs.forEach(spec => {
      if (spec.exigNa || spec.naoExtraido) return;
      const cell = spec.cells[i];
      if (cell.st === "ok") { ok++; evaluable++; }
      else if (cell.st === "no") { evaluable++; diverg.push(spec.req); }
      else if (cell.st === "ne") ne++;
    });
    return { i, sku, ok, evaluable, ne, pct: evaluable ? Math.round(ok / evaluable * 100) : 0, diverg };
  });
}
const rankFor = sc => [...sc].sort((a, b) => b.pct - a.pct || a.ne - b.ne || b.ok - a.ok);
const bestOf = specs => rankFor(scoresFor(specs))[0];
const isConcordant = spec => new Set(spec.cells.filter(c => c.st === "ok" || c.st === "no").map(c => c.st)).size <= 1;

/* ---------- checklist (serviço / software) ---------- */
function checklistSummary(cl) {
  const ev = cl.filter(r => ["ok", "no", "parcial"].includes(r.st));
  const ok = cl.filter(r => r.st === "ok").length, no = cl.filter(r => r.st === "no").length;
  return { ok, total: ev.length, no, status: no === 0 ? "ok" : "no", pct: ev.length ? Math.round(ok / ev.length * 100) : 0 };
}
const CL_ST = { ok: { cls: "ok", label: "Atende", ico: ICO_OK }, no: { cls: "bad", label: "Não atende", ico: ICO_NO }, parcial: { cls: "warn", label: "Atende parcialmente", ico: "" }, ne: { cls: "soft", label: "Não avaliado", ico: "" } };
const confBadge = c => c ? `<span class="badge ${c === "alta" ? "ok" : c === "media" ? "warn" : "bad"}" data-tip="Confiança da IA na extração">${cap(c === "media" ? "média" : c)}</span>` : `<span class="state-na">—</span>`;

/* ---------- resumo por item (adapta ao tipo) ---------- */
function itemSummary(i) {
  const it = ITEMS[i];
  if (it.tipo === "produto") { const best = bestOf(matrixOf(it)); return { kind: "produto", best, status: best.diverg.length === 0 ? "ok" : "no" }; }
  if (it.tipo === "servico" || it.tipo === "software") { const s = checklistSummary(it.checklist); return { kind: "check", ...s }; }
  const secs = it.sections.map(sec => sec.tipo === "produto" ? { tipo: "produto", ok: bestOf(matrixOf(sec)).diverg.length === 0 } : { tipo: sec.tipo, ok: checklistSummary(sec.checklist).status === "ok" });
  return { kind: "solucao", secs, status: secs.every(s => s.ok) ? "ok" : "no" };
}

/* ---------- estado ---------- */
const LS = "settle-at-prefs-v6";
let prefs = (() => { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch { return {}; } })();
const savePrefs = () => localStorage.setItem(LS, JSON.stringify(prefs));
prefs.chosen = prefs.chosen || {};
let statusFilter = prefs.filter || "all";
let tipoFilter = prefs.tipo || "produto";
let active = null, SPECS = null, STATE, RANKED, ORDER, BEST, activeMatrixHolder = null;
let currentChecklists = [];
let colW = prefs.colW || {};
let frozen = new Set(prefs.frozen || ["req", "val"]);
const COLW = k => colW[k] || (k === "check" ? 44 : k === "req" ? 300 : k === "val" ? 160 : k === "acoes" ? 84 : 176);
const saveCols = () => { prefs.colW = colW; prefs.frozen = [...frozen]; savePrefs(); };
let renderPending = false;
const scheduleRender = () => { if (!renderPending) { renderPending = true; requestAnimationFrame(() => { renderPending = false; renderMatrix(); }); } };
function recompute() { STATE = scoresFor(SPECS); RANKED = rankFor(STATE); ORDER = RANKED.map(s => s.i); BEST = RANKED[0]; window.SCORES = STATE; }

/* valores do item (a partir do preço unitário) */
ITEMS.forEach(it => { const q = parseFloat(it.quantidade) || 1, fmt = n => "R$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: 2 }); it.valorUnitario = it.precoUnit ? { v: fmt(it.precoUnit) } : { v: "—" }; it.valorTotal = it.precoUnit ? { v: fmt(it.precoUnit * q) } : { v: "—" }; });

/* ============================================================
   Resumo do edital (stats) + grid de cards
   ============================================================ */
function renderStats(ofType) {
  const total = ofType.length;
  const atend = ofType.filter(x => itemSummary(x.i).status === "ok").length;
  const nao = total - atend;
  const I = {
    target: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="3"/><circle cx="8" cy="8" r="0.6" fill="currentColor"/></svg>`,
    layers: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M8 2l6 3-6 3-6-3 6-3z"/><path d="M2 8l6 3 6-3"/></svg>`,
    check: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg>`,
    cross: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>`,
  };
  const cards = [
    { ico: "brand", svg: I.target, n: total, label: "Itens com correspondência" },
    { ico: "", svg: I.layers, n: total, label: "Itens com análise técnica" },
    { ico: "ok", svg: I.check, n: atend, label: "Itens atendidos" },
    { ico: "bad", svg: I.cross, n: nao, label: "Itens não atendidos" },
  ];
  $("#stats").innerHTML = cards.map(c => `<div class="stat" data-tip="${c.label}"><div class="stat-top"><div class="stat-ico ${c.ico}">${c.svg}</div><div class="stat-n">${c.n}</div></div><div class="stat-label">${c.label}</div></div>`).join("");
}
function renderGrid() {
  $("#crumbId").textContent = `Edital ${EDITAL.numero}`;
  const ofType = ITEMS.map((it, i) => ({ it, i })).filter(x => x.it.tipo === tipoFilter);
  renderStats(ofType);
  const html = ofType.map(({ it, i }) => {
    const sum = itemSummary(i);
    if (statusFilter !== "all" && sum.status !== statusFilter) return "";
    const chosenIdx = prefs.chosen[i];
    const analyBadge = (sum.kind === "produto")
      ? `<span class="badge soft" data-tip="Produtos do seu catálogo comparados com este item">${SKUS.length} produtos analisados</span>`
      : `<span class="badge soft">${it.checklist.length} requisitos</span>`;
    const statusBadge = sum.status === "ok"
      ? `<span class="badge ok" data-tip="Você consegue atender este item">Atende</span>`
      : `<span class="badge bad" data-tip="Há exigência(s) que você não atende">Não atende</span>`;
    const chosenBadge = (sum.kind === "produto" && chosenIdx != null) ? `<span class="badge brand">Produto selecionado</span>` : "";
    const qtyTxt = it.quantidade === "1" ? "1 unidade" : `${esc(it.quantidade)} unidades`;
    const bottom = (sum.kind === "produto")
      ? `<b>Recomendado:</b> <span style="font-family:var(--mono)">${esc(sum.best.sku.model)}</span> · ${esc(sum.best.sku.brand)}`
      : `<b>Atende</b> ${sum.ok} de ${sum.total} exigências`;
    return `<div class="item-card ${chosenIdx != null ? "selected" : ""}" data-item="${i}" data-tip="Abrir a análise completa deste item">
      <div class="ic-badges">${analyBadge}${statusBadge}${chosenBadge}</div>
      <div class="ic-desc">${esc(it.nome)}</div>
      <div class="ic-line"><b>Quantidade:</b> ${qtyTxt}</div>
      <div class="ic-line"><b>Valor unitário:</b> <span style="font-family:var(--mono)">${esc(it.valorUnitario.v)}</span> &nbsp;&nbsp; <b>Valor total:</b> <span style="font-family:var(--mono)">${esc(it.valorTotal.v)}</span></div>
      <div class="ic-reco">${bottom}</div>
    </div>`;
  }).join("");
  $("#cardGrid").innerHTML = html || `<div style="grid-column:1/-1;color:var(--muted-foreground);padding:24px;text-align:center">Nenhum item neste filtro.</div>`;
  [...$("#filterTabs").children].forEach(b => b.classList.toggle("active", b.dataset.filter === statusFilter));
}

/* ============================================================
   Overlay — despacha por mecânica
   ============================================================ */
function openTable(i) {
  active = i; const it = ITEMS[i];
  currentChecklists = []; SPECS = null; BEST = null; activeMatrixHolder = null;
  $("#toTitle").textContent = it.titulo || it.nome;

  if (it.tipo === "produto") { activeMatrixHolder = it; SPECS = matrixOf(it); recompute(); }
  let body = collapsiblesHTML(it);
  if (it.tipo === "produto") { body += `<div class="mech-host" id="matrixHost"></div>`; }
  else if (it.tipo === "servico" || it.tipo === "software") { currentChecklists = [it.checklist]; body += `<div class="mech-host" id="clHost-0"></div>`; }
  else {
    it.sections.forEach(sec => {
      body += `<div class="section-head">${esc(sec.titulo)}</div>`;
      if (sec.tipo === "produto") { activeMatrixHolder = sec; body += `<div class="mech-host" id="matrixHost"></div>`; }
      else { const idx = currentChecklists.length; currentChecklists.push(sec.checklist); body += `<div class="mech-host" id="clHost-${idx}"></div>`; }
    });
    if (activeMatrixHolder) { SPECS = matrixOf(activeMatrixHolder); recompute(); }
  }
  $("#toBody").innerHTML = body;
  if ($("#matrixHost")) renderMatrix();
  currentChecklists.forEach((c, idx) => renderChecklist($("#clHost-" + idx), c, idx));
  $("#tableOverlay").hidden = false;
}
const closeTable = () => { $("#tableOverlay").hidden = true; active = null; renderGrid(); };

/* ---------- Mecânica: matriz (produto) ---------- */
function buildCols() {
  const cols = [{ key: "check" }, { key: "req" }, { key: "val" }, ...ORDER.map(i => ({ key: "sku-" + i, skuIdx: i })), { key: "acoes" }];
  let fl = 0;
  cols.forEach(c => { c.w = COLW(c.key); c.frozen = c.key === "check" || frozen.has(c.key); });
  cols.forEach(c => { if (c.frozen) { c.left = fl; fl += c.w; } });
  const frz = cols.filter(c => c.frozen); if (frz.length) frz[frz.length - 1].edge = true;
  return cols;
}
const fzCls = c => c.frozen ? ` frozen${c.edge ? " frozen-edge" : ""}` : "";
const fzStyle = c => c.frozen ? ` style="left:${c.left}px"` : "";
const colCtrls = c => `<button class="col-pin ${c.frozen ? "on" : ""}" data-pin="${c.key}" data-tip="${c.frozen ? "Descongelar coluna" : "Congelar coluna (fixa ao rolar)"}">${PIN_SVG}</button><span class="col-resize" data-resize="${c.key}" data-tip="Arraste para redimensionar a largura"></span>`;
function cellTd(cell, ri, ci, exigNa, c) {
  if (exigNa) return `<td class="cell na-cell${fzCls(c)}"${fzStyle(c)}><span class="cell-val">${esc(cell.v)}</span></td>`;
  const icoInner = cell.st === "ok" ? ICO_OK : cell.st === "no" ? ICO_NO : "";
  const conf = (cell.st !== "ne" && cell.c) ? `<div class="conf ${cell.c}" data-tip="Confiança da IA na extração deste valor"><span class="dot"></span>${cap(cell.c)} confiança</div>` : "";
  return `<td class="cell ${cell.st}${fzCls(c)}"${fzStyle(c)}><div class="cell-line"><button class="ico-toggle ${cell.st}" data-toggle data-ri="${ri}" data-ci="${ci}" data-tip="Clique para alternar: atende → não atende → não extraído">${icoInner}</button><span class="cell-val editable" data-edit="v" data-ri="${ri}" data-ci="${ci}" contenteditable="true" data-tip="Clique para corrigir o valor extraído">${esc(cell.v)}</span></div>${conf}</td>`;
}
function renderMatrix() {
  const host = $("#matrixHost"); if (!host) return;
  const cols = buildCols(), chosenIdx = prefs.chosen[active], totalW = cols.reduce((s, c) => s + c.w, 0);
  const colgroup = `<colgroup>${cols.map(c => `<col data-k="${c.key}" style="width:${c.w}px">`).join("")}</colgroup>`;
  let head = "";
  cols.forEach(c => {
    if (c.key === "check") head += `<th class="col-check${fzCls(c)}"${fzStyle(c)}><span class="cbox" data-tip="Selecionar todos"></span></th>`;
    else if (c.key === "req") head += `<th class="col-req${fzCls(c)}"${fzStyle(c)}>Especificações do edital${colCtrls(c)}</th>`;
    else if (c.key === "val") head += `<th class="col-val${fzCls(c)}"${fzStyle(c)} data-tip="Valor que o edital exige para o requisito">Valor requerido${colCtrls(c)}</th>`;
    else if (c.key === "acoes") head += `<th class="col-acoes">Ações</th>`;
    else {
      const idx = c.skuIdx, sc = STATE[idx], rank = ORDER.indexOf(idx), best = rank === 0, isChosen = chosenIdx === idx;
      head += `<th class="col-sku${best ? " best" : ""}${isChosen ? " chosen" : ""}${fzCls(c)}"${fzStyle(c)}>
        ${best ? `<div class="best-tag" data-tip="Produto com maior aderência">★ Recomendado</div>` : `<div class="sku-rank">${rank + 1}º</div>`}
        <div class="sku-model">${esc(sc.sku.model)}</div><div class="sku-brand" data-tip="Fabricante (info do SKU, não é requisito)">${esc(sc.sku.brand)}</div>
        <div class="sku-scoreline" data-tip="Requisitos atendidos e percentual de aderência"><span class="score-frac">${sc.ok}/${sc.evaluable}${sc.ne ? ` · ${sc.ne} n/e` : ""}</span><span class="score-pct">${sc.pct}%</span></div>
        <div class="score-bar"><span class="score-fill" style="width:${sc.pct}%"></span></div>
        <button class="sku-select${isChosen ? " on" : ""}" data-choose="${idx}" data-tip="Definir como produto escolhido">${isChosen ? "✓ Selecionado" : "Selecionar"}</button>${colCtrls(c)}</th>`;
    }
  });
  let body = "";
  SPECS.forEach((spec, ri) => {
    if (spec.exigNa) return;
    const nx = !!spec.naoExtraido;
    let row = `<tr class="${isConcordant(spec) ? "concordant" : ""}${nx ? " row-missing" : ""}">`;
    cols.forEach(c => {
      if (c.key === "check") row += `<td class="col-check${fzCls(c)}"${fzStyle(c)}><span class="cbox" data-tip="Selecionar requisito"></span></td>`;
      else if (c.key === "req") row += `<td class="col-req${fzCls(c)}"${fzStyle(c)}><div class="req-head"><span class="req-name editable" data-edit="r" data-ri="${ri}" contenteditable="true" data-tip="Clique para editar o requisito">${esc(spec.req)}</span><button class="req-ico${nx ? " warn" : ""}" data-origin="${ri}" data-tip="${nx ? "Não conseguimos extrair essa informação. Selecione um trecho para extrair o dado." : "Ver de onde a IA extraiu (página e trecho)"}">${nx ? ICO_WARN : ICO_ARROW}</button></div></td>`;
      else if (c.key === "val") row += nx
        ? `<td class="col-val${fzCls(c)}"${fzStyle(c)}><span class="val-missing editable" data-edit="vr" data-ri="${ri}" contenteditable="true" data-tip="A IA identificou esta exigência no edital, mas não conseguiu extrair o valor. Clique para informar o valor requerido.">${ICO_WARN} Valor não extraído</span></td>`
        : `<td class="col-val${fzCls(c)}"${fzStyle(c)}><span class="editable" data-edit="vr" data-ri="${ri}" contenteditable="true" data-tip="Clique para corrigir o valor exigido">${esc(spec.exig)}</span></td>`;
      else if (c.key === "acoes") row += `<td class="col-acoes"><div class="acoes-cell"><button class="act-ico danger" data-delreq="${ri}" data-tip="Excluir este requisito">${ICO_TRASH}</button><button class="act-ico" data-origin="${ri}" data-tip="${nx ? "Não conseguimos extrair essa informação. Selecione um trecho para extrair o dado." : "Vincular / ver fonte no edital"}">${ICO_LINK}</button></div></td>`;
      else if (nx) row += `<td class="cell na-cell${fzCls(c)}"${fzStyle(c)}><span class="cell-muted" data-tip="Sem valor requerido extraído, não é possível comparar este produto">— aguardando valor</span></td>`;
      else row += cellTd(spec.cells[c.skuIdx], ri, c.skuIdx, spec.exigNa, c);
    });
    body += row + `</tr>`;
  });
  host.innerHTML = `<div class="table-wrap"><table class="cmp" style="width:${totalW}px">${colgroup}<thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>
    <div class="add-req" id="addReq" data-tip="Adicionar um requisito que a IA não extraiu">${ICO_PLUS} Adicionar requisito</div>`;
}

/* ---------- Seções colapsáveis (topo do overlay) ---------- */
const CARET = `<svg class="caret-svg" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10l4-4 4 4"/></svg>`;
function collapsible(title, inner, count, open) {
  return `<details class="cps"${open ? " open" : ""}><summary><span class="cps-title">${title}</span>${count != null ? `<span class="cps-cnt">${count}</span>` : ""}${CARET}</summary><div class="cps-body">${inner}</div></details>`;
}
function tagList(items, note) {
  return `${note ? `<div class="ex-note">${note}</div>` : ""}<div class="tag-list">${items.map(t => `<span class="tag-item">${esc(t)}</span>`).join("")}</div>`;
}
function collapsiblesHTML(it) {
  let html = collapsible("Descrição completa", `<p class="cps-desc">${esc(it.nome)}</p><p class="cps-desc">${esc(it.resumoTR)}</p>`, null, true);
  if (it.tipo === "produto") {
    const naoExigidas = [...(SPECS || matrixOf(it)).filter(s => s.exigNa).map(s => s.req), ...CATALOGO_NAO_EDITAL];
    html += collapsible("Especificações não exigidas pelo edital", tagList(naoExigidas, ""), null);
  }
  return `<div class="to-collapsibles">${html}</div>`;
}

/* ---------- Mecânica: checklist (serviço / software) ---------- */
function renderChecklist(host, clArr, sec) {
  if (!host) return;
  const rows = clArr.map((r, ri) => {
    const st = CL_ST[r.st] || CL_ST.ne;
    return `<tr>
      <td class="c-check"><span class="cbox"></span></td>
      <td class="c-req"><div class="req-name">${esc(r.req)}</div><div class="req-exig">Exigido: <span class="val">${esc(r.exig)}</span></div><div class="cl-actions"><button class="req-origin" data-clorigin="${sec}:${ri}" data-tip="Ver de onde a IA extraiu (página e trecho)">${ICO_ARROW} Ver no edital · p.${r.origem.pag}</button><button class="req-origin" data-clquestion="${sec}:${ri}" data-tip="Questionar / impugnar este requisito">${ICO_CHAT} Questionar</button></div></td>
      <td><span class="badge soft">${esc(r.modulo || "—")}</span></td>
      <td><button class="badge ${st.cls} clickable-badge" data-clstatus="${sec}:${ri}" data-tip="Clique para alternar o status">${st.ico}${st.label}</button></td>
      <td>${confBadge(r.c)}</td>
      <td class="c-just">${esc(r.just || "—")}</td>
      <td><span class="badge soft with-avatar">Selecionar</span></td>
    </tr>`;
  }).join("");
  host.innerHTML = `<div class="dt-wrap"><table class="dt"><thead><tr><th class="c-check"><span class="cbox"></span></th><th class="c-req">Requisito</th><th>Módulo</th><th>Status</th><th>Confiança IA</th><th class="c-just">Justificativa IA</th><th>Responsável</th></tr></thead><tbody>${rows}</tbody></table><div class="dt-foot" data-addcl="${sec}">${ICO_PLUS} Adicionar requisito</div></div>`;
}

/* ============================================================
   Origem (genérico)
   ============================================================ */
let extractRi = null, pendingExtract = null;
const FILE_SVG = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 2h6l3 3v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/><path d="M10 2v3h3"/></svg>`;
function openOriginSpec(spec, ri) {
  extractRi = null; pendingExtract = null;
  $("#drawerHead").textContent = "Visualização do arquivo";
  $("#drawerBody").innerHTML = `<div class="file-preview-empty">${FILE_SVG}<span>Visualização do arquivo</span></div>`;
  $("#drawerOverlay").hidden = false; $("#drawer").hidden = false;
}
const closeOrigin = () => { $("#drawerOverlay").hidden = true; $("#drawer").hidden = true; extractRi = null; pendingExtract = null; };

let toastT;
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2400); }

/* ============================================================
   Edição inline + interações
   ============================================================ */
function commitEdit(el) {
  const ri = +el.dataset.ri, kind = el.dataset.edit, txt = el.textContent.trim();
  if (kind === "r") SPECS[ri].req = txt || "Requisito";
  else if (kind === "vr") {
    if (SPECS[ri].exigNa) return;
    const wasMissing = SPECS[ri].naoExtraido;
    if (wasMissing && txt) { SPECS[ri].naoExtraido = false; SPECS[ri].exig = txt; recompute(); renderMatrix(); toast(`Valor informado para "${SPECS[ri].req}" — produtos liberados para comparação`); }
    else SPECS[ri].exig = txt;
  }
  else if (kind === "v") { const cc = SPECS[ri].cells[+el.dataset.ci]; cc.v = txt || "—"; cc.c = "alta"; }
}
function toggleStatus(ri, ci) {
  const cc = SPECS[ri].cells[ci];
  cc.st = cc.st === "ne" ? "ok" : cc.st === "ok" ? "no" : "ne";
  if (cc.st === "ne") cc.v = "—"; if (!cc.c) cc.c = "alta";
  recompute(); renderMatrix();
}
function addReq() {
  SPECS.push({ req: "Novo requisito", exig: "", exigNa: false, added: true, origem: { doc: "Inserido manualmente", pag: "—" }, cells: SKUS.map(() => ({ st: "ne", v: "—" })) });
  renderMatrix();
  const rows = $("#matrixHost").querySelectorAll("tbody tr"); const nameEl = rows[rows.length - 1]?.querySelector('[data-edit="r"]');
  if (nameEl) { nameEl.focus(); document.getSelection().selectAllChildren(nameEl); }
}
const CL_CYCLE = { ok: "no", no: "parcial", parcial: "ne", ne: "ok" };
function toggleClStatus(sec, ri) { const r = currentChecklists[sec][ri]; r.st = CL_CYCLE[r.st] || "ok"; renderChecklist($("#clHost-" + sec), currentChecklists[sec], sec); }
function addClReq(sec) { currentChecklists[sec].push({ req: "Novo requisito", exig: "", modulo: "—", st: "ne", c: null, just: "—", origem: { doc: "Inserido manualmente", pag: "—" } }); renderChecklist($("#clHost-" + sec), currentChecklists[sec], sec); }

/* ============================================================
   Wire
   ============================================================ */
function wire() {
  $("#filterTabs").addEventListener("click", e => { const b = e.target.closest("[data-filter]"); if (b) { statusFilter = b.dataset.filter; prefs.filter = statusFilter; savePrefs(); renderGrid(); } });
  $("#cardGrid").addEventListener("click", e => { const c = e.target.closest("[data-item]"); if (c) openTable(+c.dataset.item); });

  $("#toClose").onclick = closeTable;
  $("#toExport").onclick = () => toast("Exportando análise (PDF · planilha · resumo técnico)…");
  $("#toShare").onclick = () => toast("Link da análise copiado — compartilhe para validação (engenharia, fornecedor, gestor)");

  const tb = $("#toBody");
  tb.addEventListener("pointerdown", e => {
    const rz = e.target.closest("[data-resize]"); if (!rz) return;
    e.preventDefault(); rz.classList.add("active");
    const key = rz.dataset.resize, startX = e.clientX, startW = COLW(key);
    const move = ev => { colW[key] = Math.max(90, Math.round(startW + (ev.clientX - startX))); scheduleRender(); };
    const up = () => { saveCols(); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); renderMatrix(); };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
  });
  tb.addEventListener("click", e => {
    const pin = e.target.closest("[data-pin]"); if (pin) { const k = pin.dataset.pin; frozen.has(k) ? frozen.delete(k) : frozen.add(k); saveCols(); renderMatrix(); return; }
    const tg = e.target.closest("[data-toggle]"); if (tg) { toggleStatus(+tg.dataset.ri, +tg.dataset.ci); return; }
    const ch = e.target.closest("[data-choose]"); if (ch) { const i = +ch.dataset.choose; prefs.chosen[active] = (prefs.chosen[active] === i) ? undefined : i; if (prefs.chosen[active] == null) delete prefs.chosen[active]; savePrefs(); renderMatrix(); toast(prefs.chosen[active] != null ? `Produto escolhido: ${SKUS[i].model}` : "Seleção removida"); return; }
    const or = e.target.closest("[data-origin]"); if (or) { const ri = +or.dataset.origin; openOriginSpec(SPECS[ri], ri); return; }
    const dl = e.target.closest("[data-delreq]"); if (dl) { const ri = +dl.dataset.delreq; const nm = SPECS[ri].req; SPECS.splice(ri, 1); recompute(); renderMatrix(); toast(`Requisito removido: "${nm}"`); return; }
    const q = e.target.closest("[data-question]"); if (q) { toast(`Abrindo questionamento/impugnação — "${SPECS[+q.dataset.question].req}" (referente ao edital)`); return; }
    if (e.target.closest("#addReq")) { addReq(); return; }
    const cs = e.target.closest("[data-clstatus]"); if (cs) { const [s, r] = cs.dataset.clstatus.split(":").map(Number); toggleClStatus(s, r); return; }
    const co = e.target.closest("[data-clorigin]"); if (co) { const [s, r] = co.dataset.clorigin.split(":").map(Number); openOriginSpec(currentChecklists[s][r]); return; }
    const cq = e.target.closest("[data-clquestion]"); if (cq) { const [s, r] = cq.dataset.clquestion.split(":").map(Number); toast(`Abrindo questionamento/impugnação — "${currentChecklists[s][r].req}" (referente ao edital)`); return; }
    const ac = e.target.closest("[data-addcl]"); if (ac) { addClReq(+ac.dataset.addcl); return; }
  });
  tb.addEventListener("focusout", e => { const el = e.target.closest("[data-edit]"); if (el) commitEdit(el); });
  tb.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.closest("[data-edit]")) { e.preventDefault(); e.target.blur(); } });

  $("#drawerClose").onclick = closeOrigin; $("#drawerOverlay").onclick = closeOrigin;
  $("#drawerBody").addEventListener("mouseup", () => {
    if (extractRi == null) return;
    const doc = $("#extractDoc"), acts = $("#extractActions"); if (!doc || !acts) return;
    const sel = window.getSelection(), txt = sel.toString().trim();
    if (!txt || !doc.contains(sel.anchorNode)) { acts.hidden = true; pendingExtract = null; return; }
    pendingExtract = txt; $("#extractSel").textContent = `“${txt}”`; acts.hidden = false;
  });
  $("#drawerBody").addEventListener("click", e => {
    if (!e.target.closest("#extractConfirm") || extractRi == null || !pendingExtract) return;
    const ri = extractRi, val = pendingExtract, nm = SPECS[ri].req;
    SPECS[ri].naoExtraido = false; SPECS[ri].exig = val;
    SPECS[ri].origem = { doc: EDITAL.docNome || "Edital — Termo de Referência", pag: "—", trecho: val };
    recompute(); renderMatrix(); closeOrigin();
    toast(`Valor extraído para "${nm}" — produtos liberados para comparação`);
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { if (!$("#drawer").hidden) closeOrigin(); else if (!$("#tableOverlay").hidden) closeTable(); } });
}

/* ============================================================
   Editar informações (lado a lado com o edital) + vincular fonte
   ============================================================ */
const LINK_SVG = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6.5 9.5l3-3M5 8L3.5 9.5a2.1 2.1 0 0 0 3 3L8 11M11 8l1.5-1.5a2.1 2.1 0 0 0-3-3L8 5"/></svg>`;
let editList = [], esActive = null, pendingText = null, pendingRange = null;
function currentReqList() { if (SPECS) return SPECS.filter(s => !s.exigNa); if (currentChecklists.length) return currentChecklists[0]; return []; }
function renderEsFields() {
  $("#esFields").innerHTML = editList.map((s, i) => `
    <div class="es-field ${i === esActive ? "active" : ""}" data-ef="${i}">
      <label>${esc(s.req)}</label>
      <input class="inp" value="${esc(s.exig || "")}" placeholder="Informe o valor esperado" data-eival="${i}">
      <button class="es-link ${s.fonte ? "linked" : ""}" data-eilink="${i}">${LINK_SVG} ${s.fonte ? "Fonte vinculada" : "Vincular fonte no edital"}</button>
    </div>`).join("");
}
function openEditSheet() {
  editList = currentReqList();
  if (!editList.length) { toast("Nada para editar neste item"); return; }
  esActive = null; pendingText = null;
  $("#esDesc").textContent = ITEMS[active].nome;
  $("#esDoc").innerHTML = esc(EDITAL.docTexto);
  $("#esDocHint").textContent = "Selecione um trecho para vincular como fonte";
  renderEsFields();
  $("#editSheet").hidden = false;
}
function hidePopover() { $("#fontePopover").hidden = true; pendingText = null; pendingRange = null; }
function saveEditSheet() {
  if (SPECS) { recompute(); if ($("#matrixHost")) renderMatrix(); }
  else currentChecklists.forEach((c, i) => renderChecklist($("#clHost-" + i), c, i));
  $("#editSheet").hidden = true; hidePopover();
  toast("Análise de compatibilidade atualizada com os novos dados");
}
function initEditSheet() {
  $("#toEdit").onclick = openEditSheet;
  $("#esClose").onclick = () => { $("#editSheet").hidden = true; hidePopover(); };
  $("#esSave").onclick = saveEditSheet;
  $("#esFields").addEventListener("input", e => { const el = e.target.closest("[data-eival]"); if (el) editList[+el.dataset.eival].exig = el.value; });
  $("#esFields").addEventListener("click", e => {
    const lk = e.target.closest("[data-eilink]"); if (!lk) return;
    esActive = +lk.dataset.eilink; renderEsFields();
    $("#esDocHint").textContent = `Selecione no edital o trecho que comprova: "${editList[esActive].req}"`;
  });
  $("#esDoc").addEventListener("mouseup", () => {
    const sel = window.getSelection(), txt = sel.toString().trim();
    if (!txt || esActive == null || !$("#esDoc").contains(sel.anchorNode)) { hidePopover(); return; }
    pendingText = txt; pendingRange = sel.getRangeAt(0).cloneRange();
    const r = sel.getRangeAt(0).getBoundingClientRect(), pop = $("#fontePopover");
    pop.hidden = false;
    pop.style.top = Math.max(8, r.top - pop.offsetHeight - 8) + "px";
    pop.style.left = Math.max(8, Math.min(r.left + r.width / 2 - pop.offsetWidth / 2, innerWidth - pop.offsetWidth - 8)) + "px";
  });
  $("#fontePopover").addEventListener("click", e => {
    const b = e.target.closest("[data-fonte]"); if (!b) return;
    if (b.dataset.fonte === "confirm" && pendingText != null && esActive != null) {
      editList[esActive].fonte = pendingText;
      try { const m = document.createElement("mark"); m.className = "bound"; pendingRange.surroundContents(m); } catch (_) { }
      renderEsFields(); toast(`Fonte vinculada: "${editList[esActive].req}"`);
    }
    window.getSelection().removeAllRanges(); hidePopover();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#editSheet").hidden) { $("#editSheet").hidden = true; hidePopover(); } });
}

/* ---------- tooltip próprio ---------- */
function initTooltip() {
  const tip = document.createElement("div"); tip.className = "tt"; document.body.appendChild(tip);
  let cur = null;
  const place = el => { const r = el.getBoundingClientRect(); let top = r.top - tip.offsetHeight - 8; if (top < 6) top = r.bottom + 8; let left = r.left + r.width / 2 - tip.offsetWidth / 2; left = Math.max(6, Math.min(left, innerWidth - tip.offsetWidth - 6)); tip.style.top = top + "px"; tip.style.left = left + "px"; };
  const hide = () => { tip.classList.remove("show"); cur = null; };
  document.addEventListener("mouseover", e => {
    const el = e.target.closest("[data-tip],[title]"); if (!el || el === cur) return;
    if (el.hasAttribute("title")) { const t = el.getAttribute("title"); if (t) el.setAttribute("data-tip", t); el.removeAttribute("title"); }
    const txt = el.getAttribute("data-tip"); if (!txt) return;
    cur = el; tip.textContent = txt; tip.classList.add("show"); place(el);
  });
  document.addEventListener("mouseout", e => { if (cur && (!e.relatedTarget || !cur.contains(e.relatedTarget))) hide(); });
  document.addEventListener("click", hide);
  window.addEventListener("scroll", hide, true);
}

/* boot */
renderGrid(); wire(); initEditSheet(); initTooltip();
