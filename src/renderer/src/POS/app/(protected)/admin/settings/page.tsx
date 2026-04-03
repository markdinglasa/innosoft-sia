import { memo } from "react";
import PageLayout from "../../../../components/layout/page-layout";

function SettingsPage(){
    return <PageLayout title="Settings">
        <div>
            Settings Content
        </div>
    </PageLayout>
}

export default memo(SettingsPage)