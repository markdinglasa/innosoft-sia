import { FC } from 'react'

export type GenericFunction = GenericFunctionConstructor<unknown>

// eslint-disable-next-line
type GenericFunctionConstructor<T> = (...args: unknown[]) => T

export type GenericVoidFunction = GenericFunctionConstructor<void | Promise<void>>

export interface Id {
  Id: string
}

interface ClassName {
  className?: string
}

export interface Dict<T> {
  [key: string]: T
}

export type SFC<P = Record<string, unknown>> = FC<P & ClassName>
