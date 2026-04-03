import { memo } from "react";
import PageLayout from "../../../../components/layout/page-layout";


function DisbursementPage(){
    return <PageLayout title="Disbursement">
        <div>
            Disbursement Content
        </div>
    </PageLayout>
}

export default memo(DisbursementPage)