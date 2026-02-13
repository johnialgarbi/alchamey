declare module 'products/ProductList' {
  import * as React from 'react';

  /** Feature flags passed from host to remote ProductList. Keep in sync with remote. */
  export interface ProductListFeatureFlags {
    showRatings?: boolean;
  }

  type Props = { featureFlags?: ProductListFeatureFlags };
  const Component: React.ComponentType<Props>;
  export default Component;
}
