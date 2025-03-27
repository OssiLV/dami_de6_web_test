export interface ICreateMasterOrderDto {
    OrderNo: string;
    OrderDate: Date;
    CustomerID: string;
    TotalAmount: number;
    DivSubID: number;
}
