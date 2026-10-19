import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const API_BASE = "/api/tu";

export default function ModalPindahKelas({ siswa, onClose }) {
  const [rombelList, setRombelList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rombelTujuanId, setRombelTujuanId] = useState("");
  const [alasan, setAlasan] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch rombel aktif saat modal dibuka
useEffect(() => {
    const fetchRombel = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/rombel/aktif`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const json = await res.json();
        
        // DEBUG
        console.log("URL dipanggil:", `${API_BASE}/rombel/aktif`);
        console.log("Response:", json);
        
        if (json.success) {
          const filtered = json.data.filter((r) => r.id !== siswa.rombel_id);
          setRombelList(filtered);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRombel();
}, [siswa.rombel_id]);

  const handleSubmit = async () => {
    if (!rombelTujuanId) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/mutasi/siswa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          siswa_id: siswa.id,
          tipe_mutasi: "pindah_rombel",
          rombel_tujuan_id: rombelTujuanId,
          tanggal_mutasi: new Date().toISOString().split("T")[0],
          keterangan: alasan,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`✅ ${siswa.nama} berhasil dipindahkan ke kelas baru.`);
        onClose();
      } else {
        setError(json.message || "Gagal memproses mutasi.");
      }
    } catch (err) {
      setError("Koneksi gagal. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[400px] p-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Pindahkan Siswa
          </h3>
          <button onClick={onClose}>
            <FaTimes className="text-gray-500 hover:text-red-500" />
          </button>
        </div>

        <div className="space-y-3">
          <p>
            <strong>Nama:</strong> {siswa.nama}
          </p>
          <p>
            <strong>Kelas Saat Ini:</strong> {siswa.kelas}
          </p>

          {/* Dropdown Rombel */}
          <label className="block font-medium text-sm text-gray-600 mt-2">
            Pindahkan ke Kelas
          </label>

          {loading ? (
            <p className="text-sm text-gray-400 italic">Memuat data rombel...</p>
          ) : (
            <select
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
              value={rombelTujuanId}
              onChange={(e) => setRombelTujuanId(e.target.value)}
              disabled={rombelList.length === 0}
            >
              <option value="">
                {rombelList.length === 0
                  ? "Tidak ada rombel tersedia"
                  : "Pilih Kelas Tujuan"}
              </option>
              {rombelList.map((r) => (
                <option key={r.id} value={r.id}>
                  Kelas {r.tingkat_kelas} {r.sub_nama}
                </option>
              ))}
            </select>
          )}

          {/* Alasan */}
          <label className="block font-medium text-sm text-gray-600 mt-2">
            Alasan Pindah
          </label>
          <textarea
            rows="3"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            value={alasan}
            onChange={(e) => setAlasan(e.target.value)}
            placeholder="Tuliskan alasan pindah..."
          />

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!rombelTujuanId || submitting}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {submitting ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}