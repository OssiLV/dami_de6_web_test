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
import { tblCustomerList } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Customers() {
    const [customers, setCustomers] = useState<Array<tblCustomerList>>([]);

    useEffect(() => {
        axios
            .get("/api/customers")
            .then((res) => setCustomers(res.data))
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
                        <TableHead className="w-[100px]">CustomerID</TableHead>
                        <TableHead>CustomerName</TableHead>
                        <TableHead>TaxCode</TableHead>
                        <TableHead>Address</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.map((cust) => (
                        <TableRow key={cust.CustomerID}>
                            <TableCell>{cust.CustomerID}</TableCell>
                            <TableCell className="font-medium">
                                {cust.CustomerName}
                            </TableCell>
                            <TableCell>{cust.TaxCode}</TableCell>
                            <TableCell>{cust.Address}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-right">
                            {customers.length}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}
