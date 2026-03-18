import { mdiCloudCheck, mdiCloudOff, mdiCloudSync } from '@mdi/js'
import Icon from '@mdi/react'
import { Modal } from "@shared/components"
import { SFC } from '@shared/types'
import { memo, useState } from 'react'
import { useSelector } from 'react-redux'
import { SyncManager } from "../../utils"
import * as S from './Styles'

export const SyncStatusBadge: SFC = memo(() => {
  const { isOnline, isSyncing, totalToSync, syncedCount, pendingCount } = useSelector((state: any) => state.sync)
  const [showManager, setShowManager] = useState(false)

  let icon = mdiCloudCheck
  let text = 'Online'
  let spinning = false

  if (isSyncing) {
    icon = mdiCloudSync
    text = `Syncing (${syncedCount}/${totalToSync})`
    spinning = true
  } else if (!isOnline) {
    icon = mdiCloudOff
    text = 'Offline Mode'
  }

  return (
    <>
      <S.Container online={isOnline} syncing={isSyncing} onClick={() => setShowManager(true)} style={{ cursor: 'pointer' }}>
        <S.IconWrapper spinning={spinning}>
          <Icon path={icon} size={0.7} color="white" />
        </S.IconWrapper>
        <S.Text>{text} {pendingCount > 0 && `(${pendingCount})`}</S.Text>
      </S.Container>

      {showManager && (
        <Modal 
          header="Sync Queue Manager" 
          close={() => setShowManager(false)} 
         
        >
          <SyncManager onClose={() => setShowManager(false)} />
        </Modal>
      )}
    </>
  )
})
