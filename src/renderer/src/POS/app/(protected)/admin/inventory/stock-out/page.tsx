import { memo } from "react";
import PageLayout from "../../../../../components/layout/page-layout";


function StockOutPage(){
    return <PageLayout title="Stock-Out">
        <div>
            Stock-Out Content
        </div>
    </PageLayout>
}

export default memo(StockOutPage)    