import { memo } from "react";
import PageLayout from "../../../../components/layout/page-layout";


function CustomersPage(){
    return <PageLayout title="Customers">
        <div>
            Customers Content
        </div>
    </PageLayout>
}

export default memo(CustomersPage)