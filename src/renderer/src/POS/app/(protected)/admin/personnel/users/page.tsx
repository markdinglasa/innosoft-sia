import { memo } from "react";
import PageLayout from "../../../../../components/layout/page-layout";


function UsersPage(){
    return <PageLayout title="Users">
        <div>
            Users Content
        </div>
    </PageLayout>
}

export default memo(UsersPage)