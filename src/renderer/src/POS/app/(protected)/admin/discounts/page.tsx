import { memo } from "react";
import PageLayout from "../../../../components/layout/page-layout";


function DiscountsPage(){
    return <PageLayout title="Discounts">
        <div>
            Discounts Content
        </div>
    </PageLayout>
}

export default memo(DiscountsPage)