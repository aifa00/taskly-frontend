import { useEffect, useMemo, useState } from "react";
import DoughnutChart from "../assets/DoughnutChart";
import AddTask from "./AddTask";
import axios from "../axiosConfig";
import {
  capitalize,
  getPriorityColor,
  getStatusColor,
  modifyDate,
} from "../utils/appUtils";
import EditTask from "./EditTask";
import Dialog from "../assets/Dialog";
import { toast } from "react-toastify";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_BASE_URL);

type TaskStatus = "pending" | "in-progress" | "completed" | "blocked";

interface TaskType {
  _id: string;
  title: string;
  status: TaskStatus;
  priority: string;
  dueDate: string;
}

interface UpdatedTaskType extends TaskType {
  oldStatus: string;
}
interface TaskData {
  pending: number;
  completed: number;
  blocked: number;
  "in-progress": number;
}
function Home() {
  const [openAddTask, setOpenAddTask] = useState<boolean>(false);
  const [openEditTask, setOpenEditTask] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [editTaskId, setEditTaskId] = useState<string>("");
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [taskData, setTaskData] = useState<TaskData>({
    pending: 10,
    completed: 0,
    blocked: 0,
    "in-progress": 0,
  });
  const [dialog, setDialog] = useState<any>({});

  useEffect(() => {
    // Listen for real-time task updates
    socket.on("taskAdded", (newTask: TaskType) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setTaskData((prevTaskData) => ({
        ...prevTaskData,
        [newTask.status]: prevTaskData[newTask.status] + 1,
      }));
    });

    socket.on("taskUpdated", (updatedTask: UpdatedTaskType) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
      if (
        updatedTask.oldStatus &&
        updatedTask.status !== updatedTask.oldStatus
      ) {
        setTaskData((prevTaskData: any) => ({
          ...prevTaskData,
          [updatedTask.oldStatus]: prevTaskData[updatedTask.oldStatus] - 1,
          [updatedTask.status]: prevTaskData[updatedTask.status] + 1,
        }));
      }
    });

    socket.on("taskDeleted", (deletedTask) => {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== deletedTask._id)
      );
      setTaskData((prevTaskData: any) => ({
        ...prevTaskData,
        [deletedTask.status]: prevTaskData[deletedTask.status] - 1,
      }));
    });

    // Cleanup
    return () => {
      socket.off("taskAdded");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data } = await axios.get("/tasks", {
          params: {
            status: filter,
          },
        });
        setTasks(data.tasks);
        setTaskData(data.taskData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTask();
  }, [filter]);

  const handleOpenAddTask = () => {
    setOpenAddTask(true);
  };
  const handleOpenEditTask = (taskId: string) => {
    setEditTaskId(taskId);
    setOpenEditTask(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setDialog({
      message: "Delete Task?",
      buttonLabel: "Delete",
      onCancel: () => setOpenDeleteDialog(false),
      onSuccess: async () => {
        setTasks([...tasks].filter((task: TaskType) => task._id !== taskId));
        try {
          await axios.delete(`/tasks/${taskId}`);
          toast.success("Task Deleted");
        } catch (error) {
          console.log(error);
        }
      },
    });
    setOpenDeleteDialog(true);
  };

  const searchResults = useMemo(
    () =>
      [...tasks].filter((task: TaskType) =>
        new RegExp(search, "i").test(task.title)
      ),
    [search, tasks]
  );
  return (
    <>
      <div className="flex-column lg:flex justify-center pt-10">
        <div className="shadow inline-block lg:mt-10 pb-10">
          <h1>Task Statistics</h1>
          <DoughnutChart data={taskData} />
        </div>

        <div className="lg:w-[58%] mx-5 lg:mx-10">
          <div className="flex items-end justify-between my-10 ">
            <div>
              <h1 className="text-lg inline-block font-bold">Tasks</h1>
              <button
                className="inline-block bg-pink-950 hover:bg-pink-900 rounded text-white p-2 ml-5"
                onClick={handleOpenAddTask}
              >
                Add Task+
              </button>
            </div>
            <select
              id="status"
              defaultValue={""}
              className="border-2 border-gray-300 outline-gray-400 text-black-900 text-sm rounded-lg focus:ring-pink-950 focus:border-pink-950 block w-1/4 p-2.5"
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In progress</option>
              <option value="blocked">Blocked</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search..."
              className="w-full p-2 sm:p-3 mb-5 outline-0 focus:border focus:border-gray-300 rounded-md shadow"
            />
          </div>

          <div className="flex flex-wrap justify-center md:justify-around lg:justify-start overflow-y-scroll max-h-[75vh] mb-20">
            {tasks.length > 0 && searchResults.length > 0 ? (
              (search ? searchResults : tasks).map((task: TaskType) => (
                <div
                  key={task._id}
                  className="shadow w-64 text-left bg-pink-100 rounded p-2 mr-5 mb-5"
                >
                  <div className="flex justify-end pr-2 text-sm mb-2">
                    <span
                      className="text-blue-600 cursor-pointer"
                      onClick={() => handleOpenEditTask(task._id)}
                    >
                      Edit
                    </span>
                    &nbsp; &nbsp;
                    <span
                      className="text-red-600 cursor-pointer"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      Delete
                    </span>
                  </div>
                  <h1 className="font-bold border-b-2">{task.title}</h1>

                  <p>
                    Status:&nbsp;
                    <strong
                      className={`text-sm ${getStatusColor(task.status)}`}
                    >
                      {capitalize(task.status)}
                    </strong>
                  </p>
                  <p>
                    Priority:&nbsp;
                    <strong
                      className={`text-sm ${getPriorityColor(task.priority)}`}
                    >
                      {capitalize(task.priority)}
                    </strong>
                  </p>
                  <p>
                    Due: <span>{modifyDate(task.dueDate)}</span>
                  </p>
                </div>
              ))
            ) : search ? (
              <div className="text-center w-full">
                <p className="text-gray-400">No results found!</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full">
                <img
                  src="https://static.vecteezy.com/system/resources/previews/025/343/104/non_2x/empty-folder-no-result-document-file-data-not-found-concept-empty-state-ui-infographic-free-vector.jpg"
                  className="w-1/3 h-4/5"
                  alt="empty-tasks"
                />
                <p className="text-gray-400">Yo have no tasks</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {openAddTask && <AddTask closeModal={() => setOpenAddTask(false)} />}
      {openEditTask && (
        <EditTask
          taskId={editTaskId}
          closeModal={() => setOpenEditTask(false)}
        />
      )}
      {openDeleteDialog && <Dialog dialog={dialog} />}
    </>
  );
}

export default Home;
