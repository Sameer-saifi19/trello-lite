import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = {
    user: {
      id: "cmes8qsdo0000hzh45kyo9yrl",
    },
  };

  try {
    const board = await prisma.board.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!board) {
      return NextResponse.json("Cannot find board", { status: 404 });
    }

    await prisma.task.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(
      { message: "task deleted successully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = {
    user: { id: "cmes8qsdo0000hzh45kyo9yrl" },
  };

  try {
    const { title, description } = await req.json();

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Task title is required" },
        { status: 400 }
      );
    }

    // Find the task
    const existingTask = await prisma.task.findUnique({
      where: { id: params.id },
      include: { board: true },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Check if the user owns the board that contains the task
    if (existingTask.board.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id: params.id },
      data: { title, description },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error updating task", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
