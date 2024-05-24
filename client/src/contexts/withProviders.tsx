import React from 'react';

/**
 * This function will render a component wrapped by context providers.
 * Example:
 *
 * withProviders(ProviderA, ProviderB)(Component)
 *  => will render =>
 *      <ProviderA>
 *        <ProviderB>
 *          <Component />
 *        </ProviderB>
 *      </ProviderA>
 */
export const withProviders =
  <P extends object>(...providers: React.ComponentType<any>[]) =>
  (Component: React.ComponentType<any>) =>
  (props: P): React.ReactNode => {
    return providers.reduceRight(
      (acc, provider) => {
        let Provider = provider;
        return <Provider>{acc}</Provider>;
      },
      <Component {...props} />,
    );
  };
