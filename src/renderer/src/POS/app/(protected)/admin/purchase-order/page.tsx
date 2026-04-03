import { memo } from "react";
import PageLayout from "../../../../components/layout/page-layout";


function PurchaseOrderPage(){
    return <PageLayout title="Purchase Order">
        <div>
            Purchase Order Content
        </div>
    </PageLayout>
}

export default memo(PurchaseOrderPage)