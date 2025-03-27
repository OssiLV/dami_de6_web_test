"use client";
import { useEffect, useState } from "react";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { tblItemList } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Items() {
    const [items, setItems] = useState<Array<tblItemList>>([]);

    useEffect(() => {
        axios
            .get("/api/items")
            .then((res) => setItems(res.data))
            .catch((err) => console.error("Lỗi:", err));
    }, []);
    return (
        <div>
            <div className="flex gap-2">
                <Button size="sm">
                    <Link href="/">Back</Link>
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ItemID</TableHead>
                        <TableHead>ItemName</TableHead>
                        <TableHead>InvUnitOfMeasr</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.ItemID}>
                            <TableCell>{item.ItemID}</TableCell>
                            <TableCell className="font-medium">
                                {item.ItemName}
                            </TableCell>
                            <TableCell>{item.InvUnitOfMeasr}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-right">
                            {items.length}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}
