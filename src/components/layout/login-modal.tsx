"use client";

import { usePathname, useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import AuthForm from "./auth-form";

interface LoginModalProps {
    plan?: string;
    interval?: string;
}

export default function LoginModal({ plan, interval }: LoginModalProps) {
    const router = useRouter();
    const pathname = usePathname();

    const IsOpen = pathname.includes("/login");
    return (
        <Dialog open={IsOpen} onOpenChange={() => router.back()}>
            <DialogContent className="w-full max-w-[400px] rounded-md md:mx-auto">
                <DialogHeader>
                    <DialogTitle asChild>
                        <h2 className="font-semibold tracking-tight transition-colors">
                            Login
                        </h2>
                    </DialogTitle>
                </DialogHeader>
                <AuthForm plan={plan} interval={interval} />
            </DialogContent>
        </Dialog>
    );
}