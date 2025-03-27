"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
    TableFooter,
} from "@/components/ui/table";
import { tblCustomerList, tblItemList } from "@prisma/client";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import Link from "next/link";

export interface ICustomMasterOrder {
    OrderNo: string;
    OrderDate: Date;
    CustomerID: string;
    TotalAmount: number;
    DivSubID: string;
    tblOrderDetail: ICustomOrderDetail[];
}

export interface ICustomOrderDetail {
    ItemID: string;
    ItemName: string;
    InvUnitOfMeasr: string;
    RowDetailID: string;
    OrderMasterID: string;
    LineNumber: number;
    Quantity: number;
    Price: number;
    Amount: number;
}

export default function UpdateOrderComponent({
    masterOrderId,
}: {
    masterOrderId: string;
}) {
    const [orderNo, setOrderNo] = useState<string>("");
    const [orderDate, setOrderDate] = useState<Date>(new Date());
    const [customerID, setCustomerID] = useState<string>("");

    const [custList, setCustList] = useState<Array<tblCustomerList>>([]);
    const [currentCust, setCurrentCust] = useState<tblCustomerList>();
    const [itemList, setItemList] = useState<Array<tblItemList>>([]);
    const [orderDetail, setOrderDetail] = useState<ICustomOrderDetail[]>([]);

    const [totalQty, setTotalQty] = useState<number>(0);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    // GET: Lấy danh sách khách hàng và hàng hóa
    useEffect(() => {
        axios
            .get("/api/customers")
            .then((res) => setCustList(res.data))
            .catch((err) => console.error("Lỗi:", err));

        axios
            .get("/api/items")
            .then((res) => setItemList(res.data))
            .catch((err) => console.error("Lỗi:", err));
    }, []);

    // GET: Lấy thông tin hóa đơn
    useEffect(() => {
        axios.get(`/api/orders/${masterOrderId}`).then((res) => {
            console.log("Dữ liệu API nhận được:", res.data);

            const orderData = res.data as ICustomMasterOrder;

            setOrderNo(orderData.OrderNo);
            setOrderDate(new Date(orderData.OrderDate));
            setCustomerID(orderData.CustomerID);
            setOrderDetail(orderData.tblOrderDetail);
            setTotalAmount(orderData.TotalAmount);
            handleCustChange(orderData.CustomerID);
            for (let i = 0; i < orderData.tblOrderDetail.length; i++) {
                handleItemChange(
                    orderData.tblOrderDetail[i].ItemID,
                    orderData.tblOrderDetail[i].LineNumber
                );
            }
        });
    }, [masterOrderId, custList, itemList]);

    useEffect(() => {
        const totalQuantity = orderDetail?.reduce(
            (total, row) => total + row.Quantity,
            0
        );
        const totalAmountCalc = orderDetail?.reduce(
            (total, row) => total + row.Amount,
            0
        );

        setTotalQty(totalQuantity);
        setTotalAmount(totalAmountCalc);
    }, [orderDetail]); // Chạy lại khi `orderDetail` thay đổi

    // Xử lý thay đổi số hóa đơn
    const hanldeOrderNoChange = (value: string) => {
        setOrderNo(value);
    };

    // Xử lý thay đổi ngày hóa đơn
    const handleOrderDateChange = (value: Date) => {
        setOrderDate(value);
    };

    // Xử lý thay đổi khách hàng
    const handleCustChange = useCallback(
        (custID: string) => {
            setCurrentCust(custList.find((cust) => cust.CustomerID === custID));
            setCustomerID(custID);
        },
        [custList]
    );

    // Xử lý thay đổi sản phẩm
    const handleItemChange = useCallback(
        (itemId: string, lineNumber: number) => {
            const selectedItem = itemList.find(
                (item) => item.ItemID === itemId
            );

            setOrderDetail((prevOrder) =>
                prevOrder.map((row) =>
                    row.LineNumber === lineNumber
                        ? {
                              ...row,
                              ItemID: itemId,
                              ItemName: selectedItem?.ItemName || "",
                              InvUnitOfMeasr:
                                  selectedItem?.InvUnitOfMeasr || "",
                          }
                        : row
                )
            );
        },
        [itemList]
    );

    // Xử lý thay đổi số lượng
    const handleQtyChange = (qty: number, lineNumber: number) => {
        setOrderDetail((prevOrder) =>
            prevOrder.map((row) =>
                row.LineNumber === lineNumber
                    ? {
                          ...row,
                          Quantity: qty,
                          Amount: row.Price * qty, // Tính lại Amount khi thay đổi Quantity
                      }
                    : row
            )
        );
    };

    // Xử lý thay đổi giá
    const handlePriceChange = (price: number, lineNumber: number) => {
        setOrderDetail((prevOrder) =>
            prevOrder.map((row) =>
                row.LineNumber === lineNumber
                    ? {
                          ...row,
                          Price: price,
                          Amount: row.Quantity * price, // Tính lại Amount khi thay đổi Price
                      }
                    : row
            )
        );
    };

    // Xử lý thay đổi thành tiền
    const handleAmountChange = (amount: number, lineNumber: number) => {
        setOrderDetail((prevOrder) =>
            prevOrder.map((row) =>
                row.LineNumber === lineNumber
                    ? {
                          ...row,
                          Amount: amount,
                          Price: row.Quantity > 0 ? amount / row.Quantity : 0, // Tính lại Price khi thay đổi Amount
                      }
                    : row
            )
        );
    };

    // Thêm dòng mới vào bảng
    const addRow = () => {
        setOrderDetail([
            ...orderDetail,
            {
                ItemID: "",
                ItemName: "",
                InvUnitOfMeasr: "",
                Quantity: 0.0,
                Price: 0.0,
                Amount: 0.0,
                LineNumber: orderDetail.length + 1,
                OrderMasterID: "",
                RowDetailID: "",
            },
        ]);
    };

    // Xóa dòng khỏi bảng
    const removeRow = (lineNumber: number) => {
        setOrderDetail((prevOrder) =>
            prevOrder
                .filter((row) => row.LineNumber !== lineNumber)
                .map((row, index) => ({
                    ...row,
                    LineNumber: index + 1,
                }))
        );
    };

    // Ghi thông tin hóa đơn
    const handleUpdate = async () => {
        if (!orderNo.trim()) {
            alert("Vui lòng nhập số hóa đơn!");
            return;
        }
        if (!customerID) {
            alert("Vui lòng chọn khách hàng!");
            return;
        }
        if (orderDetail.length === 0) {
            alert("Vui lòng thêm ít nhất một mặt hàng!");
            return;
        }

        const filteredOrderDetail = orderDetail.filter(
            (item) => item.ItemID && item.ItemID.trim() !== ""
        );

        try {
            const response = await axios.put(`/api/orders/${masterOrderId}`, {
                OrderNo: orderNo,
                OrderDate: orderDate,
                CustomerID: customerID,
                TotalAmount: totalAmount,
                OrderDetail: filteredOrderDetail,
            });
            console.log("Cập nhật thành công:", response.data);
            alert("Cập nhật đơn hàng thành công!");
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <Card className="w-full max-w-5xl bg-white p-6 shadow-md">
                <CardHeader>
                    <h2 className="text-center text-xl font-bold">
                        HOÁ ĐƠN BÁN HÀNG
                    </h2>
                </CardHeader>
                <CardContent>
                    {/* Thông tin hóa đơn */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="font-medium">Số hóa đơn:</label>
                            <Input
                                className="mt-1"
                                value={orderNo}
                                onChange={(event) =>
                                    hanldeOrderNoChange(event.target.value)
                                }
                            />
                        </div>
                        <div>
                            <label className="font-medium">Ngày:</label>
                            <Input
                                className="mt-1"
                                type="date"
                                value={orderDate.toISOString().split("T")[0]}
                                onChange={(event) =>
                                    handleOrderDateChange(
                                        new Date(event.target.value)
                                    )
                                }
                            />
                        </div>
                    </div>
                    <div className="mb-4 flex flex-col">
                        <label className="font-medium">Khách hàng:</label>
                        <div className="flex gap-4 items-center">
                            <Select
                                value={customerID}
                                onValueChange={(value) =>
                                    handleCustChange(value)
                                }
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Customers</SelectLabel>
                                        {custList.map((cust) => (
                                            <SelectItem
                                                key={cust.CustomerID}
                                                value={cust.CustomerID}
                                            >
                                                {cust.CustomerID}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <label className="mt-1 uppercase">
                                {currentCust?.CustomerName}
                            </label>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="font-medium">Địa chỉ: </label>
                        <label className="mt-1">{currentCust?.Address}</label>
                    </div>

                    {/* Bảng dữ liệu sản phẩm */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã hàng</TableHead>
                                <TableHead>Tên hàng</TableHead>
                                <TableHead>DVT</TableHead>
                                <TableHead>Số lượng</TableHead>
                                <TableHead>Đơn giá</TableHead>
                                <TableHead>Thành tiền</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orderDetail.length > 0 &&
                                orderDetail?.map((row) => (
                                    <TableRow key={row.LineNumber}>
                                        <TableCell className="">
                                            <Select
                                                value={row.ItemID}
                                                onValueChange={(value) =>
                                                    handleItemChange(
                                                        value,
                                                        row.LineNumber
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn sản phẩm" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {itemList.map((item) => (
                                                        <SelectItem
                                                            key={item.ItemID}
                                                            value={item.ItemID}
                                                        >
                                                            {item.ItemID}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>

                                        <TableCell>
                                            <Input
                                                value={row.ItemName}
                                                readOnly
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                value={row.InvUnitOfMeasr}
                                                readOnly
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                value={row.Quantity}
                                                type="number"
                                                onChange={(event) =>
                                                    handleQtyChange(
                                                        Number(
                                                            event.target.value
                                                        ),
                                                        row.LineNumber
                                                    )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                value={row.Price}
                                                type="number"
                                                onChange={(event) =>
                                                    handlePriceChange(
                                                        Number(
                                                            event.target.value
                                                        ),
                                                        row.LineNumber
                                                    )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="font-bold">
                                            <Input
                                                type="number"
                                                value={row.Amount}
                                                onChange={(event) =>
                                                    handleAmountChange(
                                                        Number(
                                                            event.target.value
                                                        ),
                                                        row.LineNumber
                                                    )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    removeRow(row.LineNumber)
                                                }
                                            >
                                                ❌
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell
                                    className="text-right font-bold"
                                    colSpan={3}
                                >
                                    Tổng cộng:
                                </TableCell>
                                <TableCell className="text-center font-bold">
                                    {totalQty}
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell className="text-center font-bold">
                                    {totalAmount?.toLocaleString()}
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                    <Button className="mt-4" onClick={addRow}>
                        Thêm hàng
                    </Button>

                    {/* Nút bấm */}
                    <div className="flex justify-center gap-4 mt-6">
                        <Button onClick={handleUpdate}>Cập nhật</Button>
                        <Button variant="outline">Bỏ qua</Button>
                        <Button variant="outline">
                            <Link href="/orders">Trở về</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
