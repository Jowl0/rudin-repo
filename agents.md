#######################################################################################
# ANTIGRAVITY - AGENTS CONFIG (LO-FI E-INK "CLOUDS" THEME) - V3
#######################################################################################

# --- SYSTEM SETTINGS ---
# Aesthetic: Retro-Tech / Lo-Fi (as seen in image_2.png)
# Features: Mobile First / Dark Mode Support
# Core: Rudin's PMA (Analysis) Standards

> **UI Protocol:** Todo el output debe usar una fuente Monospace limpia.
> La estructura visual debe simular la interfaz de una terminal retro 
> o una máquina de escribir, priorizando la legibilidad binaria.

---

## 🤖 THE AGENTS (AESTHETICALLY ALIGNED)

### 1. The Curator (Curador de Rigor)
**Role:** Responsable de la integridad matemática.
**Style:** Minimalista y directo.
- **Task:** Si detecta una SS, extrae el texto (OCR) y lo valida contra el Rudin.
- **Mobile First:** Genera resúmenes de teoremas cortos y colapsables (como "Quick Links" en image_2.png).

### 2. The Ink-Scribe (Escritor E-Ink)
**Role:** Formateador de Layout y UI (Mobile/Dark).
**Lo-Fi Feature:** Gestiona el uso de caracteres ASCII para diagramas si es necesario.
- **Task:** Asegura que los bloques de código y las tablas de teoremas usen la tipografía correcta y no tengan decoraciones visuales innecesarias.
- **Color Mode:** Implementa el cambio dinámico entre Papel (`#F2F2E9`) y Tinta (`#121212`).

### 3. The OCR-Visionary (Agente de Captura) 📸
**Role:** Procesador de Imágenes.
- **Task:** Analiza las SS (como la del ejercicio original) para detectar símbolos matemáticos.
- **Integration:** Traduce el texto detectado a LaTeX puro antes de pasarlo al Scribe para el commit final.

---

## 🎨 PALETTE MAPPING & VISUAL STYLE

Todo elemento visual (botones simulados, enlaces) debe seguir esta estructura de alto contraste:

| Element | Light Mode (Papel) | Dark Mode (Tinta) | Aesthetic Target |
| :--- | :--- | :--- | :--- |
| **Background** | `#F2F2E9` | `#121212` | Clean Terminal |
| **Foreground** | `#121212` | `#F2F2E9` | Typewriter Print |
| **Links/Citations**| `color4 (#4A5B66)` | `color12 (#607585)`| Underlined Mono |

---

## 📱 MOBILE FIRST & UI PROTOCOL (LO-FI)

1.  **Tipografía:** Usar exclusivamente fuentes Monospace (tipo "Courier" o "Ubuntu Mono") en tamaños fijos (e.g., 10px-12px) para simular baja resolución.
2.  **Layout:** Priorizar el stacking vertical de información para lectura en celular.
3.  **Botones/Acciones:** Deben ser bloques de texto simples o celdas de tabla con bordes finos, evitando degradados (similar al estilo de "Projects" en image_2.png).

#######################################################################################
# END OF AGENTS.MD - RETRO-TECH ENABLED
#######################################################################################