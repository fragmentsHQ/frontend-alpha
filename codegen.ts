import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  documents: ['src/**/*.graphql'],
  overwrite: true,
  generates: {
    './src/graphql/types_goerli.generated.ts': {
      schema:
        'https://api.studio.thegraph.com/proxy/18071/fragments/version/latest',
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
        'https://api.studio.thegraph.com/proxy/18071/fragments/version/latest',
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
