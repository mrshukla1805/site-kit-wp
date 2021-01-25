/**
 * Legacy Dashboard All Traffic component.
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
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Layout from '../../../../../components/layout/Layout';
import DashboardModuleHeader from '../../../../../components/dashboard/DashboardModuleHeader';
import DashboardAllTrafficWidget from '.';

function LegacyDashboardAllTraffic() {
	return (
		<Fragment>
			<div id="googlesitekit-pagespeed-header" className="
					mdc-layout-grid__cell
					mdc-layout-grid__cell--span-12
				">
				<DashboardModuleHeader
					title={ __( 'Your Traffic at a Glance', 'google-site-kit' ) }
					description={ __( 'How people found your site.', 'google-site-kit' ) }
				/>
			</div>
			<div className="
				mdc-layout-grid__cell
				mdc-layout-grid__cell--span-12
			">
				<Layout className="googlesitekit-pagespeed-widget">
					<DashboardAllTrafficWidget />
				</Layout>
			</div>
		</Fragment>
	);
}

export default LegacyDashboardAllTraffic;
