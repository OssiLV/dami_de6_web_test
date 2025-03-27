import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Lấy thông tin master order theo ID
export async function GET(
    req: Request,
    { params }: { params: { masterOrderId: string } }
) {
    try {
        const { masterOrderId } = params;

        if (!masterOrderId) {
            return NextResponse.json(
                { error: "Thiếu MasterOrderId" },
                { status: 400 }
            );
        }

        const item = await prisma.tblOrderMaster.findUnique({
            where: { OrderMasterID: masterOrderId },
            select: {
                OrderNo: true,
                TotalAmount: true,
                OrderDate: true,
                CustomerID: true,
                tblOrderDetail: true,
            },
        });

        if (!item) {
            return NextResponse.json(
                { error: "Không tìm thấy master order" },
                { status: 404 }
            );
        }

        return NextResponse.json(item, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { masterOrderId: string } }
) {
    try {
        const { masterOrderId } = params;
        const body = await req.json();

        if (!masterOrderId) {
            return NextResponse.json(
                { error: "Thiếu MasterOrderId" },
                { status: 400 }
            );
        }

        const { OrderNo, OrderDate, CustomerID, TotalAmount, OrderDetail } =
            body;

        // Cập nhật bảng tblOrderMaster
        const updatedOrder = await prisma.tblOrderMaster.update({
            where: { OrderMasterID: masterOrderId },
            data: {
                OrderNo,
                OrderDate,
                CustomerID,
                TotalAmount,
            },
        });

        // Xóa các chi tiết cũ của đơn hàng
        await prisma.tblOrderDetail.deleteMany({
            where: { OrderMasterID: masterOrderId },
        });

        for (let i = 0; i < OrderDetail.length; i++) {
            await prisma.tblOrderDetail.create({
                data: {
                    RowDetailID: crypto.randomUUID(),
                    ItemID: OrderDetail[i].ItemID,
                    tblOrderMaster: {
                        connect: { OrderMasterID: updatedOrder.OrderMasterID },
                    },
                    LineNumber: OrderDetail[i].LineNumber,
                    Quantity: OrderDetail[i].Quantity,
                    Price: OrderDetail[i].Price,
                    Amount: OrderDetail[i].Amount,
                },
            });
        }
        return NextResponse.json(updatedOrder, { status: 200 });
    } catch (error) {
        console.error("Lỗi cập nhật đơn hàng:", error);
        return NextResponse.json(
            { error: "Lỗi server khi cập nhật đơn hàng" },
            { status: 500 }
        );
    }
}
