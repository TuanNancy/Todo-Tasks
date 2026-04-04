import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, LogOut, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AnimatedShaderBackground from "@/components/ui/animated-shader-background";
import TaskForm from "@/components/TaskForm";
import FilterBar from "@/components/FilterBar";
import TaskItem from "@/components/TaskItem";
import Pagination from "@/components/Pagination";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskCounts,
} from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const ITEMS_PER_PAGE = 5;

const TodoApp = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [counts, setCounts] = useState({ total: 0, active: 0, completed: 0 });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllTasks(currentPage, ITEMS_PER_PAGE, filter);
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (error) {
      toast.error(error.message || "Không thể tải danh sách công việc");
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filter]);

  const fetchCounts = useCallback(async () => {
    try {
      const data = await getTaskCounts();
      setCounts(data);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchCounts();
  }, [fetchTasks, fetchCounts]);

  const handleAddTask = async (title) => {
    try {
      setActionLoading(true);
      await createTask(title);
      toast.success("Đã thêm công việc mới");
      fetchTasks();
      fetchCounts();
    } catch (error) {
      toast.error(error.message || "Không thể thêm công việc");
      console.error("Error creating task:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;

    const newStatus = task.status === "active" ? "completed" : "active";
    const updateData = {
      status: newStatus,
      completedAt: newStatus === "completed" ? new Date() : null,
    };

    const optimisticTask = {
      ...task,
      status: newStatus,
      completedAt: updateData.completedAt,
    };
    setTasks(tasks.map((t) => (t._id === id ? optimisticTask : t)));

    try {
      await updateTask(id, updateData);
      toast.success("Đã cập nhật trạng thái");
      fetchCounts();
    } catch (error) {
      setTasks(tasks.map((t) => (t._id === id ? task : t)));
      toast.error(error.message || "Không thể cập nhật trạng thái");
      console.error("Error updating task status:", error);
    }
  };

  const handleStartEdit = (task) => {
    setEditingId(task._id);
    setEditingTitle(task.title);
  };

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

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      toast.success("Đã xóa công việc");
      fetchTasks();
      fetchCounts();
    } catch (error) {
      toast.error(error.message || "Không thể xóa công việc");
      console.error("Error deleting task:", error);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
      <AnimatedShaderBackground />

      <div className="relative z-10 max-w-2xl mx-auto">
        <Card className="mb-6 bg-[hsl(var(--card))]/95 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-bold text-center flex-1">
                📝 Todo App
              </CardTitle>
              {user && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm text-[hsl(var(--muted-foreground))]">
                    <User className="h-4 w-4" />
                    <span>{user.username}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    title="Đăng xuất"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <TaskForm onAddTask={handleAddTask} loading={actionLoading} />

            <div className="grid grid-cols-2 gap-4 mt-6 mb-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {counts.active}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Đang làm
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {counts.completed}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Hoàn thành
                </div>
              </div>
            </div>

            <FilterBar
              filter={filter}
              counts={counts}
              onFilterChange={handleFilterChange}
            />
          </CardContent>
        </Card>

        {tasks.length > 0 && (
          <Card className="mb-6 bg-[hsl(var(--card))]/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">
                {filter === "all" && "Tất cả công việc"}
                {filter === "active" && "Công việc đang làm"}
                {filter === "completed" && "Công việc đã hoàn thành"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  editingId={editingId}
                  editingTitle={editingTitle}
                  onToggle={handleToggleStatus}
                  onStartEdit={handleStartEdit}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                  onDelete={handleDeleteTask}
                  onEditTitleChange={setEditingTitle}
                />
              ))}
            </CardContent>
          </Card>
        )}

        {pagination.totalPages > 1 && (
          <Card className="bg-[hsl(var(--card))]/95 backdrop-blur-sm">
            <CardContent className="py-4">
              <Pagination
                currentPage={pagination.currentPage || currentPage}
                totalPages={pagination.totalPages || 1}
                totalTasks={pagination.totalTasks || 0}
                onPageChange={handlePageChange}
              />
            </CardContent>
          </Card>
        )}

        {tasks.length === 0 && (
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
