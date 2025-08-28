"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import CardItems from "./cardItems";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AddTaskDialog } from "./addTaskDialog";

type CardType = {
  id: string;
  name: string;
  createdAt: Date;
  tasks: TaskType[]
};

type TaskType = {
  id: string,
  title: string,
  description?: string,
  createdAt: Date
}

export default function BoardCard() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [newName, setNewName] = useState("");

  
  useEffect(() => {
     async function fetchData() {
      try {
        const res = await fetch(`/api/board`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const json = await res.json();
        setCards(json);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  interface DeleteCardProps {
    boardId: string;
  }

  async function handleDelete({ boardId }: DeleteCardProps) {
    try {
      const res = await fetch(`/api/board/${boardId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Something went wrong");
      window.location.reload();
    } catch (error) {
      console.error("Error while deleting ", error);
      alert("Error");
    }
  }

  function handleEdit(card: CardType) {
    setEditingCard(card);
    setNewName(card.name);
    setEditOpen(true);
  }

  async function submitEdit() {
    if (!editingCard) return;

    try {
      const res = await fetch(`/api/board/${editingCard.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });

      if (!res.ok) throw new Error("Failed to update");

      setEditOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating board");
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-4">
        {cards.map((card) => (
          <Card key={card.id} className="w-72">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>{card.name}</CardTitle>
              <CardAction>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(card)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => handleDelete({ boardId: card.id })}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardAction>
            </CardHeader>
            <CardContent>
              <CardItems tasks={card.tasks} />
            </CardContent>
            <CardFooter>
              <AddTaskDialog id={card.id}/> 
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
            <DialogDescription>
              Update the name of your board below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={submitEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
