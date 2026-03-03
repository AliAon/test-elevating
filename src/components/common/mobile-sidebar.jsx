import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

export default function MobileSidebar() {
  return (
    <Sheet>
      {/* Trigger Button */}
      <SheetTrigger asChild>
        <Button className="md:hidden">Menu</Button>
      </SheetTrigger>

      {/* Sidebar Content */}
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-4 mt-4">
          <a href="/" className="text-sm font-medium hover:text-blue-500">
            Home
          </a>
          <a href="/about" className="text-sm font-medium hover:text-blue-500">
            About
          </a>
          <a
            href="/services"
            className="text-sm font-medium hover:text-blue-500"
          >
            Services
          </a>
          <a
            href="/contact"
            className="text-sm font-medium hover:text-blue-500"
          >
            Contact
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
