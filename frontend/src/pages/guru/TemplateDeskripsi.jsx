import React, { useState, useEffect } from "react";
import api from "../../api";
import SidebarGuru from "../../components/SidebarGuru";
import toast from "react-hot-toast";
import { Save, RefreshCw, FileText, Plus, Trash2 } from "lucide-react";

const ASPEK_KOKURIKULER = [
  { key: "mutabaah_yaumiyah", label: "Mutabaah Yaumiyah" },
  { key: "bina_pribadi_islam", label: "Bina Pribadi Islam" },
  { key: "pjbl",               label: "PJBL" },
  { key: "literasi",           label: "Literasi" },
];

const GRADES = ["A", "B", "C", "D", "E"];

const GRADE_COLOR = {
  A: "bg-emerald-100 text-emerald-700 border-emerald-300",
  B: "bg-blue-100 text-blue-700 border-blue-300",
  C: "bg-amber-100 text-amber-700 border-amber-300",
  D: "bg-orange-100 text-orange-700 border-orange-300",
  E: "bg-rose-100 text-rose-700 border-rose-300",
};

const buildDefaultTemplate = (aspekList) => {
  const result = {};
  aspekList.forEach((key) => {
    result[key] = { A: "", B: "", C: "", D: "", E: "" };
  });
  return result;
};

export default function TemplateDeskripsi() {
  const [jenis, setJenis] = useState("kokurikuler");

  // ── State Kokurikuler (aspek hardcode) ──
  const [activeAspekKoku, setActiveAspekKoku] = useState(ASPEK_KOKURIKULER[0].key);
  const [templateKoku, setTemplateKoku] = useState(
    buildDefaultTemplate(ASPEK_KOKURIKULER.map((a) => a.key))
  );

  // ── State Ekstrakurikuler (aspek dinamis dari API) ──
  const [aspekEkskul, setAspekEkskul]       = useState([]); // [{key, label}]
  const [activeAspekEkskul, setActiveAspekEkskul] = useState(null);
  const [templateEkskul, setTemplateEkskul] = useState({});
  const [loadingEkskul, setLoadingEkskul]   = useState(false);

  // ── State Intrakurikuler ──
  const [templateIntra, setTemplateIntra] = useState([
    { min: 88, max: 100, deskripsi: "" },
    { min: 75, max: 87,  deskripsi: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);

  // ── Fetch sesuai jenis ──────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        if (jenis === "intrakurikuler") {
          const res = await api.get("/api/guru/template-deskripsi/intrakurikuler");
          if (res.data.success && res.data.data.length > 0) {
            setTemplateIntra(res.data.data);
          }

        } else if (jenis === "kokurikuler") {
          const res = await api.get("/api/guru/template-deskripsi/kokurikuler");
          if (res.data.success && Object.keys(res.data.data).length > 0) {
            setTemplateKoku((prev) => ({ ...prev, ...res.data.data }));
          }

        } else if (jenis === "ekstrakurikuler") {
          setLoadingEkskul(true);
          const res = await api.get("/api/guru/template-deskripsi/ekstrakurikuler");

          if (res.data.success) {
            // Bangun daftar aspek dari aspek_list (nama ekskul yang diampu)
            const list = (res.data.aspek_list || []).map((nama) => ({
              key:   nama,
              label: nama,
            }));
            setAspekEkskul(list);

            // Set active aspek ke yang pertama
            if (list.length > 0) setActiveAspekEkskul(list[0].key);

            // Merge template yang sudah ada
            const defaultTpl = buildDefaultTemplate(list.map((a) => a.key));
            setTemplateEkskul({ ...defaultTpl, ...res.data.data });
          }
          setLoadingEkskul(false);
        }
      } catch (err) {
        console.warn("Template belum ada:", err.response?.status);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [jenis]);

  // ── Handler Kokurikuler ─────────────────────────────────────────
  const handleChangeKoku = (aspek, grade, value) => {
    setTemplateKoku((prev) => ({
      ...prev,
      [aspek]: { ...prev[aspek], [grade]: value },
    }));
  };

  // ── Handler Ekstrakurikuler ─────────────────────────────────────
  const handleChangeEkskul = (aspek, grade, value) => {
    setTemplateEkskul((prev) => ({
      ...prev,
      [aspek]: { ...prev[aspek], [grade]: value },
    }));
  };

  // ── Handler Intrakurikuler ──────────────────────────────────────
  const handleChangeRange = (index, field, value) => {
    setTemplateIntra((prev) => {
      const updated = [...prev];
      updated[index][field] = field === "deskripsi" ? value : Number(value);
      return updated;
    });
  };
  const handleAddRange    = () => setTemplateIntra((prev) => [...prev, { min: 0, max: 0, deskripsi: "" }]);
  const handleRemoveRange = (i) => setTemplateIntra((prev) => prev.filter((_, idx) => idx !== i));

  // ── Save ────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      if (jenis === "intrakurikuler") {
        const res = await api.post("/api/guru/template-deskripsi/intrakurikuler/save", {
          templates: templateIntra,
        });
        if (res.data.success) toast.success("✅ Template berhasil disimpan!");

      } else {
        // kokurikuler atau ekstrakurikuler — struktur payload sama
        const sourceTemplate = jenis === "kokurikuler" ? templateKoku : templateEkskul;
        const templates = [];

        for (const aspek in sourceTemplate) {
          for (const grade in sourceTemplate[aspek]) {
            if (sourceTemplate[aspek][grade]) {
              templates.push({ aspek, grade, deskripsi: sourceTemplate[aspek][grade] });
            }
          }
        }

        const res = await api.post("/api/guru/template-deskripsi/save-bulk", {
          jenis,
          templates,
        });
        if (res.data.success) toast.success("✅ Template berhasil disimpan!");
      }
    } catch {
      toast.error("Gagal menyimpan template.");
    } finally {
      setSaving(false);
    }
  };

  // ── Render editor aspek (dipakai oleh kokurikuler & ekskul) ────
  const renderAspekEditor = (template, activeAspek, onChange) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 className="font-bold text-slate-700 text-lg mb-5">{activeAspek}</h2>
      <div className="space-y-4">
        {GRADES.map((grade) => (
          <div key={grade} className="flex gap-4 items-start">
            <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-bold text-sm shrink-0 ${GRADE_COLOR[grade]}`}>
              {grade}
            </div>
            <textarea
              value={template?.[activeAspek]?.[grade] || ""}
              onChange={(e) => onChange(activeAspek, grade, e.target.value)}
              rows={2}
              placeholder={`Deskripsi untuk nilai ${grade}...`}
              className="flex-1 text-sm text-slate-700 bg-slate-50 border border-slate-200 hover:border-indigo-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-2.5 resize-none outline-none transition-all"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <SidebarGuru />

      <main className="flex-1 p-4 lg:p-8">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-1">
              <FileText size={20} />
              <span className="uppercase tracking-wider text-xs">Akademik • Wali Kelas</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Template{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                Deskripsi{" "}
                {jenis === "kokurikuler" ? "Ko-Kurikuler"
                  : jenis === "ekstrakurikuler" ? "Ekstrakurikuler"
                  : "Intrakurikuler"}
              </span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">Deskripsi otomatis sesuai nilai.</p>
          </div>

          {/* Tab Jenis */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {["kokurikuler", "ekstrakurikuler", "intrakurikuler"].map((j) => (
              <button
                key={j}
                onClick={() => setJenis(j)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${
                  jenis === j
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                }`}
              >
                {j === "kokurikuler" ? "Ko-Kurikuler"
                  : j === "ekstrakurikuler" ? "Ekstrakurikuler"
                  : "Intrakurikuler"}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-400 animate-pulse">
              Memuat template...
            </div>
          ) : (
            <>
              {/* ── KOKURIKULER ── */}
              {jenis === "kokurikuler" && (
                <>
                  <div className="flex gap-2 flex-wrap mb-6">
                    {ASPEK_KOKURIKULER.map((a) => (
                      <button
                        key={a.key}
                        onClick={() => setActiveAspekKoku(a.key)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${
                          activeAspekKoku === a.key
                            ? "bg-slate-700 text-white border-slate-700"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                  {renderAspekEditor(templateKoku, activeAspekKoku, handleChangeKoku)}
                </>
              )}

              {/* ── EKSTRAKURIKULER ── */}
              {jenis === "ekstrakurikuler" && (
                <>
                  {loadingEkskul ? (
                    <div className="bg-white rounded-2xl p-8 text-center text-slate-400 animate-pulse">
                      Memuat daftar ekskul...
                    </div>
                  ) : aspekEkskul.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                      <p className="text-slate-400 font-medium">Belum ada ekskul yang Anda ampu.</p>
                      <p className="text-slate-300 text-sm mt-1">Hubungi Admin TU untuk penugasan ekskul.</p>
                    </div>
                  ) : (
                    <>
                      {/* Tab nama ekskul */}
                      <div className="flex gap-2 flex-wrap mb-6">
                        {aspekEkskul.map((a) => (
                          <button
                            key={a.key}
                            onClick={() => setActiveAspekEkskul(a.key)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${
                              activeAspekEkskul === a.key
                                ? "bg-slate-700 text-white border-slate-700"
                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                            }`}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                      {activeAspekEkskul && renderAspekEditor(templateEkskul, activeAspekEkskul, handleChangeEkskul)}
                    </>
                  )}
                </>
              )}

              {/* ── INTRAKURIKULER ── */}
              {jenis === "intrakurikuler" && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-bold text-slate-700 text-lg">Template Range Nilai Intrakurikuler</h2>
                    <button
                      onClick={handleAddRange}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm"
                    >
                      <Plus size={18} /> Tambah Range
                    </button>
                  </div>
                  <div className="space-y-4">
                    {templateIntra.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3 items-start bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <div className="col-span-2">
                          <label className="text-xs font-semibold text-slate-500">Min</label>
                          <input type="number" value={item.min}
                            onChange={(e) => handleChangeRange(index, "min", e.target.value)}
                            className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs font-semibold text-slate-500">Max</label>
                          <input type="number" value={item.max}
                            onChange={(e) => handleChangeRange(index, "max", e.target.value)}
                            className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                        </div>
                        <div className="col-span-7">
                          <label className="text-xs font-semibold text-slate-500">Deskripsi</label>
                          <textarea value={item.deskripsi}
                            onChange={(e) => handleChangeRange(index, "deskripsi", e.target.value)}
                            rows={2} placeholder="Masukkan deskripsi..."
                            className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none" />
                        </div>
                        <div className="col-span-1 flex justify-end pt-6">
                          <button onClick={() => handleRemoveRange(index)}
                            className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-600">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Tombol Simpan */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              {saving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
              Simpan Template
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}