<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fichaje Personal</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
/* ── RESET & VARIABLES ─────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:        #0e0e0e;
  --surface:   #161616;
  --card:      #1c1c1c;
  --border:    #2a2a2a;
  --accent:    #c8ff00;
  --accent2:   #ff6b35;
  --text:      #e8e8e8;
  --muted:     #666;
  --green:     #4ade80;
  --red:       #f87171;
  --yellow:    #fbbf24;
  --blue:      #60a5fa;
  --font-mono: 'DM Mono', monospace;
  --font-head: 'Syne', sans-serif;
}

html { font-size: 16px; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-mono);
  min-height: 100vh;
  overflow-x: hidden;
}

/* ── GRAIN OVERLAY ─────────────────────────────────────────── */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 999;
  opacity: 0.6;
}

/* ── HEADER ────────────────────────────────────────────────── */
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2rem;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 100;
}

.logo {
  font-family: var(--font-head);
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.logo-dot {
  width: 10px; height: 10px;
  background: var(--accent);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.clock {
  font-size: 1.5rem;
  font-weight: 300;
  letter-spacing: 0.05em;
  color: var(--accent);
}

/* ── NAV TABS ──────────────────────────────────────────────── */
nav {
  display: flex;
  gap: 0;
  padding: 0 2rem;
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
}
nav button {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  background: none;
  border: none;
  padding: 0.9rem 1.4rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;
}
nav button:hover { color: var(--text); }
nav button.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

/* ── MAIN ──────────────────────────────────────────────────── */
main { padding: 2rem; max-width: 1100px; margin: 0 auto; }

/* ── PANELS ────────────────────────────────────────────────── */
.panel { display: none; animation: fadeIn 0.3s ease; }
.panel.active { display: block; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

/* ── CARDS ─────────────────────────────────────────────────── */
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.card-title {
  font-family: var(--font-head);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 1rem;
}

/* ── GRID ──────────────────────────────────────────────────── */
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 640px) {
  .grid-3 { grid-template-columns: 1fr; }
  .grid-2 { grid-template-columns: 1fr; }
}

/* ── STAT CARD ─────────────────────────────────────────────── */
.stat {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 1.25rem;
}
.stat-label {
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 0.5rem;
}
.stat-value {
  font-family: var(--font-head);
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}
.stat-sub { font-size: 0.7rem; color: var(--muted); margin-top: 0.4rem; }

.positive { color: var(--green); }
.negative { color: var(--red); }
.neutral  { color: var(--accent); }
.warn     { color: var(--yellow); }

/* ── STATUS BADGE ──────────────────────────────────────────── */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.25rem 0.6rem;
  border-radius: 2px;
  border: 1px solid currentColor;
}
.badge-green  { color: var(--green); }
.badge-red    { color: var(--red); }
.badge-yellow { color: var(--yellow); }
.badge-blue   { color: var(--blue); }
.badge-accent { color: var(--accent); }
.badge-muted  { color: var(--muted); }

/* ── BIG STATUS (hoy) ──────────────────────────────────────── */
.today-status {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}
.today-time-block { text-align: center; }
.today-time-label { font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
.today-time-value { font-family: var(--font-head); font-size: 2.5rem; font-weight: 700; color: var(--accent); }

.divider-v { width: 1px; height: 60px; background: var(--border); }

/* ── PROGRESS BAR ──────────────────────────────────────────── */
.progress-wrap {
  background: var(--border);
  border-radius: 2px;
  height: 6px;
  overflow: hidden;
  margin: 0.5rem 0;
}
.progress-bar {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 0.5s ease;
}
.progress-bar.over { background: var(--green); }
.progress-bar.under { background: var(--red); }

/* ── TABLE ─────────────────────────────────────────────────── */
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
thead tr { border-bottom: 1px solid var(--border); }
th {
  text-align: left;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  padding: 0.75rem 0.75rem 0.75rem 0;
  font-weight: 400;
}
td { padding: 0.65rem 0.75rem 0.65rem 0; border-bottom: 1px solid #1f1f1f; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: rgba(255,255,255,0.02); }

/* ── BOTONES ───────────────────────────────────────────────── */
.btn {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.6rem 1.2rem;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
.btn-primary { background: var(--accent); color: #000; }
.btn-primary:hover { background: #deff33; }
.btn-ghost { background: transparent; color: var(--text); border: 1px solid var(--border); }
.btn-ghost:hover { border-color: var(--text); }
.btn-danger { background: transparent; color: var(--red); border: 1px solid var(--red); }
.btn-danger:hover { background: var(--red); color: #000; }
.btn-sm { padding: 0.35rem 0.7rem; font-size: 0.65rem; }

/* ── FORM ELEMENTS ─────────────────────────────────────────── */
.form-group { margin-bottom: 1rem; }
.form-label {
  display: block;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 0.4rem;
}
.form-input, .form-select {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 3px;
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  padding: 0.6rem 0.8rem;
  transition: border-color 0.2s;
  outline: none;
}
.form-input:focus, .form-select:focus { border-color: var(--accent); }
.form-select option { background: var(--surface); }

/* ── MODAL ─────────────────────────────────────────────────── */
.modal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  z-index: 500;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.modal-overlay.open { display: flex; }
.modal {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 2rem;
  width: 100%;
  max-width: 440px;
  animation: fadeIn 0.2s ease;
}
.modal-title {
  font-family: var(--font-head);
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}
.modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.5rem; }

/* ── CONFIG BANNER ─────────────────────────────────────────── */
.config-banner {
  background: rgba(255, 107, 53, 0.1);
  border: 1px solid var(--accent2);
  border-radius: 4px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.8rem;
  color: var(--accent2);
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

/* ── CALENDAR ──────────────────────────────────────────────── */
.cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}
.cal-month {
  font-family: var(--font-head);
  font-size: 1.2rem;
  font-weight: 700;
}
.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}
.cal-day-name {
  font-size: 0.6rem;
  text-align: center;
  color: var(--muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding-bottom: 0.5rem;
}
.cal-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  font-size: 0.75rem;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s;
  position: relative;
  gap: 2px;
}
.cal-day:hover:not(.empty):not(.weekend) { border-color: var(--border); background: var(--surface); }
.cal-day.empty { cursor: default; }
.cal-day.weekend { color: var(--muted); cursor: default; }
.cal-day.today { border-color: var(--accent); color: var(--accent); }
.cal-day .dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
}
.cal-day.has-fichaje .dot { background: var(--green); }
.cal-day.has-ausencia .dot { background: var(--yellow); }
.cal-day.vacaciones .dot { background: var(--blue); }
.cal-day.baja .dot { background: var(--red); }

/* ── TIPO AUSENCIA PILLS ───────────────────────────────────── */
.tipo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin: 0.75rem 0;
}
.tipo-pill {
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 0.5rem;
  text-align: center;
  cursor: pointer;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  transition: all 0.15s;
  background: none;
  color: var(--muted);
  font-family: var(--font-mono);
}
.tipo-pill:hover { border-color: var(--text); color: var(--text); }
.tipo-pill.selected { border-color: var(--accent); color: var(--accent); background: rgba(200,255,0,0.07); }

/* ── CONFIG ────────────────────────────────────────────────── */
.config-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
  gap: 1rem;
  flex-wrap: wrap;
}
.config-row:last-child { border-bottom: none; }
.config-label { font-size: 0.85rem; }
.config-desc { font-size: 0.7rem; color: var(--muted); margin-top: 0.2rem; }
.config-input {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 3px;
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  padding: 0.5rem 0.75rem;
  outline: none;
  width: 300px;
  max-width: 100%;
}
.config-input:focus { border-color: var(--accent); }

/* ── TOAST ─────────────────────────────────────────────────── */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: 4px;
  padding: 0.9rem 1.25rem;
  font-size: 0.8rem;
  z-index: 1000;
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.3s ease;
  max-width: 300px;
}
.toast.show { transform: translateY(0); opacity: 1; }
.toast.error { border-left-color: var(--red); }

/* ── SPINNER ───────────────────────────────────────────────── */
.spinner {
  display: inline-block;
  width: 14px; height: 14px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── EMPTY STATE ───────────────────────────────────────────── */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--muted);
  font-size: 0.8rem;
}
.empty-icon { font-size: 2rem; margin-bottom: 0.75rem; }

/* ── SCROLLBAR ─────────────────────────────────────────────── */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
</style>
</head>
<body>

<!-- ── HEADER ──────────────────────────────────────────────── -->
<header>
  <div class="logo">
    <div class="logo-dot" id="statusDot"></div>
    FICHAJE
  </div>
  <div class="clock" id="clock">--:--:--</div>
</header>

<!-- ── NAV ─────────────────────────────────────────────────── -->
<nav>
  <button class="active" onclick="showPanel('hoy')">Hoy</button>
  <button onclick="showPanel('mes')">Mes</button>
  <button onclick="showPanel('ausencias')">Ausencias</button>
  <button onclick="showPanel('config')">Config</button>
</nav>

<!-- ── MAIN ────────────────────────────────────────────────── -->
<main>

<!-- ╔══ PANEL: HOY ══════════════════════════════════════════╗ -->
<div id="panel-hoy" class="panel active">

  <div id="configBanner" class="config-banner" style="display:none">
    ⚠ Configura la URL de tu Google Apps Script en la pestaña <strong>Config</strong> para empezar.
    <button class="btn btn-ghost btn-sm" onclick="showPanel('config')">Ir a Config →</button>
  </div>

  <div class="card">
    <div class="card-title">Estado actual</div>
    <div class="today-status">
      <div class="today-time-block">
        <div class="today-time-label">Entrada</div>
        <div class="today-time-value" id="todayEntrada">--:--</div>
      </div>
      <div class="divider-v"></div>
      <div class="today-time-block">
        <div class="today-time-label">Tiempo trabajado</div>
        <div class="today-time-value" id="todayTrabajado">0h 00m</div>
      </div>
      <div class="divider-v"></div>
      <div class="today-time-block">
        <div class="today-time-label">Jornada objetivo</div>
        <div class="today-time-value" id="todayObjetivo">8h 15m</div>
      </div>
      <div class="divider-v"></div>
      <div class="today-time-block">
        <div class="today-time-label">Balance</div>
        <div class="today-time-value" id="todayBalance">--</div>
      </div>
    </div>
    <div style="margin-top:1.25rem;">
      <div style="display:flex;justify-content:space-between;font-size:0.7rem;color:var(--muted);margin-bottom:0.4rem;">
        <span>Progreso jornada</span>
        <span id="todayPct">0%</span>
      </div>
      <div class="progress-wrap">
        <div class="progress-bar" id="todayProgress" style="width:0%"></div>
      </div>
    </div>
    <div style="margin-top:1rem;display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
      <span id="todayBadge" class="badge badge-muted">SIN FICHAR</span>
      <button class="btn btn-primary" onclick="ficharManual()">
        ⏱ Fichar ahora
      </button>
      <button class="btn btn-ghost btn-sm" onclick="openEditModal()">Editar</button>
    </div>
  </div>

  <div class="card">
    <div class="card-title">Fichajes de hoy</div>
    <div id="fichajesHoy">
      <div class="empty-state">
        <div class="empty-icon">⏳</div>
        Sin fichajes hoy
      </div>
    </div>
  </div>

  <div class="grid-3">
    <div class="stat">
      <div class="stat-label">Esta semana</div>
      <div class="stat-value" id="semanaTotal">0h</div>
      <div class="stat-sub" id="semanaBalance">—</div>
    </div>
    <div class="stat">
      <div class="stat-label">Este mes</div>
      <div class="stat-value" id="mesTotal">0h</div>
      <div class="stat-sub" id="mesBalance">—</div>
    </div>
    <div class="stat">
      <div class="stat-label">Días trabajados</div>
      <div class="stat-value" id="diasTrabajados">0</div>
      <div class="stat-sub" id="diasMes">—</div>
    </div>
  </div>
</div>

<!-- ╔══ PANEL: MES ═══════════════════════════════════════════╗ -->
<div id="panel-mes" class="panel">
  <div class="card">
    <div class="cal-header">
      <button class="btn btn-ghost btn-sm" onclick="cambiarMes(-1)">← Ant</button>
      <div class="cal-month" id="calMonthTitle">Mayo 2025</div>
      <button class="btn btn-ghost btn-sm" onclick="cambiarMes(1)">Sig →</button>
    </div>
    <div class="cal-grid" id="calGrid"></div>
  </div>

  <div class="grid-3">
    <div class="stat">
      <div class="stat-label">Horas trabajadas</div>
      <div class="stat-value" id="mesResHoras">—</div>
    </div>
    <div class="stat">
      <div class="stat-label">Horas esperadas</div>
      <div class="stat-value" id="mesResEsperadas">—</div>
    </div>
    <div class="stat">
      <div class="stat-label">Balance mensual</div>
      <div class="stat-value" id="mesResBalance">—</div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">Detalle por día</div>
    <div class="table-wrap">
      <table id="mesTable">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Día</th>
            <th>Esperado</th>
            <th>Trabajado</th>
            <th>Balance</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody id="mesTableBody">
          <tr><td colspan="6" class="empty-state">Cargando…</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- ╔══ PANEL: AUSENCIAS ════════════════════════════════════╗ -->
<div id="panel-ausencias" class="panel">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
    <div>
      <div style="font-family:var(--font-head);font-weight:700;font-size:1.25rem;">Ausencias</div>
      <div style="font-size:0.75rem;color:var(--muted)">Teletrabajo, fuera de oficina, médico, vacaciones…</div>
    </div>
    <button class="btn btn-primary" onclick="openAusenciaModal()">+ Nueva ausencia</button>
  </div>

  <div class="card">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Nota</th>
            <th>Duración parcial</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="ausenciasTableBody">
          <tr><td colspan="5" class="empty-state">Cargando…</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- ╔══ PANEL: CONFIG ════════════════════════════════════════╗ -->
<div id="panel-config" class="panel">
  <div style="font-family:var(--font-head);font-weight:700;font-size:1.25rem;margin-bottom:1.5rem;">Configuración</div>

  <div class="card">
    <div class="card-title">Google Apps Script</div>
    <div class="config-row">
      <div>
        <div class="config-label">URL del Web App</div>
        <div class="config-desc">Pégala desde: Apps Script → Implementar → Gestionar implementaciones</div>
      </div>
      <input class="config-input" id="cfgUrl" type="text" placeholder="https://script.google.com/macros/s/…/exec"
        onchange="saveConfig()">
    </div>
  </div>

  <div class="card">
    <div class="card-title">Jornada laboral</div>
    <div class="config-row">
      <div>
        <div class="config-label">Lunes – Jueves</div>
        <div class="config-desc">Minutos de jornada estándar</div>
      </div>
      <input class="config-input" id="cfgLJ" type="number" value="495" style="width:120px" onchange="saveConfig()">
    </div>
    <div class="config-row">
      <div>
        <div class="config-label">Viernes</div>
        <div class="config-desc">Minutos de jornada en viernes</div>
      </div>
      <input class="config-input" id="cfgV" type="number" value="420" style="width:120px" onchange="saveConfig()">
    </div>
  </div>

  <div class="card">
    <div class="card-title">Instrucciones — Atajo iOS</div>
    <div style="font-size:0.8rem;line-height:1.8;color:var(--text);">
      <p style="margin-bottom:1rem;">Crea un <strong>Atajo de Siri</strong> con estos pasos en la app <em>Atajos</em>:</p>
      <ol style="padding-left:1.25rem;display:flex;flex-direction:column;gap:0.6rem;">
        <li>Abre <strong>Atajos</strong> → <strong>+</strong> → Nuevo atajo → nómbralo <em>"Fichar"</em></li>
        <li>Añade acción: <strong>Obtener contenido de URL</strong></li>
        <li>URL: <code id="iosUrl" style="background:var(--surface);padding:0.15rem 0.4rem;border-radius:2px;font-size:0.75rem;word-break:break-all;">TU_URL_AQUÍ?action=fichar</code></li>
        <li>Método: <strong>POST</strong> → Cuerpo tipo JSON → clave <code>action</code> = valor <code>fichar</code></li>
        <li>Añade acción: <strong>Mostrar resultado</strong> (muestra la respuesta)</li>
        <li>Opcionalmente: <strong>Añadir a pantalla de inicio</strong> o activarlo desde <strong>Acción de botón</strong> (iPhone 15 Pro+) o <strong>Dynamic Island</strong></li>
      </ol>
      <div style="margin-top:1.25rem;padding:0.75rem;background:var(--surface);border-left:2px solid var(--accent);font-size:0.75rem;">
        El atajo detecta automáticamente si es entrada o salida: si hay una entrada abierta hoy, registra la salida. Si no, registra la entrada.
      </div>
    </div>
  </div>

  <div style="display:flex;gap:1rem;flex-wrap:wrap;">
    <button class="btn btn-primary" onclick="testConexion()">Probar conexión</button>
    <button class="btn btn-ghost" onclick="loadAll()">↺ Recargar datos</button>
  </div>
</div>

</main>

<!-- ── MODAL: NUEVA AUSENCIA ──────────────────────────────── -->
<div class="modal-overlay" id="modalAusencia">
  <div class="modal">
    <div class="modal-title">Nueva ausencia</div>
    <div class="form-group">
      <label class="form-label">Fecha</label>
      <input class="form-input" id="ausenciaFecha" type="date">
    </div>
    <div class="form-group">
      <label class="form-label">Tipo</label>
      <div class="tipo-grid">
        <button class="tipo-pill" data-tipo="teletrabajo" onclick="selectTipo(this)">🏠 Teletrabajo</button>
        <button class="tipo-pill" data-tipo="fuera" onclick="selectTipo(this)">🏢 Fuera oficina</button>
        <button class="tipo-pill" data-tipo="vacaciones" onclick="selectTipo(this)">🌴 Vacaciones</button>
        <button class="tipo-pill" data-tipo="baja" onclick="selectTipo(this)">🏥 Baja / IT</button>
        <button class="tipo-pill" data-tipo="parcial" onclick="selectTipo(this)">⏱ Parcial</button>
        <button class="tipo-pill" data-tipo="otro" onclick="selectTipo(this)">📋 Otro</button>
      </div>
    </div>
    <div class="form-group" id="parcialMinGroup" style="display:none">
      <label class="form-label">Minutos de ausencia parcial</label>
      <input class="form-input" id="parcialMin" type="number" placeholder="ej: 90 (= 1h 30min)">
    </div>
    <div class="form-group">
      <label class="form-label">Nota (opcional)</label>
      <input class="form-input" id="ausenciaNota" type="text" placeholder="Médico, reunión externa…">
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal('modalAusencia')">Cancelar</button>
      <button class="btn btn-primary" onclick="guardarAusencia()">Guardar</button>
    </div>
  </div>
</div>

<!-- ── MODAL: EDITAR FICHAJE ──────────────────────────────── -->
<div class="modal-overlay" id="modalEdit">
  <div class="modal">
    <div class="modal-title">Editar fichaje de hoy</div>
    <div id="editFichajesList"></div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal('modalEdit')">Cerrar</button>
    </div>
  </div>
</div>

<!-- ── TOAST ────────────────────────────────────────────────── -->
<div class="toast" id="toast"></div>

<script>
// ── CONFIG ──────────────────────────────────────────────────
let CFG = {
  url: '',
  jornadaLJ: 495,   // 8h 15m
  jornadaV:  420    // 7h
};

function loadConfig() {
  const saved = localStorage.getItem('fichaje_cfg');
  if (saved) CFG = { ...CFG, ...JSON.parse(saved) };
  document.getElementById('cfgUrl').value = CFG.url || '';
  document.getElementById('cfgLJ').value  = CFG.jornadaLJ;
  document.getElementById('cfgV').value   = CFG.jornadaV;
  document.getElementById('iosUrl').textContent = (CFG.url || 'TU_URL_AQUÍ') + '?action=fichar';
  document.getElementById('configBanner').style.display = CFG.url ? 'none' : 'flex';
}

function saveConfig() {
  CFG.url       = document.getElementById('cfgUrl').value.trim();
  CFG.jornadaLJ = parseInt(document.getElementById('cfgLJ').value) || 495;
  CFG.jornadaV  = parseInt(document.getElementById('cfgV').value)  || 420;
  localStorage.setItem('fichaje_cfg', JSON.stringify(CFG));
  document.getElementById('iosUrl').textContent = (CFG.url || 'TU_URL_AQUÍ') + '?action=fichar';
  document.getElementById('configBanner').style.display = CFG.url ? 'none' : 'flex';
  toast('Configuración guardada');
}

// ── RELOJ ───────────────────────────────────────────────────
function tickClock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    String(now.getHours()).padStart(2,'0') + ':' +
    String(now.getMinutes()).padStart(2,'0') + ':' +
    String(now.getSeconds()).padStart(2,'0');
  updateLiveTrabajado();
}
setInterval(tickClock, 1000);
tickClock();

// ── API ─────────────────────────────────────────────────────
async function api(params, body = null) {
  if (!CFG.url) throw new Error('Configura la URL del Apps Script primero');
  const url = CFG.url + '?' + new URLSearchParams(params);
  const opts = body
    ? { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) }
    : { method: 'GET' };
  const res = await fetch(url, opts);
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json;
}

// ── HELPERS ─────────────────────────────────────────────────
function minToHM(min) {
  const h = Math.floor(Math.abs(min) / 60);
  const m = Math.abs(min) % 60;
  const sign = min < 0 ? '−' : '';
  return sign + h + 'h ' + String(m).padStart(2,'0') + 'm';
}

function today() {
  const d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth()+1).padStart(2,'0') + '-' +
    String(d.getDate()).padStart(2,'0');
}

function jornadaDia(fecha) {
  const dow = new Date(fecha + 'T12:00:00').getDay();
  if (dow === 5) return CFG.jornadaV;
  if (dow === 0 || dow === 6) return 0;
  return CFG.jornadaLJ;
}

const DIAS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

// ── ESTADO GLOBAL ────────────────────────────────────────────
let fichajesHoy = [];
let resumenMes  = null;
let ausenciasMes = [];
let currentMes = (() => {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0');
})();

// ── PANEL: HOY ───────────────────────────────────────────────
async function loadHoy() {
  if (!CFG.url) return;
  try {
    const res = await api({ action: 'getFichajes', fecha: today() });
    fichajesHoy = res.fichajes || [];
    renderFichajesHoy();
  } catch(e) { toast(e.message, true); }
}

function renderFichajesHoy() {
  const cont = document.getElementById('fichajesHoy');
  if (!fichajesHoy.length) {
    cont.innerHTML = '<div class="empty-state"><div class="empty-icon">⏳</div>Sin fichajes hoy</div>';
    updateTodayStats([]);
    return;
  }

  cont.innerHTML = fichajesHoy.map(f => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:0.6rem 0;border-bottom:1px solid var(--border);flex-wrap:wrap;gap:0.5rem;">
      <div style="display:flex;gap:1.5rem;align-items:center;">
        <span class="badge badge-green">ENTRADA ${f.Entrada}</span>
        ${f.Salida ? `<span class="badge badge-red">SALIDA ${f.Salida}</span>` : '<span class="badge badge-yellow">EN CURSO</span>'}
      </div>
      <span style="font-size:0.8rem;color:var(--muted)">${f.Minutos ? minToHM(parseInt(f.Minutos)) : '—'}</span>
    </div>
  `).join('');

  updateTodayStats(fichajesHoy);
}

function updateTodayStats(fs) {
  const jornada = jornadaDia(today());
  document.getElementById('todayObjetivo').textContent = minToHM(jornada);

  const entradaAbierta = fs.find(f => f.Entrada && !f.Salida);
  document.getElementById('todayEntrada').textContent = entradaAbierta ? entradaAbierta.Entrada : (fs[0]?.Entrada || '--:--');

  const totalMin = fs.reduce((s,f) => s + (parseInt(f.Minutos)||0), 0);
  document.getElementById('todayTrabajado').textContent = minToHM(totalMin);

  const balance = totalMin - jornada;
  const balEl = document.getElementById('todayBalance');
  balEl.textContent = (balance >= 0 ? '+' : '') + minToHM(balance);
  balEl.className = 'today-time-value ' + (balance >= 0 ? 'positive' : 'negative');

  const pct = jornada > 0 ? Math.min(100, Math.round(totalMin / jornada * 100)) : 0;
  document.getElementById('todayPct').textContent = pct + '%';
  const bar = document.getElementById('todayProgress');
  bar.style.width = pct + '%';
  bar.className = 'progress-bar ' + (pct >= 100 ? 'over' : pct < 50 ? 'under' : '');

  const badge = document.getElementById('todayBadge');
  if (entradaAbierta) {
    badge.textContent = '● EN OFICINA';
    badge.className = 'badge badge-green';
    document.getElementById('statusDot').style.background = 'var(--green)';
  } else if (fs.length) {
    badge.textContent = '✓ JORNADA CERRADA';
    badge.className = 'badge badge-muted';
    document.getElementById('statusDot').style.background = 'var(--accent)';
  } else {
    badge.textContent = 'SIN FICHAR';
    badge.className = 'badge badge-muted';
  }
}

let liveInterval = null;
function updateLiveTrabajado() {
  const abierta = fichajesHoy.find(f => f.Entrada && !f.Salida);
  if (!abierta) return;
  const [hh, mm] = abierta.Entrada.split(':').map(Number);
  const entrada = new Date();
  entrada.setHours(hh, mm, 0, 0);
  const min = Math.round((new Date() - entrada) / 60000);
  const completed = fichajesHoy.filter(f => f.Minutos).reduce((s,f) => s + (parseInt(f.Minutos)||0), 0);
  const total = completed + min;
  const jornada = jornadaDia(today());
  document.getElementById('todayTrabajado').textContent = minToHM(total);
  const balance = total - jornada;
  const balEl = document.getElementById('todayBalance');
  balEl.textContent = (balance >= 0 ? '+' : '') + minToHM(balance);
  balEl.className = 'today-time-value ' + (balance >= 0 ? 'positive' : 'negative');
  const pct = Math.min(100, Math.round(total / jornada * 100));
  document.getElementById('todayPct').textContent = pct + '%';
  document.getElementById('todayProgress').style.width = pct + '%';
}

async function ficharManual() {
  if (!CFG.url) { showPanel('config'); return; }
  try {
    toast('Fichando…');
    const res = await api({}, { action: 'fichar' });
    toast(res.tipo === 'entrada'
      ? `✓ Entrada registrada: ${res.hora}`
      : `✓ Salida registrada: ${res.hora} (${minToHM(res.minutos)})`
    );
    await loadHoy();
    await loadMes();
  } catch(e) { toast(e.message, true); }
}

// ── EDITAR FICHAJE ───────────────────────────────────────────
function openEditModal() {
  const cont = document.getElementById('editFichajesList');
  if (!fichajesHoy.length) {
    cont.innerHTML = '<div class="empty-state">Sin fichajes hoy para editar</div>';
  } else {
    cont.innerHTML = fichajesHoy.map(f => `
      <div style="margin-bottom:1.25rem;padding-bottom:1.25rem;border-bottom:1px solid var(--border);">
        <div style="font-size:0.7rem;color:var(--muted);margin-bottom:0.75rem;">Fichaje ${f.Entrada}</div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Entrada</label>
            <input class="form-input" id="editEnt_${f.ID}" type="time" value="${f.Entrada}">
          </div>
          <div class="form-group">
            <label class="form-label">Salida</label>
            <input class="form-input" id="editSal_${f.ID}" type="time" value="${f.Salida||''}">
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="guardarEditFichaje('${f.ID}')">Guardar</button>
      </div>
    `).join('');
  }
  document.getElementById('modalEdit').classList.add('open');
}

async function guardarEditFichaje(id) {
  const entrada = document.getElementById('editEnt_' + id)?.value;
  const salida  = document.getElementById('editSal_' + id)?.value;
  try {
    await api({}, { action: 'editFichaje', id, entrada, salida });
    toast('✓ Fichaje actualizado');
    closeModal('modalEdit');
    await loadHoy();
  } catch(e) { toast(e.message, true); }
}

// ── PANEL: MES ───────────────────────────────────────────────
async function loadMes() {
  if (!CFG.url) return;
  try {
    resumenMes = await api({ action: 'getResumen', mes: currentMes });
    renderCalendario();
    renderMesTable();
    renderMesStats();
    renderSemanaStats();
  } catch(e) { toast(e.message, true); }
}

function renderMesStats() {
  if (!resumenMes) return;
  document.getElementById('mesResHoras').textContent    = minToHM(resumenMes.totalTrabajados);
  document.getElementById('mesResEsperadas').textContent = minToHM(resumenMes.totalEsperados);
  const bal = resumenMes.balanceTotal;
  const el = document.getElementById('mesResBalance');
  el.textContent = (bal >= 0 ? '+' : '') + minToHM(bal);
  el.className = 'stat-value ' + (bal >= 0 ? 'positive' : 'negative');

  const dias = resumenMes.dias || [];
  document.getElementById('mesTotal').textContent = minToHM(resumenMes.totalTrabajados);
  document.getElementById('mesBalance').textContent = (bal >= 0 ? '+' : '') + minToHM(bal);
  document.getElementById('diasTrabajados').textContent = dias.filter(d => d.trabajados > 0).length;
  document.getElementById('diasMes').textContent = dias.length + ' días laborables';
}

function renderSemanaStats() {
  if (!resumenMes) return;
  const dias = resumenMes.dias || [];
  const hoy  = new Date();
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - (hoy.getDay() === 0 ? 6 : hoy.getDay() - 1));

  let semTrabajados = 0, semEsperados = 0;
  dias.forEach(d => {
    const fd = new Date(d.fecha + 'T12:00:00');
    if (fd >= lunes && fd <= hoy) {
      semTrabajados += d.trabajados;
      semEsperados  += d.esperados;
    }
  });
  document.getElementById('semanaTotal').textContent   = minToHM(semTrabajados);
  const semBal = semTrabajados - semEsperados;
  const semBalEl = document.getElementById('semanaBalance');
  semBalEl.textContent = (semBal >= 0 ? '+' : '') + minToHM(semBal);
  semBalEl.className = 'stat-sub ' + (semBal >= 0 ? 'positive' : 'negative');
}

function renderCalendario() {
  const [year, month] = currentMes.split('-').map(Number);
  document.getElementById('calMonthTitle').textContent = MESES[month-1] + ' ' + year;

  const grid = document.getElementById('calGrid');
  const diasNombre = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
  grid.innerHTML = diasNombre.map(d => `<div class="cal-day-name">${d}</div>`).join('');

  const primerDia = new Date(year, month-1, 1).getDay();
  const offset    = primerDia === 0 ? 6 : primerDia - 1;
  for (let i = 0; i < offset; i++) grid.innerHTML += `<div class="cal-day empty"></div>`;

  const totalDias  = new Date(year, month, 0).getDate();
  const todayStr   = today();
  const diasData   = {};
  if (resumenMes) resumenMes.dias.forEach(d => diasData[d.fecha] = d);

  for (let i = 1; i <= totalDias; i++) {
    const fStr = year + '-' + String(month).padStart(2,'0') + '-' + String(i).padStart(2,'0');
    const dow  = new Date(fStr + 'T12:00:00').getDay();
    const d    = diasData[fStr];
    const isToday  = fStr === todayStr;
    const isWeekend = dow === 0 || dow === 6;

    let cls = 'cal-day';
    if (isWeekend) cls += ' weekend';
    if (isToday)   cls += ' today';
    if (d?.ausencia?.Tipo === 'vacaciones') cls += ' vacaciones';
    else if (d?.ausencia?.Tipo === 'baja')  cls += ' baja';
    else if (d?.ausencia)                   cls += ' has-ausencia';
    else if (d?.fichajes?.length)           cls += ' has-fichaje';

    grid.innerHTML += `
      <div class="${cls}" onclick="clickDia('${fStr}')">
        <span>${i}</span>
        ${(d || isToday) && !isWeekend ? '<div class="dot"></div>' : ''}
      </div>`;
  }
}

function clickDia(fecha) {
  const dow = new Date(fecha + 'T12:00:00').getDay();
  if (dow === 0 || dow === 6) return;
  openAusenciaModal(fecha);
}

function renderMesTable() {
  const tb = document.getElementById('mesTableBody');
  if (!resumenMes || !resumenMes.dias.length) {
    tb.innerHTML = `<tr><td colspan="6" class="empty-state">Sin datos para este mes</td></tr>`;
    return;
  }
  tb.innerHTML = resumenMes.dias.slice().reverse().map(d => {
    const bal = d.balance;
    const balStr = (bal >= 0 ? '+' : '') + minToHM(bal);
    const balCls = bal > 0 ? 'positive' : bal < 0 ? 'negative' : '';
    const ausLabel = d.ausencia ? tipoLabel(d.ausencia.Tipo) : '';
    const hasFich  = d.fichajes.length > 0;
    let estado = '';
    if (d.ausencia?.Tipo === 'vacaciones' || d.ausencia?.Tipo === 'baja') {
      estado = `<span class="badge badge-blue">${tipoLabel(d.ausencia.Tipo)}</span>`;
    } else if (d.ausencia) {
      estado = `<span class="badge badge-yellow">${tipoLabel(d.ausencia.Tipo)}</span>`;
    } else if (hasFich && d.trabajados >= d.esperados) {
      estado = `<span class="badge badge-green">OK</span>`;
    } else if (hasFich) {
      estado = `<span class="badge badge-red">Incompleto</span>`;
    } else {
      estado = `<span class="badge badge-muted">Sin datos</span>`;
    }
    return `<tr>
      <td>${d.fecha}</td>
      <td>${DIAS[d.diaSemana]}</td>
      <td>${minToHM(d.esperados)}</td>
      <td>${minToHM(d.trabajados)}</td>
      <td class="${balCls}">${balStr}</td>
      <td>${estado}</td>
    </tr>`;
  }).join('');
}

function cambiarMes(delta) {
  const [y, m] = currentMes.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  currentMes = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0');
  loadMes();
}

// ── PANEL: AUSENCIAS ─────────────────────────────────────────
async function loadAusencias() {
  if (!CFG.url) return;
  try {
    const res = await api({ action: 'getAusencias', mes: currentMes });
    ausenciasMes = res.ausencias || [];
    renderAusenciasTable();
  } catch(e) { toast(e.message, true); }
}

function renderAusenciasTable() {
  const tb = document.getElementById('ausenciasTableBody');
  if (!ausenciasMes.length) {
    tb.innerHTML = `<tr><td colspan="5" class="empty-state">No hay ausencias registradas</td></tr>`;
    return;
  }
  tb.innerHTML = ausenciasMes.slice().sort((a,b)=>b.Fecha.localeCompare(a.Fecha)).map(a => `
    <tr>
      <td>${a.Fecha}</td>
      <td>${tipoLabel(a.Tipo)}</td>
      <td>${a.Nota || '—'}</td>
      <td>${a.MinutosAusencia ? minToHM(parseInt(a.MinutosAusencia)) : '—'}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="borrarAusencia('${a.ID}')">✕</button>
      </td>
    </tr>
  `).join('');
}

function tipoLabel(tipo) {
  const map = {
    teletrabajo: '🏠 Teletrabajo',
    fuera: '🏢 Fuera oficina',
    vacaciones: '🌴 Vacaciones',
    baja: '🏥 Baja',
    parcial: '⏱ Parcial',
    otro: '📋 Otro'
  };
  return map[tipo] || tipo;
}

let selectedTipo = '';
function openAusenciaModal(fecha = null) {
  document.getElementById('ausenciaFecha').value = fecha || today();
  document.getElementById('ausenciaNota').value  = '';
  document.getElementById('parcialMin').value    = '';
  document.getElementById('parcialMinGroup').style.display = 'none';
  document.querySelectorAll('.tipo-pill').forEach(p => p.classList.remove('selected'));
  selectedTipo = '';
  document.getElementById('modalAusencia').classList.add('open');
}

function selectTipo(btn) {
  document.querySelectorAll('.tipo-pill').forEach(p => p.classList.remove('selected'));
  btn.classList.add('selected');
  selectedTipo = btn.dataset.tipo;
  document.getElementById('parcialMinGroup').style.display =
    selectedTipo === 'parcial' ? 'block' : 'none';
}

async function guardarAusencia() {
  if (!selectedTipo) { toast('Selecciona el tipo de ausencia', true); return; }
  const fecha   = document.getElementById('ausenciaFecha').value;
  const nota    = document.getElementById('ausenciaNota').value;
  const minutos = document.getElementById('parcialMin').value;
  try {
    await api({}, { action: 'addAusencia', fecha, tipo: selectedTipo, nota, minutos: minutos || '' });
    toast('✓ Ausencia guardada');
    closeModal('modalAusencia');
    await loadAusencias();
    await loadMes();
  } catch(e) { toast(e.message, true); }
}

async function borrarAusencia(id) {
  if (!confirm('¿Eliminar esta ausencia?')) return;
  try {
    await api({}, { action: 'deleteAusencia', id });
    toast('Ausencia eliminada');
    await loadAusencias();
    await loadMes();
  } catch(e) { toast(e.message, true); }
}

// ── CONFIG / TEST ────────────────────────────────────────────
async function testConexion() {
  if (!CFG.url) { toast('Añade la URL primero', true); return; }
  try {
    toast('Probando…');
    await api({ action: 'getFichajes', fecha: today() });
    toast('✓ Conexión correcta con Google Sheets');
  } catch(e) { toast('Error: ' + e.message, true); }
}

// ── NAVEGACIÓN ───────────────────────────────────────────────
function showPanel(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  document.querySelectorAll('nav button')[
    ['hoy','mes','ausencias','config'].indexOf(name)
  ].classList.add('active');
  if (name === 'mes')      loadMes();
  if (name === 'ausencias') { loadAusencias(); }
}

// ── MODAL ────────────────────────────────────────────────────
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

// ── TOAST ────────────────────────────────────────────────────
let toastTimer;
function toast(msg, error = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (error ? ' error' : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.className = 'toast', 3500);
}

// ── INIT ─────────────────────────────────────────────────────
async function loadAll() {
  await loadHoy();
  await loadMes();
}

loadConfig();
if (CFG.url) loadAll();
</script>
</body>
</html>
