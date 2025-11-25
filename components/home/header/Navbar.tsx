import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SearchInput from "./search-input";
import ToggleMode from "./toggel-mode";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm dark:bg-black/90 border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold flex items-center"
            >
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
              href={"/articles"}
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
            <div className="hidden md:flex items-center gap-2">
              <Button>Login</Button>
              <Button>Sign-Up</Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
