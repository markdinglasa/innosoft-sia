import { memo } from "react";
import PageLayout from "../../../../../components/layout/page-layout";


function TerminalPage(){
    return <PageLayout title="Terminal">
        <div>
            Terminal Content
        </div>
    </PageLayout>
}

export default memo(TerminalPage)