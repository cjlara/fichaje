// ============================================================
// FICHAJE PERSONAL — Google Apps Script Backend v5
// Fechas guardadas como DD-MM-YYYY (Sheets no lo convierte a Date)
// Horas guardadas como HH:MM texto
// ============================================================

var SHEET_FICHAJES  = "Fichajes";
var SHEET_AUSENCIAS = "Ausencias";
var TZ = "Europe/Madrid";

// Jornada de TRABAJO REAL (lo que se contabiliza, sin comida)
var JORNADA_TRABAJO = {
  1: 8 * 60 + 15, // Lunes: 8h15m
  2: 8 * 60 + 15,
  3: 8 * 60 + 15,
  4: 8 * 60 + 15,
  5: 7 * 60,      // Viernes: 7h
};
var PAUSA_COMIDA = 60;
var JORNADA_TELETRABAJO = 8 * 60 + 15;

// Festivos nacionales fijos (MM-DD)
var FESTIVOS_NACIONALES = [
  "01-01", "01-06", "05-01", "08-15",
  "10-12", "11-01", "12-06", "12-08", "12-25"
];

function esFestivoNacional(fechaISO) {
  var mmdd = fechaISO.substring(5); // "MM-DD"
  for (var i = 0; i < FESTIVOS_NACIONALES.length; i++) {
    if (FESTIVOS_NACIONALES[i] === mmdd) return true;
  }
  return false;
}

function doGet(e)  { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
  try {
    var p = e.parameter || {};
    var result;
    switch (p.action) {
      case "fichar":         result = fichar(p); break;
      case "getFichajes":    result = getFichajes(p); break;
      case "getResumen":     result = getResumen(p); break;
      case "addAusencia":    result = addAusencia(p); break;
      case "getAusencias":   result = getAusencias(p); break;
      case "deleteAusencia": result = deleteAusencia(p); break;
      case "editFichaje":    result = editFichaje(p); break;
      case "addFichaje":     result = addFichaje(p); break;
      case "deleteFichaje":  result = deleteFichaje(p); break;
      case "debug": result = debugHora(p); break;
      default: result = { error: "Accion desconocida: " + p.action };
    }
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── HELPERS FECHA/HORA ───────────────────────────────────────

// Guarda como DD-MM-YYYY para que Sheets no lo convierta a Date
function fechaHoyStorage() {
  return Utilities.formatDate(new Date(), TZ, "dd-MM-yyyy");
}

// Lee como YYYY-MM-DD para la app (convierte desde DD-MM-YYYY o cualquier formato Date)
function leerFecha(val) {
  if (!val || val === "") return "";
  var s = String(val);
  // Formato guardado: DD-MM-YYYY
  var m = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (m) return m[3] + "-" + m[2] + "-" + m[1];
  // Ya es YYYY-MM-DD
  if (s.match(/^\d{4}-\d{2}-\d{2}/)) return s.substring(0, 10);
  // Es un Date object serializado de filas antiguas — extraer con new Date()
  try {
    var d = new Date(s);
    if (!isNaN(d.getTime())) {
      return Utilities.formatDate(d, TZ, "yyyy-MM-dd");
    }
  } catch(e) {}
  return s;
}

// Parámetro fecha de la app llega como YYYY-MM-DD, convertir a DD-MM-YYYY para buscar
function fechaParaStorage(isoDate) {
  if (!isoDate) return "";
  var parts = isoDate.split("-");
  if (parts.length === 3) return parts[2] + "-" + parts[1] + "-" + parts[0];
  return isoDate;
}

function horaAhora() {
  return Utilities.formatDate(new Date(), TZ, "HH:mm");
}

function leerHora(val) {
  if (!val || val === "") return "";
  // Sheets convierte texto "HH:MM" a Date al leer con getValues()
  // Usamos getDisplayValue() indirectamente: formateamos el Date en UTC puro
  // El valor Date de Sheets para una hora H:MM tiene exactamente H*3600+M*60 segundos
  // desde 1899-12-30 00:00:00 UTC (sin offset)
  var s = String(val);
  if (s.indexOf("1899") !== -1) {
    // Extraer HH:MM del string directamente — la hora en el string ES la hora correcta
    // "Sat Dec 30 1899 12:32:00 GMT-0014" → 12:32 es la hora local guardada
    // pero el toString() aplica el offset local actual, dando 12:46
    // Solución: usar getUTCHours/getUTCMinutes y restar el offset de -0014 (= +14min UTC offset negativo)
    // UTC time = local + 0:14, entonces local = UTC - 0:14
    // Si typeof val es object (Date), usamos getTime()
    if (typeof val === "object" && val.getTime) {
      var ms = val.getTime(); // ms desde epoch
      // 1899-12-30 en epoch = -2209161600000 ms
      var msDesde1899 = ms - (-2209161600000);
      var totalMin = Math.round(msDesde1899 / 60000) % (24 * 60);
      if (totalMin < 0) totalMin += 24 * 60;
      var h = Math.floor(totalMin / 60);
      var m = totalMin % 60;
      return String(h).padStart(2,"0") + ":" + String(m).padStart(2,"0");
    }
  }
  // Es string normal HH:MM
  var m2 = s.match(/(\d{1,2}):(\d{2})/);
  if (!m2) return "";
  return String(parseInt(m2[1])).padStart(2,"0") + ":" + m2[2];
}

function minutosEntre(horaIni, horaFin) {
  var pi = horaIni.split(":").map(Number);
  var pf = horaFin.split(":").map(Number);
  return (pf[0] * 60 + pf[1]) - (pi[0] * 60 + pi[1]);
}

function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }
  return sheet;
}

function escribirFila(sheet, rowNum, valores) {
  // Escribir valor por valor asegurando texto plano en fecha y hora
  for (var i = 0; i < valores.length; i++) {
    sheet.getRange(rowNum, i + 1).setValue(valores[i]);
  }
}

// ── FICHAR ───────────────────────────────────────────────────
function fichar(p) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, SHEET_FICHAJES, ["ID","Fecha","Entrada","Salida","Minutos","Tipo"]);

  var fechaStorage = fechaHoyStorage();  // DD-MM-YYYY
  var fechaISO     = leerFecha(fechaStorage); // YYYY-MM-DD para respuesta
  var hora         = horaAhora();
  var rng          = sheet.getDataRange();
  var data         = rng.getValues();
  var display      = rng.getDisplayValues();

  for (var i = data.length - 1; i >= 1; i--) {
    var rowFecha  = leerFecha(data[i][1]);
    var rowSalida = display[i][3];
    if (rowFecha === fechaISO && !rowSalida) {
      var horaEntrada = display[i][2];
      var minutos = minutosEntre(horaEntrada, hora);
      sheet.getRange(i + 1, 4).setValue(hora);
      sheet.getRange(i + 1, 5).setValue(minutos);
      var hTrab = Math.floor(minutos / 60);
      var mTrab = minutos % 60;
      var msgSalida = "🏁 Salida · " + hora + " · Trabajado: " + hTrab + "h " + String(mTrab).padStart(2,"0") + "m";
      return { tipo: "salida", hora: hora, minutos: minutos, fecha: fechaISO, mensaje: msgSalida };
    }
  }

  var id = Utilities.getUuid();
  var newRow = sheet.getLastRow() + 1;
  escribirFila(sheet, newRow, [id, fechaStorage, hora, "", "", "oficina"]);
  var msgEntrada = "✅ Entrada · " + hora;
  return { tipo: "entrada", hora: hora, fecha: fechaISO, mensaje: msgEntrada };
}

// ── OBTENER FICHAJES ─────────────────────────────────────────
function getFichajes(p) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, SHEET_FICHAJES, ["ID","Fecha","Entrada","Salida","Minutos","Tipo"]);
  var range = sheet.getDataRange();
  var data  = range.getValues();
  var display = range.getDisplayValues(); // hora real como la muestra Sheets

  var rows = data.slice(1).map(function(row, i) {
    var disp = display[i + 1];
    return {
      ID:      String(row[0]),
      Fecha:   leerFecha(row[1]),
      Entrada: disp[2] || "",
      Salida:  disp[3] || "",
      Minutos: row[4] !== "" ? String(row[4]) : "",
      Tipo:    String(row[5] || "oficina")
    };
  }).filter(function(r) { return r.Fecha !== "" && r.ID !== ""; });

  if (p.mes)   rows = rows.filter(function(r) { return r.Fecha.indexOf(p.mes) === 0; });
  if (p.fecha) rows = rows.filter(function(r) { return r.Fecha === p.fecha; });

  return { fichajes: rows };
}

// ── BORRAR FICHAJE ───────────────────────────────────────────
function deleteFichaje(p) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, SHEET_FICHAJES, ["ID","Fecha","Entrada","Salida","Minutos","Tipo"]);
  var data  = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(p.id)) {
      sheet.deleteRow(i + 1);
      return { ok: true };
    }
  }
  return { error: "No encontrado" };
}

// ── AÑADIR FICHAJE MANUAL ───────────────────────────────────
function addFichaje(p) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, SHEET_FICHAJES, ["ID","Fecha","Entrada","Salida","Minutos","Tipo"]);
  var id = Utilities.getUuid();
  // Convertir fecha YYYY-MM-DD a DD-MM-YYYY para evitar conversión de Sheets
  var partes = p.fecha.split("-");
  var fechaStorage = partes[2] + "-" + partes[1] + "-" + partes[0];
  var minutos = "";
  if (p.entrada && p.salida) {
    minutos = String(minutosEntre(p.entrada, p.salida));
  }
  var newRow = sheet.getLastRow() + 1;
  escribirFila(sheet, newRow, [id, fechaStorage, p.entrada || "", p.salida || "", minutos, "oficina"]);
  return { ok: true, id: id };
}

// ── EDITAR FICHAJE ───────────────────────────────────────────
function editFichaje(p) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, SHEET_FICHAJES, ["ID","Fecha","Entrada","Salida","Minutos","Tipo"]);
  var data  = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(p.id)) {
      if (p.entrada) sheet.getRange(i + 1, 3).setValue(p.entrada);
      if (p.salida)  sheet.getRange(i + 1, 4).setValue(p.salida);
      if (p.entrada && p.salida) {
        sheet.getRange(i + 1, 5).setValue(minutosEntre(p.entrada, p.salida));
      }
      return { ok: true };
    }
  }
  return { error: "Fichaje no encontrado" };
}

// ── RESUMEN ──────────────────────────────────────────────────
function getResumen(p) {
  var fichajes  = getFichajes({ mes: p.mes }).fichajes;
  var ausencias = getAusencias({ mes: p.mes }).ausencias;
  var dias = {};

  fichajes.forEach(function(f) {
    if (!dias[f.Fecha]) dias[f.Fecha] = { fichajes: [], ausencia: null };
    dias[f.Fecha].fichajes.push(f);
  });
  ausencias.forEach(function(a) {
    if (!dias[a.Fecha]) dias[a.Fecha] = { fichajes: [], ausencia: null };
    dias[a.Fecha].ausencia = a;
  });

  var totalTrabajados = 0, totalEsperados = 0, result = [];
  Object.keys(dias).sort().forEach(function(fecha) {
    var dow = new Date(fecha + "T12:00:00").getDay();
    var esperados = JORNADA_MINUTOS[dow] || 0;
    if (esperados === 0) return;
    var fs = dias[fecha].fichajes;
    var ausencia = dias[fecha].ausencia;
    // Primera entrada y última salida del día
    var bruto = 0;
    if (fs.length > 0) {
      var primeraEntrada = fs[0].Entrada;
      var ultimaSalida = "";
      for (var fi = 0; fi < fs.length; fi++) {
        if (fs[fi].Salida) ultimaSalida = fs[fi].Salida;
      }
      if (primeraEntrada && ultimaSalida) {
        bruto = minutosEntre(primeraEntrada, ultimaSalida);
      } else {
        bruto = fs.reduce(function(s, f) { return s + (parseInt(f.Minutos) || 0); }, 0);
      }
    }
    // Comida solo Lun-Jue en oficina (dow 1-4), viernes jornada continua
    var hayComida = !esTeletrabajo && dow >= 1 && dow <= 4;
    // Ausencia de día completo prevalece siempre sobre los fichajes
    if (ausencia && (ausencia.Tipo === "vacaciones" || ausencia.Tipo === "baja")) {
      trabajados = esperados;
    } else if (ausencia && (ausencia.Tipo === "teletrabajo" || ausencia.Tipo === "fuera")) {
      esperados = JORNADA_TELETRABAJO;
      trabajados = JORNADA_TELETRABAJO; // 8h15m fijo, ignora fichajes
    } else {
      trabajados = Math.max(0, bruto - (hayComida ? PAUSA_COMIDA : 0));
    }
    totalTrabajados += trabajados;
    totalEsperados  += esperados;
    result.push({ fecha: fecha, diaSemana: dow, esperados: esperados,
      trabajados: trabajados, balance: trabajados - esperados,
      ausencia: ausencia || null, fichajes: fs });
  });

  return { mes: p.mes, dias: result, totalTrabajados: totalTrabajados,
    totalEsperados: totalEsperados, balanceTotal: totalTrabajados - totalEsperados };
}

// ── AUSENCIAS ────────────────────────────────────────────────
function addAusencia(p) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, SHEET_AUSENCIAS, ["ID","Fecha","Tipo","Nota","MinutosAusencia"]);
  var id = Utilities.getUuid();
  // Guardar fecha como DD-MM-YYYY para evitar conversión
  var fechaStorage = fechaParaStorage(p.fecha);
  escribirFila(sheet, sheet.getLastRow() + 1, [id, fechaStorage, p.tipo, p.nota || "", p.minutos || ""]);
  return { ok: true, id: id };
}

function getAusencias(p) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, SHEET_AUSENCIAS, ["ID","Fecha","Tipo","Nota","MinutosAusencia"]);
  var data  = sheet.getDataRange().getValues();

  var rows = data.slice(1).map(function(row) {
    return {
      ID: String(row[0]), Fecha: leerFecha(row[1]),
      Tipo: String(row[2] || ""), Nota: String(row[3] || ""),
      MinutosAusencia: String(row[4] || "")
    };
  }).filter(function(r) { return r.Fecha !== "" && r.ID !== ""; });

  if (p.mes)   rows = rows.filter(function(r) { return r.Fecha.indexOf(p.mes) === 0; });
  if (p.fecha) rows = rows.filter(function(r) { return r.Fecha === p.fecha; });
  return { ausencias: rows };
}

function deleteAusencia(p) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, SHEET_AUSENCIAS, ["ID","Fecha","Tipo","Nota","MinutosAusencia"]);
  var data  = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(p.id)) {
      sheet.deleteRow(i + 1);
      return { ok: true };
    }
  }
  return { error: "No encontrado" };
}

function debugHora(p) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_FICHAJES);
  if (!sheet) return { error: "No sheet" };
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return { error: "Sin filas" };
  var raw = data[data.length-1][2];
  var s = String(raw);
  var isObj = (typeof raw === "object");
  var ms = isObj && raw.getTime ? raw.getTime() : null;
  var base1899 = -2209161600000;
  var msDesde1899 = ms !== null ? ms - base1899 : null;
  var totalMin = msDesde1899 !== null ? Math.round(msDesde1899 / 60000) % (24*60) : null;
  return {
    raw_string: s, tipo: typeof raw, getTime: ms,
    msDesde1899: msDesde1899, totalMin: totalMin,
    horaCalculada: totalMin !== null ? (Math.floor(totalMin/60) + ":" + String(totalMin%60).padStart(2,"0")) : null,
    utcH: isObj && raw.getUTCHours ? raw.getUTCHours() : null,
    utcM: isObj && raw.getUTCMinutes ? raw.getUTCMinutes() : null,
    displayValue: sheet.getRange(data.length, 3).getDisplayValue()
  };
}