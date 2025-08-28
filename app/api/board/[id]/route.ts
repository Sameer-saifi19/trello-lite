import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/board/[id]
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json("Unauthenticated", { status: 401 });
    }

    const boardId = params.id;

    if (!boardId) {
      return NextResponse.json({ error: "Board id required" }, { status: 400 });
    }

    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
      },
    });

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    // Make sure board belongs to current user
    if (board.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(board, { status: 200 });
  } catch (err) {
    console.error("Error fetching board:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json("Unauthenticated", { status: 401 });
    }

    const boardId = params.id;

    if (!boardId) {
      return NextResponse.json({ error: "Board id required" }, { status: 400 });
    }

    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Board name is required" },
        { status: 400 }
      );
    }

    const existingBoard = await prisma.board.findFirst({
      where: { id: boardId },
    });

    if (!existingBoard) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    // Ensure the board belongs to the current user
    if (existingBoard.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: { name },
    });

    return NextResponse.json(updatedBoard, { status: 200 });
  } catch (err) {
    console.error("Error updating board:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json("Unauthenticated", { status: 401 });
    }
    const boardId = params.id;

    if (!boardId) {
      return NextResponse.json({ error: "Board id required" }, { status: 400 });
    }

    const board = await prisma.board.findFirst({
      where: { id: boardId },
    });

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    // Ensure the board belongs to the current user
    if (board.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.board.delete({
      where: { id: boardId },
    });

    return NextResponse.json(
      { message: "Board deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting board:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
