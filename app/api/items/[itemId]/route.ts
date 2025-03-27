import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Lấy thông tin sản phẩm theo ItemID
export async function GET(
    req: Request,
    { params }: { params: { itemId: string } }
) {
    try {
        const { itemId } = params;

        if (!itemId) {
            return NextResponse.json(
                { error: "Thiếu ItemID" },
                { status: 400 }
            );
        }

        const item = await prisma.tblItemList.findUnique({
            where: { ItemID: itemId },
        });

        if (!item) {
            return NextResponse.json(
                { error: "Không tìm thấy sản phẩm" },
                { status: 404 }
            );
        }

        return NextResponse.json(item, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}
