<?php
/**
 * Class Google\Site_Kit\Tests\Core\Feature_Tours\REST_Feature_Tours_ControllerTest
 *
 * @package   Google\Site_Kit\Tests\Core\Feature_Tours
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Tests\Core\Feature_Tours;

use Google\Site_Kit\Context;
use Google\Site_Kit\Core\Feature_Tours\Dismissed_Tours;
use Google\Site_Kit\Core\Feature_Tours\REST_Feature_Tours_Controller;
use Google\Site_Kit\Core\Permissions\Permissions;
use Google\Site_Kit\Core\REST_API\REST_Routes;
use Google\Site_Kit\Core\Storage\User_Options;
use Google\Site_Kit\Tests\TestCase;
use WP_REST_Request;
use WP_REST_Response;

class REST_Feature_Tours_ControllerTest extends TestCase {

	public function tearDown() {
		parent::tearDown();
		// This ensures the REST server is initialized fresh for each test using it.
		unset( $GLOBALS['wp_rest_server'] );
	}

	public function test_register() {
		$context    = new Context( GOOGLESITEKIT_PLUGIN_MAIN_FILE );
		$controller = new REST_Feature_Tours_Controller( $context );
		remove_all_filters( 'googlesitekit_rest_routes' );
		remove_all_filters( 'googlesitekit_apifetch_preload_paths' );

		$controller->register();

		has_filter( 'googlesitekit_rest_routes' );
		has_filter( 'googlesitekit_apifetch_preload_paths' );
	}

	public function test_get_dismissed_tours() {
		$user_id = $this->factory()->user->create( array( 'role' => 'administrator' ) );
		wp_set_current_user( $user_id );
		$context      = new Context( GOOGLESITEKIT_PLUGIN_MAIN_FILE );
		$user_options = new User_Options( $context, $user_id );
		$controller   = new REST_Feature_Tours_Controller( $context, $user_options );
		remove_all_filters( 'googlesitekit_rest_routes' );
		$controller->register();

		( new Dismissed_Tours( $user_options ) )->add( 'feature_x', 'feature_y' );

		$this->register_rest_routes();

		$request = new WP_REST_Request( 'GET', '/' . REST_Routes::REST_ROOT . '/core/user/data/dismissed-tours' );

		$this->assertTrue( current_user_can( Permissions::SETUP ) );

		$response = rest_get_server()->dispatch( $request );
		/* @var WP_REST_Response $response Response instance. */

		$this->assertEqualSets(
			array( 'feature_x', 'feature_y' ),
			$response->get_data()
		);
	}

	public function test_post_dismiss_tour() {
		$user_id = $this->factory()->user->create( array( 'role' => 'administrator' ) );
		wp_set_current_user( $user_id );
		$context      = new Context( GOOGLESITEKIT_PLUGIN_MAIN_FILE );
		$user_options = new User_Options( $context, $user_id );
		$controller   = new REST_Feature_Tours_Controller( $context, $user_options );
		remove_all_filters( 'googlesitekit_rest_routes' );
		$controller->register();

		( new Dismissed_Tours( $user_options ) )->add( 'feature_x', 'feature_y' );

		$this->register_rest_routes();

		$request = new WP_REST_Request( 'POST', '/' . REST_Routes::REST_ROOT . '/core/user/data/dismiss-tour' );
		$request->set_body_params(
			array(
				'data' => array(), // no slug
			)
		);
		$this->assertTrue( current_user_can( Permissions::SETUP ) );
		$response = rest_get_server()->dispatch( $request );
		/* @var WP_REST_Response $response Response instance. */

		$this->assertEquals( 400, $response->get_status() );
		$this->assertEquals(
			'missing_required_param',
			$response->get_data()['code']
		);

		$request->set_body_params(
			array(
				'data' => array(
					'slug' => 'feature_z',
				),
			)
		);
		$response = rest_get_server()->dispatch( $request );

		$this->assertEquals( 200, $response->get_status() );
		$this->assertEqualSets(
			array( 'feature_x', 'feature_y', 'feature_z' ),
			$response->get_data()
		);
	}

	protected function register_rest_routes() {
		$routes = apply_filters( 'googlesitekit_rest_routes', array() );
		$this->assertNotEmpty( $routes );

		// Avoid test failing due to "_doing_it_wrong" notice.
		// Routes must be registered on `rest_api_init` action.
		add_action(
			'rest_api_init',
			function () use ( $routes ) {
				foreach ( $routes as $route ) {
					$route->register();
				}
			}
		);
		// Trigger the action.
		rest_get_server();

		return $routes;
	}
}