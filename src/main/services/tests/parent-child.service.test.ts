import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock Electron
vi.mock('electron', () => ({
  ipcMain: {
    handle: vi.fn(),
    on: vi.fn()
  },
  app: {
    getPath: vi.fn(),
    on: vi.fn()
  },
  dialog: {
    showSaveDialog: vi.fn(),
    showOpenDialog: vi.fn()
  },
  shell: {
    openPath: vi.fn()
  }
}))

import { ParentChildService, } from '../parent-child.service'

import { ObjectLiteral } from 'typeorm'
import { AppDataSource } from '../../typeORM/configurations'

// Mock AppDataSource
vi.mock('../../typeORM/configurations', () => ({
  AppDataSource: {
    getRepository: vi.fn(),
    transaction: vi.fn()
  }
}))

// Mock Entity Classes
class ParentMock implements ObjectLiteral { id = 1; name = 'Parent' }
class ChildMock implements ObjectLiteral { id = 1; parentId = 1; name = 'Child' }

// Concrete Test Service
class TestService extends ParentChildService<ParentMock> {
  constructor() {
    super(ParentMock, [
      { entity: ChildMock, foreignKey: 'parentId', payloadKey: 'children' }
    ])
  }
}

describe('ParentChildService Sync Engine', () => {
  let service: TestService
  let mockManager: any
  let mockParentRepo: any
  let mockChildRepo: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Create detailed mock manager for transaction
    mockParentRepo = {
      save: vi.fn()
    }
    mockChildRepo = {
      find: vi.fn(),
      delete: vi.fn(),
      save: vi.fn()
    }

    mockManager = {
      getRepository: vi.fn((entity) => {
        if (entity === ParentMock) return mockParentRepo
        if (entity === ChildMock) return mockChildRepo
        return null
      })
    }

    ;(AppDataSource.transaction as any).mockImplementation((cb: any) => cb(mockManager))
    service = new TestService()
    
    // Mock audit
    vi.spyOn(service as any, 'audit').mockResolvedValue(undefined)
  })

  it('should save parent and synchronize children (Insert/Update/Remove)', async () => {
    // Stage existing data
    const existingChild = { id: 101, parentId: 1, name: 'Old Child' }
    mockChildRepo.find.mockResolvedValue([existingChild])
    
    // Stage parent save result
    mockParentRepo.save.mockResolvedValue({ id: 1, name: 'Updated Parent' })

    // Payload: Contains 1 updated child + 1 new child (Original child 101 is missing, should be removed)
    const payload = {
      parent: { id: 1, name: 'Updated Parent' },
      children: [
        { id: 101, name: 'Updated Child 101' }, // Update
        { name: 'New Child' } // Insert
      ]
    }

    mockChildRepo.save.mockResolvedValue([
      { id: 101, parentId: 1, name: 'Updated Child 101' },
      { id: 102, parentId: 1, name: 'New Child' }
    ])

    const result = await service.saveWithChildren(payload, 1)

    // Assertions
    expect(mockParentRepo.save).toHaveBeenCalledWith(payload.parent)
    expect(mockChildRepo.find).toHaveBeenCalled()
    expect(mockChildRepo.delete).not.toHaveBeenCalled() // Wait, both 101 and new were in payload
    // Wait, the logic is: missing from incomingChildIds means delete.
    // 101 was in incoming, so not deleted.
    
    expect(result.success).toBe(true)
    expect(result.insertedChildren).toBe(1)
    expect(result.updatedChildren).toBe(1)
  })

  it('should remove child if it is missing from payload', async () => {
     mockChildRepo.find.mockResolvedValue([{ id: 99, parentId: 1 }])
     mockParentRepo.save.mockResolvedValue({ id: 1 })
     
     const payload = {
       parent: { id: 1 },
       children: [] // Child 99 missing
     }
     
     mockChildRepo.save.mockResolvedValue([])

     const result = await service.saveWithChildren(payload, 1)
     
     expect(mockChildRepo.delete).toHaveBeenCalledWith([99])
     expect(result.removedChildren).toBe(1)
  })

  it('should rollback transaction if parent save fails', async () => {
    mockParentRepo.save.mockRejectedValue(new Error('DB Failure'))

    await expect(service.saveWithChildren({ parent: {}, children: [] }))
      .rejects.toThrow('DB Failure')
  })
})
