export const TINGKAT_MULAI_PISAH_KATEGORI = 4;

export const perluKategori = (kelas) => Number(kelas) >= TINGKAT_MULAI_PISAH_KATEGORI;

export const KATEGORI_LABEL = { ikhwan: 'Ikhwan', akhwat: 'Akhwat', campuran: 'Campuran' };

// Kategori yang wajib cocok dengan siswa; null jika rombel campuran
export const kategoriRombel = (rombel) =>
  ['ikhwan', 'akhwat'].includes(rombel?.kelompok_gender) ? rombel.kelompok_gender : null;

export const labelRombel = (r) =>
  r?.nama_rombel || `${r?.tingkat_kelas ?? ''}${r?.sub_nama ?? ''}`;

export const KELAS_PER_JENJANG = {
  SD: [1, 2, 3, 4, 5, 6],
  SMP: [7, 8, 9],
  SMA: [10, 11, 12],
};

export const SEMUA_KELAS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export const daftarKelas = (jenjang) => KELAS_PER_JENJANG[jenjang] ?? SEMUA_KELAS;
export const kelasAwal = (j) => daftarKelas(j)[0];
export const kelasAkhir = (j) => { const d = daftarKelas(j); return d[d.length - 1]; };
export const rentangKelas = (j) => `Kelas ${kelasAwal(j)} - ${kelasAkhir(j)}`;

/**
 * Menentukan label subkelas untuk tampilan data siswa.
 * Untuk SD kelas 4-6 (atau kelas >= 4):
 * Siswa HARUS dipisah Ikhwan dan Akhwat, TIDAK BOLEH dicampur jadi "Reguler".
 */
export const getSubkelasLabel = (s) => {
  const kelas = Number(s?.tingkat_kelas || s?.kelas || 0);
  const isPisahGender = perluKategori(kelas);
  const kategori = (s?.kategori || '').toLowerCase().trim();

  // Bersihkan sub dasar (contoh 'A', 'B')
  let subDasar = (s?.sub_nama || s?.sub_kelas || s?.sub || '').trim();
  if (subDasar.toLowerCase() === 'reguler') {
    subDasar = '';
  }

  // Bersihkan nama rombel dari angka kelas di awal (contoh "4A Ikhwan" -> "A Ikhwan", "4 Reguler" -> "Reguler")
  const namaRombel = (s?.nama_rombel || '').trim();
  let rombelClean = namaRombel.replace(/^\d+/, '').trim();

  if (isPisahGender) {
    // 1. Jika nama_rombel sudah eksplisit menyebut Ikhwan / Akhwat
    if (/ikhwan/i.test(rombelClean) || /akhwat/i.test(rombelClean)) {
      return rombelClean.replace(/reguler/i, '').trim();
    }

    // 2. Ambil huruf sub jika ada (misal A, B, C)
    let hurufSub = subDasar;
    if (!hurufSub && rombelClean && !/reguler/i.test(rombelClean)) {
      hurufSub = rombelClean;
    }
    if (hurufSub.toLowerCase() === 'reguler') {
      hurufSub = '';
    }

    // 3. Pisahkan berdasarkan kategori siswa
    if (kategori === 'ikhwan') {
      return hurufSub ? `${hurufSub} Ikhwan` : 'Ikhwan';
    } else if (kategori === 'akhwat') {
      return hurufSub ? `${hurufSub} Akhwat` : 'Akhwat';
    } else {
      // Siswa kelas 4-6 yang belum ditentukan kategorinya
      return hurufSub ? `${hurufSub} (Belum Ditentukan)` : 'Belum Ditentukan';
    }
  }

  // Untuk kelas 1-3 (Campuran):
  if (rombelClean) return rombelClean;
  if (subDasar) return subDasar;
  return 'Reguler';
};
