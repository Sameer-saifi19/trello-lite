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
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";

type Card = {
  id: string;
  name: string;
  createdAt: Date;
};

export default function BoardCard() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:3000/api/board`);
        console.log(res);
        if (!res) throw new Error("Failed to fetch data");
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


  return (
    <>
      <div className="flex flex-wrap gap-4">
        {cards.map((card) => (
          <Card key={card.id} className="w-72">
            <CardHeader>
              <CardTitle>{card.name}</CardTitle>
              <CardAction> 
                
                

                 </CardAction>
            </CardHeader>
            <CardContent>
              <CardItems />
            </CardContent>
            <CardFooter >
                <Button className="w-full">Add a card</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
