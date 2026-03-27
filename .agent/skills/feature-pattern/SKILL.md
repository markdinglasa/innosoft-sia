---
name: feature-pattern
description: This document defines the standardized feature structure for the application.
origin: ECC
---

# Feature Pattern Reference

This document defines the standardized feature structure for the Landtrax application, based on the `src/features/staging` implementation.

## Directory Structure

A feature should be organized into the following structure:

```text
src/features/[feature]/
├── api/                # API hooks and query options
│   ├── index.ts        # Aggregated exports for API
│   ├── [CRUD].ts       # Individual API files (create, delete, get, etc.)
├── components/         # UI components
│   ├── [feature]-list.tsx
│   ├── [feature]-list-filter.tsx # Filter panel for lists
│   ├── [feature]-form-modal.tsx
│   ├── [feature]-form.tsx
│   └── [feature]-delete-modal.tsx
├── hooks/              # Feature-specific hooks
│   └── use-[feature]-filters.ts # URL-driven state management
├── index.ts            # Public API of the feature
└── types/              # (Optional) Feature-specific types
```

---

## URL-Driven Filtering (`hooks/`)

Features with lists should use URL search parameters for filter state. This ensures filters persist on refresh and navigation.

### Filter Hook Pattern (`use-[feature]-filters.ts`)

```typescript
// Example: src/features/staging/hooks/use-staging-filters.ts
export const useStagingFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const filters = {
    name: searchParams.get("name") || "",
    page: Number(searchParams.get("page")) || 1,
    // ...other filters
  };

  const setFilters = (newFilters: Partial<StagingFilters>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
      else params.delete(key);
    });
    router.push(`?${params.toString()}`);
  };

  return { filters, setFilters, clearFilters: () => router.push(window.location.pathname) };
};
```

---

## API Implementation (`api/`)

Each API operation lives in its own file and follows the `@tanstack/react-query` pattern.

### Query Pattern (`get-[feature]s.ts`)

Queries should provide `queryOptions` for prefetching and a custom hook.

```typescript
// Example: src/features/staging/api/get-stagings.ts
export const getStagings = async ({ page = 1, limit = 30, filters }: Params) => {
  const params = new URLSearchParams();
  if (filters?.name) params.append("name", filters.name);
  if (filters?.code) params.append("code", filters.code);
  return await api.get(`${ApiKey.STAGINGS}?${params}`);
};

export const getStagingsQueryOptions = (params: Params) => {
  return queryOptions({
    queryKey: [QueryKey.STAGINGS, params],
    queryFn: () => getStagings(params),
  });
};

export const useStagings = (options: UseStagingsOptions) => {
  return useQuery({
    ...getStagingsQueryOptions(options),
    ...options.queryConfig,
  });
};
```

### Mutation Pattern (`create-[feature].ts`)

Mutations should handle invalidation of relevant queries on success.

```typescript
// Example: src/features/staging/api/create-staging.ts
export const useCreateStaging = ({ mutationConfig }: UseCreateStagingOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.STAGINGS], // Invalidate all stagings
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createStaging,
  });
};
```

---

## Components (`components/`)

### 1. Filter Panel (`[feature]-list-filter.tsx`)
- Uses the custom filter hook to get/set state.
- Renders inputs, selects, and a "Clear Filters" button.
- Toggleable from the main list component.

### 2. List Component (`[feature]-list.tsx`)
- Integrates the filter hook and filter panel.
- Passes filters to the `use[Feature]s` hook.
- Manages local `searchInput` state for internal input tracking before applying to URL.

---

## SSR Hydration Pattern

Pages should prefetch the initial data on the server using `HydrationBoundary`.

```typescript
// Example: src/app/.../[feature]/page.tsx
export default async function Page({ searchParams }: { searchParams: Promise<Filters> }) {
  const queryParams = await searchParams;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    getFeaturesQueryOptions({
      page: queryParams.page ? Number(queryParams.page) : 1,
      filters: {
        name: queryParams.name || undefined,
        // ...other active filters from searchParams
      },
    })
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <FeatureClientSideComponent />
    </HydrationBoundary>
  );
}
```

---

## Entry Point (`index.ts`)

The `index.ts` in the feature root should only export what is necessary for other features or pages to consume.

```typescript
export * from "./api";
export * from "./hooks/use-[feature]-filters";
export * from "./components/[feature]-list";
export * from "./components/[feature]-list-filter";
export * from "./components/[feature]-form-modal";
```
