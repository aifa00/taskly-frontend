import { useEffect, useState } from "react";
import Button from "../assets/Button";
import axios from "../axiosConfig";
import Modal from "./Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditTask({
  taskId,
  closeModal,
}: {
  taskId: string;
  closeModal: () => void;
}) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("pending");
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState<string>(today);
  const [dueDate, setDueDate] = useState<string>("");
  const [priority, setPriority] = useState<string>("low");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const [dateError, setDateError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [deletedFileKeys, setDeletedFileKeys] = useState<string[]>([]);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data } = await axios.get(`/tasks/${taskId}`);
        const task = data.task;
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
        if (task.attachments && task.attachments?.length > 0)
          setAttachments(task.attachments);
        if (task.startDate)
          setStartDate(new Date(task.startDate).toISOString().split("T")[0]);
        if (task.dueDate)
          setDueDate(new Date(task.dueDate).toISOString().split("T")[0]);
        setPriority(task.priority);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTask();
  }, []);

  const handleSubmit = async () => {
    try {
      if (loading) return;

      setError("");

      if (!title || dateError) {
        if (!title) setError("Please enter a title");
        return;
      }

      setLoading(true);

      await axios.put(`/tasks/${taskId}`, {
        title,
        description,
        deletedFileKeys,
        status,
        startDate,
        dueDate,
        priority,
      });

      closeModal();
      toast.success("Task updated");
    } catch (error: any) {
      console.log(error);
      const errorMessage: string = error.response?.data?.message;
      errorMessage && setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onOuterClick={closeModal}>
      <div
        className="w-full lg:w-1/2 h-[75vh] overflow-y-scroll bg-white text-left p-5 lg:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <label
          htmlFor="title"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Title
        </label>
        <div className="my-2">
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => {
              if (error) setError("");
              setTitle(e.target.value);
            }}
            placeholder="Enter Title"
            className={`block w-full rounded-md ${
              error ? "border-2 border-red-400" : "border-0"
            } outline-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-200 sm:text-sm/6`}
          />
          {error && (
            <span className="block text-red-500 p-1 mt-2 bg-red-200 rounded-md">
              <i className="fa-solid fa-circle-xmark"></i> &nbsp;
              {error}
            </span>
          )}
        </div>

        <label
          htmlFor="description"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Description
        </label>
        <div className="my-2">
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter Task Description"
            className="block w-full rounded-md border-0 outline-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-200 sm:text-sm/6"
          />
        </div>

        <label className="inline-block text-sm/6 font-medium text-gray-900 p-2 my-2 rounded cursor-pointer bg-gray-100 hover:bg-gray-200">
          Attachments+
          <input
            type="file"
            multiple
            accept="image/*,application/pdf,video/*,audio/*"
            className="hidden"
            onChange={(e) => {
              const files = e.target.files;
              files && setAttachments([...attachments, ...Array.from(files)]);
            }}
          />
        </label>

        <div className="flex flex-wrap my-2">
          {attachments.map((file: any) => (
            <div key={file._id} className="relative mr-2 mb-2">
              <span
                className="absolute right-1 text-xl cursor-pointer"
                onClick={() => {
                  setDeletedFileKeys([...deletedFileKeys, file.key]);
                  setAttachments(
                    [...attachments].filter((elem) => elem !== file)
                  );
                }}
              >
                &times;
              </span>
              <img
                src={file?.imageUrl}
                className="w-20 h-20 border"
                alt={file._id}
              />
            </div>
          ))}
        </div>

        <label
          htmlFor="status"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Status
        </label>

        <div className="my-2">
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="block w-full rounded-md border-0 outline-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-200 sm:text-sm/6"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In-progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        <div className="flex-column sm:flex">
          <div className="flex-1">
            <label
              htmlFor="start-date"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Start Date
            </label>

            <div className="my-2 sm:pr-2">
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full rounded-md border-0 outline-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-200 sm:text-sm/6"
              />
            </div>
          </div>

          <div className="flex-1">
            <label
              htmlFor="due-date"
              className="block text-sm/6 font-medium text-gray-900 sm:pl-2"
            >
              Due Date
            </label>

            <div className="my-2 sm:pl-2">
              <input
                id="due-date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  if (
                    startDate &&
                    new Date(startDate) > new Date(e.target.value)
                  ) {
                    setDateError("Due date can't be less than start date");
                  } else {
                    if (dateError) setDateError("");
                  }
                }}
                type="date"
                className={`block w-full rounded-md ${
                  dateError ? "border-2 border-red-400" : "border-0"
                } outline-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-200 sm:text-sm/6`}
              />
              {dateError && (
                <span className="block text-red-500 p-1 mt-2 bg-red-200 rounded-md">
                  <i className="fa-solid fa-circle-xmark"></i> &nbsp;
                  {dateError}
                </span>
              )}
            </div>
          </div>
        </div>
        <label
          htmlFor="status"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Priority
        </label>

        <div className="my-2">
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="block w-full rounded-md border-0 outline-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-200 sm:text-sm/6"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <Button label={"Save"} onClick={handleSubmit} loading={loading} />
      </div>
    </Modal>
  );
}

export default EditTask;
