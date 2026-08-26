import React, { Component, ErrorInfo, ReactNode } from 'react'
import * as S from './Styles'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
    
    // Log it to our LogService via IPC
    try {
      globalThis.electron?.sql?.post('log-error-from-ui', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      })
    } catch (e) {
      // Ignore if IPC isn't ready
    }
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <S.Container>
          <S.Card>
            <S.Title>Something went wrong.</S.Title>
            <S.Description>
              The application encountered an unexpected error and could not continue rendering.
            </S.Description>
            
            <S.ErrorBox>
              <S.ErrorMessage>{this.state.error?.toString()}</S.ErrorMessage>
              <S.ErrorDetails>{this.state.errorInfo?.componentStack}</S.ErrorDetails>
            </S.ErrorBox>
            
            <S.Button onClick={this.handleReload}>
              Reload Application
            </S.Button>
          </S.Card>
        </S.Container>
      )
    }

    return this.props.children
  }
}
