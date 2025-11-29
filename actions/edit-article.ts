"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const editArticlesSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  category: z.string().min(3, "Category must be at least 3 characters").max(50),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

type editArticleFormstate = {
  errors: {
    title?: string[];
    category?: string[];
    featuredImage?: string[];
    content?: string[];
    formErrors?: string[];
  };
};

export const editArticle = async (
  articleId: string,
  prev: editArticleFormstate,
  formData: FormData
): Promise<editArticleFormstate> => {
  // Validate text fields
  const result = editArticlesSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    content: formData.get("content"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  let imageURL: string | undefined;

  // Handle image upload if new image provided
  const imageFile = formData.get("featuredImage") as File | null;
  if (imageFile && imageFile.size > 0) {
    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse: UploadApiResponse | undefined = await new Promise(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto", folder: "blog-articles" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          uploadStream.end(buffer);
        }
      );

      if (uploadResponse?.secure_url) {
        imageURL = uploadResponse.secure_url;
      }
    } catch (error) {
      console.error("Image upload error:", error);
      return {
        errors: {
          featuredImage: ["Failed to upload image. Please try again"],
        },
      };
    }
  }

  // Update article in database
  try {
    const updateData: any = {
      title: result.data.title,
      category: result.data.category,
      content: result.data.content,
    };

    if (imageURL) {
      updateData.featuredImage = imageURL;
    }

    await prisma.article.update({
      where: { id: articleId },
      data: updateData,
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/article/${articleId}/edit`);
  } catch (error) {
    console.error("Error updating article:", error);
    return {
      errors: {
        formErrors: ["Failed to update article. Please try again."],
      },
    };
  }

  redirect("/dashboard");
};
