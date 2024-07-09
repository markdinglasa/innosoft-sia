import { mdiDatabase } from '@mdi/js'
import { useToggle } from '@shared/hooks'
import { getActiveDBConfig } from '@shared/selectors'
import { SFC, Theme } from '@shared/types'
import { useSelector } from 'react-redux'
import { Card, ConnectionStatus, EditButton, SpacedItems } from '..'
import { DatabaseModal } from '../../modals'
import { getInitialize } from '../../selectors'
import * as S from './Styles'

export const DatabaseCard: SFC = ({ className }) => {
  const activeDatabase = useSelector(getActiveDBConfig)
  const initialized = useSelector(getInitialize)
  const [modalIsOpen, toggleModal] = useToggle(false)
  const databaseName = activeDatabase?.name

  const renderContent = () => {
    if (!databaseName) return <S.Button iconLeft={mdiDatabase} onClick={toggleModal}  text="Select Database" />
    return renderConfig()
  }

  const renderModal = () => {
    if (!modalIsOpen) return null
    return <DatabaseModal close={toggleModal} theme={Theme.dark}/>
  }

  const renderConfig = () => {
    return (
      <SpacedItems
        leftContent={<S.DatabaseIdentification database={databaseName!} server="localhost" />}
        rightContent={!initialized && <EditButton onClick={toggleModal} />}
      />
    )
  }

  return (
    <>
      <S.Container className={className}>
        <ConnectionStatus />
        <Card heading="Database Configuration">{renderContent()}</Card>
      </S.Container>
      {renderModal()}
    </>
  )
}
