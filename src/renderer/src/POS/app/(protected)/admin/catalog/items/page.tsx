import { memo } from "react";
import PageLayout from "../../../../../components/layout/page-layout";


function ItemsPage(){
    return <PageLayout title="Items">
        <div>
            Items Content
        </div>
    </PageLayout>
}

export default memo(ItemsPage)