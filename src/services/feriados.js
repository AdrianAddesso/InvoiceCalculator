/**
 * feriados.js
 * Obtiene feriados argentinos con dos fuentes:
 *   1. nolaborables.com.ar  (primaria)
 *   2. argentinadatos.com   (fallback automático)
 *
 * Ambas APIs son públicas y gratuitas, sin auth requerida.
 */

import axios from "axios";

// ── Fuente 1 ──────────────────────────────────────────────────────────────────
// GET https://nolaborables.com.ar/api/v2/feriados/{año}
// Responde: [{ dia, mes, motivo, tipo, ... }]
const URL_NOLABORABLES = (anio) =>
  `https://nolaborables.com.ar/api/v2/feriados/${anio}`;

// ── Fuente 2 (fallback) ───────────────────────────────────────────────────────
// GET https://api.argentinadatos.com/v1/feriados/{año}
// Responde: [{ fecha: "YYYY-MM-DD", tipo, descripcion, ... }]
const URL_ARGENTINADATOS = (anio) =>
  `https://api.argentinadatos.com/v1/feriados/${anio}`;

/**
 * Normaliza el formato de argentinadatos al mismo schema que nolaborables:
 * { dia, mes, motivo, tipo }
 */
function normalizarArgentinadatos(items) {
  return items.map((f) => {
    const [, mesStr, diaStr] = f.fecha.split("-");
    return {
      dia: parseInt(diaStr, 10),
      mes: parseInt(mesStr, 10),
      motivo: f.descripcion ?? f.nombre ?? "Feriado nacional",
      tipo: f.tipo ?? "inamovible",
    };
  });
}

/**
 * Obtiene todos los feriados del año y filtra por mes.
 * Intenta nolaborables primero; si falla, usa argentinadatos.
 *
 * @param {number} anio
 * @param {number} mes  - 1 a 12
 * @returns {Promise<Array<{ dia, mes, motivo, tipo }>>}
 */
export async function obtenerFeriadosDelMes(anio, mes) {
  // ── Intento 1: nolaborables.com.ar ────────────────────────────────────────
  try {
    const res = await axios.get(URL_NOLABORABLES(anio), { timeout: 6000 });
    const todos = res.data;
    return todos.filter((f) => f.mes === mes);
  } catch (err) {
    console.warn(
      `[feriados] nolaborables.com.ar falló (${err.message}). Usando fallback…`,
    );
  }

  // ── Intento 2: argentinadatos.com ─────────────────────────────────────────
  try {
    const res = await axios.get(URL_ARGENTINADATOS(anio), { timeout: 6000 });
    const normalizados = normalizarArgentinadatos(res.data);
    return normalizados.filter((f) => f.mes === mes);
  } catch (err) {
    console.error(`[feriados] Fallback también falló: ${err.message}`);
    // Propaga el error para que el componente muestre el mensaje al usuario
    throw new Error(
      "No se pudo obtener la lista de feriados. Verificá tu conexión a internet.",
    );
  }
}

/**
 * Formatea un feriado como string legible: "15/03 — Día de X"
 */
export function formatearFeriado(feriado) {
  const dia = String(feriado.dia).padStart(2, "0");
  const mes = String(feriado.mes).padStart(2, "0");
  return `${dia}/${mes} — ${feriado.motivo}`;
}
