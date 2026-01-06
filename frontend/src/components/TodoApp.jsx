import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Loader2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedShaderBackground from "@/components/ui/animated-shader-background";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/services/api";

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Format options
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  if (diffDays === 0) {
    // Hôm nay
    return `Hôm nay, ${date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else if (diffDays === 1) {
    // Hôm qua
    return `Hôm qua, ${date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else if (diffDays < 7) {
    // Trong tuần này
    return `${diffDays} ngày trước`;
  } else {
    // Lâu hơn
    return date.toLocaleDateString("vi-VN", options);
  }
};

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'active', 'completed'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Load tasks khi component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getAllTasks();
      setTasks(data);
    } catch (error) {
      toast.error(error.message || "Không thể tải danh sách công việc");
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Thêm task mới
  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      toast.error("Vui lòng nhập tiêu đề công việc");
      return;
    }

    try {
      const newTask = await createTask(newTaskTitle.trim());
      setTasks([newTask, ...tasks]);
      setNewTaskTitle("");
      toast.success("Đã thêm công việc mới");
    } catch (error) {
      toast.error(error.message || "Không thể thêm công việc");
      console.error("Error creating task:", error);
    }
  };

  // Toggle status (active/completed)
  const handleToggleStatus = async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;

    const newStatus = task.status === "active" ? "completed" : "active";
    const updateData = {
      status: newStatus,
      completedAt: newStatus === "completed" ? new Date() : null,
    };

    // Optimistic update - cập nhật UI ngay lập tức
    const optimisticTask = {
      ...task,
      status: newStatus,
      completedAt: updateData.completedAt,
    };
    setTasks(tasks.map((t) => (t._id === id ? optimisticTask : t)));

    try {
      const updatedTask = await updateTask(id, updateData);
      // Cập nhật lại với data từ server để đảm bảo sync
      setTasks(tasks.map((t) => (t._id === id ? updatedTask : t)));
      toast.success("Đã cập nhật trạng thái");
    } catch (error) {
      // Rollback nếu có lỗi
      setTasks(tasks.map((t) => (t._id === id ? task : t)));
      toast.error(error.message || "Không thể cập nhật trạng thái");
      console.error("Error updating task status:", error);
    }
  };

  // Bắt đầu chỉnh sửa
  const handleStartEdit = (task) => {
    setEditingId(task._id);
    setEditingTitle(task.title);
  };

  // Lưu chỉnh sửa
  const handleSaveEdit = async (id) => {
    if (!editingTitle.trim()) {
      toast.error("Tiêu đề không được để trống");
      return;
    }

    try {
      const updatedTask = await updateTask(id, { title: editingTitle.trim() });
      setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
      setEditingId(null);
      setEditingTitle("");
      toast.success("Đã cập nhật công việc");
    } catch (error) {
      toast.error(error.message || "Không thể cập nhật công việc");
      console.error("Error updating task:", error);
    }
  };

  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  // Xóa task
  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task._id !== id));
      toast.success("Đã xóa công việc");
      // Reset về trang 1 nếu trang hiện tại không còn items
      const filtered = getFilteredTasks();
      const maxPage = Math.ceil(filtered.length / itemsPerPage);
      if (currentPage > maxPage && maxPage > 0) {
        setCurrentPage(maxPage);
      }
    } catch (error) {
      toast.error(error.message || "Không thể xóa công việc");
      console.error("Error deleting task:", error);
    }
  };

  // Filter tasks
  const getFilteredTasks = () => {
    switch (filter) {
      case "active":
        return tasks.filter((task) => task.status === "active");
      case "completed":
        return tasks.filter((task) => task.status === "completed");
      default:
        return tasks;
    }
  };

  // Pagination
  const filteredTasks = getFilteredTasks();
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  // Reset page khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const activeTasks = tasks.filter((task) => task.status === "active");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  if (loading) {
    return (
      <div className="min-h-screen relative py-8 px-4 flex items-center justify-center">
        <AnimatedShaderBackground />
        <div className="relative z-10">
          <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--primary))]" />
        </div>
      </div>
    );
  }

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

            {/* Filter Buttons */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className="flex-1"
              >
                Tất cả ({tasks.length})
              </Button>
              <Button
                variant={filter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("active")}
                className="flex-1"
              >
                Đang làm ({activeTasks.length})
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("completed")}
                className="flex-1"
              >
                Hoàn thành ({completedTasks.length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danh sách tasks */}
        {paginatedTasks.length > 0 && (
          <Card className="mb-6 bg-[hsl(var(--card))]/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">
                {filter === "all" && "Tất cả công việc"}
                {filter === "active" && "Công việc đang làm"}
                {filter === "completed" && "Công việc đã hoàn thành"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {paginatedTasks.map((task) => (
                <div
                  key={task._id}
                  className={`flex items-center gap-3 p-3 border border-[hsl(var(--border))] rounded-lg transition-all ${
                    task.status === "completed"
                      ? "opacity-75 hover:opacity-100"
                      : "hover:bg-[hsl(var(--accent))]"
                  }`}
                >
                  {/* Button đánh dấu hoàn thành */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleToggleStatus(task._id)}
                    className={`${
                      task.status === "completed"
                        ? "text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                        : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                    }`}
                  >
                    {task.status === "completed" ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </Button>
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
                      <div className="flex-1 flex flex-col gap-1">
                        <span
                          className={`${
                            task.status === "completed" ? "line-through" : ""
                          } ${
                            task.status === "completed"
                              ? "text-[hsl(var(--muted-foreground))]"
                              : ""
                          }`}
                        >
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Tạo: {formatDate(task.createdAt)}</span>
                          </div>
                          {task.completedAt && (
                            <>
                              <span>•</span>
                              <span>{formatDate(task.completedAt)}</span>
                            </>
                          )}
                        </div>
                      </div>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <Card className="bg-[hsl(var(--card))]/95 backdrop-blur-sm">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-[hsl(var(--muted-foreground))]">
                  Trang {currentPage} / {totalPages} ({filteredTasks.length}{" "}
                  công việc)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="min-w-[40px]"
                      >
                        {page}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty state */}
        {filteredTasks.length === 0 && (
          <Card className="bg-[hsl(var(--card))]/95 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <p className="text-[hsl(var(--muted-foreground))]">
                {filter === "all" &&
                  "Chưa có công việc nào. Hãy thêm công việc mới!"}
                {filter === "active" && "Chưa có công việc đang làm nào."}
                {filter === "completed" &&
                  "Chưa có công việc đã hoàn thành nào."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TodoApp;
