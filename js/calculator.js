/**
 * Kalkulator Biaya Umroh Mandiri - Logic & Calculations
 * Mutawwifmu Visual Design System Edition
 * Diperbarui sesuai Booklet Resmi Mutawwifmu V1 (2025-2026)
 */

let calcState = {
  pax: 0,
  makkah: {
    hotelId: "emaar_grand",
    roomType: "quad", // 'double' | 'triple' | 'quad'
    nights: 0,
    rooms: 0
  },
  madinah: {
    hotelId: "saja_al_madinah",
    roomType: "quad",
    nights: 0,
    rooms: 0
  },
  hhr: {
    selectedRoutes: ["makkah_madinah"],
    tickets: 0
  },
  transport: {
    vehicle: "camry", // 'camry' | 'staria' | 'gmc' | 'hiace' | 'coaster' | 'bus'
    isManualVehicle: false,
    selectedIds: ["airport_hotel_jeddah", "city_tour_makkah", "city_tour_madinah"]
  },
  mutawwif: {
    selectedIds: ["mutawwif_reguler", "airport_handling_jeddah"]
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

function autoSelectVehicle(pax) {
  if (calcState.transport.isManualVehicle) return;
  if (pax <= 3) calcState.transport.vehicle = "camry";
  else if (pax <= 6) calcState.transport.vehicle = "staria";
  else if (pax <= 12) calcState.transport.vehicle = "hiace";
  else if (pax <= 29) calcState.transport.vehicle = "coaster";
  else calcState.transport.vehicle = "bus";

  updateArmadaControlUI();
  updateTransportRoutesListUI();
}

function updateArmadaControlUI() {
  const container = document.getElementById("armada-type-control");
  if (!container || !UMRAH_DATA.armadaList) return;
  const current = calcState.transport.vehicle || "camry";

  container.innerHTML = UMRAH_DATA.armadaList.map(a => `
    <button type="button" class="armada-btn ${a.id === current ? 'active' : ''}" data-id="${a.id}" aria-label="Pilih ${a.name}">
      <span class="armada-name">${a.name}</span>
      <span class="armada-cap">${a.capacity}</span>
    </button>
  `).join("");

  updateArmadaHint();

  container.querySelectorAll(".armada-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      calcState.transport.vehicle = btn.dataset.id;
      calcState.transport.isManualVehicle = true;
      updateArmadaControlUI();
      updateTransportRoutesListUI();
      recalculateAll();
    });
  });
}

function updateArmadaHint() {
  const hintEl = document.getElementById("armada-calc-hint");
  if (!hintEl || !UMRAH_DATA.armadaList) return;
  const current = calcState.transport.vehicle || "camry";
  const aObj = UMRAH_DATA.armadaList.find(x => x.id === current);
  if (aObj) {
    if (calcState.pax === 0) {
      hintEl.textContent = `0 Jamaah • Rekomendasi armada: ${aObj.name} (${aObj.capacity})`;
    } else {
      hintEl.textContent = `${calcState.pax} Jamaah: ${aObj.name} (${aObj.capacity})`;
    }
  }
}

function updateTransportRoutesListUI() {
  const transportContainer = document.getElementById("transport-routes-list");
  if (!transportContainer) return;
  const currentVehicle = calcState.transport.vehicle || "camry";

  transportContainer.innerHTML = UMRAH_DATA.localTransport.map(t => {
    const isChecked = calcState.transport.selectedIds.includes(t.id);
    const price = (t.prices && t.prices[currentVehicle] !== undefined) ? t.prices[currentVehicle] : (t.priceSar || 0);
    return `
      <label class="option-item ${isChecked ? 'selected' : ''}" for="transport-${t.id}">
        <div class="option-left">
          <input type="checkbox" id="transport-${t.id}" class="option-checkbox" value="${t.id}" ${isChecked ? 'checked' : ''}>
          <div>
            <div class="option-label">${t.label}</div>
            <div class="option-desc">${t.desc}</div>
          </div>
        </div>
        <div class="option-price">${formatSAR(price)}</div>
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

function renderMutawwifServicesUI() {
  const mutawwifContainer = document.getElementById("mutawwif-services-list");
  if (!mutawwifContainer) return;

  mutawwifContainer.innerHTML = UMRAH_DATA.mutawwifServices.map(m => {
    const isChecked = calcState.mutawwif.selectedIds.includes(m.id);
    const priceText = m.priceSar ? `${formatSAR(m.priceSar)}` : `${formatIDR(m.priceIdr)}${m.isPerPax ? '/pax' : ''}`;
    return `
      <label class="option-item ${isChecked ? 'selected' : ''}" for="mutawwif-${m.id}">
        <div class="option-left">
          <input type="checkbox" id="mutawwif-${m.id}" class="option-checkbox" value="${m.id}" ${isChecked ? 'checked' : ''}>
          <div>
            <div class="option-label">${m.label}</div>
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

function recalculateAll() {
  const currency = UMRAH_DATA.config.currency;
  const pax = Math.max(0, calcState.pax || 0);

  // Jika jumlah jamaah 0, SEMUA biaya, subtotal, dan rupiah wajib mulai dari 0
  if (pax === 0) {
    const visaSarEl = document.getElementById("subtotal-visa-sar");
    const visaIdrEl = document.getElementById("subtotal-visa-idr");
    if (visaSarEl) visaSarEl.textContent = "Rp0";
    if (visaIdrEl) visaIdrEl.textContent = "~$0";

    const makkahSarEl = document.getElementById("subtotal-makkah-sar");
    const makkahIdrEl = document.getElementById("subtotal-makkah-idr");
    if (makkahSarEl) makkahSarEl.textContent = "0 SAR";
    if (makkahIdrEl) makkahIdrEl.textContent = "Rp0";

    const madinahSarEl = document.getElementById("subtotal-madinah-sar");
    const madinahIdrEl = document.getElementById("subtotal-madinah-idr");
    if (madinahSarEl) madinahSarEl.textContent = "0 SAR";
    if (madinahIdrEl) madinahIdrEl.textContent = "Rp0";

    const hhrSarEl = document.getElementById("subtotal-hhr-sar");
    const hhrIdrEl = document.getElementById("subtotal-hhr-idr");
    if (hhrSarEl) hhrSarEl.textContent = "0 SAR";
    if (hhrIdrEl) hhrIdrEl.textContent = "Rp0";

    const transportSarEl = document.getElementById("subtotal-transport-sar");
    const transportIdrEl = document.getElementById("subtotal-transport-idr");
    if (transportSarEl) transportSarEl.textContent = "0 SAR";
    if (transportIdrEl) transportIdrEl.textContent = "Rp0";

    const mutawwifSarEl = document.getElementById("subtotal-mutawwif-sar");
    const mutawwifIdrEl = document.getElementById("subtotal-mutawwif-idr");
    if (mutawwifSarEl) mutawwifSarEl.textContent = "0 SAR";
    if (mutawwifIdrEl) mutawwifIdrEl.textContent = "Rp0";

    const flightSarEl = document.getElementById("subtotal-flight-sar");
    const flightIdrEl = document.getElementById("subtotal-flight-idr");
    if (flightSarEl) flightSarEl.textContent = "0 SAR";
    if (flightIdrEl) flightIdrEl.textContent = "Rp0";

    const stickyTotalEl = document.getElementById("sticky-total-idr");
    const stickyPerPaxEl = document.getElementById("sticky-perpax-idr");
    const stickyTotalSarEl = document.getElementById("sticky-total-sar");
    const stickyTotalVisaEl = document.getElementById("sticky-total-visa");

    if (stickyTotalEl) stickyTotalEl.textContent = "Rp0";
    if (stickyPerPaxEl) stickyPerPaxEl.textContent = "Rp0 / org";
    if (stickyTotalSarEl) stickyTotalSarEl.textContent = "0 SAR";
    if (stickyTotalVisaEl) stickyTotalVisaEl.textContent = "$0";

    updateRoomCapacityHints();
    updateArmadaHint();
    return;
  }

  // Visa & Asuransi (Sesuai Booklet Mutawwifmu V1 Hal. 04: Rp3.200.000 + Asuransi Rp100.000 = Rp3.300.000/pax)
  const visaIdr = pax * (UMRAH_DATA.visa.totalPerPaxIdr || 3300000);
  const visaUsd = (currency.USD_TO_IDR && currency.USD_TO_IDR > 0) ? Math.round(visaIdr / currency.USD_TO_IDR) : 0;

  // Akomodasi Hotel Makkah & Madinah di-take out sementara
  const makkahSar = 0;
  const makkahIdr = 0;
  const madinahSar = 0;
  const madinahIdr = 0;

  // Kereta Cepat Haramain (HHR)
  let hhrSingleTripCost = 0;
  calcState.hhr.selectedRoutes.forEach(rId => {
    const route = UMRAH_DATA.hhrRoutes.find(r => r.id === rId);
    if (route) hhrSingleTripCost += route.priceSar;
  });
  const hhrSar = hhrSingleTripCost * calcState.hhr.tickets;
  const hhrIdr = hhrSar * currency.SAR_TO_IDR;

  // Transportasi Darat & City Tour (Sesuai Booklet Armada & Rute)
  let transportSar = 0;
  const currentVehicle = calcState.transport.vehicle || "camry";
  calcState.transport.selectedIds.forEach(tId => {
    const item = UMRAH_DATA.localTransport.find(t => t.id === tId);
    if (item) {
      const price = (item.prices && item.prices[currentVehicle] !== undefined)
        ? item.prices[currentVehicle]
        : (item.priceSar || 0);
      transportSar += price;
    }
  });
  const transportIdr = transportSar * currency.SAR_TO_IDR;

  // Layanan Mutawwif & Handling Bandara (Sesuai Booklet)
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

  // Tiket Pesawat
  let flightIdr = 0;
  const flightItem = UMRAH_DATA.flightEstimates.find(f => f.id === calcState.flight.selectedId);
  if (flightItem) {
    if (flightItem.id === "custom_flight") {
      flightIdr = calcState.flight.customPrice * pax;
    } else {
      flightIdr = flightItem.priceIdr * pax;
    }
  }

  const totalSar = makkahSar + madinahSar + hhrSar + transportSar + mutawwifSar;
  const totalIdr = (totalSar * currency.SAR_TO_IDR) + visaIdr + mutawwifIdr + flightIdr;
  const perPaxIdr = pax > 0 ? Math.round(totalIdr / pax) : 0;

  // Update Subtotals
  const visaSarEl = document.getElementById("subtotal-visa-sar");
  const visaIdrEl = document.getElementById("subtotal-visa-idr");
  if (visaSarEl) visaSarEl.textContent = formatIDR(visaIdr);
  if (visaIdrEl) visaIdrEl.textContent = `~${formatUSD(visaUsd)}`;

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
  if (stickyPerPaxEl) stickyPerPaxEl.textContent = pax > 0 ? (formatIDR(perPaxIdr) + " / org") : "Rp0 / org";
  if (stickyTotalSarEl) stickyTotalSarEl.textContent = formatSAR(totalSar);
  if (stickyTotalVisaEl) stickyTotalVisaEl.textContent = formatUSD(visaUsd);

  // Room capacity calculation hints & armada hint
  updateRoomCapacityHints();
  updateArmadaHint();
}

function updateRoomCapacityHints() {
  const pax = calcState.pax;
  const makkahCap = calcState.makkah.roomType === 'quad' ? 4 : calcState.makkah.roomType === 'triple' ? 3 : 2;
  const madinahCap = calcState.madinah.roomType === 'quad' ? 4 : calcState.madinah.roomType === 'triple' ? 3 : 2;

  const makkahAutoRooms = pax > 0 ? Math.ceil(pax / makkahCap) : 0;
  const madinahAutoRooms = pax > 0 ? Math.ceil(pax / madinahCap) : 0;

  const makkahHint = document.getElementById("makkah-room-calc-hint");
  if (makkahHint) {
    makkahHint.textContent = `${pax} pax: ${makkahAutoRooms} kamar (${calcState.makkah.roomType.toUpperCase()})`;
  }

  const madinahHint = document.getElementById("madinah-room-calc-hint");
  if (madinahHint) {
    madinahHint.textContent = `${pax} pax: ${madinahAutoRooms} kamar (${calcState.madinah.roomType.toUpperCase()})`;
  }
}

/**
 * Auto-sync live currency rate (Opsi B: Kurs Pasar Live + Safety Buffer)
 * Memperbarui kurs harian (cache 24 jam di localStorage), berjalan di background
 * tanpa indikator badge transparan apapun di tampilan UI sesuai preferensi pengguna.
 */
function initAutoCurrency() {
  const CACHE_KEY_SAR = "mutawwifmu_sar_rate";
  const CACHE_KEY_USD = "mutawwifmu_usd_rate";
  const CACHE_KEY_TIME = "mutawwifmu_currency_time";
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const BUFFER_SAR_IDR = 50; // Safety buffer (+Rp50) untuk mencakup spread bank & fluktuasi kartu/transaksi riil

  // 1. Terapkan kurs dari cache jika masih valid (< 24 jam)
  try {
    const cachedSar = localStorage.getItem(CACHE_KEY_SAR);
    const cachedUsd = localStorage.getItem(CACHE_KEY_USD);
    const cachedTime = localStorage.getItem(CACHE_KEY_TIME);

    if (cachedSar && cachedTime && (Date.now() - Number(cachedTime) < ONE_DAY_MS)) {
      const parsedSar = Number(cachedSar);
      if (!isNaN(parsedSar) && parsedSar > 0) {
        UMRAH_DATA.config.currency.SAR_TO_IDR = parsedSar;
      }
      if (cachedUsd) {
        const parsedUsd = Number(cachedUsd);
        if (!isNaN(parsedUsd) && parsedUsd > 0) {
          UMRAH_DATA.config.currency.USD_TO_IDR = parsedUsd;
        }
      }
      return;
    }
  } catch (err) {
    // Abaikan jika localStorage tidak dapat diakses
  }

  // 2. Fetch kurs harian live dari API resmi valas (SAR base)
  fetch("https://open.er-api.com/v6/latest/SAR")
    .then(res => {
      if (!res.ok) throw new Error("Network response not ok");
      return res.json();
    })
    .then(data => {
      if (data && data.result === "success" && data.rates && data.rates.IDR) {
        const rawSarToIdr = Number(data.rates.IDR);
        // Opsi B: Tambahkan safety buffer (+Rp50)
        const bufferedSarRate = Math.round(rawSarToIdr + BUFFER_SAR_IDR);

        let calculatedUsdRate = UMRAH_DATA.config.currency.USD_TO_IDR;
        if (data.rates.USD && Number(data.rates.USD) > 0) {
          calculatedUsdRate = Math.round(rawSarToIdr / Number(data.rates.USD));
        }

        // Perbarui data currency global
        UMRAH_DATA.config.currency.SAR_TO_IDR = bufferedSarRate;
        UMRAH_DATA.config.currency.USD_TO_IDR = calculatedUsdRate;

        // Simpan ke cache localStorage
        try {
          localStorage.setItem(CACHE_KEY_SAR, bufferedSarRate.toString());
          localStorage.setItem(CACHE_KEY_USD, calculatedUsdRate.toString());
          localStorage.setItem(CACHE_KEY_TIME, Date.now().toString());
        } catch (e) {
          // Abaikan jika quota error
        }

        // Hitung ulang semua estimasi biaya secara hening di latar belakang
        recalculateAll();
      }
    })
    .catch(() => {
      // Fallback hening: tetap gunakan nilai default di UMRAH_DATA jika offline / API gangguan
    });
}

function initCalculator() {
  document.documentElement.removeAttribute("data-theme");
  localStorage.removeItem("mutawwifmu_theme");

  // Inisialisasi sinkronisasi kurs live harian (Opsi B: Kurs Pasar + Safety Buffer)
  initAutoCurrency();

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
              <div class="option-label">${r.label}</div>
              <div class="option-desc">${r.desc}</div>
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

  // Setup Armada Control & Transport Routes (Booklet)
  updateArmadaControlUI();
  updateTransportRoutesListUI();

  // Setup Mutawwif & Handling Services (Booklet)
  renderMutawwifServicesUI();

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

  // Steppers setup (start from 0, min 0)
  setupStepper("pax-count", (val) => {
    const prevPax = calcState.pax;
    calcState.pax = Math.max(0, val);
    const hhrInput = document.getElementById("hhr-tickets");
    if (hhrInput && (calcState.hhr.tickets === prevPax || calcState.hhr.tickets === 0)) {
      calcState.hhr.tickets = calcState.pax;
      hhrInput.value = calcState.hhr.tickets;
    }
    // Auto-update armada kendaraan sesuai jumlah pax
    autoSelectVehicle(calcState.pax);
    // Auto-update room count
    autoAdjustRooms("makkah");
    autoAdjustRooms("madinah");
    recalculateAll();
  });

  setupStepper("makkah-nights", (val) => {
    calcState.makkah.nights = Math.max(0, val);
    recalculateAll();
  });

  setupStepper("makkah-rooms", (val) => {
    calcState.makkah.rooms = Math.max(0, val);
    recalculateAll();
  });

  setupStepper("madinah-nights", (val) => {
    calcState.madinah.nights = Math.max(0, val);
    recalculateAll();
  });

  setupStepper("madinah-rooms", (val) => {
    calcState.madinah.rooms = Math.max(0, val);
    recalculateAll();
  });

  setupStepper("hhr-tickets", (val) => {
    calcState.hhr.tickets = Math.max(0, val);
    recalculateAll();
  });

  const resetBtn = document.getElementById("btn-reset-calculator");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      calcState = {
        pax: 0,
        makkah: { hotelId: "emaar_grand", roomType: "quad", nights: 0, rooms: 0 },
        madinah: { hotelId: "saja_al_madinah", roomType: "quad", nights: 0, rooms: 0 },
        hhr: { selectedRoutes: ["makkah_madinah"], tickets: 0 },
        transport: { vehicle: "camry", isManualVehicle: false, selectedIds: ["airport_hotel_jeddah", "city_tour_makkah", "city_tour_madinah"] },
        mutawwif: { selectedIds: ["mutawwif_reguler", "airport_handling_jeddah"] },
        flight: { selectedId: "saudia", customPrice: 0 }
      };

      const paxEl = document.getElementById("pax-count");
      if (paxEl) paxEl.value = 0;
      const mkNights = document.getElementById("makkah-nights");
      if (mkNights) mkNights.value = 0;
      const mkRooms = document.getElementById("makkah-rooms");
      if (mkRooms) mkRooms.value = 0;
      const mdNights = document.getElementById("madinah-nights");
      if (mdNights) mdNights.value = 0;
      const mdRooms = document.getElementById("madinah-rooms");
      if (mdRooms) mdRooms.value = 0;
      const hhrTickets = document.getElementById("hhr-tickets");
      if (hhrTickets) hhrTickets.value = 0;

      syncRoomSegmentActive("makkah", "quad");
      syncRoomSegmentActive("madinah", "quad");

      updateArmadaControlUI();
      updateTransportRoutesListUI();
      renderMutawwifServicesUI();

      updateHotelMakkahInfo();
      updateHotelMadinahInfo();
      recalculateAll();
      showToast("Kalkulator berhasil direset ke pengaturan awal.");
    });
  }

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
  const min = input.hasAttribute("min") ? parseInt(input.getAttribute("min"), 10) : 0;
  const max = input.hasAttribute("max") ? parseInt(input.getAttribute("max"), 10) : 999;

  if (btnMinus) {
    btnMinus.addEventListener("click", () => {
      let val = parseInt(input.value, 10);
      if (isNaN(val)) val = min;
      if (val > min) {
        val--;
        input.value = val;
        onChange(val);
      }
    });
  }

  if (btnPlus) {
    btnPlus.addEventListener("click", () => {
      let val = parseInt(input.value, 10);
      if (isNaN(val)) val = min;
      if (val < max) {
        val++;
        input.value = val;
        onChange(val);
      }
    });
  }

  input.addEventListener("input", () => {
    let val = parseInt(input.value, 10);
    if (isNaN(val)) val = min;
    if (val < min) val = min;
    if (val > max) val = max;
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

  // Preserve existing DOM and image element when only switching room type to prevent flickering.
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

  // Render full hotel card upon initial load or hotel change
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
          <span class="hotel-badge-dist"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block; vertical-align:-1px; margin-right:3px;"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>${hotel.dist} ${landmark}</span>
        </div>
        <div class="hotel-media-gradient">
          <div class="hotel-media-name">${hotel.name}</div>
          <div class="hotel-media-sub">${cityName}</div>
        </div>
      </div>
      <div class="hotel-showcase-body">
        <div class="hotel-showcase-header">
          <div class="hotel-showcase-name">Pilihan Tipe Kamar &amp; Tarif / Malam</div>
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
  const totalEl = document.getElementById("sticky-total-idr");
  const perpaxEl = document.getElementById("sticky-perpax-idr");
  const currentVehicle = calcState.transport.vehicle || "camry";
  const vObj = UMRAH_DATA.armadaList ? UMRAH_DATA.armadaList.find(a => a.id === currentVehicle) : null;

  return [
    "RINGKASAN ESTIMASI BIAYA UMROH MANDIRI (MUTAWWIFMU)",
    `• Jumlah Jamaah: ${calcState.pax > 0 ? calcState.pax + " orang" : "0 orang (Belum ditentukan)"}`,
    `• Tiket Kereta Cepat HHR: ${calcState.hhr.tickets} tiket (${calcState.hhr.selectedRoutes.length} rute)`,
    `• Armada Transportasi: ${vObj ? vObj.name + " (" + vObj.capacity + ")" : currentVehicle.toUpperCase()}`,
    `• Total Estimasi Rombongan: ${totalEl ? totalEl.textContent : "-"}`,
    `• Estimasi Biaya Per Jamaah: ${perpaxEl ? perpaxEl.textContent : "-"}`
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
  initCalculator();
  setupNavMenu();
});
