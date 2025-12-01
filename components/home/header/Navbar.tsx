'use client'
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchInput from "./search-input";
import ToggleMode from "./toggel-mode";
import { Menu, X, Search } from "lucide-react";
import { SignedIn } from "@clerk/nextjs";
import { SignedOut, SignUpButton ,SignInButton ,UserButton} from "@clerk/clerk-react";
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] =useState(false);
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm dark:bg-black/90 border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold flex items-center">
              <span className="font-bold text-2xl flex items-center gap-1">
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 bg-clip-text text-transparent">
                  Byte
                </span>
                <span className="text-foreground">Code</span>
              </span>
            </Link>
          </div>
          {/* DeskTop menu */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href={"/article"}
              className="text-sm font-medium hover:text-primary/80 transition "
            >
              Articles
            </Link>
            <Link
              href={"/tutorial"}
              className="text-sm font-medium hover:text-primary/80 transition "
            >
              Tutorial
            </Link>
            <Link
              href={"/about"}
              className="text-sm font-medium hover:text-primary/80 transition "
            >
              About
            </Link>
            <Link href={"/dashboard"}>DashBoard</Link>
          </div>
          {/* Right Section */}
          <div className="flex items-center gap-4">
            <SearchInput />
            <ToggleMode />
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <div className="hidden md:flex items-center gap-2">
                <SignInButton>
                  <Button variant={'outline'}>Sign-In</Button>
                </SignInButton>
                <SignUpButton>
                  <Button>Sign-Up</Button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      {/* Mobile Menu */}
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden py-4 space-y-4 border-t">
          {/* Search Bar (Mobile) */}
          <div className="px-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search articles..."
                className="pl-10 w-full focus-visible:ring-1"
              />
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <div className="space-y-2 px-4">
            <Link
              href="/article"
              className="block px-3 py-2 text-base font-medium text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Articles
            </Link>
            <Link
              href="/tutorials"
              className="block px-3 py-2 text-base font-medium text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tutorials
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-base font-medium text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/dashboard"
              className="block px-3 py-2 text-base font-medium text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          </div>

          {/* Mobile Auth Buttons */}
          <div className="px-4 flex flex-col gap-2">
            <Button variant="outline" className="w-full">
              Login
            </Button>
            <Button className="w-full">Sign up</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
