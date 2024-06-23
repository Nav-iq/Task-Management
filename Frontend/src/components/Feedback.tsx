import { FormEvent, useState } from "react";
import axios from "axios";
import { message } from "antd";
import TextArea from "antd/es/input/TextArea";

interface FeedbackFormProps {
  taskId: string;
  token: string | null;
  setIdSent: (id: string) => void;
  fetchTasks: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ taskId, token, setIdSent, fetchTasks }) => {
  const [feedback, setFeedback] = useState("");
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setDisabled(true);
    if (!feedback) {
      message.error({ content: "Please enter your feedback", className: "absolute right-0 px-5" });
      setDisabled(false);
      return;
    }

    try {
      await axios.post(
        "http://localhost:4000/api/feedback",
        { taskId, feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success({
        content: "Feedback submitted successfully",
        className: "absolute right-0 px-5",
      });
      setFeedback("");
    } catch (error) {
      setDisabled(false);
      console.error("Error submitting feedback:", error);
      message.error({
        content: "Failed to submit feedback",
        className: "absolute right-0 px-5",
      });
    } finally {
      setDisabled(false);
      setIdSent("");
      fetchTasks();
    }
  };

  return (
    <>
      {taskId ? (
        <form
          onSubmit={handleSubmit}
          className="w-full m-auto max-w-[500px] font-normal text-lg p-10 flex flex-col gap-3 items-center bg-gray rounded-sm"
        >
          <TextArea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback"
            className="input"
          ></TextArea>
          <button type="submit" disabled={disabled} className="main-btn">
            Submit Feedback
          </button>
        </form>
      ) : (
        'Click on a "Feedback" to give feedback about task'
      )}
    </>
  );
};

export default FeedbackForm;
