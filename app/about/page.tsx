import { Card } from "@/components/ui/card";
import { Users, Target, Heart, Zap } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            About <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">ByteCode</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Where ideas meet innovation. We're passionate about sharing knowledge and inspiring the next generation of developers.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                At ByteCode, we believe in the power of knowledge sharing. Our mission is to create a platform where developers, designers, and tech enthusiasts can learn, grow, and connect.
              </p>
              <p className="text-muted-foreground">
                We curate high-quality content covering the latest trends in web development, programming, and technology, making complex topics accessible to everyone.
              </p>
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
                alt="Team collaboration"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </Card>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-4">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Community</h3>
              <p className="text-muted-foreground">
                Building a supportive community where everyone can learn and grow together.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/20 mb-4">
                <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Quality</h3>
              <p className="text-muted-foreground">
                Delivering well-researched, accurate, and practical content you can trust.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/20 mb-4">
                <Heart className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Passion</h3>
              <p className="text-muted-foreground">
                Driven by our love for technology and commitment to sharing knowledge.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20 mb-4">
                <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                Staying ahead of the curve with the latest trends and technologies.
              </p>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">1K+</div>
              <div className="text-muted-foreground">Published Articles</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">50+</div>
              <div className="text-muted-foreground">Expert Writers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2">10M+</div>
              <div className="text-muted-foreground">Monthly Readers</div>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Join Our Community</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start your journey with ByteCode today. Explore our articles, connect with fellow developers, and stay updated with the latest in tech.
          </p>
        </div>
      </main>
    </div>
  );
}
