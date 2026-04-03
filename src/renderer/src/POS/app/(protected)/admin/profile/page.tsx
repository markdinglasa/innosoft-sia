import { memo } from "react";
import PageLayout from "../../../../components/layout/page-layout";


function ProfilePage(){
    return <PageLayout title="Profile">
        <div>
            Profile Content
        </div>
    </PageLayout>
}

export default memo(ProfilePage)