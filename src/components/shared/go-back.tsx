"use client";
import { useRouter } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import { Button } from "@/components/ui/button";
import { MoveLeftIcon } from "lucide-react";

export default function GoBack() {
    const router = useRouter();
    const scopedT = useScopedI18n('shared')
    return (
        <Button
            className="mb-5"
            size="icon"
            variant="secondary"
            onClick={() => router.back()
            }
        >
            <span className="sr-only" > {scopedT('goBack')} </span>
            <MoveLeftIcon className="h-5 w-5" />
        </Button>
    );
}