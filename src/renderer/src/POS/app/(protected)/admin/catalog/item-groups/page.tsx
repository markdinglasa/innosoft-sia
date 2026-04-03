import { memo } from "react";
import PageLayout from "../../../../../components/layout/page-layout";


function ItemGroupsPage(){
    return <PageLayout title="Item Groups">
        <div>
            Item Groups Content
        </div>
    </PageLayout>
}

export default memo(ItemGroupsPage)