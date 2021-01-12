/**
 * CompatibilityChecks component tests.
 *
 * Site Kit by Google, Copyright 2020 Google LLC
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
 * Internal dependencies
 */
import CompatibilityChecks, { AMP_PROJECT_TEST_URL } from './CompatibilityChecks';
import { render, waitFor } from '../../../../tests/js/test-utils';
import { Fragment } from 'react';
import { muteFetch } from '../../../../tests/js/utils';

const compatibilityChildren = ( { complete, inProgressFeedback, CTAFeedback } ) => (
	<Fragment>
		{ CTAFeedback }
		{ complete }
		{ inProgressFeedback }
	</Fragment>
);

describe( 'CompatibilityChecks', () => {
	beforeEach( () => {
		// Mock global.location.hostname with value that won't throw error in first check.
		Object.defineProperty( global.window, 'location', {
			value: {
				hostname: 'validurl',
			},
			writable: true,
		} );
	} );

	it( 'should initially display "Checking Compatibility..." message', async () => {
		muteFetch( /^\/google-site-kit\/v1\/core\/site\/data\/setup-tag/ );
		muteFetch( /^\/google-site-kit\/v1\/core\/site\/data\/developer-plugin/ );
		muteFetch( { query: { tagverify: '1' } } );
		const { container } = render(
			<CompatibilityChecks>
				{ compatibilityChildren }
			</CompatibilityChecks>
		);

		expect( container ).toHaveTextContent( 'Checking Compatibility…' );
	} );

	it( 'should display "Your site may not be ready for Site Kit" if a check throws an error', async () => {
		// Mock request to setup-tag
		fetchMock.postOnce(
			/^\/google-site-kit\/v1\/core\/site\/data\/setup-tag/,
			{ body: {}, status: 500 }
		);

		// Mock request to develop-plugin when error is thrown.
		muteFetch( /^\/google-site-kit\/v1\/core\/site\/data\/developer-plugin/ );

		const { container } = render(
			<CompatibilityChecks>
				{ compatibilityChildren }
			</CompatibilityChecks>
		);

		await waitFor( () => {
			expect( fetchMock ).toHaveFetchedTimes( 2 );
		} );

		// Expect neither error nor incomplete text to be displayed.
		expect( container ).toHaveTextContent( 'Your site may not be ready for Site Kit' );
		expect( console ).toHaveErrored();
	} );

	it( 'should make API requests to "setup-checks, health-checks and AMP Project test URL', async () => {
		const token = 'test-token-value';

		// Mock request to setup-tag.
		fetchMock.postOnce(
			/^\/google-site-kit\/v1\/core\/site\/data\/setup-tag/,
			{ body: { token }, status: 200 }
		);

		// Mock request to health-checks.
		fetchMock.getOnce(
			/^\/google-site-kit\/v1\/core\/site\/data\/health-checks/,
			{ body: { checks: { googleAPI: { pass: true } } }, status: 200 }
		);

		// Mock request to AMP project.
		muteFetch( AMP_PROJECT_TEST_URL );

		// Mock getExistingTag request.
		fetchMock.get(
			{ query: { tagverify: '1' } },
			{
				body: `<html><head><meta name="googlesitekit-setup" content="${ token }"/></head><body></body>`,
				status: 200,
			}
		);

		render(
			<CompatibilityChecks>
				{ compatibilityChildren }
			</CompatibilityChecks>
		);

		await waitFor( () => {
			expect( fetchMock ).toHaveFetchedTimes( 4 );
		} );

		// Expect to have made requests to the setup-checks and health-checks endpoints and the AMP Project test URL.
		expect( fetchMock ).toHaveFetched( /^\/google-site-kit\/v1\/core\/site\/data\/setup-tag/ );
		expect( fetchMock ).toHaveFetched( /^\/google-site-kit\/v1\/core\/site\/data\/health-checks/ );
		expect( fetchMock ).toHaveFetched( AMP_PROJECT_TEST_URL );
	} );

	it( 'should not contain incomplete or error messages if checks are successful', async () => {
		const token = 'test-token-value';

		// Mock request to setup-tag.
		fetchMock.postOnce(
			/^\/google-site-kit\/v1\/core\/site\/data\/setup-tag/,
			{ body: { token }, status: 200 }
		);

		// Mock request to health-checks.
		fetchMock.getOnce(
			/^\/google-site-kit\/v1\/core\/site\/data\/health-checks/,
			{ body: { checks: { googleAPI: { pass: true } } }, status: 200 }
		);

		// Mock request to AMP project.
		muteFetch( AMP_PROJECT_TEST_URL );

		// Mock getExistingTag request
		fetchMock.get(
			{ query: { tagverify: '1' } },
			{
				body: `<html><head><meta name="googlesitekit-setup" content="${ token }"/></head><body></body>`,
				status: 200,
			}
		);

		const { container } = render(
			<CompatibilityChecks>
				{ compatibilityChildren }
			</CompatibilityChecks>
		);

		await waitFor( () => {
			expect( fetchMock ).toHaveFetchedTimes( 4 );
		} );

		// Expect neither error nor incomplete text to be displayed.
		expect( container ).not.toHaveTextContent( 'Your site may not be ready for Site Kit' );
		expect( container ).not.toHaveTextContent( 'Checking Compatibility…' );
	} );
} );
