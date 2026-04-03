import { memo } from "react";
import PageLayout from "../../../../../components/layout/page-layout";


function StockCountPage(){
    return <PageLayout title="Stock-Count">
        <div>
            Stock-Count Content
        </div>
    </PageLayout>
}

export default memo(StockCountPage)    