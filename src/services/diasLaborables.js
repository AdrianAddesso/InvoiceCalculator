/**
 * diasLaborables.js
 * Servicio para calcular días laborables (lunes a viernes) en un mes/año dado.
 * No incluye lógica de feriados — eso es responsabilidad del store.
 */

/**
 * Retorna la cantidad de días de lunes a viernes en el mes y año indicados.
 * @param {number} mes  - 1 a 12
 * @param {number} anio - ej. 2025
 * @returns {number}
 */
export function contarDiasLaborables(mes, anio) {
  const totalDias = new Date(anio, mes, 0).getDate(); // día 0 del mes siguiente = último día del mes
  let count = 0;
  for (let dia = 1; dia <= totalDias; dia++) {
    const fecha = new Date(anio, mes - 1, dia);
    const diaSemana = fecha.getDay(); // 0=Dom, 1=Lun, ..., 6=Sab
    if (diaSemana !== 0 && diaSemana !== 6) {
      count++;
    }
  }
  return count;
}

/**
 * Retorna los nombres cortos de los meses en español.
 */
export const MESES = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];
