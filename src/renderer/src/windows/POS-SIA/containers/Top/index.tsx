import { useToggle } from '@shared/hooks'
import { getActiveDBConfig } from '@shared/selectors'
import { SFC } from '@shared/types'
import { useSelector } from 'react-redux'
import { ConnectionStatus, EditButton, SpacedItems, TopCard } from '../../components'
import { DatabaseModal } from '../../modals'
import * as S from './Styles'

export const Top: SFC = ({ className }) => {
  const activeDatabase = useSelector(getActiveDBConfig)
  const [modalIsOpen, toggleModal] = useToggle(false)
  const databaseName = activeDatabase?.name

  const renderAccountContent = () => {
    if (!databaseName) return <S.Button onClick={toggleModal}>Select Database</S.Button>
    return renderActiveAccount()
  }

  const renderAccountModal = () => {
    if (!modalIsOpen) return null
    return <DatabaseModal close={toggleModal} />
  }

  const renderActiveAccount = () => {
    return (
      <SpacedItems
        leftContent={<S.DatabaseIdentification database={databaseName!} server="localhost" />}
        rightContent={<EditButton onClick={toggleModal} />}
      />
    )
  }

  return (
    <>
      <S.Container className={className}>
        <TopCard heading="Database Configuration">{renderAccountContent()}</TopCard>
        <ConnectionStatus />
      </S.Container>
      {renderAccountModal()}
    </>
  )
}
