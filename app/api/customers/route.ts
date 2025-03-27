import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Lấy danh sách master orders
export async function GET() {
    try {
        const custs = await prisma.tblCustomerList.findMany();
        return NextResponse.json(custs, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}
