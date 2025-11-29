"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteArticle(articleId: string) {
  try {
    // Get article to extract image URL
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { featuredImage: true },
    });

    if (!article) {
      return { success: false, error: "Article not found" };
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
