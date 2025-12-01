import { AllArticlesPage } from "@/components/articles/all-article-page";
import ArticleSearchInput from "@/components/articles/article-search-input";
import { Button } from "@/components/ui/button";
import React, { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchArticleByQuery } from "@/lib/query/fetch-articles";
import Link from "next/link";
import { Home, Filter } from "lucide-react";

type SearchPageProps = {
  searchParams: Promise<{ search?: string; page?: string; category?: string }>;
};

const ITEMS_PER_PAGE = 6;

const page = async ({ searchParams }: SearchPageProps) => {
  const params = await searchParams;
  const searchText = params.search || "";
  const currentPage = Number(params.page) || 1;
  const category = params.category || "";
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const take = ITEMS_PER_PAGE;

  const { articles, total } = await fetchArticleByQuery(
    searchText,
    skip,
    take,
    category
  );
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const categories = ["All", "Technology", "Programming", "Web Development"];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header with Home Button */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-12 space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            All <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">Articles</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of articles on web development, programming, and technology
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <Suspense>
              <ArticleSearchInput />
            </Suspense>
          </div>

          {/* Category Filter */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/article?category=${cat === "All" ? "" : cat.toLowerCase()}&search=${searchText}`}
              >
                <Button
                  variant={
                    (cat === "All" && !category) ||
                    category === cat.toLowerCase()
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  className="rounded-full"
                >
                  {cat}
                </Button>
              </Link>
            ))}
          </div>

          {/* Results Count */}
          {searchText && (
            <p className="text-sm text-muted-foreground">
              Found {total} {total === 1 ? "article" : "articles"} for "{searchText}"
            </p>
          )}
        </div>

        {/* Articles Grid */}
        <Suspense fallback={<AllArticlesPageSkeleton />}>
          <AllArticlesPage articles={articles} />
        </Suspense>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {/* Prev Button */}
            <Link
              href={`?search=${searchText}&category=${category}&page=${currentPage - 1}`}
            >
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                className="gap-2"
              >
                ← Previous
              </Button>
            </Link>

            {/* Page Numbers */}
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
              const pageNum = currentPage <= 3 
                ? index + 1 
                : currentPage + index - 2;
              
              if (pageNum > totalPages) return null;
              
              return (
                <Link
                  key={pageNum}
                  href={`?search=${searchText}&category=${category}&page=${pageNum}`}
                >
                  <Button
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                  >
                    {pageNum}
                  </Button>
                </Link>
              );
            })}

            {/* Next Button */}
            <Link
              href={`?search=${searchText}&category=${category}&page=${currentPage + 1}`}
            >
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                className="gap-2"
              >
                Next →
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default page;

export function AllArticlesPageSkeleton() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={index}
          className="group relative overflow-hidden transition-all"
        >
          <div className="p-6">
            <Skeleton className="mb-4 h-48 w-full rounded-xl" />
            <Skeleton className="h-6 w-3/4 rounded-lg mb-2" />
            <Skeleton className="h-4 w-1/2 rounded-lg mb-6" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-20 rounded-lg" />
              </div>
              <Skeleton className="h-4 w-24 rounded-lg" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
