import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    return (
        <form className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Selamat Datang Kembali di <span className="text-primary">GreenFlow</span>👋</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Mulai Hidup Sehat dan Sejahtera Bersama Kami
                </p>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="example@email.com" required />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="At least 8 characters" required />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="email">Confirm Password</Label>
                    <Input id="email" type="email" placeholder="example@email.com" required />
                </div>
                <Button type="submit" className="w-full">
                    Login
                </Button>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-background text-muted-foreground relative z-10 px-2">
                        Or continue with
                    </span>
                </div>
                <Button variant="outline" className="w-full">
                    <Image src="/icons/google.svg" alt="Google Icon" width={16} height={16} />
                    Sign In With Google
                </Button>
            </div>
            <div className="text-center text-sm">
                Have an account?{" "}
                <Link href="#" className="underline underline-offset-4">
                    Sign In
                </Link>
            </div>
        </form>
    )
}
