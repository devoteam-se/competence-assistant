# Client

The client is a React application using Typescript and Vite.

## Requirements

- [pnpm](https://pnpm.io/)
- [Node](https://nodejs.org/) v20 (LTS)

## Folder structure

```ts
.
└── src
    ├── @types // all global types
    ├── api // API abstractions
    ├── assets // icons and images
    ├── components
    ├── contexts // react contexts and providers
    ├── hocs // higher order components
    ├── hooks // custom hooks
    ├── pages // pages of the application. Should include index file with main route
    ├── styles // styles and theme
    └── utils // utility functions
```

## Mantine

The application uses [Mantine v6](https://mantine.dev/) component library, with the following packages

```ts
- @mantine/core // core components
- @mantine/dates // calendar and date input components
- @mantine/form // form handling
- @mantine/hooks
- @mantine/modals // modals management
- @mantine/notifications // notification service
```

### Modals

Modals are opened using `openModal` function in `utils/openModal`.

Example:

```tsx
import { openModal } from 'utils/openModal';

<Button
  onClick={() =>
    openModal({ title: 'title', children: <Text>Modal Content</Text> })
  }
/>;
```
