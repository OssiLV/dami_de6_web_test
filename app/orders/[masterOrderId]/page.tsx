"use client";

import UpdateOrderComponent from "@/components/update_order";
import { useParams } from "next/navigation";

export default function MasterOrderId() {
    const { masterOrderId } = useParams<{
        masterOrderId: string;
    }>();

    return <UpdateOrderComponent masterOrderId={masterOrderId} />;
}
