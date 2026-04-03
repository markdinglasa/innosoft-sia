import { memo } from "react";
import PageLayout from "../../../../components/layout/page-layout";


function SuppliersPage(){
    return <PageLayout title="Suppliers">
        <div>
            Suppliers Content
        </div>
    </PageLayout>
}

export default memo(SuppliersPage)