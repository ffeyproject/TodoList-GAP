"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

export default function Sidebar({ selectedProject, onSelect }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: "", deadline: "" });
  const router = useRouter();

  // 🔹 Ambil profil user login
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/custom-profile");
        setCurrentUser(res.data);
      } catch (err) {
        console.error("Gagal ambil profil:", err);
      }
    };
    fetchProfile();
  }, []);

  // 🔹 Ambil daftar project
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Gagal ambil project:", err);
      }
    };
    fetchProjects();
  }, []);

  // 🔹 Fungsi logout
  const handleLogout = async () => {
    try {
      await api.post("/custom-logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  // 🔹 Fungsi tambah project
  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      await api.post("/projects", newProject);
      alert("Project berhasil ditambahkan!");
      setNewProject({ name: "", deadline: "" });

      // ✅ Ambil ulang daftar project
      const resProjects = await api.get("/projects");
      setProjects(resProjects.data);

      // ✅ Tutup modal Bootstrap
      const { Modal } = await import("bootstrap");
      const modalEl = document.getElementById("addProjectModal");
      let modalInstance = Modal.getInstance(modalEl);
      if (!modalInstance) modalInstance = new Modal(modalEl);
      modalInstance.hide();
    } catch (err) {
      console.error("Gagal tambah project:", err);
      alert("Gagal menambah project.");
    }
  };

  // 🔹 Filter project: tampilkan project yang dibuat user / user ada di tim
  const filteredProjects = (projects || []).filter(
    (p) =>
      p.created_by?.id === currentUser?.id ||
      p.users?.some((u) => u.id === currentUser?.id)
  );

  return (
    <>
      {/* Sidebar */}
      <div
        className="bg-dark text-white position-fixed d-flex flex-column"
        style={{
          width: "240px",
          height: "calc(100vh - 56px)", // tidak nabrak header
          top: "56px",
          left: 0,
          zIndex: 3000,
        }}
      >
        {/* Bagian atas bisa discroll */}
        <div className="flex-grow-1 overflow-auto p-3">
          <h4 className="mb-3">My List</h4>

          {/* Tombol buka modal */}
          <div className="mb-3">
            <button
              className="btn btn-sm btn-success w-100"
              data-bs-toggle="modal"
              data-bs-target="#addProjectModal"
            >
              + Tambah List
            </button>
          </div>

          {/* Daftar project */}
          <ul className="list-unstyled mb-4 project-list">
            {filteredProjects.length === 0 ? (
              <li className="text-muted fst-italic">Belum ada project.</li>
            ) : (
              filteredProjects.map((project) => (
                <li
                  key={project.id}
                  className={`p-2 mb-2 rounded ${
                    selectedProject?.id === project.id
                      ? "bg-primary"
                      : "bg-secondary"
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => onSelect(project)}
                >
                  <div className="fw-semibold">{project.name}</div>

                  {/* 🧑 Pembuat */}
                  {project.created_by?.name && (
                    <small className="text-light d-block">
                      Oleh: {project.created_by.name}
                    </small>
                  )}

                  {/* 📅 Deadline */}
                  {project.deadline && (
                    <small className="text-light d-block">
                      Deadline:{" "}
                      {new Date(project.deadline).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </small>
                  )}

                  {/* 👥 Tim */}
                  {project.users?.length > 0 && (
                    <small className="text-light d-block">
                      Tim:{" "}
                      {project.users
                        .map((u) => u.name || u.username || `User ${u.id}`)
                        .join(", ")}
                    </small>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Tombol logout di bawah */}
        <div
          className="border-top p-3"
          style={{
            flexShrink: 0,
            backgroundColor: "#212529",
          }}
        >
          <button className="btn btn-danger w-100" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </div>

      {/* Modal Tambah Project */}
      <div
        className="modal fade"
        id="addProjectModal"
        tabIndex="-1"
        aria-labelledby="addProjectModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addProjectModalLabel">
                Tambah Project Baru
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddProject}>
                {/* Input Nama */}
                <div className="mb-3">
                  <label className="form-label">Nama Project</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newProject.name}
                    onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Input Deadline */}
                <div className="mb-3">
                  <label className="form-label">Deadline</label>
                  <input
                    type="date"
                    className="form-control"
                    min={new Date().toISOString().split("T")[0]}
                    value={newProject.deadline}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        deadline: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Simpan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
