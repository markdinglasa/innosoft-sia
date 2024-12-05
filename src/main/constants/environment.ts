import dotenv from 'dotenv'
dotenv.config()

export const NODE_ENV: string = 'production'

//DATABASE CONFIGURATIONS
export const DB_USER: string = (process.env?.DB_USER ?? 'sa') as string
export const DB_NAME: string = (process.env?.DB_NAME ?? 'pos_myk') as string
export const DB_SERVER: string = (process.env?.DB_SERVER ?? 'localhost') as string
export const DB_PASSWORD: string = (process.env?.DB_PASSWORD ?? 'myk2024') as string
export const DB_PORT: Number = Number(process.env?.DB_PORT ?? '1433')
