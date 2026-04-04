import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TaskForm = ({ onAddTask, loading }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await onAddTask(title.trim());
    setTitle("");
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Nhập công việc mới..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
        className="flex-1"
        disabled={loading}
      />
      <Button onClick={handleSubmit} size="icon" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default TaskForm;
