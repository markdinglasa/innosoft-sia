import { memo } from "react";
import PageLayout from "../../../../../components/layout/page-layout";


function StockInPage(){
    return <PageLayout title="Stock-In">
        <div>
            Stock-In Content
        </div>
    </PageLayout>
}

export default memo(StockInPage)    