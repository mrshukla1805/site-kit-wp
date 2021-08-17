/**
 * ConfirmDisconnect Component Stories.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
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
import ConfirmDisconnect from './ConfirmDisconnect';
import { provideModules } from '../../../../../tests/js/utils';
import WithRegistrySetup from '../../../../../tests/js/WithRegistrySetup';
import { CORE_UI } from '../../../googlesitekit/datastore/ui/constants';

const Template = ( args ) => <ConfirmDisconnect { ...args } />;

export const ConfirmDisconnectWithFeatures = Template.bind( {} );
ConfirmDisconnectWithFeatures.storyName =
	'ConfirmDisconnect dialog with features';
ConfirmDisconnectWithFeatures.args = {
	slug: 'analytics',
};
ConfirmDisconnectWithFeatures.decorators = [
	( Story ) => {
		const setupRegistry = ( registry ) => {
			provideModules( registry, [
				{
					slug: 'analytics',
					active: true,
					connected: true,
					features: [
						'Audience overview',
						'Top pages',
						'Top acquisition channels',
					],
				},
			] );

			registry
				.dispatch( CORE_UI )
				.setValue( 'module-analytics-dialogActive', true );
		};

		return (
			<WithRegistrySetup func={ setupRegistry }>
				<Story />
			</WithRegistrySetup>
		);
	},
];

export const ConfirmDisconnectWithoutFeatures = Template.bind( {} );
ConfirmDisconnectWithoutFeatures.storyName =
	'ConfirmDisconnect dialog without features';
ConfirmDisconnectWithoutFeatures.args = {
	slug: 'third-party-module',
};
ConfirmDisconnectWithoutFeatures.decorators = [
	( Story ) => {
		const setupRegistry = ( registry ) => {
			provideModules( registry, [
				{
					slug: 'third-party-module',
					active: true,
					connected: true,
				},
			] );

			registry
				.dispatch( CORE_UI )
				.setValue( 'module-third-party-module-dialogActive', true );
		};

		return (
			<WithRegistrySetup func={ setupRegistry }>
				<Story />
			</WithRegistrySetup>
		);
	},
];

export default {
	title: 'Components/ConfirmDisconnect',
	component: ConfirmDisconnect,
};
