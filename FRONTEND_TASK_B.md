# Frontend Task B — Dashboard Data Thinking

## How would you wire one dashboard view to live APIs without rewriting the whole UI?

I would start with the main dashboard portfolio view. It already uses `userHoldings` in the Zustand store, mainly through `PortfolioOverview` and `AssetAllocationChart`.

I would add two API calls: one for the user's holdings and one for recent activity. The dashboard would load them when it opens, then save the results in Zustand. The current UI components could keep reading from the store, so their layout would not need to be rebuilt.

For example:

```text
GET /api/holdings
GET /api/activity?limit=20
```

The current refresh button in the Proof of Reserve view would call the same store action instead of using a timeout. Once live data is available, I would remove the simulated price and activity updates.

## Which components or store pieces would you change first?

First, I would update `lib/store.ts`.

I would keep the existing holdings and activity data, but add simple request state for each one:

```ts
loading: boolean
error: string | null
loadDashboardData: () => Promise<void>
```

Then I would add small API service functions next to the existing login API service.

After that, I would update:

- `components/portfolio-overview.tsx` to show live holdings.
- `components/asset-allocation-chart.tsx` because it uses the same holdings.
- `components/views/por-view.tsx` to show live reserve activity and make Refresh fetch data.

This keeps the current design and changes only where data comes from.

## How would you handle loading, empty, and error states?

While data is loading, I would show the existing skeleton/loading UI in the same cards instead of changing the page layout. The Refresh button should be disabled while a request is already running.

If a user has no holdings, I would show a clear message such as “No metal holdings yet.” If there is no activity, I would show “No recent activity.”

If a request fails, I would show a short error message and a Retry button. I would keep previously loaded data on screen where possible, instead of replacing the whole dashboard with an error page.

## How would you keep TypeScript types honest between API and UI?

I would define API response types separately from UI/store types. For example, the API may return timestamps as strings, while the existing UI uses `Date` objects. The API service should convert the response into the shape the UI expects before putting it in Zustand.

TypeScript does not validate real API responses at runtime. Before saving a response, I would validate that required fields exist and have the expected type. This project already has `zod`, so it can be used for runtime validation without adding a dependency.

I would also make sure protected dashboard requests use the same JWT strategy as login. The current project has a cookie and localStorage mismatch risk, so the frontend and backend need to agree on whether authentication uses a cookie or an Authorization header.
