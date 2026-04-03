import { memo } from "react";
import PageLayout from "../../../../components/layout/page-layout";


function DebitCreditCardMemoPage(){
    return <PageLayout title="Debit/Credit Card Memo">
        <div>
            Debit/Credit Card Memo Content
        </div>
    </PageLayout>
}

export default memo(DebitCreditCardMemoPage)