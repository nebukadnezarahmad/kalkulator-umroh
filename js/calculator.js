/**
 * Kalkulator Biaya Umroh Mandiri - Logic & Calculations
 * Mutawwifmu Visual Design Edition
 */

let calcState = {
  pax: 2,
  makkah: {
    hotelId: "emaar_grand",
    roomType: "quad", // 'double' | 'triple' | 'quad'
    nights: 5,
    rooms: 1
  },
  madinah: {
    hotelId: "saja_al_madinah",
    roomType: "quad",
    nights: 4,
    rooms: 1
  },
  hhr: {
    selectedRoutes: ["makkah_madinah"],
    tickets: 2
  },
  transport: {
    selectedIds: ["airport_hotel_jeddah", "carter_ziarah_makkah", "carter_ziarah_medinah"]
  },
  mutawwif: {
    selectedIds: ["mutawwif_full", "airport_handling"]
  },
  flight: {
    selectedId: "saudia",
    customPrice: 0
  }
};

// Utilities for currency formatting
function formatIDR(val) {
  return "Rp" + Math.round(val).toLocaleString("id-ID");
}

function formatSAR(val) {
  return Math.round(val).toLocaleString("en-US") + " SAR";
}

function formatUSD(val) {
  return "$" + Math.round(val).toLocaleString("en-US");
}

// Main calculation function
function recalculateAll() {
  const currency = UMRAH_DATA.config.currency;
  const pax = Math.max(1, calcState.pax);

  // 1. Visa & Asuransi
  const visaUsd = pax * UMRAH_DATA.visa.priceUsd;
  const visaIdr = visaUsd * currency.USD_TO_IDR;

  // 2. Hotel Makkah
  const hotelMakkah = UMRAH_DATA.hotelsMakkah.find(h => h.id === calcState.makkah.hotelId) || UMRAH_DATA.hotelsMakkah[0];
  const makkahPricePerNight = hotelMakkah.prices[calcState.makkah.roomType] || 0;
  const makkahSar = makkahPricePerNight * calcState.makkah.nights * calcState.makkah.rooms;
  const makkahIdr = makkahSar * currency.SAR_TO_IDR;

  // 3. Hotel Madinah
  const hotelMadinah = UMRAH_DATA.hotelsMadinah.find(h => h.id === calcState.madinah.hotelId) || UMRAH_DATA.hotelsMadinah[0];
  const madinahPricePerNight = hotelMadinah.prices[calcState.madinah.roomType] || 0;
  const madinahSar = madinahPricePerNight * calcState.madinah.nights * calcState.madinah.rooms;
  const madinahIdr = madinahSar * currency.SAR_TO_IDR;

  // 4. Kereta Cepat Haramain (HHR)
  let hhrSingleTripCost = 0;
  calcState.hhr.selectedRoutes.forEach(rId => {
    const route = UMRAH_DATA.hhrRoutes.find(r => r.id === rId);
    if (route) hhrSingleTripCost += route.priceSar;
  });
  const hhrSar = hhrSingleTripCost * calcState.hhr.tickets;
  const hhrIdr = hhrSar * currency.SAR_TO_IDR;

  // 5. Transportasi Lokal & Carter
  let transportSar = 0;
  calcState.transport.selectedIds.forEach(tId => {
    const item = UMRAH_DATA.localTransport.find(t => t.id === tId);
    if (item) transportSar += item.priceSar;
  });
  const transportIdr = transportSar * currency.SAR_TO_IDR;

  // 6. Mutawwif & Layanan Tambahan
  let mutawwifSar = 0;
  let mutawwifIdr = 0;
  calcState.mutawwif.selectedIds.forEach(mId => {
    const item = UMRAH_DATA.mutawwifServices.find(m => m.id === mId);
    if (item) {
      if (item.priceSar) mutawwifSar += item.priceSar;
      if (item.priceIdr) {
        mutawwifIdr += item.isPerPax ? (item.priceIdr * pax) : item.priceIdr;
      }
    }
  });

  // 7. Tiket Pesawat
  let flightIdr = 0;
  const flightItem = UMRAH_DATA.flightEstimates.find(f => f.id === calcState.flight.selectedId);
  if (flightItem) {
    if (flightItem.id === "custom_flight") {
      flightIdr = calcState.flight.customPrice * pax;
    } else {
      flightIdr = flightItem.priceIdr * pax;
    }
  }

  // Akumulasi Total
  const totalSar = makkahSar + madinahSar + hhrSar + transportSar + mutawwifSar;
  const totalIdr = (totalSar * currency.SAR_TO_IDR) + visaIdr + mutawwifIdr + flightIdr;
  const perPaxIdr = Math.round(totalIdr / pax);

  // Update UI Elements
  updateUI({
    visaUsd,
    visaIdr,
    makkahSar,
    makkahIdr,
    madinahSar,
    madinahIdr,
    hhrSar,
    hhrIdr,
    transportSar,
    transportIdr,
    mutawwifSar,
    mutawwifIdr,
    flightIdr,
    totalSar,
    totalIdr,
    perPaxIdr
  });
}

function updateUI(res) {
  // 1. Visa Subtotal
  const visaSarEl = document.getElementById("subtotal-visa-sar");
  const visaIdrEl = document.getElementById("subtotal-visa-idr");
  if (visaSarEl) visaSarEl.textContent = formatUSD(res.visaUsd);
  if (visaIdrEl) visaIdrEl.textContent = formatIDR(res.visaIdr);

  // 2. Hotel Makkah Subtotal
  const makkahSarEl = document.getElementById("subtotal-makkah-sar");
  const makkahIdrEl = document.getElementById("subtotal-makkah-idr");
  if (makkahSarEl) makkahSarEl.textContent = formatSAR(res.makkahSar);
  if (makkahIdrEl) makkahIdrEl.textContent = formatIDR(res.makkahIdr);

  // 3. Hotel Madinah Subtotal
  const madinahSarEl = document.getElementById("subtotal-madinah-sar");
  const madinahIdrEl = document.getElementById("subtotal-madinah-idr");
  if (madinahSarEl) madinahSarEl.textContent = formatSAR(res.madinahSar);
  if (madinahIdrEl) madinahIdrEl.textContent = formatIDR(res.madinahIdr);

  // 4. HHR Subtotal
  const hhrSarEl = document.getElementById("subtotal-hhr-sar");
  const hhrIdrEl = document.getElementById("subtotal-hhr-idr");
  if (hhrSarEl) hhrSarEl.textContent = formatSAR(res.hhrSar);
  if (hhrIdrEl) hhrIdrEl.textContent = formatIDR(res.hhrIdr);

  // 5. Transport Subtotal
  const transportSarEl = document.getElementById("subtotal-transport-sar");
  const transportIdrEl = document.getElementById("subtotal-transport-idr");
  if (transportSarEl) transportSarEl.textContent = formatSAR(res.transportSar);
  if (transportIdrEl) transportIdrEl.textContent = formatIDR(res.transportIdr);

  // 6. Mutawwif Subtotal
  const mutawwifSarEl = document.getElementById("subtotal-mutawwif-sar");
  const mutawwifIdrEl = document.getElementById("subtotal-mutawwif-idr");
  if (mutawwifSarEl) mutawwifSarEl.textContent = formatSAR(res.mutawwifSar);
  if (mutawwifIdrEl) mutawwifIdrEl.textContent = formatIDR((res.mutawwifSar * UMRAH_DATA.config.currency.SAR_TO_IDR) + res.mutawwifIdr);

  // 7. Flight Subtotal
  const flightIdrEl = document.getElementById("subtotal-flight-idr");
  if (flightIdrEl) flightIdrEl.textContent = formatIDR(res.flightIdr);

  // 8. Sticky Bottom Summary Bar
  const stickyIdr = document.getElementById("sticky-total-idr");
  const stickyPerPax = document.getElementById("sticky-perpax-idr");
  const stickySar = document.getElementById("sticky-total-sar");
  const stickyVisa = document.getElementById("sticky-total-visa");

  if (stickyIdr) stickyIdr.textContent = formatIDR(res.totalIdr);
  if (stickyPerPax) stickyPerPax.textContent = formatIDR(res.perPaxIdr) + " / org";
  if (stickySar) stickySar.textContent = formatSAR(res.totalSar);
  if (stickyVisa) stickyVisa.textContent = formatUSD(res.visaUsd);
}

// Initializer & DOM Event Listeners
function initCalculator() {
  // Populate Hotels Makkah
  const makkahSelect = document.getElementById("hotel-makkah-select");
  if (makkahSelect) {
    makkahSelect.innerHTML = UMRAH_DATA.hotelsMakkah.map(h => 
      `<option value="${h.id}" ${h.id === calcState.makkah.hotelId ? 'selected' : ''}>${h.name} - ${h.dist}</option>`
    ).join("");
    makkahSelect.addEventListener("change", (e) => {
      calcState.makkah.hotelId = e.target.value;
      updateHotelMakkahInfo();
      recalculateAll();
    });
  }

  // Populate Hotels Madinah
  const madinahSelect = document.getElementById("hotel-madinah-select");
  if (madinahSelect) {
    madinahSelect.innerHTML = UMRAH_DATA.hotelsMadinah.map(h => 
      `<option value="${h.id}" ${h.id === calcState.madinah.hotelId ? 'selected' : ''}>${h.name} - ${h.dist}</option>`
    ).join("");
    madinahSelect.addEventListener("change", (e) => {
      calcState.madinah.hotelId = e.target.value;
      updateHotelMadinahInfo();
      recalculateAll();
    });
  }

  // Populate HHR Routes checkboxes
  const hhrContainer = document.getElementById("hhr-routes-container");
  if (hhrContainer) {
    hhrContainer.innerHTML = UMRAH_DATA.hhrRoutes.map(r => {
      const isChecked = calcState.hhr.selectedRoutes.includes(r.id);
      return `
        <label class="option-card ${isChecked ? 'checked' : ''}" data-hhr-id="${r.id}">
          <input type="checkbox" value="${r.id}" ${isChecked ? 'checked' : ''}>
          <div class="option-content">
            <div class="option-label">
              <span>${r.label}</span>
              <span class="option-price">${r.priceSar} SAR</span>
            </div>
            <div class="option-desc">${r.desc}</div>
          </div>
        </label>
      `;
    }).join("");

    hhrContainer.querySelectorAll('input[type="checkbox"]').forEach(chk => {
      chk.addEventListener("change", (e) => {
        const id = e.target.value;
        const card = chk.closest(".option-card");
        if (e.target.checked) {
          if (!calcState.hhr.selectedRoutes.includes(id)) calcState.hhr.selectedRoutes.push(id);
          card.classList.add("checked");
        } else {
          calcState.hhr.selectedRoutes = calcState.hhr.selectedRoutes.filter(x => x !== id);
          card.classList.remove("checked");
        }
        recalculateAll();
      });
    });
  }

  // Populate Local Transport options
  const transportContainer = document.getElementById("local-transport-container");
  if (transportContainer) {
    transportContainer.innerHTML = UMRAH_DATA.localTransport.map(t => {
      const isChecked = calcState.transport.selectedIds.includes(t.id);
      return `
        <label class="option-card ${isChecked ? 'checked' : ''}" data-transport-id="${t.id}">
          <input type="checkbox" value="${t.id}" ${isChecked ? 'checked' : ''}>
          <div class="option-content">
            <div class="option-label">
              <span>${t.label}</span>
              <span class="option-price">${t.priceSar} SAR</span>
            </div>
          </div>
        </label>
      `;
    }).join("");

    transportContainer.querySelectorAll('input[type="checkbox"]').forEach(chk => {
      chk.addEventListener("change", (e) => {
        const id = e.target.value;
        const card = chk.closest(".option-card");
        if (e.target.checked) {
          if (!calcState.transport.selectedIds.includes(id)) calcState.transport.selectedIds.push(id);
          card.classList.add("checked");
        } else {
          calcState.transport.selectedIds = calcState.transport.selectedIds.filter(x => x !== id);
          card.classList.remove("checked");
        }
        recalculateAll();
      });
    });
  }

  // Populate Mutawwif Services options
  const mutawwifContainer = document.getElementById("mutawwif-services-container");
  if (mutawwifContainer) {
    mutawwifContainer.innerHTML = UMRAH_DATA.mutawwifServices.map(m => {
      const isChecked = calcState.mutawwif.selectedIds.includes(m.id);
      const priceStr = m.priceSar ? `${m.priceSar} SAR` : `${formatIDR(m.priceIdr)}${m.isPerPax ? '/pax' : ''}`;
      return `
        <label class="option-card ${isChecked ? 'checked' : ''}" data-mutawwif-id="${m.id}">
          <input type="checkbox" value="${m.id}" ${isChecked ? 'checked' : ''}>
          <div class="option-content">
            <div class="option-label">
              <span>${m.label}</span>
              <span class="option-price">${priceStr}</span>
            </div>
            <div class="option-desc">${m.desc}</div>
          </div>
        </label>
      `;
    }).join("");

    mutawwifContainer.querySelectorAll('input[type="checkbox"]').forEach(chk => {
      chk.addEventListener("change", (e) => {
        const id = e.target.value;
        const card = chk.closest(".option-card");
        if (e.target.checked) {
          if (!calcState.mutawwif.selectedIds.includes(id)) calcState.mutawwif.selectedIds.push(id);
          card.classList.add("checked");
        } else {
          calcState.mutawwif.selectedIds = calcState.mutawwif.selectedIds.filter(x => x !== id);
          card.classList.remove("checked");
        }
        recalculateAll();
      });
    });
  }

  // Populate Flight selector
  const flightSelect = document.getElementById("flight-select");
  if (flightSelect) {
    flightSelect.innerHTML = UMRAH_DATA.flightEstimates.map(f => {
      const priceLabel = f.priceIdr > 0 ? `(~${formatIDR(f.priceIdr)}/pax)` : `(Bebas Tulis)`;
      return `<option value="${f.id}" ${f.id === calcState.flight.selectedId ? 'selected' : ''}>${f.label} ${priceLabel}</option>`;
    }).join("");

    const customFlightWrap = document.getElementById("custom-flight-wrap");
    const customFlightInput = document.getElementById("custom-flight-input");

    flightSelect.addEventListener("change", (e) => {
      calcState.flight.selectedId = e.target.value;
      if (e.target.value === "custom_flight") {
        if (customFlightWrap) customFlightWrap.style.display = "block";
      } else {
        if (customFlightWrap) customFlightWrap.style.display = "none";
      }
      recalculateAll();
    });

    if (customFlightInput) {
      customFlightInput.addEventListener("input", (e) => {
        calcState.flight.customPrice = parseInt(e.target.value.replace(/\D/g, ""), 10) || 0;
        recalculateAll();
      });
    }
  }

  // Room type selectors for Makkah
  setupRoomTypeSelector("makkah");
  setupRoomTypeSelector("madinah");

  // Steppers for Pax, Nights, Rooms, HHR Tickets
  setupStepper("pax-count", (val) => {
    calcState.pax = Math.max(1, val);
    // Sync to HHR tickets automatically if they were equal
    const hhrInput = document.getElementById("hhr-tickets");
    if (hhrInput && parseInt(hhrInput.value, 10) === calcState.hhr.tickets) {
      calcState.hhr.tickets = calcState.pax;
      hhrInput.value = calcState.hhr.tickets;
    }
    recalculateAll();
  });

  setupStepper("makkah-nights", (val) => {
    calcState.makkah.nights = Math.max(1, val);
    recalculateAll();
  });

  setupStepper("makkah-rooms", (val) => {
    calcState.makkah.rooms = Math.max(1, val);
    recalculateAll();
  });

  setupStepper("madinah-nights", (val) => {
    calcState.madinah.nights = Math.max(1, val);
    recalculateAll();
  });

  setupStepper("madinah-rooms", (val) => {
    calcState.madinah.rooms = Math.max(1, val);
    recalculateAll();
  });

  setupStepper("hhr-tickets", (val) => {
    calcState.hhr.tickets = Math.max(0, val);
    recalculateAll();
  });

  updateHotelMakkahInfo();
  updateHotelMadinahInfo();
  recalculateAll();
}

function setupRoomTypeSelector(city) {
  const container = document.getElementById(`room-type-${city}`);
  if (!container) return;

  container.querySelectorAll(".room-type-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      container.querySelectorAll(".room-type-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      calcState[city].roomType = btn.dataset.roomType;
      recalculateAll();
    });
  });
}

function setupStepper(inputId, onChange) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const parent = input.closest(".stepper-wrap");
  if (!parent) return;

  const btnMinus = parent.querySelector(".stepper-minus");
  const btnPlus = parent.querySelector(".stepper-plus");

  if (btnMinus) {
    btnMinus.addEventListener("click", () => {
      let val = parseInt(input.value, 10) || 1;
      if (val > 1) {
        val--;
        input.value = val;
        onChange(val);
      }
    });
  }

  if (btnPlus) {
    btnPlus.addEventListener("click", () => {
      let val = parseInt(input.value, 10) || 1;
      val++;
      input.value = val;
      onChange(val);
    });
  }

  input.addEventListener("input", () => {
    let val = parseInt(input.value, 10) || 1;
    onChange(val);
  });
}

function updateHotelMakkahInfo() {
  const hotel = UMRAH_DATA.hotelsMakkah.find(h => h.id === calcState.makkah.hotelId);
  const infoEl = document.getElementById("hotel-makkah-info");
  if (hotel && infoEl) {
    infoEl.innerHTML = `
      <div class="hotel-spec">
        <span class="spec-item">★ <b>Bintang ${hotel.stars}</b></span>
        <span class="spec-item">📍 <b>${hotel.dist}</b></span>
      </div>
      <div style="font-size:12.5px;color:var(--text-muted)">
        Quad: <b>${hotel.prices.quad} SAR</b> · Triple: <b>${hotel.prices.triple} SAR</b> · Double: <b>${hotel.prices.double} SAR</b>
      </div>
    `;
  }
}

function updateHotelMadinahInfo() {
  const hotel = UMRAH_DATA.hotelsMadinah.find(h => h.id === calcState.madinah.hotelId);
  const infoEl = document.getElementById("hotel-madinah-info");
  if (hotel && infoEl) {
    infoEl.innerHTML = `
      <div class="hotel-spec">
        <span class="spec-item">★ <b>Bintang ${hotel.stars}</b></span>
        <span class="spec-item">📍 <b>${hotel.dist}</b></span>
      </div>
      <div style="font-size:12.5px;color:var(--text-muted)">
        Quad: <b>${hotel.prices.quad} SAR</b> · Triple: <b>${hotel.prices.triple} SAR</b> · Double: <b>${hotel.prices.double} SAR</b>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", initCalculator);
