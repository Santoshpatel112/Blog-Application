import React from "react";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  FileText,
  Calendar,
  Users,
} from "lucide-react";

const AnalyticsPage = async () => {
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

  // Fetch analytics data
  const articles = await prisma.article.count({
    where: { authorId: dbUser.id },
  });

  const totalLikes = await prisma.like.count({
    where: {
      article: {
        authorId: dbUser.id,
      },
    },
  });

  const totalComments = await prisma.comment.count({
    where: {
      article: {
        authorId: dbUser.id,
      },
    },
  });

  // @ts-ignore - SavedArticle model exists but TypeScript hasn't picked it up yet
  const savedCount = await prisma.savedArticle.count({
    where: {
      article: {
        authorId: dbUser.id,
      },
    },
  });

  const articlesWithStats = await prisma.article.findMany({
    where: { authorId: dbUser.id },
    include: {
      likes: true,
      comments: true,
    },
    orderBy: {
      createAt: "desc",
    },
    take: 10,
  });

  // Get saved counts for each article
  // @ts-ignore - SavedArticle model exists but TypeScript hasn't picked it up yet
  const savedCounts = await Promise.all(
    articlesWithStats.map(async (article) => ({
      articleId: article.id,
      // @ts-ignore
      count: await prisma.savedArticle.count({
        where: { articleId: article.id },
      }),
    }))
  );

  // Calculate engagement metrics
  const avgLikesPerArticle = articles > 0 ? (totalLikes / articles).toFixed(1) : 0;
  const avgCommentsPerArticle = articles > 0 ? (totalComments / articles).toFixed(1) : 0;
  const totalEngagement = totalLikes + totalComments + savedCount;

  // Find most popular article
  let mostPopularArticle = null;
  let mostPopularSavedCount = 0;
  
  if (articlesWithStats.length > 0) {
    let maxEngagement = 0;
    for (let i = 0; i < articlesWithStats.length; i++) {
      const article = articlesWithStats[i];
      const savedCount = savedCounts[i].count;
      const engagement = article.likes.length + article.comments.length + savedCount;
      
      if (engagement > maxEngagement) {
        maxEngagement = engagement;
        mostPopularArticle = article;
        mostPopularSavedCount = savedCount;
      }
    }
  }

  // Category breakdown
  const categoryStats = articlesWithStats.reduce<Record<string, number>>((acc, article) => {
    acc[article.category] = (acc[article.category] || 0) + 1;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5);

  // Recent activity (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentArticles = await prisma.article.count({
    where: {
      authorId: dbUser.id,
      createAt: {
        gte: thirtyDaysAgo,
      },
    },
  });

  return (
    <main className="flex-1 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        </div>
        <p className="text-muted-foreground">
          Track your content performance and engagement
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {recentArticles} published this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLikes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {avgLikesPerArticle} avg per article
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {avgCommentsPerArticle} avg per article
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEngagement}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Likes + Comments + Saves
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Most Popular Article */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Most Popular Article
            </CardTitle>
            <CardDescription>Your top performing content</CardDescription>
          </CardHeader>
          <CardContent>
            {mostPopularArticle ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {mostPopularArticle.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {mostPopularArticle.category}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {mostPopularArticle.likes.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {mostPopularArticle.comments.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Comments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {mostPopularSavedCount}
                    </div>
                    <div className="text-xs text-muted-foreground">Saves</div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No articles yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Top Categories
            </CardTitle>
            <CardDescription>Your most used categories</CardDescription>
          </CardHeader>
          <CardContent>
            {topCategories.length > 0 ? (
              <div className="space-y-4">
                {topCategories.map(([category, count]) => {
                  const articleCount = count as number;
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="font-medium">{category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground">
                          {articleCount} {articleCount === 1 ? "article" : "articles"}
                        </div>
                        <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${(articleCount / articles) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No categories yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Articles Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Recent Articles Performance
          </CardTitle>
          <CardDescription>Last 10 published articles</CardDescription>
        </CardHeader>
        <CardContent>
          {articlesWithStats.length > 0 ? (
            <div className="space-y-4">
              {articlesWithStats.map((article, index) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{article.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(article.createAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 ml-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span>{article.likes.length}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <span>{article.comments.length}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{savedCounts[index].count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No articles published yet
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default AnalyticsPage;
