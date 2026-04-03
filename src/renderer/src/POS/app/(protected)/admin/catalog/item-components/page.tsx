import { memo } from "react";
import PageLayout from "../../../../../components/layout/page-layout";


function ItemComponentsPage(){
    return <PageLayout title="Item Components">
        <div>
            Item Components Content
        </div>
    </PageLayout>
}

export default memo(ItemComponentsPage)