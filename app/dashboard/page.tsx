'use client'

import { AddCardDialog } from "@/components/addCardDialog";
import BoardCard from "@/components/boardCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  return (
    <>
      <BoardCard />
      <div className="w-72">
        <AddCardDialog />
      </div>
    </>
  );
}
