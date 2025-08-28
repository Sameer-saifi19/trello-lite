import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth()
  if(!session?.user?.email){
    return NextResponse.json("Unauthenticated", {status: 401})
  }

  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Board name is required" },
        { status: 400 }
      );
    }

    const board = await prisma.board.create({
      data: {
        name,
        userId: session.user.id as string,
      },
    });

    return NextResponse.json(board, { status: 201 });
  } catch (error) {
    console.error("Error creating board:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = {
    user:{
      id: "cmes8qsdo0000hzh45kyo9yrl"
    }
  }

  try {
    const result = await prisma.board.findMany({
      where: {
        userId: session.user?.id,
      },
      include: {
        tasks: true
      },
      orderBy:{
        createdAt: "asc"      
      }
    });

    if (result.length === 0) {
      return NextResponse.json("No boards here");
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error while getting Posts", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

