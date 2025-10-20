"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal, Form, Button, Stack } from "react-bootstrap";
import api from "../lib/api";
import { toast } from 'react-hot-toast';
import { IoMdArrowDropdown, IoMdArrowDropup  } from "react-icons/io";
import { RiFolderAddFill } from "react-icons/ri";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { MdDoNotDisturbAlt } from "react-icons/md";



export default function Sidebar({  projects, selectedProject, onSelect, setProjects, onSetUser, user }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [newProject, setNewProject] = useState({ name: "", deadline: "" });
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showProject, setShowProject] = useState(false);
  const [keywordSearchProject, setKeywordSearchProject] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showMiniSidebar,setShowMiniSidebar] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0);
  const router = useRouter();

  // 🔹 Ambil profil user login
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/custom-profile");
        setCurrentUser(res.data);
        onSetUser(res.data);
        // setCurrentUser(
        //   {
        //     "id": 4,
        //     "name": "Winner",
        //     "email": "winner@mail.com",
        //     "email_verified_at": null,
        //     "created_at": "2025-10-06T04:14:25.000000Z",
        //     "updated_at": "2025-10-06T04:14:25.000000Z",
        //     "pivot": {
        //         "project_id": 1,
        //         "user_id": 4
        //     }
        // }
        // );
      } catch (err) {
        console.error("Gagal ambil profil:", err);
      }
    };
    fetchProfile();
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
      const res = await api.post("/projects", newProject);
      setNewProject({ name: "", deadline: "" });
      setProjects([...projects, res.data]);
      setShowAddProjectModal(false);
      toast.success("Project berhasil ditambahkan");
    } catch (err) {
      console.error("Gagal tambah project:", err);
      toast.error("Gagal menambah project.");
    }
  };

    // Pantau perubahan ukuran layar
    useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
  
      // Set ukuran awal
      setWindowWidth(window.innerWidth);
  
      // Tambahkan event listener
      window.addEventListener("resize", handleResize);
  
      // Hapus event listener saat komponen unmount
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    // Otomatis sembunyikan sidebar jika layar < 1000px
    useEffect(() => {
      if (windowWidth < 1000) {
        setShowSidebar(false);
        setShowMiniSidebar(true);
      } else {
        setShowSidebar(true);
        setShowMiniSidebar(false);
      }
    }, [windowWidth]);

  // 🔹 Filter project: tampilkan project yang dibuat user / user ada di tim
  const filteredProjects = (projects || [])
  .filter(
    (p) =>
      p.created_by?.id === currentUser?.id ||
      p.users?.some((u) => u.id === currentUser?.id)
  )
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));


  return (
    <>
      {/* Sidebar */}
      <div className="d-flex">
        <div
          className={`bg-dark text-cyan custom-sidebar ${showSidebar ? "show" : ""}`}
        >

          {/* Tombol buka modal */}
          <div className="p-3">
            <h4 className="mb-3">My Project List</h4>
            <div className="mb-3">
              <button
                className="btn btn-sm bg-cyan text-dark w-100"
                onClick={() => setShowAddProjectModal(true)}
              >
                <RiFolderAddFill /> New Project
              </button>
            </div>
            <Button variant="transparent" size="sm" className="w-100 text-cyan" onClick={() => setShowProject(!showProject)}>
              Projects
              {showProject ? <IoMdArrowDropup className="mx-2"/> : <IoMdArrowDropdown className="mx-2"/>}
            </Button>
            {showProject &&
              <Form className="my-2">
                <Form.Control size="sm" type="text" name="project-name" placeholder="Cari Project" value={keywordSearchProject} onChange={(e) => setKeywordSearchProject(e.target.value)}/>
              </Form>
            }

          </div>

          {/* Bagian atas bisa discroll */}
          <div className="flex-grow-1 overflow-auto sidebar-scrollbar p-3">
            {/* Daftar project */}
            <ul className="list-unstyled mb-4 project-list">
              {filteredProjects.length === 0 ? (
                <li className="text-secondary fst-italic text-center"><MdDoNotDisturbAlt/> Belum ada project.</li>
              ) : (
                showProject &&
                <>

                  {filteredProjects.map((project) => (
                    keywordSearchProject && !project.name.toLowerCase().includes(keywordSearchProject.toLowerCase()) ? null :
                    <li
                      key={project.id}
                      className={`p-2 mb-2 rounded ${
                        selectedProject?.id === project.id
                          ? "bg-cyan text-dark"
                          : "bg-secondary"
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => onSelect(project)}
                    >
                      <div className="fw-semibold" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{project.name}</div>

                      {/* 🧑 Pembuat */}
                      {project.created_by?.name && (
                        <small className={selectedProject?.id === project.id ? 'text-dark d-block' : 'text-light d-block'}>
                          Oleh: {project.created_by.name}
                        </small>
                      )}

                      {/* 📅 Deadline */}
                      {project.deadline && (
                        <small className={selectedProject?.id === project.id ? 'text-dark d-block' : 'text-light d-block'}>
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
                        <small className={selectedProject?.id === project.id ? 'text-dark d-block' : 'text-light d-block'}>
                          Tim:{" "}
                          {project.users
                            .map((u) => u.name || u.username || `User ${u.id}`)
                            .join(", ")}
                        </small>
                      )}
                    </li>
                  ))}
                </>
              )}
            </ul> 
          </div>

          {/* Tombol logout di bawah */}
          <div
            className="p-3"
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
        
        <div className={`mini-sidebar ${showMiniSidebar ? "" : "hide"} ${showSidebar ? "margined" : ""}`} onClick={() => setShowSidebar(!showSidebar)}>
        <div className={`toggle-icon ${showSidebar ? "rotate" : ""}`}>
          <FaArrowRight size={20} />
        </div>
      </div>
      </div>


      {/* Modal Tambah Project */}
      <Modal
        show={showAddProjectModal}
        onHide={() => setShowAddProjectModal(false)}
        data-bs-theme="dark"
        centered
      >
          <Modal.Header closeButton>
            <Modal.Title>Tambah Project</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-white">
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
                <Stack direction="horizontal" gap={2}>
                  <button type="submit" className="btn bg-cyan text-dark w-100">
                    Simpan
                  </button>
                  <button type="button" onClick={() => setShowAddProjectModal(false)} className="btn bg-purple text-light w-100">
                    Batal
                  </button>
                </Stack>

              </form>
          </Modal.Body>
      </Modal>
    </>
  );
}
