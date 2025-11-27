"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteArticle(articleId: string) {
  try {
    await prisma.article.delete({
      where: {
        id: articleId,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting article:", error);
    return { success: false, error: "Failed to delete article" };
  }
}
