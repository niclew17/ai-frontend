"use client";

import { Poppins } from "next/font/google";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { useTheme } from "next-themes";

const font = Poppins({
  weight: "600",
  subsets: ["latin"],
});

export const Navbar = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary h-16">
      <div className="flex items-center">
        <MobileSidebar />
        <Link
          href="/"
          className="relative w-[80px] md:w-[130px] lg:w-[180px] h-[25px] md:h-[40px] lg:h-[55px] flex items-center"
        >
          <Image
            src={
              theme === "dark"
                ? "/images/rubber-duck-logo-dark.png" // Dark mode image
                : "/images/rubber-duck-logo.png" // Light mode image
            }
            alt="BYU Rubber Duck"
            fill
            className="object-contain"
          />
        </Link>
      </div>
      <div className="flex items-center gap-x-3">
        <Button variant="premium" size="sm">
          Student Console
        </Button>
        <ModeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};
