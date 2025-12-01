import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, Rocket, Star, Clock, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function TutorialPage() {
  const tutorials = [
    {
      id: 1,
      title: "Getting Started with Next.js 16",
      description: "Learn the fundamentals of Next.js and build your first modern web application.",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
      category: "Web Development",
      level: "Beginner",
      duration: "2 hours",
      lessons: 12,
    },
    {
      id: 2,
      title: "Mastering TypeScript",
      description: "Deep dive into TypeScript with advanced patterns and best practices.",
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
      category: "Programming",
      level: "Intermediate",
      duration: "3 hours",
      lessons: 18,
    },
    {
      id: 3,
      title: "React Hooks Complete Guide",
      description: "Master React Hooks from basics to advanced custom hooks.",
      image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800",
      category: "React",
      level: "Intermediate",
      duration: "2.5 hours",
      lessons: 15,
    },
    {
      id: 4,
      title: "Building REST APIs with Node.js",
      description: "Create scalable and secure REST APIs using Node.js and Express.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
      category: "Backend",
      level: "Intermediate",
      duration: "4 hours",
      lessons: 20,
    },
    {
      id: 5,
      title: "Tailwind CSS Mastery",
      description: "Build beautiful, responsive UIs with Tailwind CSS utility classes.",
      image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800",
      category: "CSS",
      level: "Beginner",
      duration: "1.5 hours",
      lessons: 10,
    },
    {
      id: 6,
      title: "Database Design with Prisma",
      description: "Learn modern database design and ORM with Prisma.",
      image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800",
      category: "Database",
      level: "Advanced",
      duration: "3.5 hours",
      lessons: 16,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 mb-4">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm font-medium">Learn & Grow</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Interactive <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">Tutorials</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master modern web development with our comprehensive, hands-on tutorials designed for developers of all levels.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-3">
              <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">50+</div>
            <div className="text-sm text-muted-foreground">Tutorials</div>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/20 mb-3">
              <Rocket className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">100+</div>
            <div className="text-sm text-muted-foreground">Projects</div>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/20 mb-3">
              <Star className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">10K+</div>
            <div className="text-sm text-muted-foreground">Students</div>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20 mb-3">
              <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">95%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </Card>
        </div>

        {/* Tutorials Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">Featured Tutorials</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tutorials.map((tutorial) => (
              <Card
                key={tutorial.id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={tutorial.image}
                    alt={tutorial.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-black/90 text-foreground">
                      {tutorial.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      tutorial.level === "Beginner"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : tutorial.level === "Intermediate"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    }`}>
                      {tutorial.level}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {tutorial.duration}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {tutorial.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {tutorial.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {tutorial.lessons} lessons
                    </span>
                    <Button size="sm" variant="ghost" className="group-hover:bg-purple-100 dark:group-hover:bg-purple-900/20">
                      Start Learning →
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="p-8 md:p-12 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already learning and building amazing projects with our tutorials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/article">
              <Button size="lg" className="gap-2">
                <BookOpen className="h-5 w-5" />
                Browse All Tutorials
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="gap-2">
                Learn More
              </Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
}
