import { motion } from "framer-motion";

export default function SubkelasCard({ sub, selected, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-200 shadow-sm ${
        selected
          ? "border-blue-600 bg-gradient-to-br from-blue-100 to-indigo-50 shadow-md"
          : "border-gray-200 bg-white hover:bg-blue-50"
      }`}
    >
      <h3 className="text-xl font-semibold text-blue-700 mb-1">{sub}</h3>
      <p className="text-sm text-gray-500">Klik untuk lihat / ubah jadwal</p>
    </motion.div>
  );
}
