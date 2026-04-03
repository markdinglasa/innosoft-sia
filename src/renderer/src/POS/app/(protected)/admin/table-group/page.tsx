import { memo } from "react";
import PageLayout from "../../../../components/layout/page-layout";


function TableGroupPage(){
    return <PageLayout title="Table Group">
        <div>
            Table Group Content
        </div>
    </PageLayout>
}

export default memo(TableGroupPage)