/**
 * Checklist Persiapan Umroh - Mutawwifmu Edition
 * Interactive task manager with progress bar, localStorage persistence, and print export.
 */

let checklistState = [];

function initChecklist() {
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

  renderChecklist();
  setupChecklistActions();
}

function saveChecklist() {
  localStorage.setItem("MUTAWWIFMU_CHECKLIST", JSON.stringify(checklistState));
}

function renderChecklist() {
  const container = document.getElementById("checklist-phases");
  if (!container) return;

  let totalTasks = 0;
  let completedTasks = 0;

  container.innerHTML = checklistState.map((phase, pIdx) => {
    const phaseTotal = phase.items.length;
    const phaseDone = phase.items.filter(i => i.done).length;
    totalTasks += phaseTotal;
    completedTasks += phaseDone;

    return `
      <div class="calc-card" style="margin-bottom: 20px;">
        <div class="card-header" style="margin-bottom: 14px; padding-bottom: 10px;">
          <div>
            <h3 class="card-title" style="font-size: 16px;">${phase.title}</h3>
            <span class="card-subtitle">${phaseDone} dari ${phaseTotal} persiapan selesai</span>
          </div>
        </div>
        <div class="task-list" style="display: flex; flex-direction: column; gap: 10px;">
          ${phase.items.map((item, iIdx) => `
            <label class="option-card ${item.done ? 'checked' : ''}" style="padding: 10px 14px;">
              <input type="checkbox" data-phase="${pIdx}" data-item="${iIdx}" ${item.done ? 'checked' : ''}>
              <div class="option-content">
                <span style="${item.done ? 'text-decoration: line-through; opacity: 0.7;' : 'font-weight: 500;'} font-size: 13.5px;">
                  ${item.text}
                </span>
              </div>
            </label>
          `).join("")}
        </div>
      </div>
    `;
  }).join("");

  // Update Progress Bar
  const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const fillEl = document.getElementById("progress-fill");
  const textEl = document.getElementById("progress-text");
  const countEl = document.getElementById("progress-count");

  if (fillEl) fillEl.style.width = `${percent}%`;
  if (textEl) textEl.textContent = `${percent}%`;
  if (countEl) countEl.textContent = `${completedTasks} dari ${totalTasks} persiapan terpenuhi`;

  // Attach Checkbox event listeners
  container.querySelectorAll('input[type="checkbox"]').forEach(chk => {
    chk.addEventListener("change", (e) => {
      const pIdx = parseInt(e.target.dataset.phase, 10);
      const iIdx = parseInt(e.target.dataset.item, 10);
      checklistState[pIdx].items[iIdx].done = e.target.checked;
      saveChecklist();
      renderChecklist();
    });
  });
}

function setupChecklistActions() {
  // Add task button
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

  // Reset button
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

  // Print button
  const printBtn = document.getElementById("btn-print-checklist");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }
}

document.addEventListener("DOMContentLoaded", initChecklist);
