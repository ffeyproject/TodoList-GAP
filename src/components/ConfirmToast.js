import toast from "react-hot-toast";

export function showConfirmToast(message, onConfirm) {
  toast.custom(
    (t) => (
      <div
        className="bg-dark text-white shadow p-4 rounded shadow-md flex flex-col items-center"
        style={{ minWidth: "250px" }}
      >
        <p className="text-gray-800 mb-3">{message}</p>
        <div className="d-flex flex-row gap-2 justify-content-end">
          <button
            onClick={() => {
              toast.dismiss(t.id); // langsung tutup
              onConfirm();
            }}
            className="btn bg-cyan text-dark"
          >
            Ya
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="btn bg-purple text-light"
          >
            Batal
          </button>
        </div>
      </div>
    ),
    {
      duration: 0, // ❗️Tidak auto-dismiss
      position: "top-center", // (opsional)
    }
  );
}
