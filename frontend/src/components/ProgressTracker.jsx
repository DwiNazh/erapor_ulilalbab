// src/components/ProgressTracker.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaCircle } from "react-icons/fa";

const steps = [
  { id: 1, label: "Tahun Ajaran", path: "/dashboardtusd/tahunajaran" },
  { id: 2, label: "Promosi Siswa", path: "/dashboardtusd/promosi" },
  { id: 3, label: "Penetapan Wali Kelas", path: "/dashboardtusd/wali-kelas" },
  { id: 4, label: "Penempatan Siswa", path: "/dashboardtusd/penempatan-siswa" },
  { id: 5, label: "Finalisasi Total", path: "/dashboardtusd/finalisasi-total" },
];

export default function ProgressTracker() {
  const navigate = useNavigate();
  
  // Dummy progress (nanti ganti dengan data real dari API / state)
  const [completedSteps, setCompletedSteps] = useState([1, 2]); // Contoh: langkah 1 & 2 selesai

  const handleStepClick = (step) => {
    // Hanya boleh klik kalau sudah selesai atau langkah berikutnya
    const maxCompleted = Math.max(...completedSteps, 0);
    if (completedSteps.includes(step.id) || step.id === maxCompleted + 1) {
      navigate(step.path);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
      <h3 className="text-xl font-bold text-blue-700 mb-4">Progress Setup Tahun Ajaran</h3>
      
      <div className="flex justify-between items-center relative">
        {/* Background line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2" />
        
        {/* Progress fill */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-blue-600 transition-all duration-500 -translate-y-1/2"
          style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === Math.max(...completedSteps, 0) + 1;
          const isDisabled = !isCompleted && !isCurrent;

          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step)}
              disabled={isDisabled}
              className={`flex flex-col items-center flex-1 relative z-10 transition-all ${
                isDisabled ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md ${
                  isCompleted
                    ? "bg-green-500"
                    : isCurrent
                    ? "bg-blue-600 ring-4 ring-blue-200"
                    : "bg-gray-300"
                }`}
              >
                {isCompleted ? <FaCheckCircle size={20} /> : step.id}
              </div>
              <span className="mt-2 text-xs md:text-sm font-medium text-center text-gray-700">
                {step.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tombol simulasi (untuk testing, hapus nanti) */}
      <button
        onClick={() => {
          const next = Math.max(...completedSteps, 0) + 1;
          if (next <= steps.length) setCompletedSteps((prev) => [...new Set([...prev, next])]);
        }}
        className="mt-6 text-sm text-blue-600 hover:underline"
      >
        Simulasi selesaikan langkah berikutnya (testing)
      </button>
    </div>
  );
}