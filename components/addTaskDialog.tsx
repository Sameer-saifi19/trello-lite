"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type TaskType = {
  id: string;
  title: string;
  description?: string | null;
};

export function AddTaskDialog({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);

  async function createTask(e: React.FormEvent) {
    
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/board/${id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) throw new Error("Failed to create task");

      const data = await res.json();
      console.log("Task created:", data);

      setTitle("");
      setDescription("");
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Error creating task");
    } finally {
      setLoading(false);
    }
  }

  async function submitEdit() {
    if (!editingTask) return;

    try {
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) throw new Error("Failed to update task");

      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error while updating task", error);
      alert("Error updating task");
    }
  }

  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Add Task</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={createTask}>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>
              Add a new task to this board.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="pt-4">Title</Label>
              <Input
                id="title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                placeholder="Task title"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="pt-4">Description</Label>
              <Input
                id="description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                placeholder="Optional description"
              />
            </div>
          </div>

          <DialogFooter className="pt-8">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button disabled={loading} onClick={submitEdit}>
              {loading ? "Creating..." : "Save Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
