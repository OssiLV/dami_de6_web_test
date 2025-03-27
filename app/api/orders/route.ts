import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Lấy danh sách master orders
export async function GET() {
    try {
        const masteOrders = await prisma.tblOrderMaster.findMany();
        return NextResponse.json(masteOrders, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}

// POST: Tạo master order
export async function POST(req: Request) {
    try {
        const {
            OrderNo,
            OrderDate,
            CustomerID,
            TotalAmount,
            DivSubID,
            OrderDetail,
        }: {
            OrderNo: string;
            OrderDate: string;
            CustomerID: string;
            TotalAmount: number;
            DivSubID: string;
            OrderDetail: {
                RowDetailID: string;
                ItemID: string;
                ItemName: string;
                InvUnitOfMeasr: string;
                OrderMasterID?: string;
                LineNumber: number;
                Quantity: number;
                Price: number;
                Amount: number;
            }[];
        } = await req.json();

        if (
            !OrderNo ||
            !OrderDate ||
            !CustomerID ||
            !TotalAmount ||
            OrderDetail.length === 0
        ) {
            return NextResponse.json(
                { error: "Thiếu thông tin" },
                { status: 400 }
            );
        }
        const orderDetailFiltered = OrderDetail.map(
            ({
                RowDetailID,
                ItemID,
                ItemName,
                InvUnitOfMeasr,
                OrderMasterID,
                LineNumber,
                Quantity,
                Price,
                Amount,
            }) => ({
                RowDetailID,
                ItemID,
                ItemName,
                InvUnitOfMeasr,
                OrderMasterID,
                LineNumber,
                Quantity,
                Price,
                Amount,
            })
        );
        const masterOrderUUID = crypto.randomUUID();

        await prisma.tblOrderMaster.create({
            data: {
                OrderMasterID: masterOrderUUID, // Generate a unique ID
                OrderNo,
                OrderDate,
                CustomerID,
                TotalAmount,
                DivSubID,
            },
        });

        const orderDetailFilteredWithIDs = orderDetailFiltered.map(
            (item: any) => ({
                ...item,
                RowDetailID: crypto.randomUUID(),
                OrderMasterID: masterOrderUUID,
            })
        );

        for (let i = 0; i < orderDetailFilteredWithIDs.length; i++) {
            await prisma.tblOrderDetail.create({
                data: {
                    RowDetailID: orderDetailFilteredWithIDs[i].RowDetailID,
                    ItemID: orderDetailFilteredWithIDs[i].ItemID,
                    tblOrderMaster: {
                        connect: { OrderMasterID: masterOrderUUID },
                    },
                    LineNumber: orderDetailFilteredWithIDs[i].LineNumber,
                    Quantity: orderDetailFilteredWithIDs[i].Quantity,
                    Price: orderDetailFilteredWithIDs[i].Price,
                    Amount: orderDetailFilteredWithIDs[i].Amount,
                },
            });
        }

        // return NextResponse.json(order, { status: 201 });
        return NextResponse.json("Tạo hoá đơn thành công", { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}
