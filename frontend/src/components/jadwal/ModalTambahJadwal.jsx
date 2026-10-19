import { useState } from "react";

export default function ModalTambahJadwal({ subkelas, urutanHari, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    hari: "",
    mapel: "",
    jam: "",
    guru: "",
  });

  const handleSubmit = () => {
    if (!formData.hari || !formData.mapel || !formData.jam || !formData.guru) return;
    onSubmit(formData);
    setFormData({ hari: "", mapel: "", jam: "", guru: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">
          Tambah Jadwal Baru ({subkelas})
        </h3>
        <div className="space-y-3">
          <select
            name="hari"
            value={formData.hari}
            onChange={(e) => setFormData({ ...formData, hari: e.target.value })}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Pilih Hari</option>
            {urutanHari.map((hari) => (
              <option key={hari} value={hari}>
                {hari}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Mata Pelajaran"
            value={formData.mapel}
            onChange={(e) => setFormData({ ...formData, mapel: e.target.value })}
            className="w-full border rounded-lg p-2"
          />

          <input
            type="text"
            placeholder="Jam (misal: 07:00 - 08:30)"
            value={formData.jam}
            onChange={(e) => setFormData({ ...formData, jam: e.target.value })}
            className="w-full border rounded-lg p-2"
          />

          <input
            type="text"
            placeholder="Nama Guru"
            value={formData.guru}
            onChange={(e) => setFormData({ ...formData, guru: e.target.value })}
            className="w-full border rounded-lg p-2"
          />

          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
