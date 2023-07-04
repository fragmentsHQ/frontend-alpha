import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  documents: ['src/**/*.graphql'],
  overwrite: true,
  generates: {
    './src/graphql/types_goerli.generated.ts': {
      schema:
        'https://api.studio.thegraph.com/query/47865/fragments-mumbai/v0.0.2',
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        withMutationFn: true,
      },
    },
    './src/graphql/types_polygon.generated.ts': {
      schema:
        'https://api.studio.thegraph.com/query/47865/fragments-graph/v0.0.1',
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        withMutationFn: true,
      },
    },
    // './src/graphql/hooks': {
    //   preset: 'near-operation-file',
    //   presetConfig: {
    //     extension: '.generated.tsx',
    //     baseTypesPath: '../types_goerli.generated.ts',
    //   },
    //   plugins: [
    //     'typescript',
    //     'typescript-operations',
    //     'typescript-react-apollo',
    //   ],
    //   config: {
    //     withHooks: true,
    //   },
    // },
    // './src/graphql_polygon/hooks': {
    //   preset: 'near-operation-file',
    //   presetConfig: {
    //     extension: '.generated.tsx',
    //     baseTypesPath: '../types_polygon.generated.ts',
    //   },
    //   plugins: [
    //     'typescript',
    //     'typescript-operations',
    //     'typescript-react-apollo',
    //   ],
    //   config: {
    //     withHooks: true,
    //   },
    // },
  },
};

export default config;
