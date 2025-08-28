import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = {
    user: { id: "cmes8qsdo0000hzh45kyo9yrl" },
  };

  try {
    const body = await req.json();
    const { title, description } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Task title is required" },
        { status: 400 }
      );
    }

    // ✅ find the board using the id from URL
    const board = await prisma.board.findUnique({
      where: { id: params.id },
    });

    if (!board) {
      return NextResponse.json(
        { error: "Board not found" },
        { status: 404 }
      );
    }

    // ✅ check ownership
    if (board.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // ✅ create task inside this board
    const task = await prisma.task.create({
      data: {
        title,
        description,
        boardId: board.id,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
