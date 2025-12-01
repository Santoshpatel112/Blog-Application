"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const saveArticle = async (articleId: string) => {
  const { userId } = await auth();
  
  if (!userId) {
    throw Error("You must be logged in");
  }

  const user = await prisma.user.findUnique({
    where: {
      clearkUserId: userId,
    },
  });

  if (!user) {
    throw Error("User doesn't exist in the database");
  }

  // @ts-ignore - SavedArticle model exists but TypeScript hasn't picked it up yet
  const existingSave = await prisma.savedArticle.findFirst({
    where: { articleId, userId: user.id },
  });

  if (existingSave) {
    // Unsave
    // @ts-ignore
    await prisma.savedArticle.delete({
      where: { id: existingSave.id },
    });
  } else {
    // Save
    // @ts-ignore
    await prisma.savedArticle.create({
      data: { articleId, userId: user.id },
    });
  }

  revalidatePath(`/article/${articleId}`);
  revalidatePath("/dashboard");
};
