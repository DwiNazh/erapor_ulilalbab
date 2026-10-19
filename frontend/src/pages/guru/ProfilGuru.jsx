import React, { useEffect, useState } from "react";
import SidebarKepsek from "../../components/SidebarGuru";
import api from "../../api";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import ImageCropper from "../../components/ImageCropper";
import {
  FaUserCircle,
  FaCamera,
  FaLock,
  FaIdCard,
  FaChalkboardTeacher,
  FaSave,
  FaKey,
  FaSyncAlt
} from "react-icons/fa";

export default function ProfilGuru() {
  const [user, setUser] = useState({});
  const [form, setForm] = useState({
    name: "",
    nipy: ""
  });

  const [password, setPassword] = useState({
    current: "",
    new: ""
  });

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
      setForm({
        name: res.data.name,
        nipy: res.data.nipy
      });
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
    multiple: false
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

    formData.append("_method", "PUT");

    try {
      await api.post("/api/user/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profil berhasil diperbarui");
      fetchUser();
    } catch {
      toast.error("Gagal memperbarui profil");
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
      toast.error("Gagal mengubah password");
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen bg-slate-50">
        <SidebarKepsek />
        <div className="flex-1 p-8 animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="h-[400px] bg-slate-200 rounded-3xl"></div>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <SidebarKepsek />

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-4xl mx-auto">

          {/* HEADER (PERSIS) */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <FaChalkboardTeacher className="text-indigo-600" /> Profil Saya
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                Update informasi identitas dan foto profil Anda.
              </p>
            </div>
            <button
              onClick={fetchUser}
              className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition shadow-sm"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* LEFT PROFILE CARD (PERSIS) */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center sticky top-10">

                <div className="relative inline-block group">
                  <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden bg-indigo-50 flex items-center justify-center border-4 border-white shadow-xl group-hover:scale-105 transition-transform">
                    {preview ? (
                      <img src={preview} className="w-full h-full object-cover" />
                    ) : (
                      <FaUserCircle className="text-4xl text-indigo-600" />
                    )}
                  </div>

                  <div
                    {...getRootProps()}
                    className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-3 rounded-2xl shadow-lg cursor-pointer border-4 border-white"
                  >
                    <input {...getInputProps()} />
                    <FaCamera size={16} />
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="font-bold text-lg text-slate-800">
                    {user.name}
                  </h2>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 mt-2">
                    Guru
                  </div>
                </div>

                <div className="mt-8 space-y-3 pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-sm text-slate-500 justify-center">
                    <FaIdCard className="text-slate-400" />
                    <span className="font-medium text-xs">
                      NIPY: {user.nipy}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT CONTENT (PERSIS STRUCTURE) */}
            <div className="md:col-span-2 space-y-8">

              {/* FORM */}
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">

                <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                  <FaUserCircle className="text-indigo-500" />
                  <h3 className="font-bold text-slate-700 uppercase tracking-widest text-xs">
                    Informasi Dasar
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                      Nama
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                      NIPY
                    </label>
                    <input
                      value={form.nipy}
                      onChange={(e) =>
                        setForm({ ...form, nipy: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 font-semibold"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={processing}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2"
                    >
                      {processing ? <FaSyncAlt className="animate-spin" /> : <FaSave />}
                      Perbarui Data
                    </button>
                  </div>
                </form>
              </div>

              {/* PASSWORD (PERSIS) */}
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">

                <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                  <FaLock className="text-rose-500" />
                  <h3 className="font-bold text-slate-700 uppercase tracking-widest text-xs">
                    Ganti Kata Sandi
                  </h3>
                </div>

                <div className="p-8 space-y-6">

                  <input
                    type="password"
                    placeholder="Password Lama"
                    value={password.current}
                    onChange={(e) =>
                      setPassword({ ...password, current: e.target.value })
                    }
                    className="w-full bg-slate-50 border rounded-2xl px-4 py-3.5"
                  />

                  <input
                    type="password"
                    placeholder="Password Baru"
                    value={password.new}
                    onChange={(e) =>
                      setPassword({ ...password, new: e.target.value })
                    }
                    className="w-full bg-slate-50 border rounded-2xl px-4 py-3.5"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={handleChangePassword}
                      disabled={processing}
                      className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2"
                    >
                      <FaKey />
                      Update Password
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

        {/* CROPPER */}
        {showCrop && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg">
              <ImageCropper
                image={rawImage}
                onCropDone={(blob) => {
                  setCroppedImage(blob);
                  setPreview(URL.createObjectURL(blob));
                  setShowCrop(false);
                }}
              />
            </div>
          </div>
        )}

      </main>
    </div>
  );
}