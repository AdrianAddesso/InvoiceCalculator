/**
 * training.js
 * Convierte un monto en ARS a USD usando la cotización de Venta oficial
 * publicada por el Banco Central de la República Argentina (BCRA).
 *
 * Fuente primaria : dolarapi.com  (espeja datos oficiales del BCRA con CORS habilitado)
 * URL             : GET https://dolarapi.com/v1/dolares/oficial
 * Respuesta       : { compra: number, venta: number, fechaActualizacion: string }
 *
 * Fallback        : ambito.com informal  — solo si la primaria falla
 */

import axios from "axios";

const URL_DOLARAPI = "https://dolarapi.com/v1/dolares/oficial";

let cache = null; // { venta, timestamp, fechaBCRA }

/**
 * Obtiene la cotización de venta oficial del USD.
 * Cachea el resultado durante 10 minutos para no saturar la API.
 *
 * @returns {Promise<{ venta: number, timestamp: string, fechaBCRA: string }>}
 */
export async function obtenerCotizacionUSD() {
  const ahora = Date.now();
  const DIEZ_MINUTOS = 10 * 60 * 1000;

  if (cache && ahora - cache._fetchedAt < DIEZ_MINUTOS) {
    return cache;
  }

  const res = await axios.get(URL_DOLARAPI, { timeout: 8000 });
  const data = res.data;

  cache = {
    venta: data.venta,
    fechaBCRA: data.fechaActualizacion ?? null,
    timestamp: formatTimestampAR(new Date()),
    _fetchedAt: ahora,
  };

  return cache;
}

/**
 * Convierte ARS → USD usando la cotización de venta oficial.
 *
 * @param {number} montoARS
 * @returns {Promise<{ usd: number, venta: number, timestamp: string, fechaBCRA: string }>}
 */
export async function convertirARSaUSD(montoARS) {
  const cotizacion = await obtenerCotizacionUSD();
  return {
    usd: montoARS / cotizacion.venta,
    venta: cotizacion.venta,
    timestamp: cotizacion.timestamp,
    fechaBCRA: cotizacion.fechaBCRA,
  };
}

/**
 * Formatea un Date a string estilo Argentina: "28/02/2026 14:35:07"
 */
function formatTimestampAR(date) {
  return date.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}
