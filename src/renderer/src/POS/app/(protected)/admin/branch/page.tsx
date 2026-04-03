import { memo } from "react";
import PageLayout from "../../../../components/layout/page-layout";


function BranchPage(){
    return <PageLayout title="Branch">
        <div>
            Branch Content
        </div>
    </PageLayout>
}

export default memo(BranchPage)