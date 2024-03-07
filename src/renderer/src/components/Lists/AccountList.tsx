import { useEffect, useState } from "react";

type Account = {
    Account: string; // Adjust the type according to your actual data structure
    // Other properties if any
};

export const AccountList = () => {
    const [accounts, setAccounts] = useState<Account[]>([]); // Specify the type here

    useEffect(() => {
        // Request the item list from the main process
        window.api.get('get-account-list').then((datalist: Account[]) => { // Adjust the type here
            setAccounts(datalist);
        }).catch((error) => {
            console.error('Error fetching item list:', error);
        });
    }, []);

    return (
        <>
            <div>
                <h2>Item List</h2>
                <ul>
                    {accounts.map((account, index) => (
                        <li key={index}>{account.Account}</li>
                    ))}
                </ul>
            </div>
        </>
    );
};
