import { memo } from "react";
import PageLayout from "../../../../../components/layout/page-layout";


function UnitPage(){
    return <PageLayout title="Unit">
        <div>
            Unit Content
        </div>
    </PageLayout>
}

export default memo(UnitPage)