"use client";

import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TaskType = {
  id: string;
  title: string;
  description?: string | null;
};

export default function CardItems({
  tasks,
  boardId,
}: {
  tasks: TaskType[];
  boardId: string;
}) {
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Delete task
  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Something went wrong");
      window.location.reload();
    } catch (error) {
      console.error("Error while deleting ", error);
      alert("Error");
    }
  }

  // 🔹 Open dialog for editing
  function handleEdit(task: TaskType): void {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
    setOpen(true);
  }

  // 🔹 Open dialog for creating
  function handleAdd(): void {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setOpen(true);
  }

  // 🔹 Create or update task
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingTask) {
        // update
        const res = await fetch(`/api/tasks/${editingTask.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
        });
        if (!res.ok) throw new Error("Failed to update task");
      } else {
        // create
        const res = await fetch(`/api/board/${boardId}/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
        });
        if (!res.ok) throw new Error("Failed to create task");
      }

      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error while saving task", error);
      alert("Error saving task");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Task List */}
      <div>
        <ol>
          {tasks.map((task) => (
            <li
              key={task.id}
              className="bg-zinc-500 p-1 rounded-md pl-4 text-white tracking-wide text-md flex justify-between items-center mb-2"
            >
              <span>{task.title}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <EllipsisVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(task)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}
        </ol>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingTask ? "Edit Task" : "Create Task"}
              </DialogTitle>
              <DialogDescription>
                {editingTask
                  ? "Update your task details."
                  : "Add a new task to this board."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  placeholder="Task title"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  placeholder="Optional description"
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading
                  ? editingTask
                    ? "Updating..."
                    : "Creating..."
                  : "Save Task"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
