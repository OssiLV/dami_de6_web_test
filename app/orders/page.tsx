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
import { tblOrderMaster } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Orders() {
    const [orders, setOrders] = useState<Array<tblOrderMaster>>([]);
    const router = useRouter();
    useEffect(() => {
        axios
            .get("/api/orders")
            .then((res) => setOrders(res.data))
            .catch((err) => console.error("Lỗi:", err));
    }, []);
    const handleClick = (masterOrderId: string) => {
        router.push(`orders/${masterOrderId}`);
    };

    return (
        <div>
            <div className="flex gap-2">
                <Button size="sm">
                    <Link href="/">Back</Link>
                </Button>
                <Button size="sm">
                    <Link href="/create-order">Create an order</Link>
                </Button>
            </div>

            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">OrderNo</TableHead>
                        <TableHead>CustomerID</TableHead>
                        <TableHead className="text-right">
                            TotalAmount
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow
                            key={order.OrderMasterID}
                            onClick={() => handleClick(order.OrderMasterID)}
                        >
                            <TableCell>{order.OrderNo}</TableCell>
                            <TableCell className="font-medium">
                                {order.CustomerID}
                            </TableCell>
                            <TableCell className="text-right">
                                {order.TotalAmount}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-right">
                            {orders.length}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}
