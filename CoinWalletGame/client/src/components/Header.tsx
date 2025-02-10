import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "wouter";

export default function Header() {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer">
            Coin Game
          </h1>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/">
                <Button variant="ghost" className="justify-start w-full">Home</Button>
              </Link>
              <Link href="/history">
                <Button variant="ghost" className="justify-start w-full">History</Button>
              </Link>
              <Button variant="ghost" className="justify-start w-full">Profile</Button>
              <Button variant="ghost" className="justify-start w-full">Support</Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}