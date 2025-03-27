import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col justify-between items-center gap-5">
            <Button>
                <Link href="/customers">Customer</Link>
            </Button>
            <Button>
                <Link href="/items">Items</Link>
            </Button>
            <Button>
                <Link href="/orders">Oders</Link>
            </Button>
        </div>
    );
}
