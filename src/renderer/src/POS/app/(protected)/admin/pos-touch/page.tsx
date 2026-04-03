import { memo } from "react";
import PageLayout from "../../../../components/layout/page-layout";


function POSTouchPage(){
    return <PageLayout title="POS Touch">
        <div>
            POS Touch Content
        </div>
    </PageLayout>
}

export default memo(POSTouchPage)