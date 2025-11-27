"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type FormState = {
  errors: {
    title?: string;
    category?: string;
    featuredImage?: string;
    content?: string[];
    formErrors?: string;
  };
};

export async function createArticles(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const content = formData.get("content") as string;
  const featuredImage = formData.get("featuredImage") as string;

  const errors: FormState["errors"] = {};

  // Validation
  if (!title || title.trim().length === 0) {
    errors.title = "Title is required";
  }

  if (!category || category.trim().length === 0) {
    errors.category = "Category is required";
  }

  if (!content || content.trim().length === 0) {
    errors.content = ["Content is required"];
  }

  if (!featuredImage || featuredImage.trim().length === 0) {
    errors.featuredImage = "Featured image is required";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    // For now, use the first user from the database as the author
    const firstUser = await prisma.user.findFirst();

    if (!firstUser) {
      return {
        errors: {
          formErrors: "No user found. Please create a user first.",
        },
      };
    }

    await prisma.article.create({
      data: {
        title,
        category,
        content,
        featuredImage,
        authorId: firstUser.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/articles");

    return { errors: {} };
  } catch (error) {
    console.error("Error creating article:", error);
    return {
      errors: {
        formErrors: "Failed to create article. Please try again.",
      },
    };
  }
}
