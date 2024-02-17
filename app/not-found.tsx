"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="max-w-7xl flex justify-center items-center h-screen">
      <div className="grid grid-cols-1 gap-4">
        <h1 className="text-6xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
          404 Page Not Found...
        </h1>
        <p>
          Looks like you tried to navigate to a page that doesn&apos;t exist.
        </p>
        <Button className="w-max">
          <Link href={"/"}>Back to the home page</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
