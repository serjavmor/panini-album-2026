// Lógica Principal de la Aplicación
import { getAlbumDatabase, TEAMS_DATA, SPECIAL_SECTION } from './db.js';

// Base de datos del álbum (estática estructurada)
const ALBUM_DB = getAlbumDatabase();

// Total absoluto de cromos en el álbum
const TOTAL_STICKERS = Object.values(ALBUM_DB).reduce((acc, team) => acc + team.stickers.length, 0);

// Estado de la colección (cargado de localStorage o vacío)
let collectionState = {};

// Equipo que se está visualizando actualmente
let activeTeamId = "FWC";

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  loadCollectionState();
  initNavigation();
  initSidebarMobile();
  renderGroupsSidebar();
  renderActiveTeamPage();
  updateGlobalProgress();
  initSearch();
  initBackupAndReset();
});

// 1. GESTIÓN DEL ESTADO & LOCALSTORAGE
function loadCollectionState() {
  const savedState = localStorage.getItem("panini_2026_collection");
  if (savedState) {
    try {
      collectionState = JSON.parse(savedState);
    } catch (e) {
      console.error("Error al cargar el estado, inicializando vacío", e);
      collectionState = {};
    }
  } else {
    collectionState = {};
  }
}

function saveCollectionState() {
  localStorage.setItem("panini_2026_collection", JSON.stringify(collectionState));
  updateGlobalProgress();
  // Si estamos en la pestaña de estadísticas o intercambio, actualizarlas
  if (document.getElementById("stats-tab").classList.contains("active")) {
    renderStatsTab();
  }
  if (document.getElementById("exchange-tab").classList.contains("active")) {
    renderExchangeTab();
  }
}

// Obtener detalles del estado de una lámina
function getStickerStatus(stickerId) {
  return collectionState[stickerId] || { status: "missing", count: 0 };
}

// Cambiar estado principal (Toque rápido)
function toggleStickerOwned(stickerId) {
  const current = getStickerStatus(stickerId);
  if (current.status === "missing") {
    collectionState[stickerId] = { status: "owned", count: 1 };
    showToast("¡Cromo obtenido! 🌟");
  } else {
    // Si era owned o repeated, vuelve a missing
    delete collectionState[stickerId];
    showToast("Cromo removido. ❌");
  }
  saveCollectionState();
  renderActiveTeamPage();
}

// Aumentar repetidas
function addRepeatedSticker(stickerId, event) {
  if (event) event.stopPropagation(); // Evita el click de la tarjeta principal
  const current = getStickerStatus(stickerId);
  
  if (current.status === "missing") {
    collectionState[stickerId] = { status: "owned", count: 1 };
  } else if (current.status === "owned") {
    collectionState[stickerId] = { status: "repeated", count: 2 }; // 1 en álbum + 1 repetida
  } else {
    collectionState[stickerId].count += 1;
  }
  
  saveCollectionState();
  renderActiveTeamPage();
}

// Disminuir repetidas
function removeRepeatedSticker(stickerId, event) {
  if (event) event.stopPropagation(); // Evita el click de la tarjeta principal
  const current = getStickerStatus(stickerId);
  
  if (current.status === "repeated") {
    if (current.count > 2) {
      current.count -= 1;
    } else {
      current.status = "owned";
      current.count = 1;
    }
  } else if (current.status === "owned") {
    delete collectionState[stickerId];
  }
  
  saveCollectionState();
  renderActiveTeamPage();
}


// 2. VISTAS Y NAVEGACIÓN DE PESTAÑAS
function initNavigation() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Remover activas
      tabs.forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      
      // Activar actual
      tab.classList.add("active");
      const contentId = tab.getAttribute("data-tab");
      const contentEl = document.getElementById(contentId);
      contentEl.classList.add("active");
      
      // Acciones específicas al entrar a una pestaña
      if (contentId === "stats-tab") {
        renderStatsTab();
      } else if (contentId === "exchange-tab") {
        renderExchangeTab();
      } else if (contentId === "album-tab") {
        renderActiveTeamPage();
      }
    });
  });
}

function initSidebarMobile() {
  const toggleBtn = document.getElementById("sidebar-toggle-btn");
  const sidebarPanel = document.querySelector(".sidebar-panel");
  
  if (toggleBtn && sidebarPanel) {
    toggleBtn.addEventListener("click", () => {
      const isExpanded = sidebarPanel.classList.toggle("expanded");
      toggleBtn.setAttribute("aria-expanded", isExpanded);
    });
  }
}


// 3. RENDERIZADO DEL PANEL LATERAL (Sidebar Accordion)
function renderGroupsSidebar() {
  const container = document.getElementById("groups-accordion");
  container.innerHTML = "";
  
  // Agrupar equipos por grupo
  const groups = {};
  
  // Agregar FWC primero como sección especial
  groups["Especial"] = [ALBUM_DB["FWC"]];
  
  // Agrupar los demás
  TEAMS_DATA.forEach(team => {
    const groupName = `Grupo ${team.group}`;
    if (!groups[groupName]) groups[groupName] = [];
    groups[groupName].push(ALBUM_DB[team.id]);
  });
  
  // Renderizar la interfaz de acordeón
  Object.entries(groups).forEach(([groupKey, teams]) => {
    const isEspecial = groupKey === "Especial";
    
    // Contenedor del grupo
    const groupWrapper = document.createElement("div");
    groupWrapper.className = "group-wrapper";
    
    // Botón de cabecera
    const headerBtn = document.createElement("button");
    headerBtn.className = `group-header-btn ${isEspecial ? "open" : ""}`;
    headerBtn.innerHTML = `
      <span>${groupKey}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    `;
    
    // Lista de equipos
    const teamsList = document.createElement("div");
    teamsList.className = `group-teams-list ${isEspecial ? "open" : ""}`;
    
    teams.forEach(team => {
      const teamBtn = document.createElement("button");
      teamBtn.className = `team-list-item ${team.id === activeTeamId ? "active" : ""}`;
      teamBtn.id = `sidebar-team-${team.id}`;
      
      // Calcular progreso del equipo para el badge del sidebar
      const progress = getTeamProgress(team.id);
      
      teamBtn.innerHTML = `
        <span>${team.flag} &nbsp;${team.name}</span>
        <span class="team-item-progress-badge" id="sidebar-badge-${team.id}">${progress.owned}/${team.stickers.length}</span>
      `;
      
      teamBtn.addEventListener("click", () => {
        // Cambiar equipo activo
        document.querySelectorAll(".team-list-item").forEach(el => el.classList.remove("active"));
        teamBtn.classList.add("active");
        
        activeTeamId = team.id;
        // Limpiar buscador al cambiar de equipo para evitar confusiones
        document.getElementById("sticker-search").value = "";
        
        // Cerrar sidebar en versión móvil si está expandido
        const sidebarPanel = document.querySelector(".sidebar-panel");
        const toggleBtn = document.getElementById("sidebar-toggle-btn");
        if (sidebarPanel && sidebarPanel.classList.contains("expanded")) {
          sidebarPanel.classList.remove("expanded");
          if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
        }
        
        renderActiveTeamPage();
      });
      
      teamsList.appendChild(teamBtn);
    });
    
    // Lógica colapsable
    headerBtn.addEventListener("click", () => {
      const isOpen = teamsList.classList.toggle("open");
      headerBtn.classList.toggle("open", isOpen);
    });
    
    groupWrapper.appendChild(headerBtn);
    groupWrapper.appendChild(teamsList);
    container.appendChild(groupWrapper);
  });
}

// Calcular progreso individual de un equipo
function getTeamProgress(teamId) {
  const team = ALBUM_DB[teamId];
  if (!team) return { owned: 0, percentage: 0 };
  
  let ownedCount = 0;
  team.stickers.forEach(sticker => {
    const state = getStickerStatus(sticker.id);
    if (state.status !== "missing") {
      ownedCount++;
    }
  });
  
  const percentage = Math.round((ownedCount / team.stickers.length) * 100) || 0;
  return {
    owned: ownedCount,
    total: team.stickers.length,
    percentage: percentage
  };
}


// 4. RENDERIZADO DE LA PÁGINA DEL ÁLBUM ACTIVA
function renderActiveTeamPage() {
  const team = ALBUM_DB[activeTeamId];
  if (!team) return;
  
  // 1. Actualizar Cabecera de Página
  const headerContainer = document.getElementById("active-team-header");
  headerContainer.innerHTML = `
    <span class="flag-icon">${team.flag}</span>
    <div>
      <h2>${team.name}</h2>
      <span class="group-badge">${team.group === "Especial" ? "Especial" : "Grupo " + team.group}</span>
    </div>
  `;
  
  // 2. Actualizar Progreso del Equipo
  const progress = getTeamProgress(activeTeamId);
  document.getElementById("team-percentage").textContent = `${progress.percentage}%`;
  document.getElementById("team-ratio").textContent = `${progress.owned} / ${progress.total}`;
  
  // Animar círculo radial
  const radialFill = document.getElementById("team-radial-fill");
  const strokeDashoffset = 126 - (126 * progress.percentage) / 100;
  radialFill.style.strokeDashoffset = strokeDashoffset;
  
  // 3. Renderizar las Láminas en el Grid
  const grid = document.getElementById("stickers-grid");
  grid.innerHTML = "";
  
  team.stickers.forEach(sticker => {
    const card = createStickerCard(sticker);
    grid.appendChild(card);
  });
  
  // Actualizar badges del sidebar
  const badge = document.getElementById(`sidebar-badge-${activeTeamId}`);
  if (badge) {
    badge.textContent = `${progress.owned}/${progress.total}`;
  }
}

// Crear elemento HTML para un cromo
function createStickerCard(sticker) {
  const state = getStickerStatus(sticker.id);
  const card = document.createElement("div");
  
  card.className = `sticker-card ${state.status}`;
  card.setAttribute("data-id", sticker.id);
  
  // Formatear el ID quitando el guión para que se vea como en el álbum real: "MEX 2" o "FWC 5"
  const formattedId = sticker.id.replace("-", " ");
  
  // Badge de repetidas
  let repeatBadgeHtml = "";
  if (state.status === "repeated" && state.count > 1) {
    // Las repetidas son unidades extra, ej: count = 2 significa 1 pegada y 1 repetida (x1 repetida)
    const repeatCount = state.count - 1;
    repeatBadgeHtml = `<div class="sticker-repeat-badge">+${repeatCount}</div>`;
  }
  
  card.innerHTML = `
    ${repeatBadgeHtml}
    <div class="sticker-slot-id">
      <span>${formattedId}</span>
    </div>
    <div class="sticker-slot-name">
      <span>${sticker.name.toUpperCase()}</span>
    </div>
    
    <!-- Controles flotantes de repetidas -->
    <div class="sticker-controls">
      <button class="control-btn btn-minus" title="Quitar unidad/repetida">-</button>
      <button class="control-btn btn-plus" title="Añadir repetida">+</button>
    </div>
  `;
  
  // Eventos
  card.addEventListener("click", (e) => {
    // Si se hizo click en un botón de control, no hacer nada aquí (ya tienen sus listeners)
    if (e.target.closest(".control-btn")) return;
    
    // Solo permitir marcar como obtenida si está missing.
    // Una vez obtenida o repetida, los cambios se controlan estrictamente con los botones + y -
    // para evitar desmarcados accidentales en móviles.
    if (state.status === "missing") {
      toggleStickerOwned(sticker.id);
    }
  });
  
  const btnPlus = card.querySelector(".btn-plus");
  const btnMinus = card.querySelector(".btn-minus");
  
  btnPlus.addEventListener("click", (e) => addRepeatedSticker(sticker.id, e));
  btnMinus.addEventListener("click", (e) => removeRepeatedSticker(sticker.id, e));
  
  return card;
}


// 5. ACTUALIZACIÓN DE PROGRESO GLOBAL (Header)
function updateGlobalProgress() {
  let ownedCount = 0;
  let repeatedCount = 0;
  
  Object.entries(collectionState).forEach(([stickerId, data]) => {
    if (data.status !== "missing") {
      ownedCount++;
      if (data.status === "repeated" && data.count > 1) {
        repeatedCount += (data.count - 1);
      }
    }
  });
  
  const missingCount = TOTAL_STICKERS - ownedCount;
  const percentage = Math.round((ownedCount / TOTAL_STICKERS) * 100) || 0;
  
  document.getElementById("global-owned-count").textContent = ownedCount;
  document.getElementById("global-missing-count").textContent = missingCount;
  document.getElementById("global-repeated-count").textContent = repeatedCount;
  document.getElementById("global-progress-percentage").textContent = `${percentage}%`;
  
  const progressBar = document.getElementById("global-progress-bar");
  progressBar.style.width = `${percentage}%`;
}


// 6. BUSCADOR EN TIEMPO REAL
function initSearch() {
  const searchInput = document.getElementById("sticker-search");
  
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === "") {
      // Si se limpia el buscador, volver a la página de equipo activa
      renderActiveTeamPage();
      return;
    }
    
    // Realizar búsqueda global en toda la base de datos
    const results = [];
    
    Object.values(ALBUM_DB).forEach(team => {
      team.stickers.forEach(sticker => {
        if (
          sticker.id.toLowerCase().includes(query) ||
          sticker.name.toLowerCase().includes(query) ||
          team.name.toLowerCase().includes(query)
        ) {
          results.push({
            ...sticker,
            teamName: team.name,
            teamFlag: team.flag
          });
        }
      });
    });
    
    // Renderizar resultados de búsqueda
    renderSearchResults(results, query);
  });
}

function renderSearchResults(results, query) {
  // Cambiar el layout de la página central para mostrar resultados de búsqueda
  const headerContainer = document.getElementById("active-team-header");
  headerContainer.innerHTML = `
    <span class="flag-icon">🔍</span>
    <div>
      <h2>Resultados de Búsqueda</h2>
      <span class="group-badge" style="color: var(--accent-blue);">"${query}"</span>
    </div>
  `;
  
  document.getElementById("team-percentage").textContent = "";
  document.getElementById("team-ratio").textContent = `${results.length} coincidencias`;
  document.getElementById("team-radial-fill").style.strokeDashoffset = 126;
  
  const grid = document.getElementById("stickers-grid");
  grid.innerHTML = "";
  
  if (results.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
        <p style="font-size: 1.1rem; font-weight: 500;">No se encontraron láminas coincidentes.</p>
        <p style="font-size: 0.85rem; margin-top: 0.5rem;">Intenta con el nombre de un jugador, país o número de lámina (ej. "Messi", "México", "ESP-11").</p>
      </div>
    `;
    return;
  }
  
  results.forEach(sticker => {
    const card = createStickerCard(sticker);
    
    // Modificar un poco la tarjeta para que muestre el país en los resultados globales
    const slotName = card.querySelector(".sticker-slot-name");
    if (slotName) {
      slotName.style.flexDirection = "column";
      slotName.style.gap = "2px";
      
      const teamBadge = document.createElement("div");
      teamBadge.style.fontSize = "0.6rem";
      teamBadge.style.color = "var(--accent-gold)";
      teamBadge.style.fontWeight = "700";
      teamBadge.textContent = `${sticker.teamFlag} ${sticker.teamName.toUpperCase()}`;
      slotName.appendChild(teamBadge);
    }
    
    grid.appendChild(card);
  });
}


// 7. PESTAÑA DE ESTADÍSTICAS DETALLADAS
function renderStatsTab() {
  let ownedCount = 0;
  let repeatedCount = 0;
  let completedPages = 0;
  
  Object.entries(collectionState).forEach(([stickerId, data]) => {
    if (data.status !== "missing") {
      ownedCount++;
      if (data.status === "repeated" && data.count > 1) {
        repeatedCount += (data.count - 1);
      }
    }
  });
  
  const missingCount = TOTAL_STICKERS - ownedCount;
  
  document.getElementById("stats-owned").textContent = ownedCount;
  document.getElementById("stats-missing").textContent = missingCount;
  document.getElementById("stats-repeated").textContent = repeatedCount;
  
  // Renderizar la lista de progreso por selección
  const listContainer = document.getElementById("teams-progress-list");
  listContainer.innerHTML = "";
  
  Object.values(ALBUM_DB).forEach(team => {
    const prog = getTeamProgress(team.id);
    if (prog.percentage === 100) completedPages++;
    
    const row = document.createElement("div");
    row.className = "team-progress-row";
    row.innerHTML = `
      <div class="team-row-info">
        <span>${team.flag}</span>
        <span style="font-weight: 500; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${team.name}</span>
      </div>
      <div class="team-row-bar-wrap">
        <div class="team-row-bar-fill" style="width: ${prog.percentage}%;"></div>
      </div>
      <div class="team-row-text">${prog.percentage}%</div>
      <div style="font-size: 0.75rem; color: var(--text-secondary); min-width: 45px; text-align: right;">${prog.owned}/${prog.total}</div>
    `;
    
    listContainer.appendChild(row);
  });
  
  document.getElementById("stats-completed-pages").textContent = completedPages;
}


// 8. PESTAÑA DE INTERCAMBIO (LISTAS)
function renderExchangeTab() {
  const missingList = [];
  const repeatedList = {};
  
  // Agrupar cromos por equipo
  Object.entries(ALBUM_DB).forEach(([teamId, team]) => {
    team.stickers.forEach(sticker => {
      const state = getStickerStatus(sticker.id);
      
      if (state.status === "missing") {
        // Añadir a faltantes
        missingList.push({
          id: sticker.id,
          name: sticker.name,
          teamId: teamId,
          teamName: team.name,
          number: sticker.number || parseInt(sticker.id.split("-")[1])
        });
      } else if (state.status === "repeated" && state.count > 1) {
        // Añadir a repetidas
        const repeatCount = state.count - 1;
        if (!repeatedList[teamId]) repeatedList[teamId] = [];
        repeatedList[teamId].push({
          id: sticker.id,
          name: sticker.name,
          count: repeatCount
        });
      }
    });
  });
  
  // 1. FORMATEAR LISTA DE FALTANTES
  const missingTextContainer = document.getElementById("list-missing-text");
  if (missingList.length === 0) {
    missingTextContainer.textContent = "¡Felicidades! Tienes el álbum completo. No te falta ningún cromo. 🎉";
  } else {
    // Agrupar por país para la lista compacta
    const groupedMissing = {};
    missingList.forEach(item => {
      if (!groupedMissing[item.teamId]) groupedMissing[item.teamId] = [];
      // Si es FWC (sección especial), colocamos el id completo, para otros el número formateado a 2 dígitos
      const label = item.teamId === "FWC" ? item.id : String(item.number).padStart(2, "0");
      groupedMissing[item.teamId].push(`${label} - ${item.name.toUpperCase()}`);
    });
    
    let textOut = `ÁLBUM PANINI MUNDIAL 2026 - MIS FALTANTES ❌\n`;
    textOut += `Progreso global: ${document.getElementById("global-progress-percentage").textContent} (${document.getElementById("global-owned-count").textContent}/${TOTAL_STICKERS})\n`;
    textOut += `Faltan: ${missingList.length} cromos\n`;
    textOut += `==========================================\n\n`;
    
    Object.entries(groupedMissing).forEach(([teamId, items]) => {
      const team = ALBUM_DB[teamId];
      textOut += `${team.flag} ${team.name} (${items.length}):\n`;
      textOut += `   ${items.join(", ")}\n\n`;
    });
    
    missingTextContainer.textContent = textOut;
  }
  
  // 2. FORMATEAR LISTA DE REPETIDAS
  const repeatedTextContainer = document.getElementById("list-repeated-text");
  const repeatedKeys = Object.keys(repeatedList);
  
  if (repeatedKeys.length === 0) {
    repeatedTextContainer.textContent = "No tienes láminas repetidas registradas para intercambio.";
  } else {
    let textOut = `ÁLBUM PANINI MUNDIAL 2026 - MIS REPETIDAS 🔄\n`;
    let totalRep = 0;
    
    Object.values(repeatedList).forEach(list => {
      list.forEach(item => totalRep += item.count);
    });
    
    textOut += `Total repetidas disponibles: ${totalRep} cromos\n`;
    textOut += `==========================================\n\n`;
    
    Object.entries(repeatedList).forEach(([teamId, items]) => {
      const team = ALBUM_DB[teamId];
      textOut += `${team.flag} ${team.name} (${items.length} tipos):\n`;
      const itemTexts = items.map(item => {
        // Obtener el número
        const numLabel = teamId === "FWC" ? item.id : item.id.split("-")[1];
        return `${numLabel} - ${item.name.toUpperCase()} (x${item.count})`;
      });
      textOut += `   ${itemTexts.join(", ")}\n\n`;
    });
    
    repeatedTextContainer.textContent = textOut;
  }
}

// Copiar texto al portapapeles
function copyTextToClipboard(text, successMsg) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMsg);
  }).catch(err => {
    console.error("Error al copiar texto: ", err);
    showToast("Error al copiar al portapapeles ⚠️");
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}


// 9. RESPALDOS, REINICIOS E IMPORTACIÓN
function initBackupAndReset() {
  // Modal Reiniciar
  const btnClear = document.getElementById("btn-clear-data");
  const modalReset = document.getElementById("modal-reset");
  const btnResetCancel = document.getElementById("btn-reset-cancel");
  const btnResetConfirm = document.getElementById("btn-reset-confirm");
  
  btnClear.addEventListener("click", () => {
    modalReset.classList.add("open");
  });
  
  btnResetCancel.addEventListener("click", () => {
    modalReset.classList.remove("open");
  });
  
  btnResetConfirm.addEventListener("click", () => {
    collectionState = {};
    saveCollectionState();
    modalReset.classList.remove("open");
    // Actualizar sidebar badges
    Object.keys(ALBUM_DB).forEach(teamId => {
      const badge = document.getElementById(`sidebar-badge-${teamId}`);
      if (badge) {
        const prog = getTeamProgress(teamId);
        badge.textContent = `${prog.owned}/${prog.total}`;
      }
    });
    renderActiveTeamPage();
    showToast("Colección reiniciada con éxito.");
  });
  
  // Modal Backup
  const btnExport = document.getElementById("btn-export-data");
  const btnImport = document.getElementById("btn-import-data");
  const modalBackup = document.getElementById("modal-backup");
  const btnBackupClose = document.getElementById("btn-backup-close");
  const btnBackupAction = document.getElementById("btn-backup-action");
  const backupTitle = document.getElementById("backup-modal-title");
  const backupDesc = document.getElementById("backup-modal-description");
  const backupText = document.getElementById("backup-textarea");
  
  let currentBackupMode = "export"; // 'export' o 'import'
  
  btnExport.addEventListener("click", () => {
    currentBackupMode = "export";
    backupTitle.textContent = "Respaldar / Exportar Datos";
    backupDesc.textContent = "Copia el siguiente código de seguridad para restaurar tu progreso en otro dispositivo:";
    btnBackupAction.textContent = "Copiar Código";
    btnBackupAction.style.display = "block";
    
    // Generar Base64 del estado
    const stateStr = JSON.stringify(collectionState);
    const base64Str = btoa(unescape(encodeURIComponent(stateStr)));
    backupText.value = base64Str;
    backupText.readOnly = true;
    
    modalBackup.classList.add("open");
  });
  
  btnImport.addEventListener("click", () => {
    currentBackupMode = "import";
    backupTitle.textContent = "Importar Copia de Respaldo";
    backupDesc.textContent = "Pega aquí el código de seguridad (Base64) generado anteriormente para restaurar tu progreso:";
    btnBackupAction.textContent = "Restaurar Progreso";
    btnBackupAction.style.display = "block";
    backupText.value = "";
    backupText.readOnly = false;
    backupText.placeholder = "Pega tu código aquí...";
    
    modalBackup.classList.add("open");
  });
  
  btnBackupClose.addEventListener("click", () => {
    modalBackup.classList.remove("open");
  });
  
  btnBackupAction.addEventListener("click", () => {
    if (currentBackupMode === "export") {
      // Copiar código
      copyTextToClipboard(backupText.value, "¡Código copiado con éxito! 📋");
      modalBackup.classList.remove("open");
    } else {
      // Importar
      const code = backupText.value.trim();
      if (!code) {
        showToast("Por favor, pega un código válido ⚠️");
        return;
      }
      
      try {
        const decodedStr = decodeURIComponent(escape(atob(code)));
        const importedState = JSON.parse(decodedStr);
        
        // Validación básica
        if (typeof importedState === "object") {
          collectionState = importedState;
          saveCollectionState();
          
          // Actualizar todo
          Object.keys(ALBUM_DB).forEach(teamId => {
            const badge = document.getElementById(`sidebar-badge-${teamId}`);
            if (badge) {
              const prog = getTeamProgress(teamId);
              badge.textContent = `${prog.owned}/${prog.total}`;
            }
          });
          
          renderActiveTeamPage();
          showToast("¡Colección restaurada con éxito! 🎉");
          modalBackup.classList.remove("open");
        } else {
          showToast("Código inválido o malformado ⚠️");
        }
      } catch (e) {
        console.error("Error al importar: ", e);
        showToast("Código corrupto o incompatible ⚠️");
      }
    }
  });
  
  // Eventos de botones de copiado de listas
  document.getElementById("btn-copy-missing").addEventListener("click", () => {
    const text = document.getElementById("list-missing-text").textContent;
    if (text.includes("No tienes láminas")) {
      showToast("No hay elementos para copiar.");
      return;
    }
    copyTextToClipboard(text, "¡Lista de Faltantes copiada! 📋");
  });
  
  document.getElementById("btn-copy-repeated").addEventListener("click", () => {
    const text = document.getElementById("list-repeated-text").textContent;
    if (text.includes("No tienes láminas")) {
      showToast("No hay elementos para copiar.");
      return;
    }
    copyTextToClipboard(text, "¡Lista de Repetidas copiada! 📋");
  });
}
