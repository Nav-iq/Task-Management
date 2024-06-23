import { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "./TaskForm";
import { message } from "antd";
import FeedbackForm from "../components/Feedback";

interface Task {
  _id: string;
  title: string;
  status: string;
  description: string;
  hasFeedback: boolean;
}

interface TaskListProps {
  token: string | null;
}

const TaskList: React.FC<TaskListProps> = ({ token }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [updateButton, setUpdateButton] = useState(false);
  const [updateTaskId, setUpdateTaskId] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [idSent, setIdSent] = useState("");
  const [username, setUsername] = useState<string | null>(localStorage.getItem("username"));
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Check feedback status for each task
      const tasksWithFeedbackStatus = await Promise.all(
        response.data.map(async (task: Task) => {
          const feedbackResponse = await axios.get(
            `http://localhost:4000/api/feedback/check/${task._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return { ...task, hasFeedback: feedbackResponse.data.hasFeedback };
        })
      );

      setTasks(tasksWithFeedbackStatus);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  const handleLogout = () => {
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    });
  };

  const handleDelete = async (taskId: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
      message.success({
        content: "Task deleted successfully",
        className: "absolute right-0 px-5",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      message.error({
        content: "Failed to delete task",
        className: "absolute right-0 px-5",
      });
    }
  };

  const handleEdit = (id: string) => {
    setUpdateButton(true);
    setUpdateTaskId(id);
    const task = tasks.find((task) => task._id === id);
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
    }
  };

  return (
    <div className="min-h-screen bg-gray">
      <div
        className="relative container px-10 m-auto flex items-center shadow-3xl shadow-primary justify-between w-full text-2xl text-tertiary bg-bg text-center py-3 font-bold 
      max-md:flex-col-reverse max-md:gap-y-5 max-md:pt-20"
      >
        <h1 className="flex flex-col gap-y-2">
          {username}
          <span className=" text-xs border-2 border-secondary rounded-full p-1 bg-gray">
            {role}
          </span>
        </h1>
        <h2>Task Management</h2>
        <button
          onClick={handleLogout}
          className=" text-md text-secondary w-fit main-btn text-center py-1 font-bold 
          max-md:absolute max-md:right-0 max-md:m-5 max-md:top-0"
        >
          Log Out
        </button>
      </div>

      <div className="container m-auto mt-10 flex flex-col items-center">
        {role === "User" ? (
          <FeedbackForm
            token={token}
            taskId={idSent}
            setIdSent={setIdSent}
            fetchTasks={fetchTasks}
          />
        ) : (
          <TaskForm
            token={token}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            fetchTasks={fetchTasks}
            updateButton={updateButton}
            setUpdateButton={setUpdateButton}
            updateTaskId={updateTaskId}
            setUpdateTaskId={setUpdateTaskId}
            role={role}
            status={status}
            setStatus={setStatus}
          />
        )}
        <h1 className="mt-10 text-2xl text-tertiary w-full bg-bg text-center py-3 font-bold shadow-3xl shadow-primary">
          Task List
        </h1>
        <div className="w-full p-5">
          <ul className="flex flex-col items-start list-decimal p-2">
            {tasks.map((task) => (
              <li key={task?._id} className="w-full">
                <div
                  className={`w-full flex justify-between items-center mb-2 shadow-3xl p-2 max-xsm:flex-col pr-6 max-xsm:pr-0"
                  `}
                >
                  <div className="flex flex-col flex-[5] overflow-x-auto max-xsm:text-center">
                    <h3 className="text-xl font-semibold">{task?.title}</h3>
                    <p className="text-base">{task?.description}</p>
                  </div>
                  <div className="w-full flex items-end justify-around flex-[1] gap-5  max-xsm:mt-3 m max-xxsm:flex-col max-xxsm:gap-2">
                    {role === "User" && (
                      <h3
                        className={`flex-1 bg-teal-500 rounded-full px-2 text-white shadow-3xl cursor-pointer transition-all ease-in   ${
                          task.hasFeedback
                            ? "cursor-not-allowed opacity-50 shadow-inner"
                            : "hover:bg-teal-600 hover:shadow-inner"
                        }`}
                        onClick={() => !task.hasFeedback && setIdSent(task?._id)}
                      >
                        {task.hasFeedback ? "Submitted" : "Feedback"}
                      </h3>
                    )}

                    {role === "User" ? null : (
                      <>
                        <h3
                          onClick={() => handleEdit(task._id)}
                          className="flex-1 shadow-inner w-fit text-center hover:shadow-[#00000057] text-sm font-medium rounded-full bg-tertiary px-2 text-white cursor-pointer"
                        >
                          Edit
                        </h3>
                        {role === "Manager" ? null : (
                          <h3
                            onClick={() => handleDelete(task._id)}
                            className="flex-1 shadow-inner w-fit hover:shadow-[#00000057] text-sm font-medium rounded-full bg-secondary px-2 text-white cursor-pointer"
                          >
                            Delete
                          </h3>
                        )}
                      </>
                    )}

                    <h3
                      className={`min-w-fit w-full text-center text-sm font-medium ${
                        task.status === "To Do"
                          ? "text-secondary "
                          : task.status === "In Progress"
                          ? "text-yellow-600 "
                          : task.status === "Completed"
                          ? "text-green-600 "
                          : "text-text"
                      }`}
                    >
                      {task?.status}
                    </h3>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
