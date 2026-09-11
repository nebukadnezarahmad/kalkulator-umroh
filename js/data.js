/**
 * Data Master Kalkulator Biaya Umroh Mandiri - Mutawwifmu
 * Nilai kurs, daftar hotel Makkah & Madinah, rute Kereta Cepat Haramain (HHR),
 * transportasi lokal, mutawwif, dan tiket pesawat.
 */

const UMRAH_DATA = {
  config: {
    appName: "Kalkulator Umroh Mandiri",
    brandName: "Mutawwifmu",
    brandTagline: "Teman Perjalanan Umroh & Halal Travel Terpercaya",
    officialWhatsApp: "6287745873159",
    currency: {
      SAR_TO_IDR: 4250,
      USD_TO_IDR: 16200
    }
  },

  visa: {
    defaultPax: 2,
    priceUsd: 215, // Biaya visa resmi + asuransi kesehatan Arab Saudi
    description: "Sudah termasuk penerbitan visa resmi umroh dan asuransi kesehatan pemerintah Arab Saudi."
  },

  hotelsMakkah: [
    { id: "dar_al_taqwa", name: "Dar Al Taqwa (Bintang 5, Pelataran)", stars: 5, dist: "Pelataran Haram", prices: { double: 1450, triple: 1800, quad: 2150 } },
    { id: "pullman_zamzam", name: "Pullman Zamzam Makkah (Bintang 5, Tower)", stars: 5, dist: "0 m (Tower)", prices: { double: 1100, triple: 1350, quad: 1600 } },
    { id: "hilton_convention", name: "Hilton Convention Makkah (Bintang 5)", stars: 5, dist: "150 m", prices: { double: 1050, triple: 1250, quad: 1450 } },
    { id: "swissotel_makkah", name: "Swissotel Makkah (Bintang 5, Abraj Al Bait)", stars: 5, dist: "0 m", prices: { double: 1150, triple: 1400, quad: 1650 } },
    { id: "anjum_hotel", name: "Anjum Hotel Makkah (Bintang 5)", stars: 5, dist: "200 m", prices: { double: 850, triple: 1050, quad: 1250 } },
    { id: "emaar_grand", name: "Emaar Grand Hotel (Bintang 4)", stars: 4, dist: "450 m", prices: { double: 550, triple: 650, quad: 750 } },
    { id: "emaar_elite", name: "Emaar Elite Makkah (Bintang 4)", stars: 4, dist: "500 m", prices: { double: 500, triple: 600, quad: 700 } },
    { id: "retaj_al_rayyan", name: "Retaj Al Rayyan (Bintang 4)", stars: 4, dist: "600 m", prices: { double: 480, triple: 560, quad: 640 } },
    { id: "le_meridien_towers", name: "Le Meridien Towers (Bintang 5, Shuttle 24 Jam)", stars: 5, dist: "Shuttle Bus Gratis", prices: { double: 420, triple: 490, quad: 560 } },
    { id: "al_kiswah_towers", name: "Al Kiswah Towers (Bintang 3, Shuttle Bus)", stars: 3, dist: "Shuttle Bus 24 Jam", prices: { double: 320, triple: 370, quad: 420 } },
    { id: "olayan_golden", name: "Olayan Golden Hotel (Bintang 3)", stars: 3, dist: "750 m", prices: { double: 280, triple: 320, quad: 360 } }
  ],

  hotelsMadinah: [
    { id: "dar_al_iman_intercon", name: "Dar Al Iman InterContinental (Bintang 5, Depan Pintu 25)", stars: 5, dist: "Pelataran Nabawi", prices: { double: 1250, triple: 1450, quad: 1650 } },
    { id: "maden_hotel", name: "Maden Hotel Madinah (Bintang 5)", stars: 5, dist: "50 m", prices: { double: 950, triple: 1100, quad: 1250 } },
    { id: "pullman_madinah", name: "Pullman Madinah (Bintang 5)", stars: 5, dist: "100 m", prices: { double: 880, triple: 1100, quad: 1320 } },
    { id: "saja_al_madinah", name: "Saja Al Madinah (Bintang 4, Favorit Jemaah)", stars: 4, dist: "250 m", prices: { double: 520, triple: 580, quad: 640 } },
    { id: "rua_international", name: "Rua International Hotel (Bintang 4)", stars: 4, dist: "200 m", prices: { double: 500, triple: 550, quad: 600 } },
    { id: "emaar_royal", name: "Emaar Royal Madinah (Bintang 5)", stars: 5, dist: "150 m", prices: { double: 680, triple: 780, quad: 880 } },
    { id: "grand_plaza_badr", name: "Grand Plaza Badr Al Maqam (Bintang 4)", stars: 4, dist: "300 m", prices: { double: 520, triple: 600, quad: 680 } },
    { id: "concorde_dar_al_khair", name: "Concorde Dar Al Khair (Bintang 3)", stars: 3, dist: "250 m", prices: { double: 480, triple: 530, quad: 580 } },
    { id: "diyar_al_eiman", name: "Diyar Al Eiman (Bintang 3)", stars: 3, dist: "350 m", prices: { double: 460, triple: 510, quad: 560 } },
    { id: "saman_al_jadid", name: "Saman Al Jadid (Bintang 3 Ekonomis)", stars: 3, dist: "450 m", prices: { double: 300, triple: 340, quad: 380 } }
  ],

  hhrRoutes: [
    { id: "makkah_madinah", label: "Makkah → Madinah", priceSar: 200, desc: "Durasi ±2 jam (Kelas Ekonomi)" },
    { id: "madinah_makkah", label: "Madinah → Makkah", priceSar: 200, desc: "Durasi ±2 jam (Kelas Ekonomi)" },
    { id: "jeddah_makkah", label: "Bandara Jeddah → Makkah", priceSar: 100, desc: "Durasi ±55 menit" },
    { id: "jeddah_madinah", label: "Bandara Jeddah → Madinah", priceSar: 200, desc: "Durasi ±1 jam 50 menit" }
  ],

  localTransport: [
    { id: "airport_hotel_jeddah", label: "Antar-Jemput Bandara Jeddah ↔ Hotel Makkah", priceSar: 350, icon: "car" },
    { id: "airport_hotel_medinah", label: "Antar-Jemput Bandara Madinah ↔ Hotel Madinah", priceSar: 250, icon: "car" },
    { id: "stasiun_hotel_makkah", label: "Stasiun Kereta HHR ↔ Hotel Makkah", priceSar: 200, icon: "car" },
    { id: "stasiun_hotel_medinah", label: "Stasiun Kereta HHR ↔ Hotel Madinah", priceSar: 200, icon: "car" },
    { id: "carter_ziarah_makkah", label: "Carter Mobil Ziarah Kota Makkah (Jabal Nur, Arafah, Mina - 6 Jam)", priceSar: 450, icon: "van" },
    { id: "carter_ziarah_medinah", label: "Carter Mobil Ziarah Kota Madinah (Masjid Quba, Uhud, Percetakan Quran - 6 Jam)", priceSar: 400, icon: "van" },
    { id: "ziarah_thaif", label: "Carter Mobil Ekskursi Ziarah Thaif PP (Teleferik, Masjid Abbas - 6-8 Jam)", priceSar: 600, icon: "mountain" },
    { id: "wisata_alula", label: "Ekskursi Madinah ↔ Al Ula PP (Madain Saleh, Elephant Rock)", priceSar: 1200, icon: "landmark" }
  ],

  mutawwifServices: [
    { id: "mutawwif_full", label: "Pendampingan Mutawwif Khusus (Full Manasik & Bimbingan Ibadah)", priceSar: 1500, desc: "Mutawwif resmi berbahasa Indonesia mendampingi rangkaian ibadah umroh & ziarah sejarah Islam.", checked: true },
    { id: "airport_handling", label: "Handling Bandara Kedatangan & Kepulangan (Fast Track & Bagasi)", priceSar: 300, desc: "Penyambutan di bandara, bantuan imigrasi, penanganan bagasi bus/mobil, dan check-in hotel.", checked: true },
    { id: "exclusive_merchandise", label: "Paket Perlengkapan Umroh Mutawwifmu (Koper Fiber, Kain Ihram/Mukena, Tas Paspor)", priceIdr: 950000, isPerPax: true, desc: "Perlengkapan standar ibadah eksklusif dikirim ke rumah sebelum keberangkatan.", checked: false }
  ],

  flightEstimates: [
    { id: "saudia", label: "Saudia Airlines (Direct CGK/SUB ↔ JED/MED)", priceIdr: 16500000, airline: "Saudia" },
    { id: "garuda", label: "Garuda Indonesia (Direct CGK/SUB ↔ JED/MED)", priceIdr: 17800000, airline: "Garuda" },
    { id: "transit_full", label: "Maskapai Full Service Transit (Oman Air / Emirates / Qatar)", priceIdr: 14200000, airline: "Full Service" },
    { id: "budget_transit", label: "Maskapai Budget / Transit (Scoot / AirAsia / Lion)", priceIdr: 11800000, airline: "Low Cost" },
    { id: "custom_flight", label: "Input Estimasi Sendiri (Custom)", priceIdr: 0, airline: "Custom" }
  ],

  checklistPhases: [
    {
      title: "Tahap 1: Dokumen & Persiapan Awal (H-60 s.d. H-14)",
      items: [
        { id: "c1", text: "Paspor dengan masa berlaku minimal 7 bulan dan nama minimal 2 kata", done: false },
        { id: "c2", text: "Penerbitan Visa Umroh resmi & sertifikat asuransi kesehatan Arab Saudi", done: false },
        { id: "c3", text: "Suntik Vaksin Meningitis (Buku Kuning / SatuSehat ICV)", done: false },
        { id: "c4", text: "Tiket pesawat pulang-pergi kelas ekonomi/bisnis sudah terkonfirmasi", done: false },
        { id: "c5", text: "Konfirmasi reservasi hotel Makkah dan Madinah dengan voucher resmi", done: false },
        { id: "c6", text: "Pemesanan tiket Kereta Cepat Haramain (HHR) online H-30", done: false }
      ]
    },
    {
      title: "Tahap 2: Perlengkapan Ibadah & Pakaian",
      items: [
        { id: "c7", text: "Kain Ihram (2-3 set untuk ikhwan) beserta ikat pinggang sabuk ihram", done: false },
        { id: "c8", text: "Mukena, baju gamis/abaya longgar, dan ciput anti-melorot (untuk akhwat)", done: false },
        { id: "c9", text: "Sandal jepit nyaman untuk ke masjid dan tas kantong sandal", done: false },
        { id: "c10", text: "Buku panduan doa manasik umroh sesuai sunnah & Al-Quran saku", done: false },
        { id: "c11", text: "Gunting kecil untuk tahallul (disimpan di koper bagasi, bukan kabin)", done: false }
      ]
    },
    {
      title: "Tahap 3: Logistik, Keuangan & Kesehatan",
      items: [
        { id: "c12", text: "Obat-obatan pribadi: vitamin C, obat batuk/flu, parasetamol, koyo, pelembab bibir", done: false },
        { id: "c13", text: "Uang tunai Saudi Riyal (SAR) secukupnya untuk sedekah & jajan harian", done: false },
        { id: "c14", text: "Kartu debit/kredit berlogo Visa/Mastercard (sudah aktivasi transaksi luar negeri)", done: false },
        { id: "c15", text: "Paket Roaming Arab Saudi (Telkomsel/Indosat/XL) atau eSIM lokal (STC/Mobily)", done: false },
        { id: "c16", text: "Powerbank (maksimal 20.000 mAh di dalam tas kabin) & colokan universal kaki tiga (Tipe G)", done: false }
      ]
    },
    {
      title: "Tahap 4: Setibanya di Tanah Suci & Rangkaian Ibadah",
      items: [
        { id: "c17", text: "Download & aktivasi aplikasi Nusuk untuk reservasi slot Raudhah Madinah", done: false },
        { id: "c18", text: "Pengambilan miqat di Bir Ali / Yalamlam / pesawat sebelum tiba di Makkah", done: false },
        { id: "c19", text: "Pelaksanaan tawaf umroh 7 putaran, sholat sunnah di belakang Maqam Ibrahim", done: false },
        { id: "c20", text: "Minum air zamzam sambil berdoa menghadap kiblat", done: false },
        { id: "c21", text: "Pelaksanaan sa'i antara bukit Shafa dan Marwah 7 kali putaran", done: false },
        { id: "c22", text: "Tahallul (cukur gundul / potong rambut minimal 3 helai) sebagai penutup umroh", done: false }
      ]
    }
  ]
};
