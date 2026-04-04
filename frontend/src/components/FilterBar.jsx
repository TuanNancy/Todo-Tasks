import { Button } from "@/components/ui/button";

const FilterBar = ({ filter, counts, onFilterChange }) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={filter === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("all")}
        className="flex-1"
      >
        Tất cả ({counts.total})
      </Button>
      <Button
        variant={filter === "active" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("active")}
        className="flex-1"
      >
        Đang làm ({counts.active})
      </Button>
      <Button
        variant={filter === "completed" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("completed")}
        className="flex-1"
      >
        Hoàn thành ({counts.completed})
      </Button>
    </div>
  );
};

export default FilterBar;
