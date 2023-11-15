/**
 * Utilities for mocking the `useInstanceId()` hook.
 *
 * Site Kit by Google, Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * WordPress dependencies
 */
import { useMemoOne } from 'use-memo-one';
import { useInstanceId } from '@wordpress/compose';

/**
 * Creates a new ID for a given object.
 *
 * This uses a `Map` to track object instances, as opposed to the `WeakMap` used in the original `useInstanceId()` from @wordpress/compose.
 * Using a regular `Map` to track objects will ensure they are not unpredictably garbage collected during tests, which can cause the
 * generated instance IDs to change, with resulting test failures.
 *
 * @since n.e.x.t
 *
 * @param {Map}    instanceMap Map of object instances to their current id.
 * @param {Object} object      Object reference to create an id for.
 * @return {number} The new id.
 */
function createID( instanceMap, object ) {
	const instances = instanceMap.get( object ) || 0;
	instanceMap.set( object, instances + 1 );

	return instances;
}

/**
 * Provides a unique instance ID.
 *
 * @since 1.107.0
 * @since n.e.x.t Updated to provide instance ID instead of memoized ID.
 *
 * @param {Map}    instanceMap Map of object instances to their current id.
 * @param {Object} object      Object reference to create an id for.
 * @param {string} prefix      Prefix for the unique id.
 * @return {string} The unique id.
 */
function useInstanceID( instanceMap, object, prefix = '' ) {
	return useMemoOne( () => {
		const id = createID( instanceMap, object );

		return prefix ? `${ prefix }-${ id }` : id;
	}, [ instanceMap, object, prefix ] );
}

// eslint-disable-next-line sitekit/jsdoc-tag-grouping
/**
 * Mocks the `useInstanceId()` hook.
 *
 * This is necessary to ensure that the instance IDs generated by the hook are predictable during tests.
 *
 * @since 1.107.0
 * @since n.e.x.t Updated to use `useInstanceID` and `instanceMap`.
 */
export function mockUseInstanceID() {
	const instanceMap = new Map();

	beforeAll( () => {
		// Note that `useInstanceId()` is a Jest spy, having been spied on in the global `@wordpress/compose` mock.
		useInstanceId.mockImplementation(
			useInstanceID.bind( null, instanceMap )
		);
	} );

	beforeEach( () => {
		// Clear the cached object instances before each test to ensure a clean run.
		instanceMap.clear();
	} );

	afterAll( () => {
		// Clear the cached object instances after all tests to avoid memory leaks.
		instanceMap.clear();
		useInstanceId.mockRestore();
	} );
}
