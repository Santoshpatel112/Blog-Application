import React from "react";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Bookmark } from "lucide-react";

const SavedArticlesPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // Get the current user from database, or create if doesn't exist
  let dbUser = await prisma.user.findUnique({
    where: {
      clearkUserId: userId,
    },
  });

  // If user doesn't exist in database, create them
  if (!dbUser) {
    const clerkUser = await currentUser();

    if (clerkUser) {
      dbUser = await prisma.user.create({
        data: {
          clearkUserId: userId,
          name:
            `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
            "User",
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          imageURL: clerkUser.imageUrl || "",
        },
      });
    } else {
      redirect("/");
    }
  }

  // Fetch saved articles
  // @ts-ignore - SavedArticle model exists but TypeScript hasn't picked it up yet
  const savedArticles = await prisma.savedArticle.findMany({
    where: {
      userId: dbUser.id,
    },
    include: {
      article: {
        include: {
          author: {
            select: {
              name: true,
              email: true,
              imageURL: true,
            },
          },
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Bookmark className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Saved Articles</h1>
        </div>
        <p className="text-muted-foreground">
          Articles you've saved for later reading
        </p>
      </div>

      {savedArticles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No saved articles yet</h3>
            <p className="text-muted-foreground">
              Start saving articles to read them later
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedArticles.map(({ article }: any) => (
            <Link key={article.id} href={`/article/${article.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                <div className="relative h-48 w-full">
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2 text-lg">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(article.createAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{article.likes.length} likes</span>
                      <span>{article.comments.length} comments</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
};

export default SavedArticlesPage;
