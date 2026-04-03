import { memo } from "react";
import PageLayout from "../../../../components/layout/page-layout";


function POSHotelPage(){
    return <PageLayout title="POS Hotel">
        <div>
            POS Hotel Content
        </div>
    </PageLayout>
}

export default memo(POSHotelPage)