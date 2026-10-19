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
export const daftarKelas = (jenjang = "SD") => KELAS_PER_JENJANG[jenjang] ?? [];