"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Sidebar from "../components/Sidebar";
import api from "../lib/api";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [task, setTask] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

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
      const res = await api.post("/comments", {
        task_id: selectedTask.id,
        body: comment,
      });

      setSelectedTask({
        ...selectedTask,
        comments: [...(selectedTask.comments || []), res.data],
      });
      setComment("");
    } catch (error) {
      console.error("Gagal simpan komentar:", error);
    }
  };

  // drag & drop task
  const onDragEnd = async (result) => {
    if (!result.destination || !selectedProject) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const taskId = result.draggableId;
      const newStatus = destination.droppableId;

      try {
        await api.put(`/tasks/${taskId}`, { status: newStatus });

        const updatedProjects = projects.map((proj) => {
          if (proj.id !== selectedProject.id) return proj;
          const updatedTasks = proj.tasks.map((t) =>
            t.id.toString() === taskId ? { ...t, status: newStatus } : t
          );
          return { ...proj, tasks: updatedTasks };
        });

        setProjects(updatedProjects);
        setSelectedProject(
          updatedProjects.find((p) => p.id === selectedProject.id)
        );
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
      const updatedProjects = projects.map((p) =>
        p.id === projectId ? res.data : p
      );
      setProjects(updatedProjects);
      setSelectedProject(res.data);
    } catch (err) {
      console.error("Gagal tambah kontributor:", err);
    }
  };

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
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar
        projects={projects}
        selectedProject={selectedProject}
        onSelect={setSelectedProject}
        onAdd={addProject}
      />

      {/* Konten kanan */}
      <div
        className="flex-grow-1"
        style={{ marginLeft: "240px", marginTop: "0", padding: "0 1.5rem" }}
      >
        {selectedProject ? (
          <>
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
            <div className="input-group mb-3" style={{ maxWidth: "400px" }}>
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

            {/* Input tambah task */}
            <div className="input-group mb-3" style={{ maxWidth: "400px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Tambah task..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
              <button className="btn btn-primary" onClick={addTask}>
                Tambah
              </button>
            </div>

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
                          className="p-3 border rounded min-vh-50"
                          style={{
                            background: snapshot.isDraggingOver
                              ? "#f1f1f1"
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
                                        ? "#d1e7dd"
                                        : "white",
                                      cursor: "pointer",
                                      ...provided.draggableProps.style,
                                    }}
                                    onClick={() => setSelectedTask(item)}
                                  >
                                    <div className="card-body p-2">
                                      {item.text}{" "}
                                      {item.comments?.length > 0 && (
                                        <span className="badge bg-secondary ms-2">
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
          <h4 className="text-muted">Tambahkan List untuk mulai</h4>
        )}
      </div>

      {/* Modal detail task */}
      {selectedTask && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedTask.text}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedTask(null)}
                ></button>
              </div>
              <div className="modal-body">
                <h6>Komentar:</h6>
                <ul className="list-group mb-3">
                  {(selectedTask.comments || []).map((c, i) => (
                    <li key={i} className="list-group-item">
                      <strong>{c.user?.name || "Anon"}:</strong> {c.body}
                    </li>
                  ))}
                </ul>

                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tambah komentar..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button className="btn btn-success" onClick={addComment}>
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
    </div>
  );
}
