import { mdiDatabase } from '@mdi/js'
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

  const renderContent = () => {
    if (!databaseName) return <S.Button iconLeft={mdiDatabase} onClick={toggleModal}  text="Select Database" />
    return renderConfig()
  }

  const renderModal = () => {
    if (!modalIsOpen) return null
    return <DatabaseModal close={toggleModal} />
  }

  const renderConfig = () => {
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
        <ConnectionStatus />
        <TopCard heading="Database Configuration">{renderContent()}</TopCard>
      </S.Container>
      {renderModal()}
    </>
  )
}
