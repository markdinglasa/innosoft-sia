import { memo } from "react";
import PageLayout from "../../../../../components/layout/page-layout";


function TermPage(){
    return <PageLayout title="Term">
        <div>
            Term Content
        </div>
    </PageLayout>
}

export default memo(TermPage)