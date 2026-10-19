import React from "react";

export default function JadwalTable({ subkelas, jadwal, urutanHari, onTambah, onExport, onImport }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-md bg-white">
      {/* Header & Buttons */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-100 to-indigo-100 border-b border-blue-200">
        <h3 className="text-xl font-semibold text-blue-700">Jadwal Subkelas {subkelas}</h3>
        <div className="flex gap-3">
          <button
            onClick={onTambah}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            + Tambah Jadwal
          </button>
          <button
            onClick={onExport}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Export Excel
          </button>
          <label className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow cursor-pointer">
            Import Excel
            <input type="file" accept=".xlsx, .xls" onChange={onImport} className="hidden" />
          </label>
        </div>
      </div>

      {/* Tabel Jadwal */}
      {Object.keys(jadwal).length > 0 ? (
        urutanHari
          .filter((hari) => jadwal[hari])
          .map((hari) => (
            <div key={hari} className="mb-8">
              <h4 className="text-lg font-semibold text-blue-600 mb-2 px-4">{hari}</h4>
              <table className="w-full border-collapse mb-4">
                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <tr>
                    <th className="p-3 text-left w-16">No</th>
                    <th className="p-3 text-left">Mata Pelajaran</th>
                    <th className="p-3 text-left">Jam</th>
                    <th className="p-3 text-left">Guru</th>
                  </tr>
                </thead>
                <tbody>
                  {jadwal[hari].map((j, i) => (
                    <tr key={i} className="odd:bg-white even:bg-blue-50 hover:bg-blue-100 transition">
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3 font-medium text-gray-800">{j.mapel}</td>
                      <td className="p-3">{j.jam}</td>
                      <td className="p-3">{j.guru}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
      ) : (
        <p className="p-4 text-gray-500 italic">Belum ada jadwal untuk subkelas ini.</p>
      )}
    </div>
  );
}
