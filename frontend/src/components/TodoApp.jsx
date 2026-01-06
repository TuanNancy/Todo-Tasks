import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import AnimatedShaderBackground from "@/components/ui/animated-shader-background";

const TodoApp = () => {
  // Mock data - sẽ được thay thế khi kết nối backend
  const [tasks, setTasks] = useState([
    {
      _id: "1",
      title: "Hoàn thành dự án Todo App",
      status: "active",
      createdAt: new Date(),
    },
    {
      _id: "2",
      title: "Học React và Tailwind CSS",
      status: "completed",
      createdAt: new Date(),
    },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Thêm task mới
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      toast.error("Vui lòng nhập tiêu đề công việc");
      return;
    }

    const newTask = {
      _id: Date.now().toString(),
      title: newTaskTitle.trim(),
      status: "active",
      createdAt: new Date(),
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
    toast.success("Đã thêm công việc mới");
  };

  // Toggle status (active/completed)
  const handleToggleStatus = (id) => {
    setTasks(
      tasks.map((task) =>
        task._id === id
          ? {
              ...task,
              status: task.status === "active" ? "completed" : "active",
            }
          : task
      )
    );
    toast.success("Đã cập nhật trạng thái");
  };

  // Bắt đầu chỉnh sửa
  const handleStartEdit = (task) => {
    setEditingId(task._id);
    setEditingTitle(task.title);
  };

  // Lưu chỉnh sửa
  const handleSaveEdit = (id) => {
    if (!editingTitle.trim()) {
      toast.error("Tiêu đề không được để trống");
      return;
    }

    setTasks(
      tasks.map((task) =>
        task._id === id ? { ...task, title: editingTitle.trim() } : task
      )
    );
    setEditingId(null);
    setEditingTitle("");
    toast.success("Đã cập nhật công việc");
  };

  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  // Xóa task
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task._id !== id));
    toast.success("Đã xóa công việc");
  };

  const activeTasks = tasks.filter((task) => task.status === "active");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  return (
    <div className="min-h-screen relative py-8 px-4">
      {/* Animated Shader Background */}
      <AnimatedShaderBackground />
      
      {/* Content overlay with semi-transparent background for readability */}
      <div className="relative z-10 max-w-2xl mx-auto">
        <Card className="mb-6 bg-[hsl(var(--card))]/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              📝 Todo App
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Form thêm task mới */}
            <div className="flex gap-2 mb-6">
              <Input
                placeholder="Nhập công việc mới..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
                className="flex-1"
              />
              <Button onClick={handleAddTask} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Thống kê */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {activeTasks.length}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Đang làm
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {completedTasks.length}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Hoàn thành
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danh sách tasks đang làm */}
        {activeTasks.length > 0 && (
          <Card className="mb-6 bg-[hsl(var(--card))]/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Công việc đang làm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {activeTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center gap-3 p-3 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
                >
                  <Checkbox
                    checked={false}
                    onChange={() => handleToggleStatus(task._id)}
                  />
                  {editingId === task._id ? (
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSaveEdit(task._id)
                        }
                        className="flex-1"
                        autoFocus
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleSaveEdit(task._id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1">{task.title}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleStartEdit(task)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Danh sách tasks đã hoàn thành */}
        {completedTasks.length > 0 && (
          <Card className="bg-[hsl(var(--card))]/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Đã hoàn thành</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {completedTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center gap-3 p-3 border border-[hsl(var(--border))] rounded-lg opacity-75 hover:opacity-100 transition-opacity"
                >
                  <Checkbox
                    checked={true}
                    onChange={() => handleToggleStatus(task._id)}
                  />
                  {editingId === task._id ? (
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSaveEdit(task._id)
                        }
                        className="flex-1"
                        autoFocus
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleSaveEdit(task._id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 line-through">{task.title}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleStartEdit(task)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Empty state */}
        {tasks.length === 0 && (
          <Card className="bg-[hsl(var(--card))]/95 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <p className="text-[hsl(var(--muted-foreground))]">
                Chưa có công việc nào. Hãy thêm công việc mới!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TodoApp;

