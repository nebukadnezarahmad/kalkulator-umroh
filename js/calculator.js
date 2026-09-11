/**
 * Kalkulator Biaya Umroh Mandiri - Logic & Calculations
 * Mutawwifmu Visual Design System Edition
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

function formatIDR(val) {
  return "Rp" + Math.round(val).toLocaleString("id-ID");
}

function formatSAR(val) {
  return Math.round(val).toLocaleString("en-US") + " SAR";
}

function formatUSD(val) {
  return "$" + Math.round(val).toLocaleString("en-US");
}

function showToast(message) {
  const toast = document.getElementById("toast-notice");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

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

  // Update Subtotals
  const visaSarEl = document.getElementById("subtotal-visa-sar");
  const visaIdrEl = document.getElementById("subtotal-visa-idr");
  if (visaSarEl) visaSarEl.textContent = formatUSD(visaUsd);
  if (visaIdrEl) visaIdrEl.textContent = formatIDR(visaIdr);

  const makkahSarEl = document.getElementById("subtotal-makkah-sar");
  const makkahIdrEl = document.getElementById("subtotal-makkah-idr");
  if (makkahSarEl) makkahSarEl.textContent = formatSAR(makkahSar);
  if (makkahIdrEl) makkahIdrEl.textContent = formatIDR(makkahIdr);

  const madinahSarEl = document.getElementById("subtotal-madinah-sar");
  const madinahIdrEl = document.getElementById("subtotal-madinah-idr");
  if (madinahSarEl) madinahSarEl.textContent = formatSAR(madinahSar);
  if (madinahIdrEl) madinahIdrEl.textContent = formatIDR(madinahIdr);

  const hhrSarEl = document.getElementById("subtotal-hhr-sar");
  const hhrIdrEl = document.getElementById("subtotal-hhr-idr");
  if (hhrSarEl) hhrSarEl.textContent = formatSAR(hhrSar);
  if (hhrIdrEl) hhrIdrEl.textContent = formatIDR(hhrIdr);

  const transportSarEl = document.getElementById("subtotal-transport-sar");
  const transportIdrEl = document.getElementById("subtotal-transport-idr");
  if (transportSarEl) transportSarEl.textContent = formatSAR(transportSar);
  if (transportIdrEl) transportIdrEl.textContent = formatIDR(transportIdr);

  const mutawwifSarEl = document.getElementById("subtotal-mutawwif-sar");
  const mutawwifIdrEl = document.getElementById("subtotal-mutawwif-idr");
  if (mutawwifSarEl) mutawwifSarEl.textContent = formatSAR(mutawwifSar);
  if (mutawwifIdrEl) mutawwifIdrEl.textContent = formatIDR((mutawwifSar * currency.SAR_TO_IDR) + mutawwifIdr);

  const flightSarEl = document.getElementById("subtotal-flight-sar");
  const flightIdrEl = document.getElementById("subtotal-flight-idr");
  if (flightSarEl) flightSarEl.textContent = formatSAR(Math.round(flightIdr / currency.SAR_TO_IDR));
  if (flightIdrEl) flightIdrEl.textContent = formatIDR(flightIdr);

  // Update Sticky Summary Bar
  const stickyTotalEl = document.getElementById("sticky-total-idr");
  const stickyPerPaxEl = document.getElementById("sticky-perpax-idr");
  const stickyTotalSarEl = document.getElementById("sticky-total-sar");
  const stickyTotalVisaEl = document.getElementById("sticky-total-visa");

  if (stickyTotalEl) stickyTotalEl.textContent = formatIDR(totalIdr);
  if (stickyPerPaxEl) stickyPerPaxEl.textContent = formatIDR(perPaxIdr) + " / org";
  if (stickyTotalSarEl) stickyTotalSarEl.textContent = formatSAR(totalSar);
  if (stickyTotalVisaEl) stickyTotalVisaEl.textContent = formatUSD(visaUsd);

  // Room capacity calculation hints
  updateRoomCapacityHints();
}

function updateRoomCapacityHints() {
  const pax = calcState.pax;
  const makkahCap = calcState.makkah.roomType === 'quad' ? 4 : calcState.makkah.roomType === 'triple' ? 3 : 2;
  const madinahCap = calcState.madinah.roomType === 'quad' ? 4 : calcState.madinah.roomType === 'triple' ? 3 : 2;

  const makkahAutoRooms = Math.ceil(pax / makkahCap);
  const madinahAutoRooms = Math.ceil(pax / madinahCap);

  const makkahHint = document.getElementById("makkah-room-calc-hint");
  if (makkahHint) {
    makkahHint.textContent = `${pax} pax: ${makkahAutoRooms} kamar (${calcState.makkah.roomType.toUpperCase()})`;
  }

  const madinahHint = document.getElementById("madinah-room-calc-hint");
  if (madinahHint) {
    madinahHint.textContent = `${pax} pax: ${madinahAutoRooms} kamar (${calcState.madinah.roomType.toUpperCase()})`;
  }
}

function initCalculator() {
  document.documentElement.removeAttribute("data-theme");
  localStorage.removeItem("mutawwifmu_theme");

  // Populate Makkah Hotels
  const makkahSelect = document.getElementById("hotel-makkah-select");
  if (makkahSelect) {
    makkahSelect.innerHTML = UMRAH_DATA.hotelsMakkah.map(h => 
      `<option value="${h.id}" ${h.id === calcState.makkah.hotelId ? 'selected' : ''}>${h.name} (${h.dist}, ★${h.stars})</option>`
    ).join("");

    makkahSelect.addEventListener("change", (e) => {
      calcState.makkah.hotelId = e.target.value;
      updateHotelMakkahInfo();
      recalculateAll();
    });
  }

  // Populate Madinah Hotels
  const madinahSelect = document.getElementById("hotel-madinah-select");
  if (madinahSelect) {
    madinahSelect.innerHTML = UMRAH_DATA.hotelsMadinah.map(h => 
      `<option value="${h.id}" ${h.id === calcState.madinah.hotelId ? 'selected' : ''}>${h.name} (${h.dist}, ★${h.stars})</option>`
    ).join("");

    madinahSelect.addEventListener("change", (e) => {
      calcState.madinah.hotelId = e.target.value;
      updateHotelMadinahInfo();
      recalculateAll();
    });
  }

  // Setup HHR Routes
  const hhrContainer = document.getElementById("hhr-routes-list");
  if (hhrContainer) {
    hhrContainer.innerHTML = UMRAH_DATA.hhrRoutes.map(r => {
      const isChecked = calcState.hhr.selectedRoutes.includes(r.id);
      return `
        <label class="option-item ${isChecked ? 'selected' : ''}" for="hhr-${r.id}">
          <div class="option-left">
            <input type="checkbox" id="hhr-${r.id}" class="option-checkbox" value="${r.id}" ${isChecked ? 'checked' : ''}>
            <div>
              <div class="option-label">${r.route}</div>
              <div class="option-desc">${r.class} · estimasi ${r.duration}</div>
            </div>
          </div>
          <div class="option-price">${formatSAR(r.priceSar)} / tiket</div>
        </label>
      `;
    }).join("");

    hhrContainer.querySelectorAll('input[type="checkbox"]').forEach(chk => {
      chk.addEventListener("change", (e) => {
        const id = e.target.value;
        const item = chk.closest(".option-item");
        if (e.target.checked) {
          if (!calcState.hhr.selectedRoutes.includes(id)) calcState.hhr.selectedRoutes.push(id);
          item.classList.add("selected");
        } else {
          calcState.hhr.selectedRoutes = calcState.hhr.selectedRoutes.filter(x => x !== id);
          item.classList.remove("selected");
        }
        recalculateAll();
      });
    });
  }

  // Setup Transport
  const transportContainer = document.getElementById("transport-routes-list");
  if (transportContainer) {
    transportContainer.innerHTML = UMRAH_DATA.localTransport.map(t => {
      const isChecked = calcState.transport.selectedIds.includes(t.id);
      return `
        <label class="option-item ${isChecked ? 'selected' : ''}" for="transport-${t.id}">
          <div class="option-left">
            <input type="checkbox" id="transport-${t.id}" class="option-checkbox" value="${t.id}" ${isChecked ? 'checked' : ''}>
            <div>
              <div class="option-label">${t.title}</div>
              <div class="option-desc">${t.vehicle} · ${t.desc}</div>
            </div>
          </div>
          <div class="option-price">${formatSAR(t.priceSar)}</div>
        </label>
      `;
    }).join("");

    transportContainer.querySelectorAll('input[type="checkbox"]').forEach(chk => {
      chk.addEventListener("change", (e) => {
        const id = e.target.value;
        const item = chk.closest(".option-item");
        if (e.target.checked) {
          if (!calcState.transport.selectedIds.includes(id)) calcState.transport.selectedIds.push(id);
          item.classList.add("selected");
        } else {
          calcState.transport.selectedIds = calcState.transport.selectedIds.filter(x => x !== id);
          item.classList.remove("selected");
        }
        recalculateAll();
      });
    });
  }

  // Setup Mutawwif Services
  const mutawwifContainer = document.getElementById("mutawwif-services-list");
  if (mutawwifContainer) {
    mutawwifContainer.innerHTML = UMRAH_DATA.mutawwifServices.map(m => {
      const isChecked = calcState.mutawwif.selectedIds.includes(m.id);
      const priceText = m.priceSar ? `${formatSAR(m.priceSar)}` : `${formatIDR(m.priceIdr)}${m.isPerPax ? '/pax' : ''}`;
      return `
        <label class="option-item ${isChecked ? 'selected' : ''}" for="mutawwif-${m.id}">
          <div class="option-left">
            <input type="checkbox" id="mutawwif-${m.id}" class="option-checkbox" value="${m.id}" ${isChecked ? 'checked' : ''}>
            <div>
              <div class="option-label">${m.title}</div>
              <div class="option-desc">${m.desc}</div>
            </div>
          </div>
          <div class="option-price">${priceText}</div>
        </label>
      `;
    }).join("");

    mutawwifContainer.querySelectorAll('input[type="checkbox"]').forEach(chk => {
      chk.addEventListener("change", (e) => {
        const id = e.target.value;
        const item = chk.closest(".option-item");
        if (e.target.checked) {
          if (!calcState.mutawwif.selectedIds.includes(id)) calcState.mutawwif.selectedIds.push(id);
          item.classList.add("selected");
        } else {
          calcState.mutawwif.selectedIds = calcState.mutawwif.selectedIds.filter(x => x !== id);
          item.classList.remove("selected");
        }
        recalculateAll();
      });
    });
  }

  // Setup Flight
  const flightSelect = document.getElementById("flight-select");
  if (flightSelect) {
    flightSelect.innerHTML = UMRAH_DATA.flightEstimates.map(f => {
      const priceLabel = f.priceIdr > 0 ? `(~${formatIDR(f.priceIdr)}/pax)` : `(Bebas Tulis)`;
      return `<option value="${f.id}" ${f.id === calcState.flight.selectedId ? 'selected' : ''}>${f.label} ${priceLabel}</option>`;
    }).join("");

    const customFlightGroup = document.getElementById("custom-flight-group");
    const customFlightInput = document.getElementById("custom-flight-input");

    flightSelect.addEventListener("change", (e) => {
      calcState.flight.selectedId = e.target.value;
      if (customFlightGroup) {
        customFlightGroup.style.display = e.target.value === "custom_flight" ? "block" : "none";
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

  // Setup Segmented Room Type Controls
  setupRoomTypeControl("makkah");
  setupRoomTypeControl("madinah");

  // Steppers setup
  setupStepper("pax-count", (val) => {
    calcState.pax = Math.max(1, val);
    const hhrInput = document.getElementById("hhr-tickets");
    if (hhrInput && parseInt(hhrInput.value, 10) === calcState.hhr.tickets) {
      calcState.hhr.tickets = calcState.pax;
      hhrInput.value = calcState.hhr.tickets;
    }
    // Auto-update room count
    autoAdjustRooms("makkah");
    autoAdjustRooms("madinah");
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

  // Reset button
  const resetBtn = document.getElementById("btn-reset-calculator");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      calcState = {
        pax: 2,
        makkah: { hotelId: "emaar_grand", roomType: "quad", nights: 5, rooms: 1 },
        madinah: { hotelId: "saja_al_madinah", roomType: "quad", nights: 4, rooms: 1 },
        hhr: { selectedRoutes: ["makkah_madinah"], tickets: 2 },
        transport: { selectedIds: ["airport_hotel_jeddah", "carter_ziarah_makkah", "carter_ziarah_medinah"] },
        mutawwif: { selectedIds: ["mutawwif_full", "airport_handling"] },
        flight: { selectedId: "saudia", customPrice: 0 }
      };

      // Reset DOM values
      const paxEl = document.getElementById("pax-count");
      if (paxEl) paxEl.value = 2;
      const mkNights = document.getElementById("makkah-nights");
      if (mkNights) mkNights.value = 5;
      const mkRooms = document.getElementById("makkah-rooms");
      if (mkRooms) mkRooms.value = 1;
      const mdNights = document.getElementById("madinah-nights");
      if (mdNights) mdNights.value = 4;
      const mdRooms = document.getElementById("madinah-rooms");
      if (mdRooms) mdRooms.value = 1;
      const hhrTickets = document.getElementById("hhr-tickets");
      if (hhrTickets) hhrTickets.value = 2;

      syncRoomSegmentActive("makkah", "quad");
      syncRoomSegmentActive("madinah", "quad");

      updateHotelMakkahInfo();
      updateHotelMadinahInfo();
      recalculateAll();
      showToast("Kalkulator berhasil direset ke pengaturan awal.");
    });
  }

  // Copy summary button
  const copyBtn = document.getElementById("btn-copy-summary");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const summaryText = buildSummaryText();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(summaryText).then(() => {
          showToast("Ringkasan estimasi berhasil disalin.");
        }).catch(() => {
          showToast("Ringkasan siap dikirim via WhatsApp.");
        });
      } else {
        showToast("Ringkasan siap dikirim via WhatsApp.");
      }
    });
  }

  updateHotelMakkahInfo();
  updateHotelMadinahInfo();
  recalculateAll();
}

function autoAdjustRooms(city) {
  const cap = calcState[city].roomType === 'quad' ? 4 : calcState[city].roomType === 'triple' ? 3 : 2;
  const needed = Math.max(1, Math.ceil(calcState.pax / cap));
  calcState[city].rooms = needed;
  const input = document.getElementById(`${city}-rooms`);
  if (input) input.value = needed;
}

function setupRoomTypeControl(city) {
  const control = document.getElementById(`${city}-room-type-control`);
  if (!control) return;

  control.querySelectorAll(".segment-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      control.querySelectorAll(".segment-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      calcState[city].roomType = btn.dataset.type;
      autoAdjustRooms(city);
      if (city === "makkah") updateHotelMakkahInfo();
      if (city === "madinah") updateHotelMadinahInfo();
      recalculateAll();
    });
  });
}

function syncRoomSegmentActive(city, type) {
  const control = document.getElementById(`${city}-room-type-control`);
  if (!control) return;
  control.querySelectorAll(".segment-btn").forEach(btn => {
    if (btn.dataset.type === type) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
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

const renderedHotelState = {
  makkah: { hotelId: null },
  madinah: { hotelId: null }
};

function renderHotelShowcase(city) {
  const isMakkah = city === "makkah";
  const hotelList = isMakkah ? UMRAH_DATA.hotelsMakkah : UMRAH_DATA.hotelsMadinah;
  const hotelId = calcState[city].hotelId;
  const hotel = hotelList.find(h => h.id === hotelId) || hotelList[0];
  const container = document.getElementById(isMakkah ? "hotel-makkah-info" : "hotel-madinah-info");
  if (!hotel || !container) return;

  const currentRoom = calcState[city].roomType || "quad";
  const cityName = isMakkah ? "Makkah Al-Mukarramah" : "Madinah Al-Munawwarah";
  const landmark = isMakkah ? "ke Masjidil Haram" : "ke Masjid Nabawi";
  const hotelImg = hotel.image || `assets/hotels/${hotel.id}.jpg`;

  // JIKA HOTEL SUDAH TER-RENDER DAN HANYA GANTI TIPE KAMAR:
  // JANGAN re-render gambar atau DOM kartu hotel agar TIDAK ADA GLITCH / KEDIP SAMA SEKALI!
  const existingCard = container.querySelector(".hotel-showcase-card");
  if (existingCard && renderedHotelState[city].hotelId === hotel.id) {
    const pills = container.querySelectorAll(".hotel-rate-pill");
    pills.forEach(pill => {
      if (pill.dataset.type === currentRoom) {
        pill.classList.add("active");
      } else {
        pill.classList.remove("active");
      }
    });
    return;
  }

  // Jika hotel berubah atau render awal, render kartu lengkap
  renderedHotelState[city].hotelId = hotel.id;

  container.innerHTML = `
    <div class="hotel-showcase-card">
      <div class="hotel-showcase-media">
        <img 
          src="${hotelImg}" 
          alt="${hotel.name}" 
          class="hotel-showcase-img" 
          id="${city}-hotel-showcase-img"
          loading="lazy"
          onerror="this.onerror=null; this.src='assets/hotels/${hotel.id}.jpg';"
        >
        <div class="hotel-media-badges">
          <span class="hotel-badge-stars">★ Bintang ${hotel.stars}</span>
          <span class="hotel-badge-dist">📍 ${hotel.dist} ${landmark}</span>
        </div>
        <div class="hotel-media-gradient">
          <div class="hotel-media-name">${hotel.name}</div>
          <div class="hotel-media-sub">★ Bintang ${hotel.stars} • ${cityName}</div>
        </div>
      </div>
      <div class="hotel-showcase-body">
        <div class="hotel-showcase-header">
          <div class="hotel-showcase-name">Estimasi Tarif Kamar / Malam (${hotel.name})</div>
          <div class="hotel-showcase-tag">Klik tipe kamar untuk memperbarui kalkulasi</div>
        </div>
        <div class="hotel-rate-pills">
          <button type="button" class="hotel-rate-pill ${currentRoom === 'quad' ? 'active' : ''}" data-type="quad" aria-label="Pilih tipe kamar Quad">
            <span class="pill-type">Quad (Sekamar 4)</span>
            <span class="pill-price">${formatSAR(hotel.prices.quad)}</span>
            <span class="pill-unit">/ malam</span>
          </button>
          <button type="button" class="hotel-rate-pill ${currentRoom === 'triple' ? 'active' : ''}" data-type="triple" aria-label="Pilih tipe kamar Triple">
            <span class="pill-type">Triple (Sekamar 3)</span>
            <span class="pill-price">${formatSAR(hotel.prices.triple)}</span>
            <span class="pill-unit">/ malam</span>
          </button>
          <button type="button" class="hotel-rate-pill ${currentRoom === 'double' ? 'active' : ''}" data-type="double" aria-label="Pilih tipe kamar Double">
            <span class="pill-type">Double (Sekamar 2)</span>
            <span class="pill-price">${formatSAR(hotel.prices.double)}</span>
            <span class="pill-unit">/ malam</span>
          </button>
        </div>
      </div>
    </div>
  `;

  // Event listener klik pada pills tarif kamar
  container.querySelectorAll(".hotel-rate-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const type = pill.dataset.type;
      if (!type || type === calcState[city].roomType) return;
      calcState[city].roomType = type;
      syncRoomSegmentActive(city, type);
      autoAdjustRooms(city);
      renderHotelShowcase(city);
      recalculateAll();
    });
  });
}

function updateHotelMakkahInfo() {
  renderHotelShowcase("makkah");
}

function updateHotelMadinahInfo() {
  renderHotelShowcase("madinah");
}

function buildSummaryText() {
  const hotelM = UMRAH_DATA.hotelsMakkah.find(h => h.id === calcState.makkah.hotelId);
  const hotelN = UMRAH_DATA.hotelsMadinah.find(h => h.id === calcState.madinah.hotelId);
  const totalEl = document.getElementById("sticky-total-idr");
  const perpaxEl = document.getElementById("sticky-perpax-idr");

  return [
    "RINGKASAN ESTIMASI BIAYA UMROH MANDIRI (MUTAWWIFMU)",
    `• Jumlah Jamaah: ${calcState.pax} orang`,
    `• Hotel Makkah: ${hotelM ? hotelM.name : '-'} (${calcState.makkah.nights} malam, ${calcState.makkah.rooms} kamar ${calcState.makkah.roomType})`,
    `• Hotel Madinah: ${hotelN ? hotelN.name : '-'} (${calcState.madinah.nights} malam, ${calcState.madinah.rooms} kamar ${calcState.madinah.roomType})`,
    `• Tiket Kereta Cepat HHR: ${calcState.hhr.tickets} tiket (${calcState.hhr.selectedRoutes.length} rute)`,
    `• Total Estimasi Rombongan: ${totalEl ? totalEl.textContent : '-'}`,
    `• Estimasi Biaya Per Jamaah: ${perpaxEl ? perpaxEl.textContent : '-'}`
  ].join("\n");
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
}

document.addEventListener("DOMContentLoaded", () => {
  initCalculator();
  setupNavMenu();
});

