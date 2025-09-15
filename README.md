# Panal - Visualización de Economía Asociativa Escolar

**Panal** es una aplicación web que visualiza la economía asociativa escolar usando un patrón hexagonal donde cada hexágono representa un aporte individual de las familias.

## ¿Qué Puedes Hacer con Panal?

### Visualizar Datos Financieros
- **Ver el presupuesto total** de la escuela representado como un panal de hexágonos
- **Identificar familias en mora** (hexágonos marrones)
- **Distinguir tipos de aportes** por colores:
  - Dorado claro: Becas (aportes reducidos)
  - Dorado medio: Aportes estándar
  - Dorado oscuro: Donaciones (aportes adicionales)
  - Marrón oscuro: Familias en mora

### Consultar Estadísticas
- **Total de mora**: Suma de aportes adeudados
- **Donaciones**: Monto adicional recibido por encima del aporte estándar
- **Becas**: Reducción total otorgada por debajo del aporte estándar
- **Presupuesto total**: Suma de todos los aportes

### Simular Cambios
- **Seleccionar una familia** específica
- **Ajustar el porcentaje** de sus aportes (+/- desde el valor inicial)
- **Ver el impacto inmediato** en las estadísticas generales
- **Observar cómo cambian** los totales de mora, donaciones y becas

### Navegar la Interfaz
- **Canvas hexagonal** que ocupa toda la pantalla
- **Barra de estadísticas** en la parte superior
- **Panel de control** en la parte inferior con:
  - Selector de familia
  - Deslizador para ajustar porcentajes
  - Información de aportes actuales vs iniciales

## Datos de Ejemplo

La aplicación simula:
- **300 familias** contribuyentes
- **400 aportes** individuales distribuidos entre las familias
- **40 familias** en mora (seleccionadas aleatoriamente)
- **Presupuesto base** de $200,000,000
- **Aportes estándar** de $500,000 por estudiante

---

*Panal: Visualización interactiva de economía asociativa escolar.*
