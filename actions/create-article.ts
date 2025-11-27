"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const createArticlesSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  category: z.string().min(3, "Category must be at least 3 characters").max(50),
  content: z.string().min(10, "Content must be at least 10 characters"),
  featuredImage: z.string().min(1, "Featured image is required"),
});

type createArticleFormstate = {
  errors: {
    title?: string[];
    category?: string[];
    featuredImage?: string[];
    content?: string[];
    formErrors?: string[];
  };
};

export const createArticles = async (
  prev: createArticleFormstate,
  formData: FormData
): Promise<createArticleFormstate> => {
  // Validate
  const result = createArticlesSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    content: formData.get("content"),
    featuredImage: formData.get("featuredImage"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    // For now, use the first user from the database as the author
    const firstUser = await prisma.user.findFirst();

    if (!firstUser) {
      return {
        errors: {
          formErrors: ["No user found. Please create a user first."],
        },
      };
    }

    await prisma.article.create({
      data: {
        title: result.data.title,
        category: result.data.category,
        content: result.data.content,
        featuredImage: result.data.featuredImage,
        authorId: firstUser.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error creating article:", error);
    return {
      errors: {
        formErrors: ["Failed to create article. Please try again."],
      },
    };
  }

  redirect("/dashboard");
};
