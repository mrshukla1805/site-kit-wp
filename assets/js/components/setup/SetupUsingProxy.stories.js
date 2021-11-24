/**
 * SetupUsingProxy Component Stories.
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
import SetupUsingProxy from './SetupUsingProxy';
import {
	CORE_USER,
	DISCONNECTED_REASON_CONNECTED_URL_MISMATCH,
} from '../../googlesitekit/datastore/user/constants';
import {
	provideSiteConnection,
	provideUserAuthentication,
	provideModules,
} from '../../../../tests/js/utils';
import WithRegistrySetup from '../../../../tests/js/WithRegistrySetup';

const Template = () => <SetupUsingProxy />;

export const Start = Template.bind( {} );
Start.storyName = 'Start';

export const StartWithError = Template.bind( {} );
StartWithError.storyName = 'Start – with error';
StartWithError.args = {
	setupRegistry: ( registry ) => {
		provideSiteConnection( registry, {
			connected: false,
			hasConnectedAdmins: false,
		} );
	},
};

export const StartUserInput = Template.bind( {} );
StartUserInput.storyName = 'Start [User Input]';
StartUserInput.args = {
	setupRegistry: ( registry ) => {
		provideModules( registry, [
			{
				slug: 'analytics',
				active: true,
				connected: true,
			},
		] );
	},
};
StartUserInput.parameters = {
	features: [ 'serviceSetupV2', 'userInput' ],
};

export const StartUserInputError = Template.bind( {} );
StartUserInputError.storyName = 'Start – with error [User Input]';
StartUserInputError.args = {
	setupRegistry: ( registry ) => {
		provideSiteConnection( registry, {
			connected: false,
			hasConnectedAdmins: false,
		} );
		provideModules( registry, [
			{
				slug: 'analytics',
				active: true,
				connected: true,
			},
		] );
	},
};
StartUserInputError.parameters = {
	features: [ 'serviceSetupV2', 'userInput' ],
};

export const DisconnectedURLMismatch = Template.bind( {} );
DisconnectedURLMismatch.storyName = 'Disconnected - URL Mismatch';
DisconnectedURLMismatch.args = {
	setupRegistry: ( registry ) => {
		provideUserAuthentication( registry, {
			authenticated: false,
			disconnectedReason: DISCONNECTED_REASON_CONNECTED_URL_MISMATCH,
		} );
	},
};

export const DisconnectedURLMismatchUserInput = Template.bind( {} );
DisconnectedURLMismatchUserInput.storyName =
	'Disconnected - URL Mismatch [User Input]';
DisconnectedURLMismatchUserInput.args = {
	setupRegistry: ( registry ) => {
		provideUserAuthentication( registry, {
			authenticated: false,
			disconnectedReason: DISCONNECTED_REASON_CONNECTED_URL_MISMATCH,
		} );
		provideModules( registry, [
			{
				slug: 'analytics',
				active: true,
				connected: true,
			},
		] );
	},
};
DisconnectedURLMismatchUserInput.parameters = {
	features: [ 'serviceSetupV2', 'userInput' ],
};

export const AnalyticsActive = Template.bind( {} );
AnalyticsActive.storyName = 'Start - with Analytics Active';
AnalyticsActive.args = {
	setupRegistry: ( registry ) => {
		provideModules( registry, [
			{
				slug: 'analytics',
				active: true,
				connected: true,
			},
		] );
	},
};
AnalyticsActive.parameters = {
	features: [ 'serviceSetupV2' ],
};

export const AnalyticsInactive = Template.bind( {} );
AnalyticsInactive.storyName = 'Start - with Analytics Inactive';
AnalyticsInactive.parameters = {
	features: [ 'serviceSetupV2' ],
};

export default {
	title: 'Setup / Using Proxy',
	decorators: [
		( Story, { args } ) => {
			const setupRegistry = ( registry ) => {
				provideSiteConnection( registry, {
					hasConnectedAdmins: false,
				} );

				registry
					.dispatch( CORE_USER )
					.receiveGetTracking( { enabled: false } );

				// Call story-specific setup.
				if ( typeof args?.setupRegistry === 'function' ) {
					args.setupRegistry( registry );
				}
			};

			return (
				<WithRegistrySetup func={ setupRegistry }>
					<Story />
				</WithRegistrySetup>
			);
		},
	],
	parameters: { padding: 0 },
};