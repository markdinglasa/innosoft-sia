import { SFC } from '@shared/types'
import { SqlChannel } from '@shared/types/sql'
import { useEffect, useState } from 'react'
import * as S from './Styles'

type Account = {
  Account: string // Define the actual properties of your account data
}

export const Dashboard: SFC = ({ className }) => {
  const [accounts, setAccounts] = useState<Account[]>([]) // Use the Account type here

  useEffect(() => {
    const table = 'MstAccount'

    const fetchData = async () => {
      try {
        const datalist: Account[] = await window.electron.sql.get(SqlChannel.getAllAccounts, table)
        setAccounts(datalist)
        console.log(datalist) // Logging datalist to console
      } catch (error) {
        console.error('Error fetching item list:', error)
        setAccounts([]) // Handle error by setting accounts to null
      }
    }

    fetchData()
  }, [])

  return (
    <S.Container className={className}>
      <section>
        <div
          className="flex items-center justify-center h-full"
          style={{ width: '400px', height: '400px' }}
        >
          <div className="w-full max-w-xl p-6 bg-white rounded-md shadow-md">
            <h1 className="text-3xl font-semibold text-center text-gray-600">Test List</h1>
            <div className="px-2">
              <div>
                <h2>Account List</h2>
                {accounts ? (
                  accounts.length > 0 ? (
                    <ul>
                      {accounts.map((account, index) => (
                        <li key={index}>{account.Account}</li>
                      ))}
                    </ul>
                  ) : (
                    <span>No data fetched</span>
                  )
                ) : (
                  <p>Error fetching data or no accounts found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </S.Container>
  )
}
