import { mdiClose } from '@mdi/js'
import Icon from '@mdi/react'
import { LogEntry } from '@shared/types'
import { Logs } from '@shared/types/preloads/sqlChannels/config/logs'
import { useEffect, useState } from 'react'
import * as S from './Styles'

interface LogViewerProps {
  isOpen: boolean
  onClose: () => void
}

export const LogViewer = ({ isOpen, onClose }: LogViewerProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchLogs = async () => {
    try {
      setIsLoading(true)
      const response = await globalThis.electron.sql.get(Logs.getLogs)
      if (response?.IsSomething && response.List) {
        setLogs(response.List)
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = async () => {
    try {
      await globalThis.electron.sql.get(Logs.clearLogs)
      setLogs([])
    } catch (error) {
      console.error('Failed to clear logs:', error)
    }
  }

  const handleExport = async () => {
    try {
      await globalThis.electron.sql.get(Logs.exportLogs)
    } catch (error) {
      console.error('Failed to export logs:', error)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchLogs()
    }
  }, [isOpen])

  return (
    <>
      <S.Overlay $isOpen={isOpen} onClick={onClose} />
      <S.Panel $isOpen={isOpen}>
        <S.Header>
          <S.Title>Application Logs</S.Title>
          <S.HeaderActions>
            <S.ActionButton onClick={fetchLogs} disabled={isLoading}>
              Refresh
            </S.ActionButton>
            <S.ActionButton onClick={handleExport}>Export</S.ActionButton>
            <S.ActionButton onClick={handleClear}>Clear</S.ActionButton>
            <S.CloseButton onClick={onClose}>
              <Icon path={mdiClose} size={1} />
            </S.CloseButton>
          </S.HeaderActions>
        </S.Header>

        <S.Body>
          {logs.length === 0 ? (
            <S.EmptyState>{isLoading ? 'Loading logs...' : 'No logs available.'}</S.EmptyState>
          ) : (
            <S.LogList>
              {logs.map((log) => (
                <S.LogItem key={log.id} $level={log.level}>
                  <S.LogHeader>
                    <S.LogMeta>
                      <S.LogLevelBadge $level={log.level}>{log.level}</S.LogLevelBadge>
                      <S.LogSource>{log.source}</S.LogSource>
                    </S.LogMeta>
                    <S.LogTime>{new Date(log.timestamp).toLocaleTimeString()}</S.LogTime>
                  </S.LogHeader>
                  <S.LogMessage>{log.message}</S.LogMessage>
                  {log.details && <S.LogDetails>{log.details}</S.LogDetails>}
                </S.LogItem>
              ))}
            </S.LogList>
          )}
        </S.Body>
      </S.Panel>
    </>
  )
}
