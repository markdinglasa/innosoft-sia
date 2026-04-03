import { memo } from "react";
import PageLayout from "../../../../components/layout/page-layout";


function CollectionsPage(){
    return <PageLayout title="Collections">
        <div>
            Collections Content
        </div>
    </PageLayout>
}

export default memo(CollectionsPage)