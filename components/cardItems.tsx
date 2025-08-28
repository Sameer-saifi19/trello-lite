import { EllipsisVertical } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

type TaskType = {
  id: string;
  title: string;
  description?: string | null;
};

export default function CardItems({ tasks }: { tasks: TaskType[] }) {

  async function handleEdit() {
    
  }

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
  
  return (
    <>
      <div>
        <ol>
          {tasks.map((task) => (
            <li key={task.id} className="bg-zinc-500 p-1 rounded-md pl-4 text-white tracking-wide text-md flex justify-between items-center mb-2">
              <span>{task.title}</span>
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit()}>
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
    </>
  );
}
