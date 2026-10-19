import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaChalkboardTeacher,
  FaClipboardCheck,
  FaSignOutAlt,
  FaUserCircle,
  FaChevronRight,
} from "react-icons/fa";

export default function SidebarKepsek() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();

  const isActive = (path, exact = false) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const handleLogout = async () => {
    try {
      toast.loading("Sedang keluar...", { id: "logout" });
      await logout?.();
      toast.success("Berhasil keluar", { id: "logout" });
      window.location.href = "/login";
    } catch (err) {
      toast.error("Gagal keluar");
      window.location.href = "/login";
    }
  };

  const menuItems = [
    {
      path: "/dashboardkepsek",
      label: "Dashboard",
      icon: <FaTachometerAlt />,
      exact: true,
    },
    {
      path: "/dashboardkepsek/guru",
      label: "Monitoring Guru",
      icon: <FaChalkboardTeacher />,
    },
    {
      path: "/dashboardkepsek/approval-rapor",
      label: "Approval Rapor",
      icon: <FaClipboardCheck />,
    },
    {
      path: "/dashboardkepsek/profil",
      label: "Profil Saya",
      icon: <FaUserCircle />,
    },
  ];

  return (
    <>
      {/* MOBILE TRIGGER */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-3 rounded-2xl shadow-xl text-purple-600 border border-purple-50"
      >
        <FaBars size={20} />
      </button>

      {/* BACKDROP */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* ASIDE SIDEBAR */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          w-72 h-screen bg-white border-r border-slate-100
          transform transition-all duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 flex flex-col
        `}
      >
        {/* HEADER AREA */}
        <div className="p-7">
          <div className="flex justify-end md:hidden mb-4">
            <button
              className="text-slate-300 hover:text-rose-500 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* USER PROFILE CARD */}
          <div className="flex items-center gap-3.5 p-5 bg-purple-50/50 rounded-[2rem] border border-purple-100/50 shadow-sm shadow-purple-100/20">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-purple-100 overflow-hidden">
                {user?.foto ? (
                  <img
                    src={user.foto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-purple-600 text-3xl" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
            </div>

            <div className="overflow-hidden">
              <p className="font-black text-[15px] text-slate-800 truncate leading-tight">
                {user?.name || "Kepala Sekolah"}
              </p>
              <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.15em] mt-1">
                Kepala Sekolah
              </p>
            </div>
          </div>
        </div>

        {/* NAVIGATION MENU */}
        <nav className="flex-1 overflow-y-auto px-6 space-y-1.5 mt-4 custom-scrollbar">
          <p className="text-[10px] font-black text-slate-400 px-4 mb-4 uppercase tracking-[0.3em] italic">
            Navigasi Utama
          </p>

          {menuItems.map((item) => {
            const active = isActive(item.path, item.exact);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group
                  ${
                    active
                      ? "bg-purple-600 text-white shadow-xl shadow-purple-200 translate-x-1"
                      : "text-slate-500 hover:bg-purple-50 hover:text-purple-600"
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`text-xl transition-transform duration-300 ${
                      active
                        ? "scale-110"
                        : "group-hover:scale-110 opacity-60 group-hover:opacity-100"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-bold text-[14px] tracking-tight">
                    {item.label}
                  </span>
                </div>

                {active && <FaChevronRight className="text-[10px] opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER AREA */}
        <div className="p-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-rose-500 bg-rose-50/50 hover:bg-rose-50 border border-rose-100/50 font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-sm shadow-rose-100/20"
          >
            <FaSignOutAlt />
            Keluar Aplikasi
          </button>
        </div>
      </aside>
    </>
  );
}