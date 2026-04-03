import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SysSettingsService } from './sys-settings.service'

// Mock dependencies that cause Electron/Node issues
vi.mock('../../../entities/utilities/SysSettings.entity', () => {
  return {
    SysSettingsEntity: class {
      terminalId: number = 0
      orPrintTitle: string = ''
      isPartialPrint: number = 0
    }
  }
})

vi.mock('../../../typeORM/configurations', () => ({
  AppDataSource: {
    getRepository: vi.fn()
  }
}))

vi.mock('../../base.service', () => ({
  BaseService: class {
    constructor(protected entity: any) {}
    get repository() { return null as any }
  }
}))

vi.mock('../../../common/utils/validator', () => ({
  transformAndValidate: vi.fn((_cls, data) => Promise.resolve(data))
}))

describe('SysSettingsService Merge Logic', () => {
  let service: SysSettingsService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new SysSettingsService()
  })

  it('merges Global, Branch, and Terminal settings correctly', async () => {
    const globalSettings = { terminalId: 0, orPrintTitle: 'Global Title', isPartialPrint: 0 }
    const branchSettings = { terminalId: -10, orPrintTitle: 'Branch Title', isPartialPrint: 0 }
    const terminalSettings = { terminalId: 100, orPrintTitle: 'Branch Title', isPartialPrint: 1 }

    // Mock repository.findOneBy
    const mockRepo = {
      findOneBy: vi.fn().mockImplementation((criteria: any) => {
        if (criteria.terminalId === 0) return Promise.resolve(globalSettings)
        if (criteria.terminalId === -10) return Promise.resolve(branchSettings)
        if (criteria.terminalId === 100) return Promise.resolve(terminalSettings)
        return Promise.resolve(null)
      })
    }

    vi.spyOn(service as any, 'repository', 'get').mockReturnValue(mockRepo)
    vi.spyOn(service as any, 'getTerminalBranchId').mockResolvedValue(10)

    const merged = await service.getMergedSettings(100)

    expect(merged.orPrintTitle).toBe('Branch Title') // Branch overrides Global
    expect(merged.isPartialPrint).toBe(1) // Terminal overrides Global
    expect(merged.terminalId).toBe(100) // Final identity is the terminal
  })

  it('falls back to Global if Branch and Terminal settings are missing', async () => {
    const globalSettings = { terminalId: 0, orPrintTitle: 'Global Title', isPartialPrint: 0 }

    const mockRepo = {
      findOneBy: vi.fn().mockImplementation((criteria: any) => {
        if (criteria.terminalId === 0) return Promise.resolve(globalSettings)
        return Promise.resolve(null)
      })
    }

    vi.spyOn(service as any, 'repository', 'get').mockReturnValue(mockRepo)
    vi.spyOn(service as any, 'getTerminalBranchId').mockResolvedValue(10)

    const merged = await service.getMergedSettings(100)

    expect(merged.orPrintTitle).toBe('Global Title')
    expect(merged.isPartialPrint).toBe(0)
  })
})
