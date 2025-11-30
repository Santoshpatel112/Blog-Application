"use server";

import { prisma } from "@/lib/prisma";

export async function fetchArticleByQuery(
  searchText: string,
  skip: number,
  take: number
) {
  try {
    const where = searchText
      ? {
          OR: [
            { title: { contains: searchText, mode: "insensitive" as const } },
            { category: { contains: searchText, mode: "insensitive" as const } },
            { content: { contains: searchText, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take,
        orderBy: {
          createAt: "desc",
        },
        include: {
          author: {
            select: {
              name: true,
              email: true,
              imageURL: true,
            },
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    return { articles, total };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return { articles: [], total: 0 };
  }
}
