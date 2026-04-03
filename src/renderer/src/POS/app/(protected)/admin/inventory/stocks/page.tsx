import { memo } from "react";
import PageLayout from "../../../../../components/layout/page-layout";


function StocksPage(){
    return <PageLayout title="Stocks">
        <div>
            Stocks Content
        </div>
    </PageLayout>
}

export default memo(StocksPage)    