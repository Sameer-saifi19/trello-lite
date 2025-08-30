'use client'

import { LogOut, Moon, Settings, Sun, User } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { useSession } from "next-auth/react";
import { AddCardDialog } from "./addCardDialog";

export default function Navbar() {

    const { theme, setTheme } = useTheme();
    const {data: session, status} = useSession();
    return (
        <nav className="p-4 mb-8 flex items-center justify-between bg-zinc-500/40">
            <div className="flex items-center gap-6">
                <h1 className="pl-4 text-4xl font-bold tracking-wider uppercase"> Taskly</h1>
            </div>
            <div className="flex items-center gap-4">

                <span className="text-lg tracking-wide pl-10 font-regular" > Hi, {session?.user?.name}</span>
                <span><AddCardDialog/></span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent sideOffset={12}>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/admin/dashboard/profile" className="flex items-center gap-2">
                                <User />
                                My Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings /> Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">
                            {" "}
                            <LogOut /> Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                
            </div>
        </nav>
    );
};