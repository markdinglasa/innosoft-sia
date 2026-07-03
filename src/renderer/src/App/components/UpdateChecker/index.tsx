import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import DownloadIcon from '@mui/icons-material/Download'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { colors } from '@shared/styles'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

type UpdateStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'not-available'
  | 'downloading'
  | 'downloaded'
  | 'error'

interface ProgressData {
  percent: number
  transferred: number
  total: number
  bytesPerSecond: number
}

export const UpdateChecker = () => {
  const [status, setStatus] = useState<UpdateStatus>('idle')
  const [currentVersion, setCurrentVersion] = useState<string>('')
  const [newVersion, setNewVersion] = useState<string>('')
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    window.electron.updater.getCurrentVersion().then((v) => setCurrentVersion(v))

    window.electron.updater.onChecking(() => {
      setStatus('checking')
    })
    window.electron.updater.onUpdateAvailable((data) => {
      setStatus('available')
      setNewVersion(data.version)
    })
    window.electron.updater.onUpdateNotAvailable(() => {
      setStatus('not-available')
    })
    window.electron.updater.onDownloadProgress((data) => {
      setStatus('downloading')
      setProgress(data)
    })
    window.electron.updater.onUpdateDownloaded(() => {
      setStatus('downloaded')
    })
    window.electron.updater.onUpdateError((data) => {
      setStatus('error')
      setErrorMessage(data.message || 'An unknown error occurred.')
    })

    return () => {
      window.electron.updater.removeAllListeners()
    }
  }, [])

  const handleCheckForUpdates = useCallback(async () => {
    setStatus('checking')
    setErrorMessage('')
    await window.electron.updater.checkForUpdates()
  }, [])

  const handleDownload = useCallback(async () => {
    setStatus('downloading')
    setProgress({ percent: 0, transferred: 0, total: 0, bytesPerSecond: 0 })
    await window.electron.updater.downloadUpdate()
  }, [])

  const handleInstall = useCallback(async () => {
    await window.electron.updater.quitAndInstall()
  }, [])

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <Container>
      <Header>
        <SystemUpdateAltIcon sx={{ color: colors.secondary, fontSize: 20 }} />
        <Title>Software Update</Title>
      </Header>

      <VersionRow>
        <VersionLabel>Current Version</VersionLabel>
        <VersionValue>{currentVersion || '...'}</VersionValue>
      </VersionRow>

      {/* Status-specific UI */}
      {status === 'idle' && (
        <ActionButton onClick={handleCheckForUpdates}>Check for Updates</ActionButton>
      )}

      {status === 'checking' && (
        <StatusRow>
          <Spinner />
          <StatusText>Checking for updates...</StatusText>
        </StatusRow>
      )}

      {status === 'not-available' && (
        <StatusRow>
          <CheckCircleIcon sx={{ color: colors.palette.green['300'], fontSize: 18 }} />
          <StatusText style={{ color: colors.palette.green['300'] }}>
            You&apos;re up to date!
          </StatusText>
          <RetryLink onClick={handleCheckForUpdates}>Check again</RetryLink>
        </StatusRow>
      )}

      {status === 'available' && (
        <UpdateAvailableContainer>
          <StatusRow>
            <DownloadIcon sx={{ color: colors.secondary, fontSize: 18 }} />
            <StatusText>
              Version <strong>{newVersion}</strong> is available
            </StatusText>
          </StatusRow>
          <ActionButton onClick={handleDownload}>Download Update</ActionButton>
        </UpdateAvailableContainer>
      )}

      {status === 'downloading' && progress && (
        <DownloadContainer>
          <StatusRow>
            <Spinner />
            <StatusText>Downloading... {progress.percent}%</StatusText>
          </StatusRow>
          <ProgressBarOuter>
            <ProgressBarInner style={{ width: `${progress.percent}%` }} />
          </ProgressBarOuter>
          <DownloadDetails>
            {formatBytes(progress.transferred)} / {formatBytes(progress.total)} &middot;{' '}
            {formatBytes(progress.bytesPerSecond)}/s
          </DownloadDetails>
        </DownloadContainer>
      )}

      {status === 'downloaded' && (
        <UpdateAvailableContainer>
          <StatusRow>
            <CheckCircleIcon sx={{ color: colors.palette.green['300'], fontSize: 18 }} />
            <StatusText style={{ color: colors.palette.green['300'] }}>
              Update downloaded!
            </StatusText>
          </StatusRow>
          <InstallButton onClick={handleInstall}>
            <RestartAltIcon sx={{ fontSize: 16 }} />
            Restart &amp; Install
          </InstallButton>
        </UpdateAvailableContainer>
      )}

      {status === 'error' && (
        <ErrorContainer>
          <StatusRow>
            <ErrorOutlineIcon sx={{ color: colors.palette.red['400'], fontSize: 18 }} />
            <StatusText style={{ color: colors.palette.red['400'] }}>
              {errorMessage || 'Update check failed.'}
            </StatusText>
          </StatusRow>
          <ActionButton onClick={handleCheckForUpdates}>Try Again</ActionButton>
        </ErrorContainer>
      )}
    </Container>
  )
}

// --- Styled Components ---

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border: 1px solid ${colors.palette.gray['700']};
  border-radius: 8px;
  margin: 8px 0 12px 0;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
`

const Title = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.white};
`

const VersionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const VersionLabel = styled.span`
  font-size: 12px;
  color: ${colors.palette.gray['400']};
`

const VersionValue = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${colors.secondary};
  font-family: monospace;
`

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

const StatusText = styled.span`
  font-size: 12px;
  color: ${colors.palette.gray['300']};

  strong {
    color: ${colors.white};
  }
`

const ActionButton = styled.button`
  background: ${colors.secondary};
  color: ${colors.primary};
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.pink};
    color: ${colors.white};
  }
`

const InstallButton = styled(ActionButton)`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${colors.palette.green['400']};
  color: ${colors.white};

  &:hover {
    background: ${colors.palette.green['300']};
  }
`

const RetryLink = styled.span`
  font-size: 11px;
  color: ${colors.secondary};
  cursor: pointer;
  text-decoration: underline;
  margin-left: auto;

  &:hover {
    color: ${colors.pink};
  }
`

const UpdateAvailableContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const DownloadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ProgressBarOuter = styled.div`
  width: 100%;
  height: 6px;
  background: ${colors.palette.gray['700']};
  border-radius: 3px;
  overflow: hidden;
`

const ProgressBarInner = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${colors.secondary}, ${colors.palette.cyan['300']});
  border-radius: 3px;
  transition: width 0.3s ease;
`

const DownloadDetails = styled.span`
  font-size: 11px;
  color: ${colors.palette.gray['400']};
`

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid ${colors.palette.gray['600']};
  border-top-color: ${colors.secondary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`
