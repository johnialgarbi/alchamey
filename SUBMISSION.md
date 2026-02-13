## Micro-frontend with Module Federation

**Host** (`apps/host`) and **remote** (`apps/remote-products`) are both Vite apps using `@module-federation/vite`.

**Remote setup**  
The remote exposes a single federated entry: `./ProductList` points to `ProductListFederated.tsx`. That component wraps the real `ProductList` with Redux `Provider` and the remote’s Chakra `theme`, so the host can drop it in without caring about store or theme. The remote’s Vite config also defines an `api-products` plugin: in dev it handles `GET /api/products` and returns the same mock data (from `src/api/mockProducts.ts`) so the host can proxy to it and get JSON instead of HTML.

**Host setup**  
The host declares the remote in `vite.config.ts` (`products` → `http://localhost:3002/remoteEntry.js`) and lazy-loads the component with `const ProductList = lazy(() => import('products/ProductList'))`. It renders it inside `MainContainer` with `Suspense` and passes `featureFlags` (e.g. `{ showRatings: true }`). So the host only knows “products/ProductList” and the props; it doesn’t touch Redux or the remote theme. To avoid the “Expected JSON but got HTML” issue, the host proxies `/api` to the remote (`proxy: { '/api': { target: 'http://localhost:3002', changeOrigin: true } }`), so `fetch('/api/products')` from the host page hits the remote’s dev API. The host also adds top padding to the main content (`MainContainer pt="72px"`) so the fixed header doesn’t cover the filter bar.

**Shared deps**  
React, React-DOM, Chakra, and Emotion are marked as shared singletons in both configs so there’s a single copy at runtime and no “invalid hook” or style mismatches from duplicate libs.

**Summary**  
Remote exposes one ready-to-use ProductList (with its own Redux + theme). Host loads it via Module Federation, passes feature flags, and proxies `/api` to the remote so the list can load products. Layout and padding on the host make sure the filter is visible below the fixed nav.

---

## Choices, decisions & approach

- **Chakra UI** – Used as the main component library so we get accessible, themeable components and a consistent look without writing a lot of custom CSS. Fits well with the remote’s need to ship its own theme.
- **Redux Toolkit** – Central place for product list state (products + filter). Keeps filter/search/sort logic in one slice and makes it easy to add RTK Query for the API.
- **RTK Query** – Handles fetching products, caching, and loading/error state. One hook (`useGetProductsQuery`) in the UI; the rest is in the API slice.
- **Reusable components** – Built small, focused components (filter, tabs, select, product card, layout wrappers) so the main ProductList stays simple and pieces can be tested or reused.
- **Custom theme** – Defined breakpoints and a color palette so the app looks consistent and responsive without hardcoding pixels everywhere.

---

## Chakra UI & color schema

**Component library**  
Chakra UI is used for layout (`Box`, `Flex`, `Grid`), form controls (`Input`, `Tabs`, `Select`), feedback (`Spinner`, `Button`), and images. Components accept the theme’s tokens (e.g. `color="gray.50"`, `bg="blue.50"`).

**Theme setup**  
Theme lives in `apps/remote-products/src/styles/`:

- **`theme.ts`** – Uses Chakra’s `createSystem` and `defaultConfig`. It wires in custom breakpoints, colors, and recipes (e.g. for inputs and buttons).
- **`themeColors.ts`** – Defines the palette: e.g. `gray`, `blue`, `green`, `orange`, `red` with shades (50, 100, 200, …). These are exposed as theme tokens so you can use `color="gray.50"` or `bg="blue.50"` in components.
- **Recipes** – `inputsRecipes` and `buttonRecipes` customise how Chakra’s input and button components look.

The remote wraps the app (and the federated ProductList) in `ChakraProvider` with this theme so the host doesn’t need to provide one. Tests use the same theme via `test-utils` so components render with the real styles.

---

## Reusable components (`apps/remote-products/src/components/`)

Components are split by responsibility and reused where it makes sense:

- **Layout** – `FlexRowContainer` (with variants like `FlexRowContainerSpaceBetween`, `FlexRowContainerCentered`) and `FlexColumnContainer` wrap Chakra `Flex` and standardise spacing/alignment. Used in the filter bar and product cards.
- **Filter UI** – `ProductsFilter` composes category tabs, search, and sort. It uses `SegmentedTabs` for categories, Chakra `Input` for search (with a debounced hook), and `SelectInput` for “Sort by”.
- **SegmentedTabs** – Wraps Chakra `Tabs` with a fixed API (`items`, `value`/`defaultValue`, `onValueChange`). Handles controlled/uncontrolled and supports responsive wrapping.
- **SelectInput** – Custom select built from Chakra `Select.Root` and list collection. Handles options, clear, loading state, and is used for sort.
- **ProductItem** – One product card: image, tag, name, description, price, rating (optional), add-to-cart. Uses `Tag`, `RateElement`, `Typography`, and layout components.
- **Typography** – Shared text styles so headings and body copy stay consistent.
- **Tag**, **RateElement** – Small presentational bits used inside ProductItem.

The idea: keep each file doing one thing, use composition in `ProductsFilter` and `ProductList`, and rely on Chakra + theme for visuals.

---

## Redux Toolkit for state management

Product list state lives in a single slice: **`productsListSlice`**.

- **State shape** – `products` (array from the API) and `filter` (search, category, sortByPrice, visibleCount).
- **Actions** – `setProducts` (filled from RTK Query result) and `setFilter` (updates one or more filter fields; partial updates so we don’t wipe the rest).
- **Usage** – `ProductList` uses `useGetProductsQuery()` and then `dispatch(setProducts(products))` when data arrives. Filter changes (search, category, sort, “Load more”) all go through `setFilter`. The UI reads state with `useAppSelector` and the selectors below.

So: RTK Query = “get list from API”; slice = “store list + filter and drive what’s visible”.

---

## Selectors (`productsListSlice`)

Selectors are in the same file as the slice and use `createSelector` so we only recompute when inputs change.

- **`selectFilteredAndSortedProducts`** – Takes raw products and current filter; filters by search (case-insensitive name) and category, then sorts by price (asc/desc) if `sortByPrice` is set. Returns the full filtered+sorted array.
- **`selectVisibleProducts`** – Slices that array with `filter.visibleCount` for “Load more” pagination.
- **`selectHasMoreProducts`** – True when there are more items after the visible slice (for showing/hiding the “Load more” button).
- **`selectCategories`** – Derives the category list from products (unique categories plus `"all"`) for the filter tabs.

All of these take `RootState` and are used with `useAppSelector(selectVisibleProducts)` etc. Keeping filtering and sorting in selectors keeps the reducer simple and makes the logic easy to unit test.

---

## RTK Query & API slice (`apiSlice.ts`)

**What it does**  
`createApi` defines one endpoint: `getProducts`, which fetches the product list. The hook `useGetProductsQuery()` returns `{ data, error, isLoading }`. When data loads, the app dispatches `setProducts(data)` so the rest of the UI uses the same Redux state and selectors.

**Why the request is implemented this way**

- **Custom `baseQuery`** – We don’t use `fetchBaseQuery` out of the box. In dev, the host proxies `/api` to the remote; sometimes the first response can be HTML (e.g. dev server shell) instead of JSON. So the custom base query:
  - Tries the request and checks `Content-Type`. If it’s not JSON, it retries a few times with a short delay (e.g. 3 attempts, 600 ms apart) so we can get a real JSON response after the dev server is ready.
  - Uses `credentials: 'include'` and a JSON content-type header so it behaves like a normal API client.
- **Single endpoint** – Products are loaded in one call (`/api/products`). No per-product or per-category endpoints; filtering and sorting are done client-side with the selectors above.
- **Tags** – The endpoint provides tags so RTK Query can invalidate or refetch if we add mutations later. For now it’s mainly for consistency and future use.

So in simple terms: we use a custom fetch that retries when the server returns HTML instead of JSON (to handle dev proxy quirks), then we cache the result with RTK Query and feed it into the products slice.

---

## Responsive design & breakpoints

Breakpoints are set in the theme (`theme.ts`): **sm 480px**, **md 768px**, **lg 1024px**, **xl 1200px**. Components use Chakra’s responsive props (object syntax), e.g. `{{ base: '…', md: '…', lg: '…' }}`.

- **Product grid** – 1 column on mobile, 2 from `sm`, 3 from `lg`, 4 from `xl` (`templateColumns`).
- **Filter bar** – Stacks vertically on small screens (`flexDirection: column`), then horizontal from `lg`. Gap and alignment switch at `base` vs `lg`.
- **Search + Sort** – Full width on mobile, then fixed widths from `sm` (e.g. search 250px, sort 180px). They sit in a row from `sm`.
- **Category tabs** – Wrap on small screens (`flexWrap: wrap`), then a single row from `lg`; tab flex is “half width minus gap” on base and “auto” on `lg`.
- **Spacing** – Padding and gaps (e.g. on main container, grid, product card) increase from `base` to `md`/`lg` so it doesn’t feel cramped on large screens.

So: one set of breakpoints in the theme, and each component uses them where layout or size needs to change.

---

## Unit testing

Tests use **Vitest** and **React Testing Library**. The idea is to test behaviour and structure, not implementation details.

- **Test setup** – `test-utils.tsx` provides a custom `render` that wraps the tree in Redux `Provider` and Chakra `ChakraProvider` with the real theme, so components get the same context as in the app.
- **ProductsFilter** – Renders with mock categories; we check that category tabs and the search input (by label) and the “Sort by” combobox are present.
- **SegmentedTabs** – Renders tabs and checks labels; one test clicks a tab and asserts the selected state (e.g. `aria-selected`).
- **ProductItem** – Renders with a mock product; checks name, price, category, image (with alt), and add-to-cart button and its accessible label. One test mocks `showToastr` and asserts it’s called when the button is clicked.
- **productsListSlice** – Reducer tests for `setProducts` and `setFilter` (including partial merge). Selector tests with a small mock state: filter by search/category, sort asc/desc, visible slice, “has more”, and categories list.

No E2E or API tests in this doc; focus is on components and slice logic.

---

## Optimization, rendering, performance & semantic HTML

- **Memo** – `ProductItem` is wrapped in `memo()` so we don’t re-render every card when the parent list re-renders; only when its `product` (or `showRatings`) changes.
- **Selectors** – `createSelector` (and using the same selector references in `useAppSelector`) avoids recomputing filtered/sorted lists when the underlying state hasn’t changed.
- **Callbacks** – Handlers that are passed down (e.g. filter change, load more) are wrapped in `useCallback` where it matters to avoid unnecessary re-renders of children.
- **Debounced search** – Search input uses a debounced hook so we don’t dispatch and recompute on every keystroke; see “Debounced input hook” below.
- **Images** – Product images use `loading="lazy"` and `decoding="async"` so they don’t block initial paint.
- **Semantic HTML** – Main product list is a `Grid` with `as="ul"` and each item is `Box as="li"`. Filter area is `as="section"` with `aria-label="Filter products"`. Main content is `as="main"` with `aria-label="Product list"`. Buttons and inputs have clear labels (e.g. `aria-label` for search and add-to-cart). So we get list structure and landmarks that work with assistive tech.

---

## Debounced input hook (`useDebouncedInput.ts`)

Search would fire a Redux update on every keypress, which would re-run selectors and re-render the list a lot. So we debounce: the input value updates immediately (so typing feels instant), but the “real” value that drives the filter is only sent after the user pauses.

- **API** – `useDebouncedInput(initialValue, onChange, delay)` (default delay 300 ms). Returns `{ value, onChange }` so you can use it like a controlled input: `value={searchInput.value}` and `onChange={(e) => searchInput.onChange(e.target.value)}`.
- **Behaviour** – On each change we reset a timer; when the timer fires we call `onChange` (which in our case dispatches `setFilter({ search: value })`). If `initialValue` is updated from outside (e.g. reset filter), the hook syncs its internal value and clears any pending timer.
- **Cleanup** – Refs hold the latest `onChange` and the timeout; the timeout is cleared on unmount and when `initialValue` changes so we don’t leak or call stale callbacks.

So: same UX as a normal input, but fewer Redux updates and less work while the user is still typing.