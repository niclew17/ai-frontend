import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { src, name, description, instruction, seed, categoryId } = body;

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!src || !name || !description || !instruction || !seed || !categoryId) {
      return new NextResponse("Missing Required Fields", { status: 400 });
    }
    //TODO: Check for subscription

    const bot = await prismadb.bot.create({
      data: {
        categoryId,
        userId: user.id,
        userName: user.firstName,
        src,
        name,
        description,
        instruction,
        seed,
      },
    });

    return NextResponse.json(bot);
  } catch (error) {
    console.log("[BOT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
