"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteArticle(articleId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "You must be logged in to delete articles" };
    }

    // Get the current user
    const currentUser = await prisma.user.findUnique({
      where: {
        clearkUserId: userId,
      },
    });

    if (!currentUser) {
      return { success: false, error: "User not found" };
    }

    // Get article to check ownership and extract image URL
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { 
        featuredImage: true,
        authorId: true,
      },
    });

    if (!article) {
      return { success: false, error: "Article not found" };
    }

    // Check if the user is the author of the article
    if (article.authorId !== currentUser.id) {
      return { success: false, error: "You are not authorized to delete this article" };
    }

    // Delete article and related data (comments, likes will be deleted due to cascade)
    await prisma.article.delete({
      where: { id: articleId },
    });

    // Delete image from Cloudinary if it exists
    if (article.featuredImage && article.featuredImage.includes("cloudinary")) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = article.featuredImage.split("/");
        const filename = urlParts[urlParts.length - 1];
        const publicId = `blog-articles/${filename.split(".")[0]}`;
        
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
        // Continue even if image deletion fails
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/");

    return { success: true, message: "Article deleted successfully" };
  } catch (error) {
    console.error("Error deleting article:", error);
    return { success: false, error: "Failed to delete article" };
  }
}
