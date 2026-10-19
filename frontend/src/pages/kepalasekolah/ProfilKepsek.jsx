import React, { useEffect, useState } from "react";
import SidebarKepsek from "../../components/SidebarKepalasekolah";
import api from "../../api";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import ImageCropper from "../../components/ImageCropper";
import {
  FaUserCircle,
  FaCamera,
  FaLock,
  FaIdCard,
  FaUserTie,
  FaSave,
  FaKey,
  FaSyncAlt,
  FaSchool,
} from "react-icons/fa";

export default function ProfilKepsek() {
  const [user, setUser] = useState({});
  // 1. MODIFIKASI: Ubah 'nip' menjadi 'nipy' agar sesuai dengan AuthController
  const [form, setForm] = useState({ name: "", nipy: "" });
  const [password, setPassword] = useState({ current: "", new: "" });

  const [preview, setPreview] = useState(null);
  const [rawImage, setRawImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCrop, setShowCrop] = useState(false);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/user");
      setUser(res.data);
      // 2. MODIFIKASI: Ambil 'nipy' dari response backend
      setForm({ name: res.data.name, nipy: res.data.nipy || "" });
      setPreview(res.data.foto_url || null);
    } catch {
      toast.error("Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (files) => {
    const file = files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setRawImage(url);
      setShowCrop(true);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

const handleSubmit = async (e) => {
  e.preventDefault();
  setProcessing(true);

  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("nipy", form.nipy);

  if (croppedImage) {
    const file = new File([croppedImage], "avatar.jpg", {
      type: croppedImage.type || "image/jpeg",
    });
    formData.append("foto", file);
  }

  // 1. TAMBAHKAN INI: Spoofing method agar Laravel mengenalnya sebagai PUT
  formData.append("_method", "PUT");

  try {
    // 2. UBAH DISINI: Ganti api.put menjadi api.post
    await api.post("/api/user/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Profil berhasil diperbarui");
    fetchUser();
  } catch (err) {
    const errors = err.response?.data?.errors;
    if (errors?.nipy) {
      toast.error("NIPY sudah digunakan");
    } else {
      toast.error("Gagal memperbarui profil");
    }
  } finally {
    setProcessing(false);
  }
};

  const handleChangePassword = async () => {
    if (!password.current || !password.new)
      return toast.error("Isi semua field password");
    setProcessing(true);
    try {
      await api.post("/api/user/change-password", password);
      toast.success("Password berhasil diubah");
      setPassword({ current: "", new: "" });
    } catch {
      toast.error("Gagal mengubah password. Periksa password lama Anda.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen bg-amber-50">
        <SidebarKepsek />
        <div className="flex-1 p-8 animate-pulse">
          <div className="h-8 bg-amber-100 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-amber-100 rounded w-1/3 mb-10"></div>
          <div className="max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 h-64 bg-amber-100 rounded-3xl"></div>
            <div className="md:col-span-2 h-[400px] bg-amber-100 rounded-3xl"></div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-amber-50 text-slate-800">
      <SidebarKepsek />

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-4xl mx-auto">

          {/* HEADER */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <FaUserTie className="text-amber-600" /> Pengaturan Profil
              </h1>
              <p className="text-slate-500 mt-1">
                Kelola informasi akun dan keamanan Kepala Sekolah.
              </p>
            </div>
            <button
              onClick={fetchUser}
              className="p-3 bg-white border border-amber-200 text-amber-600 rounded-xl hover:bg-amber-50 transition shadow-sm"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* LEFT: PHOTO CARD */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-amber-100 text-center">
                <div className="relative inline-block group">
                  <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden bg-amber-100 flex items-center justify-center border-4 border-white shadow-xl">
                    {preview ? (
                      <img
                        src={preview}
                        className="w-full h-full object-cover"
                        alt="Profile"
                      />
                    ) : (
                      <span className="text-4xl font-black text-amber-600">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div
                    {...getRootProps()}
                    className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-3 rounded-2xl shadow-lg cursor-pointer hover:bg-amber-600 transition-all border-4 border-white"
                  >
                    <input {...getInputProps()} />
                    <FaCamera size={16} />
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="font-bold text-lg text-slate-800">
                    {user.name}
                  </h2>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-200 mt-2">
                    <FaSchool size={10} />
                    Kepala Sekolah
                  </div>
                </div>

                <div className="mt-8 space-y-3 pt-6 border-t border-amber-50">
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <FaIdCard className="text-slate-400" />
                    <span className="font-medium text-xs">
                      {/* 7. MODIFIKASI: Ubah user.nip menjadi user.nipy */}
                      NIPY: {user.nipy || "---"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: FORMS */}
            <div className="md:col-span-2 space-y-8">

              {/* PERSONAL INFO FORM */}
              <div className="bg-white rounded-[2rem] shadow-sm border border-amber-100 overflow-hidden">
                <div className="p-6 bg-amber-50/60 border-b border-amber-100 flex items-center gap-3">
                  <FaUserCircle className="text-amber-500" />
                  <h3 className="font-bold text-slate-700 uppercase tracking-widest text-xs">
                    Informasi Personal
                  </h3>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-amber-400 outline-none transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      NIPY
                    </label>
                    <input
                      type="text"
                      // 8. MODIFIKASI: Menggunakan form.nipy
                      value={form.nipy}
                      onChange={(e) =>
                        setForm({ ...form, nipy: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-amber-400 outline-none transition-all font-semibold"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={processing}
                      className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-amber-100 transition-all disabled:bg-slate-300"
                    >
                      {processing ? (
                        <FaSyncAlt className="animate-spin" />
                      ) : (
                        <FaSave />
                      )}
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>

              {/* SECURITY FORM */}
              <div className="bg-white rounded-[2rem] shadow-sm border border-amber-100 overflow-hidden">
                <div className="p-6 bg-amber-50/60 border-b border-amber-100 flex items-center gap-3">
                  <FaLock className="text-rose-500" />
                  <h3 className="font-bold text-slate-700 uppercase tracking-widest text-xs">
                    Keamanan Akun
                  </h3>
                </div>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        Password Lama
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password.current}
                        onChange={(e) =>
                          setPassword({ ...password, current: e.target.value })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-rose-400 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        Password Baru
                      </label>
                      <input
                        type="password"
                        placeholder="Minimal 6 karakter"
                        value={password.new}
                        onChange={(e) =>
                          setPassword({ ...password, new: e.target.value })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-rose-400 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleChangePassword}
                      disabled={processing}
                      className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-slate-200 transition-all disabled:bg-slate-300"
                    >
                      {processing ? (
                        <FaSyncAlt className="animate-spin" />
                      ) : (
                        <FaKey />
                      )}
                      Update Password
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* MODAL CROPPER */}
        {showCrop && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="p-6 bg-amber-500 text-white flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FaCamera /> Potong Foto
                </h3>
                <button
                  onClick={() => setShowCrop(false)}
                  className="text-amber-100 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-8">
                <ImageCropper
                  image={rawImage}
                  onCropDone={(blob) => {
                    setCroppedImage(blob);
                    setPreview(URL.createObjectURL(blob));
                    setShowCrop(false);
                  }}
                />
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setShowCrop(false)}
                    className="px-6 py-2 text-slate-400 font-bold hover:text-slate-600"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}