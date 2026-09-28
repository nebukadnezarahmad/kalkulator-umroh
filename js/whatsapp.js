/**
 * WhatsApp Lead Generator - Mutawwifmu Edition
 * Formats user calculation into an attractive, professional consultation message.
 * Updated to reflect official Booklet Mutawwifmu V1 pricing.
 */

function buildWhatsAppConsultationMessage() {
  const pax = Math.max(1, calcState.pax);
  const currency = UMRAH_DATA.config.currency;

  const lines = [];
  lines.push("السلام عليكم ورحمة الله وبركاته");
  lines.push("*BISMILLAH, KONSULTASI ESTIMASI BIAYA UMROH MANDIRI*");
  lines.push("Ref: Kalkulator Mandiri Mutawwifmu.com (Booklet Resmi)");
  lines.push("---------------------------------------");

  const visaIdr = pax * (UMRAH_DATA.visa.totalPerPaxIdr || 3300000);
  const visaUsd = Math.round(visaIdr / currency.USD_TO_IDR);
  lines.push(`👥 *Jumlah Jamaah:* ${pax} Orang`);
  lines.push(`📄 *Visa Umrah & Asuransi:* ${formatIDR(visaIdr)} (~${formatUSD(visaUsd)})`);
  lines.push("");

  const hotelMakkah = UMRAH_DATA.hotelsMakkah.find(h => h.id === calcState.makkah.hotelId);
  if (hotelMakkah) {
    const roomTypeLabel = calcState.makkah.roomType.toUpperCase();
    lines.push(`🕋 *Hotel Makkah:* ${hotelMakkah.name}`);
    lines.push(`   • Kamar: Tipe ${roomTypeLabel} (${calcState.makkah.rooms} Kamar)`);
    lines.push(`   • Durasi: ${calcState.makkah.nights} Malam`);
    lines.push(`   • Jarak: ${hotelMakkah.dist}`);
  }
  lines.push("");

  const hotelMadinah = UMRAH_DATA.hotelsMadinah.find(h => h.id === calcState.madinah.hotelId);
  if (hotelMadinah) {
    const roomTypeLabel = calcState.madinah.roomType.toUpperCase();
    lines.push(`🕌 *Hotel Madinah:* ${hotelMadinah.name}`);
    lines.push(`   • Kamar: Tipe ${roomTypeLabel} (${calcState.madinah.rooms} Kamar)`);
    lines.push(`   • Durasi: ${calcState.madinah.nights} Malam`);
    lines.push(`   • Jarak: ${hotelMadinah.dist}`);
  }
  lines.push("");

  if (calcState.hhr.selectedRoutes.length > 0) {
    lines.push(`🚄 *Kereta Cepat Haramain (HHR):*`);
    calcState.hhr.selectedRoutes.forEach(rId => {
      const r = UMRAH_DATA.hhrRoutes.find(x => x.id === rId);
      if (r) lines.push(`   • ${r.label} (${calcState.hhr.tickets} Tiket @ ${formatSAR(r.priceSar)})`);
    });
    lines.push("");
  }

  if (calcState.transport.selectedIds.length > 0) {
    const currentVehicle = calcState.transport.vehicle || "camry";
    const vObj = UMRAH_DATA.armadaList ? UMRAH_DATA.armadaList.find(a => a.id === currentVehicle) : null;
    const vLabel = vObj ? `${vObj.name} (${vObj.capacity})` : currentVehicle.toUpperCase();
    lines.push(`🚗 *Transportasi Darat & City Tour (Armada: ${vLabel}):*`);
    calcState.transport.selectedIds.forEach(tId => {
      const t = UMRAH_DATA.localTransport.find(x => x.id === tId);
      if (t) {
        const p = (t.prices && t.prices[currentVehicle] !== undefined) ? t.prices[currentVehicle] : (t.priceSar || 0);
        lines.push(`   • ${t.label} (${formatSAR(p)})`);
      }
    });
    lines.push("");
  }

  if (calcState.mutawwif.selectedIds.length > 0) {
    lines.push(`🧕 *Layanan Mutawwif & Handling:*`);
    calcState.mutawwif.selectedIds.forEach(mId => {
      const m = UMRAH_DATA.mutawwifServices.find(x => x.id === mId);
      if (m) {
        const priceText = m.priceSar ? `${formatSAR(m.priceSar)}` : `${formatIDR(m.priceIdr)}${m.isPerPax ? '/pax' : ''}`;
        lines.push(`   • ${m.label} (${priceText})`);
      }
    });
    lines.push("");
  }

  const flight = UMRAH_DATA.flightEstimates.find(f => f.id === calcState.flight.selectedId);
  if (flight) {
    let flightText = flight.label;
    if (flight.id === "custom_flight" && calcState.flight.customPrice > 0) {
      flightText = `Input Sendiri (~${formatIDR(calcState.flight.customPrice)}/pax)`;
    }
    lines.push(`✈️ *Estimasi Penerbangan:* ${flightText}`);
    lines.push("");
  }

  const totalIdrEl = document.getElementById("sticky-total-idr")?.textContent || "Rp0";
  const totalSarEl = document.getElementById("sticky-total-sar")?.textContent || "0 SAR";
  const perPaxIdrEl = document.getElementById("sticky-perpax-idr")?.textContent || "Rp0 / org";

  lines.push("---------------------------------------");
  lines.push(`💰 *TOTAL ESTIMASI:* ${totalIdrEl} (~${totalSarEl})`);
  lines.push(`💵 *ESTIMASI PER ORANG:* ${perPaxIdrEl}`);
  lines.push("---------------------------------------");
  lines.push("");
  lines.push("Halo Tim Mutawwifmu, saya telah menyusun rincian rencana umroh mandiri di atas sesuai panduan Booklet Resmi Mutawwifmu.");
  lines.push("Mohon info ketersediaan slot hotel, visa, dan konfirmasi Land Arrangement untuk rencana ini. Terima kasih!");

  return lines.join("\n");
}

function openWhatsAppConsultation() {
  const phone = UMRAH_DATA.config.officialWhatsApp;
  const message = buildWhatsAppConsultationMessage();
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn-whatsapp-action");
  if (btn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openWhatsAppConsultation();
    });
  }

  const navWa = document.getElementById("nav-btn-wa");
  if (navWa) {
    navWa.addEventListener("click", (e) => {
      e.preventDefault();
      openWhatsAppConsultation();
    });
  }
});
