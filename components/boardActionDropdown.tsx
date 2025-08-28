
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

export default function DropDown(){
    return <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button ><EllipsisVertical/></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
}