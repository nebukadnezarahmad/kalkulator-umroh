/**
 * Data Master Kalkulator Biaya Umroh Mandiri - Mutawwifmu
 * Sesuai Dokumen Resmi: OFFICIAL COMPANY PROFILE & PRICELIST BOOKLET MUTAWWIFMU V1 (2025-2026)
 * Nilai kurs, paket visa, armada transportasi darat, city tour, layanan mutawwif, handling bandara, hotel, dan kereta cepat.
 */

const UMRAH_DATA = {
  config: {
    appName: "Kalkulator Umroh Mandiri",
    brandName: "Mutawwifmu",
    brandTagline: "Land Arrangement No. 1 di Dunia",
    officialWhatsApp: "6287745873159",
    currency: {
      SAR_TO_IDR: 4250,
      USD_TO_IDR: 16200
    }
  },

  visa: {
    defaultPax: 2,
    priceIdr: 3200000, // IDR 3.200.000 per pax (Sesuai Booklet Mutawwifmu Hal. 04)
    insuranceIdr: 100000, // Asuransi Perjalanan: IDR 100.000 per pax (Booklet Hal. 04)
    totalPerPaxIdr: 3300000, // Total Visa Umrah Reguler + Asuransi Medis resmi: IDR 3.300.000 per pax
    priceUsd: 204, // Estimasi ekuivalen USD di kurs 16.200
    description: "Sesuai Booklet Resmi Mutawwifmu: Visa Umrah Reguler (Rp3.200.000) dan Asuransi Perjalanan resmi (Rp100.000)."
  },

  hotelsMakkah: [
    { id: "dar_al_taqwa", name: "Dar Al Taqwa (Bintang 5, Pelataran)", stars: 5, dist: "Pelataran Haram", image: "assets/hotels/dar_al_taqwa.jpg", roomImages: { quad: "assets/hotels/rooms/dar_al_taqwa_quad.jpg", triple: "assets/hotels/rooms/dar_al_taqwa_triple.jpg", double: "assets/hotels/rooms/dar_al_taqwa_double.jpg" }, prices: { double: 1450, triple: 1800, quad: 2150 } },
    { id: "pullman_zamzam", name: "Pullman Zamzam Makkah (Bintang 5, Tower)", stars: 5, dist: "0 m (Tower)", image: "assets/hotels/pullman_zamzam.jpg", roomImages: { quad: "assets/hotels/rooms/pullman_zamzam_quad.jpg", triple: "assets/hotels/rooms/pullman_zamzam_triple.jpg", double: "assets/hotels/rooms/pullman_zamzam_double.jpg" }, prices: { double: 1100, triple: 1350, quad: 1600 } },
    { id: "hilton_convention", name: "Hilton Convention Makkah (Bintang 5)", stars: 5, dist: "150 m", image: "assets/hotels/hilton_convention.jpg", roomImages: { quad: "assets/hotels/rooms/hilton_convention_quad.jpg", triple: "assets/hotels/rooms/hilton_convention_triple.jpg", double: "assets/hotels/rooms/hilton_convention_double.jpg" }, prices: { double: 1050, triple: 1250, quad: 1450 } },
    { id: "swissotel_makkah", name: "Swissotel Makkah (Bintang 5, Abraj Al Bait)", stars: 5, dist: "0 m", image: "assets/hotels/swissotel_makkah.jpg", roomImages: { quad: "assets/hotels/rooms/swissotel_makkah_quad.jpg", triple: "assets/hotels/rooms/swissotel_makkah_triple.jpg", double: "assets/hotels/rooms/swissotel_makkah_double.jpg" }, prices: { double: 1150, triple: 1400, quad: 1650 } },
    { id: "anjum_hotel", name: "Anjum Hotel Makkah (Bintang 5)", stars: 5, dist: "200 m", image: "assets/hotels/anjum_hotel.jpg", roomImages: { quad: "assets/hotels/rooms/anjum_hotel_quad.jpg", triple: "assets/hotels/rooms/anjum_hotel_triple.jpg", double: "assets/hotels/rooms/anjum_hotel_double.jpg" }, prices: { double: 850, triple: 1050, quad: 1250 } },
    { id: "emaar_grand", name: "Emaar Grand Hotel (Bintang 4)", stars: 4, dist: "450 m", image: "assets/hotels/emaar_grand.jpg", roomImages: { quad: "assets/hotels/rooms/emaar_grand_quad.jpg", triple: "assets/hotels/rooms/emaar_grand_triple.jpg", double: "assets/hotels/rooms/emaar_grand_double.jpg" }, prices: { double: 550, triple: 650, quad: 750 } },
    { id: "emaar_elite", name: "Emaar Elite Makkah (Bintang 4)", stars: 4, dist: "500 m", image: "assets/hotels/emaar_elite.jpg", roomImages: { quad: "assets/hotels/rooms/emaar_elite_quad.jpg", triple: "assets/hotels/rooms/emaar_elite_triple.jpg", double: "assets/hotels/rooms/emaar_elite_double.jpg" }, prices: { double: 500, triple: 600, quad: 700 } },
    { id: "retaj_al_rayyan", name: "Retaj Al Rayyan (Bintang 4)", stars: 4, dist: "600 m", image: "assets/hotels/retaj_al_rayyan.jpg", roomImages: { quad: "assets/hotels/rooms/retaj_al_rayyan_quad.jpg", triple: "assets/hotels/rooms/retaj_al_rayyan_triple.jpg", double: "assets/hotels/rooms/retaj_al_rayyan_double.jpg" }, prices: { double: 480, triple: 560, quad: 640 } },
    { id: "le_meridien_towers", name: "Le Meridien Towers (Bintang 5, Shuttle 24 Jam)", stars: 5, dist: "Shuttle Bus Gratis", image: "assets/hotels/le_meridien_towers.jpg", roomImages: { quad: "assets/hotels/rooms/le_meridien_towers_quad.jpg", triple: "assets/hotels/rooms/le_meridien_towers_triple.jpg", double: "assets/hotels/rooms/le_meridien_towers_double.jpg" }, prices: { double: 420, triple: 490, quad: 560 } },
    { id: "al_kiswah_towers", name: "Al Kiswah Towers (Bintang 3, Shuttle Bus)", stars: 3, dist: "Shuttle Bus 24 Jam", image: "assets/hotels/al_kiswah_towers.jpg", roomImages: { quad: "assets/hotels/rooms/al_kiswah_towers_quad.jpg", triple: "assets/hotels/rooms/al_kiswah_towers_triple.jpg", double: "assets/hotels/rooms/al_kiswah_towers_double.jpg" }, prices: { double: 320, triple: 370, quad: 420 } },
    { id: "olayan_golden", name: "Olayan Golden Hotel (Bintang 3)", stars: 3, dist: "750 m", image: "assets/hotels/olayan_golden.jpg", roomImages: { quad: "assets/hotels/rooms/olayan_golden_quad.jpg", triple: "assets/hotels/rooms/olayan_golden_triple.jpg", double: "assets/hotels/rooms/olayan_golden_double.jpg" }, prices: { double: 280, triple: 320, quad: 360 } }
  ],

  hotelsMadinah: [
    { id: "dar_al_iman_intercon", name: "Dar Al Iman InterContinental (Bintang 5, Depan Pintu 25)", stars: 5, dist: "Pelataran Nabawi", image: "assets/hotels/dar_al_iman_intercon.jpg", roomImages: { quad: "assets/hotels/rooms/dar_al_iman_intercon_quad.jpg", triple: "assets/hotels/rooms/dar_al_iman_intercon_triple.jpg", double: "assets/hotels/rooms/dar_al_iman_intercon_double.jpg" }, prices: { double: 1250, triple: 1450, quad: 1650 } },
    { id: "maden_hotel", name: "Maden Hotel Madinah (Bintang 5)", stars: 5, dist: "50 m", image: "assets/hotels/maden_hotel.jpg", roomImages: { quad: "assets/hotels/rooms/maden_hotel_quad.jpg", triple: "assets/hotels/rooms/maden_hotel_triple.jpg", double: "assets/hotels/rooms/maden_hotel_double.jpg" }, prices: { double: 950, triple: 1100, quad: 1250 } },
    { id: "pullman_madinah", name: "Pullman Madinah (Bintang 5)", stars: 5, dist: "100 m", image: "assets/hotels/pullman_madinah.jpg", roomImages: { quad: "assets/hotels/rooms/pullman_madinah_quad.jpg", triple: "assets/hotels/rooms/pullman_madinah_triple.jpg", double: "assets/hotels/rooms/pullman_madinah_double.jpg" }, prices: { double: 880, triple: 1100, quad: 1320 } },
    { id: "saja_al_madinah", name: "Saja Al Madinah (Bintang 4, Favorit Jemaah)", stars: 4, dist: "250 m", image: "assets/hotels/saja_al_madinah.jpg", roomImages: { quad: "assets/hotels/rooms/saja_al_madinah_quad.jpg", triple: "assets/hotels/rooms/saja_al_madinah_triple.jpg", double: "assets/hotels/rooms/saja_al_madinah_double.jpg" }, prices: { double: 520, triple: 580, quad: 640 } },
    { id: "rua_international", name: "Rua International Hotel (Bintang 4)", stars: 4, dist: "200 m", image: "assets/hotels/rua_international.jpg", roomImages: { quad: "assets/hotels/rooms/rua_international_quad.jpg", triple: "assets/hotels/rooms/rua_international_triple.jpg", double: "assets/hotels/rooms/rua_international_double.jpg" }, prices: { double: 500, triple: 550, quad: 600 } },
    { id: "emaar_royal", name: "Emaar Royal Madinah (Bintang 5)", stars: 5, dist: "150 m", image: "assets/hotels/emaar_royal.jpg", roomImages: { quad: "assets/hotels/rooms/emaar_royal_quad.jpg", triple: "assets/hotels/rooms/emaar_royal_triple.jpg", double: "assets/hotels/rooms/emaar_royal_double.jpg" }, prices: { double: 680, triple: 780, quad: 880 } },
    { id: "grand_plaza_badr", name: "Grand Plaza Badr Al Maqam (Bintang 4)", stars: 4, dist: "300 m", image: "assets/hotels/grand_plaza_badr.jpg", roomImages: { quad: "assets/hotels/rooms/grand_plaza_badr_quad.jpg", triple: "assets/hotels/rooms/grand_plaza_badr_triple.jpg", double: "assets/hotels/rooms/grand_plaza_badr_double.jpg" }, prices: { double: 520, triple: 600, quad: 680 } },
    { id: "concorde_dar_al_khair", name: "Concorde Dar Al Khair (Bintang 3)", stars: 3, dist: "250 m", image: "assets/hotels/concorde_dar_al_khair.jpg", roomImages: { quad: "assets/hotels/rooms/concorde_dar_al_khair_quad.jpg", triple: "assets/hotels/rooms/concorde_dar_al_khair_triple.jpg", double: "assets/hotels/rooms/concorde_dar_al_khair_double.jpg" }, prices: { double: 480, triple: 530, quad: 580 } },
    { id: "diyar_al_eiman", name: "Diyar Al Eiman (Bintang 3)", stars: 3, dist: "350 m", image: "assets/hotels/diyar_al_eiman.jpg", roomImages: { quad: "assets/hotels/rooms/diyar_al_eiman_quad.jpg", triple: "assets/hotels/rooms/diyar_al_eiman_triple.jpg", double: "assets/hotels/rooms/diyar_al_eiman_double.jpg" }, prices: { double: 460, triple: 510, quad: 560 } },
    { id: "saman_al_jadid", name: "Saman Al Jadid (Bintang 3 Ekonomis)", stars: 3, dist: "450 m", image: "assets/hotels/saman_al_jadid.jpg", roomImages: { quad: "assets/hotels/rooms/saman_al_jadid_quad.jpg", triple: "assets/hotels/rooms/saman_al_jadid_triple.jpg", double: "assets/hotels/rooms/saman_al_jadid_double.jpg" }, prices: { double: 300, triple: 340, quad: 380 } }
  ],

  hhrRoutes: [
    { id: "makkah_madinah", label: "Makkah → Madinah", priceSar: 200, desc: "Durasi ±2 jam (Kelas Ekonomi)" },
    { id: "madinah_makkah", label: "Madinah → Makkah", priceSar: 200, desc: "Durasi ±2 jam (Kelas Ekonomi)" },
    { id: "jeddah_makkah", label: "Bandara Jeddah → Makkah", priceSar: 100, desc: "Durasi ±55 menit" },
    { id: "jeddah_madinah", label: "Bandara Jeddah → Madinah", priceSar: 200, desc: "Durasi ±1 jam 50 menit" }
  ],

  // Daftar Pilihan Armada Resmi Mutawwifmu (Booklet Hal. 05)
  armadaList: [
    { id: "camry", name: "Camry / Sonata", capacity: "2–3 Pax", desc: "Sedan premium, cocok untuk pasangan atau keluarga kecil", maxPax: 3 },
    { id: "staria", name: "Hyundai Staria", capacity: "4–6 Pax", desc: "MPV modern, nyaman untuk keluarga / rombongan kecil", maxPax: 6 },
    { id: "gmc", name: "GMC New Model", capacity: "4–6 Pax", desc: "SUV luxury besar, pengalaman berkendara VIP", maxPax: 6 },
    { id: "hiace", name: "Toyota Hiace", capacity: "7–12 Pax", desc: "Minibus lega, ideal untuk rombongan keluarga besar", maxPax: 12 },
    { id: "coaster", name: "Toyota Coaster", capacity: "13–29 Pax", desc: "Bus mini, pilihan terbaik grup rombongan menengah", maxPax: 29 },
    { id: "bus", name: "Bus Full Size", capacity: "30–49 Pax", desc: "Bus besar 49 seat, solusi ekonomis jamaah rombongan", maxPax: 49 }
  ],

  // Rute Perjalanan Transportasi & City Tour Resmi (Booklet Hal. 05 & 06)
  localTransport: [
    {
      id: "airport_hotel_jeddah",
      label: "Bandara Jeddah ↔ Hotel Makkah",
      desc: "Antar-jemput kedatangan bandara Jeddah langsung ke lobi hotel Makkah",
      icon: "car",
      prices: { camry: 500, staria: 600, gmc: 700, hiace: 650, coaster: 900, bus: 1050 }
    },
    {
      id: "hotel_makkah_airport_jeddah",
      label: "Hotel Makkah ↔ Bandara Jeddah",
      desc: "Antar-jemput kepulangan dari lobi hotel Makkah menuju bandara Jeddah",
      icon: "car",
      prices: { camry: 450, staria: 550, gmc: 700, hiace: 650, coaster: 900, bus: 1050 }
    },
    {
      id: "makkah_madinah_transfer",
      label: "Transfer Antarkota Makkah ↔ Madinah",
      desc: "Perjalanan darat antarkota Makkah & Madinah (alternatif / pendukung kereta HHR)",
      icon: "car",
      prices: { camry: 700, staria: 800, gmc: 800, hiace: 900, coaster: 1250, bus: 1450 }
    },
    {
      id: "airport_hotel_medinah",
      label: "Bandara Madinah ↔ Hotel Madinah",
      desc: "Antar-jemput kedatangan bandara Madinah langsung ke lobi hotel Madinah",
      icon: "car",
      prices: { camry: 400, staria: 450, gmc: 600, hiace: 600, coaster: 750, bus: 950 }
    },
    {
      id: "hotel_madinah_airport_medinah",
      label: "Hotel Madinah ↔ Bandara Madinah",
      desc: "Antar-jemput kepulangan dari lobi hotel Madinah menuju bandara Madinah",
      icon: "car",
      prices: { camry: 370, staria: 400, gmc: 550, hiace: 550, coaster: 700, bus: 950 }
    },
    {
      id: "hotel_madinah_airport_jeddah",
      label: "Hotel Madinah ↔ Bandara Jeddah (PP)",
      desc: "Perjalanan darat langsung dari hotel Madinah menuju bandara Jeddah",
      icon: "car",
      prices: { camry: 750, staria: 850, gmc: 1150, hiace: 900, coaster: 1250, bus: 1650 }
    },
    {
      id: "city_tour_makkah",
      label: "City Tour Kota Makkah (Termasuk Mutawwif & Snack)",
      desc: "Jabal Tsur, Padang Arafah, Jabal Rahmah, Muzdalifah & Mina, Jabal Nur",
      icon: "van",
      prices: { camry: 820, staria: 930, gmc: 930, hiace: 1045, coaster: 1235, bus: 1705 }
    },
    {
      id: "city_tour_madinah",
      label: "City Tour Kota Madinah (Termasuk Mutawwif & Snack)",
      desc: "Masjid Bilal, Sholat di Masjid Quba, Kebun Kurma, Jabal Uhud",
      icon: "van",
      prices: { camry: 820, staria: 880, gmc: 880, hiace: 995, coaster: 1165, bus: 1395 }
    },
    {
      id: "city_tour_thaif",
      label: "City Tour Ekskursi Thaif (Termasuk Mutawwif & Snack)",
      desc: "Masjid Abdullah bin Abbas, Pabrik Parfum Mawar, Miqat Qarnul Manazil",
      icon: "mountain",
      prices: { camry: 920, staria: 1235, gmc: 1235, hiace: 1345, coaster: 1665, bus: 2095 }
    },
    {
      id: "wisata_alula",
      label: "Ekskursi Madinah ↔ Al-Ula (Hegra & Elephant Rock)",
      desc: "Kawasan Bersejarah Hegra / Madain Saleh & Elephant Rock (Paket Eksklusif)",
      icon: "landmark",
      prices: { camry: 1200, staria: 1400, gmc: 1600, hiace: 1800, coaster: 2500, bus: 3500 }
    }
  ],

  // Layanan Mutawwif, Handling, & Fasilitas Tambahan (Booklet Hal. 04 & 07)
  mutawwifServices: [
    {
      id: "mutawwif_reguler",
      label: "Mutawwif Reguler (Berbahasa Indonesia)",
      priceSar: 300,
      desc: "Penyediaan mutawwif resmi bersertifikat berbahasa Indonesia mendampingi rangkaian ibadah umroh (Sesuai Booklet).",
      checked: true
    },
    {
      id: "mutawwif_bilingual",
      label: "Mutawwif Bilingual (Indonesia, Arab, Inggris)",
      priceSar: 350,
      desc: "Mutawwif berpengalaman menguasai 3 bahasa (Indonesia, Arab, Inggris) untuk asistensi ibadah dan komunikasi.",
      checked: false
    },
    {
      id: "airport_handling_jeddah",
      label: "Handling Bandara Jeddah (Kedatangan & Kepulangan)",
      priceSar: 300,
      desc: "Pendampingan imigrasi, penanganan bagasi bus/mobil, dan check-in hotel di Bandara Jeddah (per grup).",
      checked: true
    },
    {
      id: "airport_handling_jakarta",
      label: "Handling Bandara Jakarta (Soekarno-Hatta)",
      priceIdr: 350000,
      isPerPax: true,
      desc: "Asistensi check-in, bagasi, dan pelepasan jamaah di Bandara Internasional Soekarno-Hatta (Rp350.000 / pax).",
      checked: false
    },
    {
      id: "airport_handling_vip",
      label: "Handling Jeddah VIP + Penjemputan + Free Mutawwif 1x",
      priceSar: 900,
      desc: "Paket lengkap handling bandara PP, penjemputan khusus, dan gratis 1x pendampingan mutawwif saat umroh.",
      checked: false
    },
    {
      id: "doc_foto_video",
      label: "Dokumentasi Profesional Foto & Video",
      priceSar: 600,
      desc: "Tim fotografer & videografer profesional di tanah suci, termasuk editing foto & video siap tayang.",
      checked: false
    },
    {
      id: "exclusive_merchandise",
      label: "Paket Perlengkapan Umroh Mutawwifmu",
      priceIdr: 950000,
      isPerPax: true,
      desc: "Perlengkapan ibadah eksklusif dikirim ke rumah sebelum keberangkatan (Koper fiber, Ihram/Mukena, Tas paspor).",
      checked: false
    }
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
