import { Button } from "./ui/button";

export default function CardItems() {
  return (
    <>
      <div>
        <ol>
          <li className="bg-zinc-500 p-1 rounded-md pl-4 text-white tracking-wide text-md flex justify-between items-center mb-2">
            <span>Task 1</span>
            <Button variant="ghost">
              
            </Button>
          </li>
        </ol>
      </div>
    </>
  );
}
