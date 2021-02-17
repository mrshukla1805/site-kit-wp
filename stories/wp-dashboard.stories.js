/**
 * WP Dashboard Stories.
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
 * External dependencies
 */
import { storiesOf } from '@storybook/react';

/**
 * Internal dependencies
 */
import GoogleLogoIcon from '../assets/svg/logo-g.svg';
import SiteKitLogoIcon from '../assets/svg/logo-sitekit.svg';
import WPDashboardApp from '../assets/js/components/wp-dashboard/WPDashboardApp';
import { CORE_SITE } from '../assets/js/googlesitekit/datastore/site/constants';
import { CORE_USER } from '../assets/js/googlesitekit/datastore/user/constants';
import { CORE_MODULES } from '../assets/js/googlesitekit/modules/datastore/constants';
import {
	wpDashboardPopularPagesArgs,
	wpDashboardPopularPagesData,
	wpDashboardSessionDurationArgs,
	wpDashboardSessionDurationData,
	wpDashboardUniqueVisitorsArgs,
	wpDashboardUniqueVisitorsData,
} from '../assets/js/modules/analytics/datastore/__fixtures__';
import {
	wpDashboardClicksArgs,
	wpDashboardClicksData,
	wpDashboardImpressionsArgs,
	wpDashboardImpressionsData,
} from '../assets/js/modules/search-console/datastore/__fixtures__';
import { MODULES_ANALYTICS } from '../assets/js/modules/analytics/datastore/constants';
import { WithTestRegistry } from '../tests/js/utils';
import { MODULES_SEARCH_CONSOLE } from '../assets/js/modules/search-console/datastore/constants';

storiesOf( 'WordPress', module )
	.add( 'WordPress Dashboard', () => {
		const setupRegistry = ( { dispatch } ) => {
			dispatch( CORE_SITE ).receiveSiteInfo( {
				usingProxy: true,
				referenceSiteURL: 'https://example.com',
				adminURL: 'https://example.com/wp-admin/',
				siteName: 'My Site Name',
			} );
			dispatch( CORE_USER ).receiveGetAuthentication( {
				authenticated: true,
				requiredScopes: [],
				grantedScopes: [],
			} );
			dispatch( CORE_MODULES ).receiveGetModules( [
				{
					slug: 'analytics',
					active: true,
					connected: true,
				},
				{
					slug: 'search-console',
					active: true,
					connected: true,
				},
			] );
			dispatch( CORE_USER ).setReferenceDate( '2021-01-23' );

			// For <WPDashboardUniqueVisitors />
			dispatch( MODULES_ANALYTICS ).receiveGetReport( wpDashboardUniqueVisitorsData, { options: wpDashboardUniqueVisitorsArgs } );
			dispatch( MODULES_ANALYTICS ).finishResolution( 'getReport', [ wpDashboardUniqueVisitorsArgs ] );

			// For <WPDashboardSessionDuration />
			dispatch( MODULES_ANALYTICS ).receiveGetReport( wpDashboardSessionDurationData, { options: wpDashboardSessionDurationArgs } );
			dispatch( MODULES_ANALYTICS ).finishResolution( 'getReport', [ wpDashboardSessionDurationArgs ] );

			// For <WPDashboardImpressions />
			dispatch( MODULES_SEARCH_CONSOLE ).receiveGetReport( wpDashboardImpressionsData, { options: wpDashboardImpressionsArgs } );

			// For <WPDashboardClicks />
			dispatch( MODULES_SEARCH_CONSOLE ).receiveGetReport( wpDashboardClicksData, { options: wpDashboardClicksArgs } );

			// For <WPDashboardPopularPages />
			dispatch( MODULES_ANALYTICS ).receiveGetReport( wpDashboardPopularPagesData, { options: wpDashboardPopularPagesArgs } );
			dispatch( MODULES_ANALYTICS ).finishResolution( 'getReport', [ wpDashboardPopularPagesArgs ] );
		};

		return (
			<div id="dashboard-widgets">
				<div className="metabox-holder">
					<div id="google_dashboard_widget" className="postbox">
						<h2 className="hndle ui-sortable-handle">
							<span><span className="googlesitekit-logo googlesitekit-logo--mini">
								<GoogleLogoIcon height="19" width="19" />
								<SiteKitLogoIcon height="17" width="78" />
							</span></span>
						</h2>
						<div className="inside">
							<div id="js-googlesitekit-wp-dashboard">
								<WithTestRegistry callback={ setupRegistry }>
									<WPDashboardApp />
								</WithTestRegistry>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}, {
		options: {
			readySelector: '.googlesitekit-data-block',
			delay: 2000, // Wait for table overlay to animate.
		},
	} );
