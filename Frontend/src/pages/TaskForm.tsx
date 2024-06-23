import { FormEvent, useState } from "react";
import axios from "axios";
import { Input, Select, message } from "antd";

interface TaskFormProps {
  token: string | null;
  setTitle: any;
  setDescription: any;
  title: string;
  description: string;
  fetchTasks: () => void;
  updateButton: boolean;
  setUpdateButton: (updateButton: boolean) => void;
  updateTaskId: string;
  setUpdateTaskId: (id: string) => void;
  role: string | null;
  status: string;
  setStatus: any;
}

const TaskForm: React.FC<TaskFormProps> = ({
  token,
  setTitle,
  setDescription,
  title,
  description,
  fetchTasks,
  updateButton,
  setUpdateButton,
  updateTaskId,
  setUpdateTaskId,
  role,
  status,
  setStatus,
}) => {
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setDisabled(true);

    if (!title || !description) {
      message.error({
        content: "Please fill in all fields",
        className: "absolute right-0 px-5",
      });
      setDisabled(false);
      return;
    }

    try {
      await axios.post(
        "http://localhost:4000/api/tasks",
        { title, description, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success({
        content: "Task added successfully",
        className: "absolute right-0 px-5",
      });
      setTitle("");
      setDescription("");
      fetchTasks();
      setDisabled(false);
    } catch (error) {
      setDisabled(false);
      message.error({
        content: "Failed to add task",
        className: "absolute right-0 px-5",
      });
      console.error(error);
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setDisabled(true);
    try {
      await axios.put(
        `http://localhost:4000/api/tasks/${updateTaskId}`,
        { title, description, status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTasks();
      message.success({
        content: "Task updated successfully",
        className: "absolute right-0 px-5",
      });
      setDisabled(false);
      setUpdateButton(false);
      setTitle("");
      setDescription("");
      setUpdateTaskId("");
      setStatus("To Do");
    } catch (error) {
      setDisabled(false);
      console.error("Error updating task:", error);
      message.error({
        content: "Failed to update task",
        className: "absolute right-0 px-5",
      });
    }
  };

  return (
    <form
      onSubmit={role === "Manager" ? handleUpdate : updateButton ? handleUpdate : handleSubmit}
      className="flex flex-col max-w-[500px] w-full gap-4"
    >
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="input"
      />
      <Input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="input"
      />
      <div className=" flex justify-between items-center gap-2">
        <h1 className="w-1/5 text-tertiary max-xxsm:w-1/3 text-center font-semibold text-lg py-3">
          Status :{" "}
        </h1>
        <Select
          className="w-full h-[54px] text-center input p-0 rounded-md"
          value={status}
          onChange={(value) => setStatus(value)}
          options={[
            { value: "To Do", label: "To Do" },
            { value: "In Progress", label: "In Progress" },
            { value: "Completed", label: "Completed" },
          ]}
        />
      </div>

      <button
        type="submit"
        className={`main-btn ${disabled && " active:animate-none"}`}
        disabled={disabled}
      >
        {role === "Manager" ? "Update Task" : updateButton ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
};

export default TaskForm;
