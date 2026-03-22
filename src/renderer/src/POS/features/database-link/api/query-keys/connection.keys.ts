export const connectionKeys = {
  all: ['connections'] as const,
  lists: () => [...connectionKeys.all, 'list'] as const,
  list: (filters: string) => [...connectionKeys.lists(), { filters }] as const,
  details: () => [...connectionKeys.all, 'detail'] as const,
  detail: (id: string) => [...connectionKeys.details(), id] as const
}

