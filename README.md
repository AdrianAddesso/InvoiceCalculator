# PNT2: Final
# Conversor de Distancia - Vue 3 + Pinia

## Installation
Install the project dependencies:
`npm install`

## Getting the Repository
Clone the repository:
`git clone https://github.com/AdrianAddesso/adrian-addesso-pnt2-final.git`

## Enunciado

Se solicita desarrollar una aplicación frontend utilizando Vue CLI (Vue 3) que permita realizar la conversión de una distancia ingresada en kilómetros (km) a metros (m) y millas (mi). Representar los metros con dos decimales y las millas con cuatro decimales.

La aplicación deberá implementar el patrón de estado global utilizando Pinia, separando correctamente state, getters y actions, y consumiendo dicha información desde la vista.

## Requisitos funcionales

1. La interfaz deberá contar con:
   - Un campo de entrada para ingresar la distancia en kilómetros.
   - Dos elementos de texto que muestren:
     - La distancia convertida a metros.
     - La distancia convertida a millas.

2. La conversión deberá ser reactiva:
   - Cada vez que el usuario modifique el valor ingresado, los resultados deberán actualizarse automáticamente, sin utilizar botones para disparar el cálculo.

3. Se deberá permitir el ingreso de valores negativos.

## Reglas de conversión

- **Metros**: `metros = kilómetros × 1000`
- **Millas**: `millas = kilómetros × 0.621371`

## Estado global (Pinia)

La aplicación deberá utilizar Pinia como sistema de estado global, cumpliendo las siguientes condiciones:

- El valor ingresado en kilómetros deberá almacenarse en el **state** del store.
- Las conversiones a metros y millas deberán implementarse como **getters**.
- La modificación del valor de kilómetros deberá realizarse exclusivamente mediante una **action**.
- La vista no deberá realizar cálculos, solo consumir los datos expuestos por el store.

## Reglas de estilo visual

El color del texto de ambos valores convertidos deberá variar dinámicamente según el valor ingresado en kilómetros:

- **Azul** si el valor es menor o igual a 0 km.
- **Magenta** si el valor es mayor a 0 km y menor a 5 km.
- **Rojo** para valores iguales o mayores a 5 km.

## Requisitos técnicos

- Vue 3 creado con Vue CLI (options o composition API)
- Uso de Pinia como store global.
- Uso de state, getters y actions (no estado local).
- Código claro, ordenado y correctamente indentado.


