"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Sidebar from "../components/Sidebar";
import { showConfirmToast } from "../components/ConfirmToast";
import api from "../lib/api";
// import { toast } from 'react-toastify';
import { MdGroupAdd } from "react-icons/md";
import { Stack, Button, Modal, ListGroup, Form, Card  } from "react-bootstrap";
import { FaGear } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { IoIosRemoveCircle } from "react-icons/io";
import { BsPaperclip } from "react-icons/bs";
import { FaFile } from "react-icons/fa";
import { FaEllipsisV } from "react-icons/fa";
import toast from "react-hot-toast";


export default function Home() {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [task, setTask] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [showContributorForm, setShowContributorForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [showModalManageContributor, setShowModalManageContributor] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);


  const router = useRouter();

  // cek login
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/custom-profile");
        fetchProjects();
      } catch (err) {
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // ambil semua project
  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data || []);
      console.log("projects", res.data);
    //   setProjects([
    //     {
    //         "id": 1,
    //         "name": "1",
    //         "deadline": "2025-10-06T00:00:00.000000Z",
    //         "created_at": "2025-10-06T03:00:20.000000Z",
    //         "updated_at": "2025-10-06T03:00:20.000000Z",
    //         "created_by_id": 1,
    //         "tasks": [
    //             {
    //                 "id": 34,
    //                 "project_id": 1,
    //                 "text": "Route delete Project : /api/projects/{project}",
    //                 "status": "done",
    //                 "created_at": "2025-10-13T10:00:16.000000Z",
    //                 "updated_at": "2025-10-15T02:49:52.000000Z",
    //                 "comments": [
    //                     {
    //                         "id": 38,
    //                         "task_id": 34,
    //                         "user_id": 4,
    //                         "body": "done",
    //                         "created_at": "2025-10-15T02:51:52.000000Z",
    //                         "updated_at": "2025-10-15T02:51:52.000000Z",
    //                         "user": {
    //                             "id": 4,
    //                             "name": "Winner",
    //                             "email": "winner@mail.com",
    //                             "email_verified_at": null,
    //                             "created_at": "2025-10-06T04:14:25.000000Z",
    //                             "updated_at": "2025-10-06T04:14:25.000000Z"
    //                         }
    //                     }
    //                 ]
    //             },
    //             {
    //                 "id": 26,
    //                 "project_id": 1,
    //                 "text": "route delete task : api/tasks/{task}",
    //                 "status": "done",
    //                 "created_at": "2025-10-13T03:08:07.000000Z",
    //                 "updated_at": "2025-10-15T04:30:02.000000Z",
    //                 "comments": [
    //                     {
    //                         "id": 39,
    //                         "task_id": 26,
    //                         "user_id": 4,
    //                         "body": "done",
    //                         "created_at": "2025-10-15T03:07:45.000000Z",
    //                         "updated_at": "2025-10-15T03:07:45.000000Z",
    //                         "user": {
    //                             "id": 4,
    //                             "name": "Winner",
    //                             "email": "winner@mail.com",
    //                             "email_verified_at": null,
    //                             "created_at": "2025-10-06T04:14:25.000000Z",
    //                             "updated_at": "2025-10-06T04:14:25.000000Z"
    //                         }
    //                     }
    //                 ]
    //             },
    //             {
    //                 "id": 25,
    //                 "project_id": 1,
    //                 "text": "route delete tim : /api/projects/{project}/contributors/{user}",
    //                 "status": "done",
    //                 "created_at": "2025-10-13T03:07:17.000000Z",
    //                 "updated_at": "2025-10-15T04:34:13.000000Z",
    //                 "comments": [
    //                     {
    //                         "id": 40,
    //                         "task_id": 25,
    //                         "user_id": 4,
    //                         "body": "done",
    //                         "created_at": "2025-10-15T04:30:10.000000Z",
    //                         "updated_at": "2025-10-15T04:30:10.000000Z",
    //                         "user": {
    //                             "id": 4,
    //                             "name": "Winner",
    //                             "email": "winner@mail.com",
    //                             "email_verified_at": null,
    //                             "created_at": "2025-10-06T04:14:25.000000Z",
    //                             "updated_at": "2025-10-06T04:14:25.000000Z"
    //                         }
    //                     }
    //                 ]
    //             },
    //             {
    //                 "id": 35,
    //                 "project_id": 1,
    //                 "text": "route add file : /api/tasks/{task}/files",
    //                 "status": "todo",
    //                 "created_at": "2025-10-15T04:50:54.000000Z",
    //                 "updated_at": "2025-10-15T04:50:54.000000Z",
    //                 "comments": [
    //                     {
    //                         "id": 41,
    //                         "task_id": 35,
    //                         "user_id": 1,
    //                         "body": "nama variable nya : files",
    //                         "created_at": "2025-10-15T04:52:39.000000Z",
    //                         "updated_at": "2025-10-15T04:52:39.000000Z",
    //                         "user": {
    //                             "id": 1,
    //                             "name": "admin",
    //                             "email": "admin@mail.com",
    //                             "email_verified_at": null,
    //                             "created_at": "2025-10-06T02:58:55.000000Z",
    //                             "updated_at": "2025-10-06T02:58:55.000000Z"
    //                         }
    //                     }
    //                 ]
    //             }
    //         ],
    //         "users": [
    //             {
    //                 "id": 1,
    //                 "name": "admin",
    //                 "email": "admin@mail.com",
    //                 "email_verified_at": null,
    //                 "created_at": "2025-10-06T02:58:55.000000Z",
    //                 "updated_at": "2025-10-06T02:58:55.000000Z",
    //                 "pivot": {
    //                     "project_id": 1,
    //                     "user_id": 1
    //                 }
    //             },
    //             {
    //                 "id": 4,
    //                 "name": "Winner",
    //                 "email": "winner@mail.com",
    //                 "email_verified_at": null,
    //                 "created_at": "2025-10-06T04:14:25.000000Z",
    //                 "updated_at": "2025-10-06T04:14:25.000000Z",
    //                 "pivot": {
    //                     "project_id": 1,
    //                     "user_id": 4
    //                 }
    //             }
    //         ],
    //         "created_by": {
    //             "id": 1,
    //             "name": "admin",
    //             "email": "admin@mail.com",
    //             "email_verified_at": null,
    //             "created_at": "2025-10-06T02:58:55.000000Z",
    //             "updated_at": "2025-10-06T02:58:55.000000Z"
    //         }
    //     }
    // ]);
      
    } catch (error) {
      console.error("Gagal ambil projects:", error);
    }
  };

  // tambah project
  const addProject = async (name, deadline = null) => {
    try {
      const res = await api.post("/projects", { name, deadline });
      setProjects([...projects, res.data]);
      setSelectedProject(res.data);
    } catch (error) {
      console.error("Gagal simpan project:", error);
    }
  };

  // polling komentar task
  useEffect(() => {
    if (!selectedTask) return;

    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/tasks/${selectedTask.id}`);
        setSelectedTask(res.data);
      } catch (err) {
        console.error("Gagal update komentar:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedTask]);

  // tambah task
  const addTask = async () => {
    if (!task.trim() || !selectedProject) return;
    try {
      const res = await api.post("/tasks", {
        project_id: selectedProject.id,
        text: task,
        status: "todo",
      });

      const updatedProjects = projects.map((proj) =>
        proj.id === selectedProject.id
          ? { ...proj, tasks: [...(proj.tasks || []), res.data] }
          : proj
      );

      setProjects(updatedProjects);
      setSelectedProject(
        updatedProjects.find((p) => p.id === selectedProject.id)
      );
      setTask("");
    } catch (error) {
      console.error("Gagal simpan task:", error);
    }
  };

  // tambah komentar
  const addComment = async () => {
    if (!comment.trim() || !selectedTask) return;
  
    try {
      // 1️⃣ Kirim komentar dulu
      const formData = new FormData();
      formData.append("task_id", selectedTask.id);
      formData.append("body", comment);
  
      const res = await api.post("/comments", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // 2️⃣ Kirim file (jika ada)
      if (selectedFiles.length > 0) {
        const fileForm = new FormData();
        fileForm.append("comment_id", res.data.id);
        selectedFiles.forEach((file) => {
          fileForm.append("files[]", file); // ← penting: gunakan "files[]"
        });
  
        await api.post(`tasks/${selectedTask.id}/files`, fileForm, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
  
      // 3️⃣ Update state frontend
      setSelectedTask({
        ...selectedTask,
        comments: [...(selectedTask.comments || []), res.data],
      });
  
      const updatedProjects = projects.map((proj) =>
        proj.id === selectedProject.id
          ? {
              ...proj,
              tasks: proj.tasks.map((t) =>
                t.id === selectedTask.id
                  ? {
                      ...t,
                      comments: [...(t.comments || []), res.data],
                    }
                  : t
              ),
            }
          : proj
      );
  
      setProjects(updatedProjects);
      setSelectedProject(
        updatedProjects.find((p) => p.id === selectedProject.id)
      );
  
      setComment("");
      setSelectedFiles([]);
      toast.success("Komentar berhasil ditambahkan!");
    } catch (error) {
      console.error("Gagal simpan komentar:", error);
    }
  };
  
  
  

  // drag & drop task
  const onDragEnd = async (result) => {
    if (!result.destination || !selectedProject) return;
    const { source, destination } = result;

    //jika drag ke task yang sama, tidak perlu diupdate
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    if (source.droppableId !== destination.droppableId) {
      const taskId = result.draggableId;
      const newStatus = destination.droppableId;

      try {
        const updatedProjects = projects.map((proj) => {
          if (proj.id !== selectedProject.id)return proj;
          const updatedTasks = proj.tasks.map((t) =>
            t.id.toString() === taskId ? { ...t, status: newStatus } : t
          );
          return { ...proj, tasks: updatedTasks };
        });

        setProjects(updatedProjects);
        setSelectedProject(
          updatedProjects.find((p) => p.id === selectedProject.id)
        );
        await api.put(`/tasks/${taskId}`, { status: newStatus });
        toast.success('Status task berhasil diubah!')
      } catch (err) {
        console.error("Gagal update status task:", err);
      }
    }
  };

  // tambah kontributor
  const addContributors = async (projectId, emails) => {
    try {
      const res = await api.post(`/projects/${projectId}/contributors`, {
        emails,
      });
      // ubah projects secara imutabel users : res.data.users
      const updatedProjects = projects.map((proj) =>
        proj.id === projectId ? { ...proj, users: res.data.users } : proj
      );
      setProjects(updatedProjects);
      setSelectedProject(updatedProjects.find((p) => p.id === projectId));
      toast.success('Kontributor berhasil ditambahkan!')
    } catch (err) {
      toast.error('Gagal menambahkan kontributor!');
      console.error("Gagal tambah kontributor:", err);
    }
  };

  //fungsi untuk hapus task
  const handleDeleteTask = async (taskId) => {
    try {
      // memnuculkan konfirmasi dulu sebelum melakukan delete
      showConfirmToast("Yakin untuk menghapus task ini?", () => {
        api.delete(`/tasks/${taskId}`);
        const updatedProjects = projects.map((proj) =>
          proj.id === selectedProject.id
            ? {
                ...proj,
                tasks: proj.tasks.filter((t) => t.id !== taskId),
              }
            : proj
        );
        // memperbarui state projects secara imutabel
        setProjects(updatedProjects);
        setSelectedProject(updatedProjects.find((p) => p.id === selectedProject.id));
        setSelectedTask(null);
        toast.success('Task berhasil dihapus!')
      });

    } catch (err) {
      console.error("Gagal hapus task:", err);
    }
  }

  // handle untuk menyembunyikan menu jika di klik di luar ref menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // jika modal masih terbuka, jangan tutup menu
      if (showModalManageContributor) return;
  
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModalManageContributor]);

  //handle untuk hapus project
  const handleDeleteProject = async (projectId) => {
    try {
      //memunculkan konfirmasi dulu
      showConfirmToast("Yakin untuk menghapus project ini?", () => {
        api.delete(`/projects/${projectId}`);
        const updatedProjects = projects.filter((p) => p.id !== projectId);
        // update state project
        setProjects(updatedProjects);
        setSelectedProject(null);
        setSelectedTask(null);
        toast.success('Project berhasil dihapus!')
      });
    } catch (err) {
      console.error("Gagal hapus project:", err);
    }
  };

  // handle Remove Contributor
  const handleRemoveContributor = async (projectId, contributorId) => {
    showConfirmToast("Yakin untuk menghapus kontributor ini?", () => {
      api.delete(`/projects/${projectId}/contributors/${contributorId}`);
      const updatedProjects = projects.map((p) =>
        p.id === projectId ? { ...p, users: p.users.filter((c) => c.id !== contributorId) } : p
      );
      setProjects(updatedProjects);
      setSelectedProject(updatedProjects.find((p) => p.id === projectId));
      toast.success('Kontributor berhasil dihapus!')
    })
  }

  //handle untuk memilih File
  const handleChooseFile = () => {
    // buka dialog pemilihan file
    fileInputRef.current.click();
  };

  useEffect(() => {
    console.log("FIle Selected",selectedFiles);
    
  }, [selectedFiles]);

  const handleFileChange = (e) => {
    // ambil semua file dari input
    const files = Array.from(e.target.files);

    // kalau ingin menambahkan file baru tanpa menimpa yang lama:
    setSelectedFiles((prev) => [...prev, ...files]);
    fileInputRef.current.value = null;
  };

  //handle untuk delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      showConfirmToast("Yakin untuk menghapus komentar ini?", () => {
        api.delete(`/comments/${commentId}`);
        const updatedProjects = projects.map((p) => {
          const updatedTasks = p.tasks.map((t) => {
            const updatedComments = t.comments.filter((c) => c.id !== commentId);
            return { ...t, comments: updatedComments };
          });
          return { ...p, tasks: updatedTasks };
        });
        setProjects(updatedProjects);
        setSelectedProject(updatedProjects.find((p) => p.id === selectedProject.id));
      });
    } catch (err) {
      console.error("Gagal hapus komentar:", err);
    }finally {
      toast.success('Komentar berhasil dihapus!')
    }
  }
  
  // total komentar
  const totalComments =
    selectedProject &&
    (selectedProject.tasks || []).reduce(
      (sum, task) => sum + (task.comments?.length || 0),
      0
    );

  if (loading) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <h4>Sedang memuat...</h4>
      </div>
    );
  }



  return (
    <div className="">
      {/* Sidebar */}
      <Sidebar
        projects={projects}
        selectedProject={selectedProject}
        setProjects={setProjects}
        onSelect={setSelectedProject}
        onSetUser={setUser}
      />

      {/* Konten kanan */}
      <div
        className="content"
      >
        {selectedProject ? (
          <>
            <Stack direction="horizontal" className="justify-content-between align-items-start">
              {/* Kiri */}
              <div className="d-flex flex-column flex-grow-1">
                <h2>{selectedProject.name}</h2>
                <p>
                  <strong>Deadline:</strong>{" "}
                  {selectedProject.deadline
                    ? new Date(selectedProject.deadline).toLocaleDateString()
                    : "Belum ditentukan"}
                </p>
                <p>
                  <strong>Tim:</strong>{" "}
                  {(selectedProject.users || []).map((u) => u.name).join(", ") ||
                    "Belum ada kontributor"}
                </p>
                <p>
                  <strong>Total komentar:</strong> {totalComments}
                </p>

                {/* Input tambah kontributor */}
                <Stack
                  direction="horizontal"
                  className="align-items-center"
                  style={{ maxWidth: "455px" }}
                >
                  <div
                    className={`contributor-input-container ${
                      showContributorForm ? "show" : ""
                    } mb-3`}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tambah Tim dengan Email (pisahkan dengan koma)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const emails = e.target.value
                            .split(",")
                            .map((email) => email.trim());
                          addContributors(selectedProject.id, emails);
                          e.target.value = "";
                        }
                      }}
                    />
                  </div>
                  <Button
                    className="mb-3 text-cyan bg-transparent p-0 d-flex align-items-center nowrap"
                    onClick={() => setShowContributorForm(!showContributorForm)}
                  >
                    <MdGroupAdd size={24} className="me-2 text-cyan cursor-pointer" />
                    {!showContributorForm && "Add Contributor"}
                  </Button>
                </Stack>

                {/* Input tambah task */}
                <div className="input-group mb-3" style={{ maxWidth: "400px" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tambah task..."
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                  />
                  <button className="btn bg-cyan text-dark" onClick={addTask}>
                    Tambah
                  </button>
                </div>
              </div>

              {/* Kanan */}
              <div className="position-relative d-inline-block" ref={menuRef}>
                {/* Ikon Gear */}
                <FaGear
                  className="text-cyan cursor-pointer"
                  size={24}
                  onClick={() => setShowMenu(!showMenu)}
                />

                {/* Card Menu (tepat di dekat ikon) 0*/}
                {showMenu && (
                  <div
                    className="card bg-dark shadow position-absolute"
                    style={{
                      top: "30px", // sedikit di bawah ikon
                      left: "-260px",   // sejajar dengan ikon di sisi kiri
                      zIndex: 1050,
                      width: "250px",
                      borderRadius: "10px",
                    }}
                  >
                    <p className="text-light px-3 m-0 pt-3">Pengaturan</p>
                    <ul className="list-unstyled mb-0 p-2">
                      <li className="py-1 px-2 hover-bg" style={{ cursor: "pointer" }}>
                        <Button variant="secondary" className="w-100" onClick={() => setShowModalManageContributor(selectedProject.id)}>Manage Contributor</Button>
                      </li>
                      <hr style={{borderColor: "rgba(255, 255, 255, 0.3)"}}/>
                      <li className="py-1 px-2 hover-bg" style={{ cursor: "pointer" }}>
                        <Button variant="danger" className="w-100" onClick={() => handleDeleteProject(selectedProject.id)}>Hapus Project</Button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </Stack>

            {/* Task board */}
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="row">
                {["todo", "progress", "done"].map((status) => (
                  <div key={status} className="col-md-4">
                    <h5 className="text-center">
                      {status === "todo"
                        ? "Todo"
                        : status === "progress"
                        ? "On Progress"
                        : "Done"}
                    </h5>
                    <Droppable droppableId={status}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`p-3 border rounded min-vh-50 border bg-transparent ${status === "todo" ? "border-secondary" : status === "progress" ? "border-warning" : "border-success"}`}
                          style={{
                            background: snapshot.isDraggingOver
                              ? (status === "todo"
                                ? "#ccc"
                                : status === "progress"
                                ? "#ffc1074d"
                                : "#dff0d8")
                              : "white",
                            minHeight: "300px",
                          }}
                        >
                          {(selectedProject.tasks || [])
                            .filter((t) => t.status === status)
                            .map((item, index) => (
                              <Draggable
                                key={item.id.toString()}
                                draggableId={item.id.toString()}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="card mb-2"
                                    style={{
                                      background: snapshot.isDragging
                                          ? "white"
                                          :  (status === "todo"
                                            ? "#f8f9fa"
                                            : status === "progress"
                                            ? "#664d03"
                                            : "#0a3622"),
                                      cursor: "pointer",
                                      color: snapshot.isDragging ? "black" : status === "todo" ? "black" : status === "progress" ? "white" : "white",
                                      ...provided.draggableProps.style,
                                    }}
                                    onClick={() => setSelectedTask(item)}
                                  >
                                    <div className="card-body p-2">
                                      {item.text}{" "}
                                      {item.comments?.length > 0 && (
                                        <span className="badge bg-danger ms-2 rounded">
                                          {item.comments.length}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          </>
        ) : (
          <h4 className="text-light">Tambahkan List untuk mulai</h4>
        )}
      </div>

      {/* Modal detail task */}
      {selectedTask && (
        <div
          className="modal fade show"
          data-bs-theme="dark"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content"> 
              <div className="modal-header">
                <h5 className="modal-title" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedTask.text}</h5>
                <div className="d-flex justify-content-end ms-auto">
                  <button
                    type="button"
                    className="btn-close ms-2"
                    onClick={() => setSelectedTask(null)}
                  ></button>
                </div>
              </div>
              <div className="modal-body">
                <Button variant="danger" className="mb-3" size="sm" onClick={() => handleDeleteTask(selectedTask.id)}><MdDelete size={20  }/>Hapus Task </Button>
                <ul className="list-group mb-3">
                  {(selectedTask.files || []).map((f, i) => (
                    <li className="list-group-item" key={i}>
                      <a href={f.url} target="_blank" rel="noopener noreferrer">
                        {f.name}
                      </a>
                    </li>
                  ))}
                </ul>
                <h6>Komentar:</h6>
                <div className="mb-3 p-2 customed-scrollbar" style={{ maxHeight: "70vh", overflowY: "auto"}}>
                  {(selectedTask.comments || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((c, i) => (
                    <ul className="list-group mb-3" key={i}>
                        <li className="list-group-item bg-extra-dark">
                            <span className="d-flex align-items-center justify-content-between">
                              <strong className="me-auto">{c.user?.name || "Anonymous"}</strong>
                              <span className="text-muted ms-auto justify-content-end">
                                {new Intl.DateTimeFormat("id-ID", { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(c.created_at))}
                              </span>
                              { user?.id === c.user_id &&
                                <span className="mx-2" style={{ cursor: "pointer" }} onClick={() => handleDeleteComment(c.id)}>
                                  <MdDelete className="text-danger" size={20}/>
                                </span>
                              }

                            </span>
                        </li>
                        <li className="list-group-item">
                          <p>{c.body}</p>
                          {c.files?.length > 0 && (
                            <ListGroup variant="flush">
                                {c.files.map((f, i) => (
                                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                    <ListGroup.Item className="d-flex align-items-center justify-content-between bg-secondary" key={i} >
                                      <div className="d-flex align-items-center gap-2">
                                        <FaFile size={35}/> {f.file_name} 
                                      </div>
                                    </ListGroup.Item>
                                  </a>

                                ))}
                            </ListGroup>
                          )}
                        </li>
                    </ul>
                  ))}
                </div>

                {selectedFiles.length > 0 && (
                  <Card className="p-2 shadow mb-1">
                        <ListGroup variant="flush">
                          {selectedFiles?.map((f, i) => (
                            <ListGroup.Item className="d-flex align-items-center justify-content-between bg-secondary" key={i}>
                              <div className="d-flex align-items-center gap-2">
                                <FaFile size={35}/> {f.name} 
                              </div>
                              <div className="d-flex text-danger" style={{ cursor: "pointer" }}  onClick={() =>setSelectedFiles((prevFiles) => prevFiles.filter((_, index) => index !== i))}>
                                <IoIosRemoveCircle size={24}/>
                              </div>
                            </ListGroup.Item>
                          ))}

                        </ListGroup>
                  </Card>                 
                )}

                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tambah komentar..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <button className="btn bg-secondary text-light" onClick={handleChooseFile}>
                    <BsPaperclip/>
                  </button>
                  <button className="btn bg-cyan text-dark" onClick={addComment} disabled={!comment}>
                    Kirim
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Project */}
      <div
        className="modal fade"
        id="addProjectModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Tambah Name List</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const name = e.target.name.value;
                  const deadline = e.target.deadline.value;
                  if (name.trim()) {
                    addProject(name, deadline);
                    e.target.reset();
                    document
                      .querySelector("#addProjectModal .btn-close")
                      .click();
                  }
                }}
              >
                <div className="mb-3">
                  <label className="form-label">Nama Project</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Masukkan nama project"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Deadline</label>
                  <input type="date" name="deadline" className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary">
                  Simpan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal Manage Contributor*/}
      <Modal data-bs-theme="dark" show={showModalManageContributor} onHide={() => setShowModalManageContributor(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Manage Contributor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><i>Contributor List :</i></p>
          <ListGroup variant="flush">
          {(selectedProject?.users || []).map((u, i) => (
              <ListGroup.Item className="d-flex justify-content-between align-items-center" key={i}>
              <div>
                <strong>{u.email}</strong>
              </div>
              <div className="d-flex text-danger" style={{ cursor: "pointer" }} onClick={() => handleRemoveContributor(selectedProject.id, u.id)}>
                <IoIosRemoveCircle size={24}/>Remove
              </div>
            </ListGroup.Item>
          ))}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </div>
    

  );
  
}
