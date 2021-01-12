/**
 * LegacySearchConsoleDashboardWidgetKeywordTable component.
 *
 * Site Kit by Google, Copyright 2019 Google LLC
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
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import {
	getTimeInSeconds,
	numFmt,
	untrailingslashit,
} from '../../../../util';
import withData from '../../../../components/higherorder/withData';
import { TYPE_MODULES } from '../../../../components/data';
import { getDataTableFromData } from '../../../../components/data-table';
import PreviewTable from '../../../../components/PreviewTable';
import { STORE_NAME } from '../../datastore/constants';
import { STORE_NAME as CORE_SITE } from '../../../../googlesitekit/datastore/site/constants';
import { getCurrentDateRangeDayCount } from '../../../../util/date-range';
import TableOverflowContainer from '../../../../components/TableOverflowContainer';
const { useSelect } = Data;

const LegacySearchConsoleDashboardWidgetKeywordTable = ( props ) => {
	const { data } = props;
	const domain = useSelect( ( select ) => select( STORE_NAME ).getPropertyID() );
	const url = useSelect( ( select ) => select( CORE_SITE ).getCurrentEntityURL() );
	const isDomainProperty = useSelect( ( select ) => select( STORE_NAME ).isDomainProperty() );
	const referenceSiteURL = useSelect( ( select ) => {
		return untrailingslashit( select( CORE_SITE ).getReferenceSiteURL() );
	} );
	const baseServiceURLArgs = {
		resource_id: domain,
		num_of_days: getCurrentDateRangeDayCount(),
	};
	if ( url ) {
		baseServiceURLArgs.page = `!${ url }`;
	} else if ( isDomainProperty && referenceSiteURL ) {
		baseServiceURLArgs.page = `*${ referenceSiteURL }`;
	}
	const baseServiceURL = useSelect( ( select ) => select( STORE_NAME ).getServiceURL(
		{
			path: '/performance/search-analytics',
			query: baseServiceURLArgs,
		}
	) );

	if ( ! data || ! data.length ) {
		return null;
	}

	const headers = [
		{
			title: __( 'Keyword', 'google-site-kit' ),
			tooltip: __( 'Most searched for keywords related to your content', 'google-site-kit' ),
			primary: true,
		},
		{
			title: __( 'Clicks', 'google-site-kit' ),
			tooltip: __( 'Number of times users clicked on your content in search results', 'google-site-kit' ),
		},
		{
			title: __( 'Impressions', 'google-site-kit' ),
			tooltip: __( 'Counted each time your content appears in search results', 'google-site-kit' ),
		},
	];
	const links = [];

	const dataMapped = data.map( ( row, i ) => {
		const query = row.keys[ 0 ];
		links[ i ] = addQueryArgs( baseServiceURL, { query: `!${ query }` } );
		return [
			query,
			numFmt( row.clicks, { style: 'decimal' } ),
			numFmt( row.impressions, { style: 'decimal' } ),
		];
	} );

	const options = {
		hideHeader: false,
		chartsEnabled: false,
		links,
	};

	const dataTable = getDataTableFromData( dataMapped, headers, options );

	return (
		<TableOverflowContainer>
			{ dataTable }
		</TableOverflowContainer>
	);
};

export default withData(
	LegacySearchConsoleDashboardWidgetKeywordTable,
	[
		{
			type: TYPE_MODULES,
			identifier: 'search-console',
			datapoint: 'searchanalytics',
			data: {
				url: global._googlesitekitLegacyData.permaLink,
				dimensions: 'query',
				limit: 10,
			},
			priority: 1,
			maxAge: getTimeInSeconds( 'day' ),
			context: [ 'Single', 'Dashboard' ],
		},
	],
	<PreviewTable padding />,
	{ createGrid: true },
	( returnedData ) => ! returnedData.length
);
