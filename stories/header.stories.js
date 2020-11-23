/**
 * Header stories.
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
 * External dependencies
 */
import { storiesOf } from '@storybook/react';

/**
 * Internal dependencies
 */
import Header from '../assets/js/components/Header';
import DateRangeSelector from '../assets/js/components/DateRangeSelector';
import { createTestRegistry, provideSiteInfo, provideUserAuthentication, WithTestRegistry } from '../tests/js/utils';

function Setup( props ) {
	return (
		<WithTestRegistry { ...props }>
			<Header>
				{ props.children }
			</Header>
		</WithTestRegistry>
	);
}

storiesOf( 'Global', module )
	.addDecorator( ( storyFn ) => {
		const registry = createTestRegistry();
		provideUserAuthentication( registry );
		provideSiteInfo( registry, {
			usingProxy: true,
			proxySetupURL: 'https://sitekit.withgoogle.com/site-management/setup/',
			proxyPermissionsURL: 'https://sitekit.withgoogle.com/site-management/permissions/',
			referenceSiteURL: 'http://example.com',
			siteName: 'My Site Name',
		} );

		return storyFn( registry );
	} )
	.add( 'Plugin Header', ( registry ) => {
		return (
			<Setup registry={ registry } />
		);
	} )
	.add( 'Plugin Header with Date Selector', ( registry ) => {
		return (
			<Setup registry={ registry }>
				<DateRangeSelector />
			</Setup>
		);
	} );
