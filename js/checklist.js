/**
 * Checklist Persiapan Umroh Mandiri
 * Mutawwifmu Visual Design System Edition
 * Enhanced for Mobile & Desktop UX
 */

let checklistState = [];
let currentPhaseFilter = "all";

function initChecklist() {
  document.documentElement.removeAttribute("data-theme");
  localStorage.removeItem("mutawwifmu_theme");

  const saved = localStorage.getItem("MUTAWWIFMU_CHECKLIST");
  if (saved) {
    try {
      checklistState = JSON.parse(saved);
    } catch (e) {
      checklistState = JSON.parse(JSON.stringify(UMRAH_DATA.checklistPhases));
    }
  } else {
    checklistState = JSON.parse(JSON.stringify(UMRAH_DATA.checklistPhases));
  }

  setupPhaseTabs();
  renderChecklist();
  setupChecklistActions();
}

function saveChecklist() {
  localStorage.setItem("MUTAWWIFMU_CHECKLIST", JSON.stringify(checklistState));
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setupPhaseTabs() {
  const tabsContainer = document.getElementById("checklist-phase-tabs");
  if (!tabsContainer) return;

  tabsContainer.querySelectorAll(".phase-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      tabsContainer.querySelectorAll(".phase-tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentPhaseFilter = btn.dataset.phase || "all";
      renderChecklist();
    });
  });
}

function renderChecklist() {
  const container = document.getElementById("checklist-phases");
  if (!container) return;

  let totalTasks = 0;
  let completedTasks = 0;

  // Calculate totals across ALL phases
  checklistState.forEach(phase => {
    totalTasks += phase.items.length;
    completedTasks += phase.items.filter(i => i.done).length;
  });

  const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const fillEl = document.getElementById("progress-fill");
  const textEl = document.getElementById("progress-text");
  const countEl = document.getElementById("progress-count");

  if (fillEl) fillEl.style.width = `${percent}%`;
  if (textEl) textEl.textContent = `${percent}%`;
  if (countEl) countEl.textContent = `${completedTasks} dari ${totalTasks} persiapan terpenuhi`;

  // Filter which phases to show
  const filteredPhases = checklistState
    .map((phase, pIdx) => ({ phase, pIdx }))
    .filter(({ pIdx }) => currentPhaseFilter === "all" || String(pIdx) === String(currentPhaseFilter));

  container.innerHTML = filteredPhases.map(({ phase, pIdx }) => {
    const phaseTotal = phase.items.length;
    const phaseDone = phase.items.filter(i => i.done).length;
    const phasePercent = phaseTotal > 0 ? Math.round((phaseDone / phaseTotal) * 100) : 0;

    return `
      <div class="calc-card scroll-reveal is-revealed" style="margin-bottom: 16px;">
        <div class="card-header">
          <div class="step-info">
            <div class="step-num">0${pIdx + 1}</div>
            <div>
              <h2 class="card-title">${escapeHtml(phase.title)}</h2>
              <p class="card-subtitle">${phaseDone} dari ${phaseTotal} persiapan selesai</p>
            </div>
          </div>
          <div class="card-subtotal">
            <div class="sar-val">${phasePercent}% Selesai</div>
            <div class="idr-val">${phaseDone}/${phaseTotal} Terpenuhi</div>
          </div>
        </div>
        <div class="task-list" style="display: flex; flex-direction: column; gap: 8px;">
          ${phase.items.map((item, iIdx) => `
            <label class="checklist-task-card ${item.done ? 'is-done' : ''}" for="chk-${pIdx}-${iIdx}">
              <div class="checklist-task-left">
                <input type="checkbox" id="chk-${pIdx}-${iIdx}" class="checklist-checkbox" data-phase="${pIdx}" data-item="${iIdx}" ${item.done ? 'checked' : ''}>
                <span class="checklist-task-text">${escapeHtml(item.text)}</span>
              </div>
              ${item.id && item.id.startsWith("custom_") ? `
                <button type="button" class="checklist-task-del" data-del-phase="${pIdx}" data-del-item="${iIdx}" title="Hapus catatan kustom" aria-label="Hapus catatan">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              ` : ''}
            </label>
          `).join("")}
        </div>
      </div>
    `;
  }).join("");

  // Checkbox change handlers
  container.querySelectorAll('input[type="checkbox"]').forEach(chk => {
    chk.addEventListener("change", (e) => {
      const pIdx = parseInt(e.target.dataset.phase, 10);
      const iIdx = parseInt(e.target.dataset.item, 10);
      if (checklistState[pIdx] && checklistState[pIdx].items[iIdx]) {
        checklistState[pIdx].items[iIdx].done = e.target.checked;
        saveChecklist();
        renderChecklist();
      }
    });
  });

  // Delete custom items handlers
  container.querySelectorAll(".checklist-task-del").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const pIdx = parseInt(btn.dataset.delPhase, 10);
      const iIdx = parseInt(btn.dataset.delItem, 10);
      if (checklistState[pIdx] && checklistState[pIdx].items[iIdx]) {
        checklistState[pIdx].items.splice(iIdx, 1);
        saveChecklist();
        renderChecklist();
      }
    });
  });
}

function setupChecklistActions() {
  const addBtn = document.getElementById("btn-add-task");
  const inputEl = document.getElementById("input-new-task");
  const selectPhase = document.getElementById("select-task-phase");

  if (addBtn && inputEl && selectPhase) {
    addBtn.addEventListener("click", () => {
      const text = (inputEl.value || "").trim();
      const pIdx = parseInt(selectPhase.value, 10) || 0;
      if (!text) return;

      if (checklistState[pIdx]) {
        checklistState[pIdx].items.push({
          id: "custom_" + Date.now(),
          text: text,
          done: false
        });
        inputEl.value = "";
        saveChecklist();
        renderChecklist();
      }
    });

    inputEl.addEventListener("keypress", (e) => {
      if (e.key === "Enter") addBtn.click();
    });
  }

  const resetBtn = document.getElementById("btn-reset-checklist");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Reset ulang seluruh checklist ke pengaturan awal?")) {
        checklistState = JSON.parse(JSON.stringify(UMRAH_DATA.checklistPhases));
        saveChecklist();
        renderChecklist();
      }
    });
  }

  const printBtn = document.getElementById("btn-print-checklist");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }
}

function setupNavMenu() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const navMenu = document.getElementById("primary-nav-menu");
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = navMenu.classList.toggle("open");
    toggleBtn.setAttribute("aria-expanded", isOpen);
  });

  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      navMenu.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  });

  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
    });
  });

  // Breakout of iframe for any mutawwifmu.com links when embedded
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    const href = link.getAttribute("href");
    if (href && (href.startsWith("https://mutawwifmu.com") || href.startsWith("http://mutawwifmu.com"))) {
      if (window.self !== window.top) {
        e.preventDefault();
        try {
          window.top.location.href = href;
        } catch (err) {
          window.location.href = href;
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initChecklist();
  setupNavMenu();
});
