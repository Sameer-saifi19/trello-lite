import { AddCardDialog } from "@/components/addCardDialog";
import BoardCard from "@/components/boardCard";
import { Dialog } from "@/components/ui/dialog";

export default function Dashboard(){
    return <>
        <BoardCard/>
        <div className="w-72">

        <AddCardDialog/>
        </div>
    </>
}