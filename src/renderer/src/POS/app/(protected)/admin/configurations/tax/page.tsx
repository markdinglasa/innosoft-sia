import { memo } from "react";
import PageLayout from "../../../../../components/layout/page-layout";


function TaxPage(){
    return <PageLayout title="Tax">
        <div>
            Tax Content
        </div>
    </PageLayout>
}

export default memo(TaxPage)