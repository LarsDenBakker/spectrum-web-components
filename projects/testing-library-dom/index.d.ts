// TypeScript Version: 2.8
import { getQueriesForElement } from '@testing-library/dom/typings/get-queries-for-element';
import * as queries from '@testing-library/dom/typings/queries';
import * as queryHelpers from '@testing-library/dom/typings/query-helpers';

declare const within: typeof getQueriesForElement;
export { queries, queryHelpers, within };

export * from '@testing-library/dom/typings/queries';
export * from '@testing-library/dom/typings/query-helpers';
export * from '@testing-library/dom/typings/wait';
export * from '@testing-library/dom/typings/wait-for-dom-change';
export * from '@testing-library/dom/typings/wait-for-element';
export * from '@testing-library/dom/typings/wait-for-element-to-be-removed';
export * from '@testing-library/dom/typings/matches';
export * from '@testing-library/dom/typings/get-node-text';
export * from '@testing-library/dom/typings/events';
export * from '@testing-library/dom/typings/get-queries-for-element';
export * from '@testing-library/dom/typings/pretty-dom';
export * from '@testing-library/dom/typings/config';
