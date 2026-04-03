import { memo } from "react";
import PageLayout from "../../../../components/layout/page-layout";


function NotificationsPage(){
    return <PageLayout title="Notifications">
        <div>
            Notifications Content
        </div>
    </PageLayout>
}

export default memo(NotificationsPage)