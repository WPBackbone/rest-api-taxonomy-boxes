<?php
/**
 * REST API: \RestApiTaxBoxes\REST\Terms_Controller class.
 *
 * @package RestApiTaxBoxes\REST
 * @since 1.0.0
 */

namespace RestApiTaxBoxes\REST;

use WP_REST_Server;
use WP_REST_Terms_Controller;

/**
 * Class used to manage terms associated with a taxonomy via the REST API.
 *
 * Extends the Core WP_REST_Terms_Controller class to allow 0 value to 'number'
 * parameter to retrieve all existing terms. Overrides the registered routes for
 * terms and adjust the get_items() method to avoid division by zero when using
 * number=0.
 *
 * @since 1.0.0
 *
 * @see WP_REST_Terms_Controller
 */
class Terms_Controller extends WP_REST_Terms_Controller {

	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * Identical to WP_REST_Terms_Controller::register_routes() except for
	 * the $override argument set to true to override routes.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @see register_rest_route()
	 */
	public function register_routes() {

		register_rest_route( $this->namespace, '/' . $this->rest_base, array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_items' ),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
				'args'                => $this->get_collection_params(),
			),
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'create_item' ),
				'permission_callback' => array( $this, 'create_item_permissions_check' ),
				'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::CREATABLE ),
			),
			'schema' => array( $this, 'get_public_item_schema' ),
		), true );

		register_rest_route( $this->namespace, '/' . $this->rest_base . '/(?P<id>[\d]+)', array(
			'args' => array(
				'id' => array(
					'description' => __( 'Unique identifier for the term.' ),
					'type'        => 'integer',
				),
			),
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_item' ),
				'permission_callback' => array( $this, 'get_item_permissions_check' ),
				'args'                => array(
					'context' => $this->get_context_param( array(
						'default' => 'view',
					) ),
				),
			),
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_item' ),
				'permission_callback' => array( $this, 'update_item_permissions_check' ),
				'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE ),
			),
			array(
				'methods'             => WP_REST_Server::DELETABLE,
				'callback'            => array( $this, 'delete_item' ),
				'permission_callback' => array( $this, 'delete_item_permissions_check' ),
				'args'                => array(
					'force' => array(
						'type'        => 'boolean',
						'default'     => false,
						'description' => __( 'Required to be true, as terms do not support trashing.' ),
					),
				),
			),
			'schema' => array( $this, 'get_public_item_schema' ),
		), true );
	}

	/**
	 * Retrieves terms associated with a taxonomy.
	 *
	 * Identical to WP_REST_Terms_Controller::get_items() except for the
	 * pagination handling, avoiding a division by zero when the 'number'
	 * parameter is set to 0 (retrieve all terms).
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {

		// Retrieve the list of registered collection query parameters.
		$registered = $this->get_collection_params();

		/*
		 * This array defines mappings between public API query parameters whose
		 * values are accepted as-passed, and their internal WP_Query parameter
		 * name equivalents (some are the same). Only values which are also
		 * present in $registered will be set.
		 */
		$parameter_mappings = array(
			'exclude'    => 'exclude',
			'include'    => 'include',
			'order'      => 'order',
			'orderby'    => 'orderby',
			'post'       => 'post',
			'hide_empty' => 'hide_empty',
			'per_page'   => 'number',
			'search'     => 'search',
			'slug'       => 'slug',
		);

		$prepared_args = array();

		/*
		 * For each known parameter which is both registered and present in the request,
		 * set the parameter's value on the query $prepared_args.
		 */
		foreach ( $parameter_mappings as $api_param => $wp_param ) {
			if ( isset( $registered[ $api_param ], $request[ $api_param ] ) ) {
				$prepared_args[ $wp_param ] = $request[ $api_param ];
			}
		}

		if ( isset( $registered['offset'] ) && ! empty( $request['offset'] ) ) {
			$prepared_args['offset'] = $request['offset'];
		} else {
			$prepared_args['offset'] = ( $request['page'] - 1 ) * $prepared_args['number'];
		}

		$taxonomy_obj = get_taxonomy( $this->taxonomy );

		if ( $taxonomy_obj->hierarchical && isset( $registered['parent'], $request['parent'] ) ) {
			if ( 0 === $request['parent'] ) {
				// Only query top-level terms.
				$prepared_args['parent'] = 0;
			} else {
				if ( $request['parent'] ) {
					$prepared_args['parent'] = $request['parent'];
				}
			}
		}

		/**
		 * Filters the query arguments before passing them to get_terms().
		 *
		 * The dynamic portion of the hook name, `$this->taxonomy`, refers to the taxonomy slug.
		 *
		 * Enables adding extra arguments or setting defaults for a terms
		 * collection request.
		 *
		 * @since 4.7.0
		 *
		 * @link https://developer.wordpress.org/reference/functions/get_terms/
		 *
		 * @param array $prepared_args Array of arguments to be passed to get_terms().
		 * @param WP_REST_Request $request The current request.
		 */
		$prepared_args = apply_filters( "rest_{$this->taxonomy}_query", $prepared_args, $request );

		if ( ! empty( $prepared_args['post'] ) ) {
			$query_result = wp_get_object_terms( $prepared_args['post'], $this->taxonomy, $prepared_args );

			// Used when calling wp_count_terms() below.
			$prepared_args['object_ids'] = $prepared_args['post'];
		} else {
			$query_result = get_terms( $this->taxonomy, $prepared_args );
		}

		$count_args = $prepared_args;

		unset( $count_args['number'], $count_args['offset'] );

		$total_terms = wp_count_terms( $this->taxonomy, $count_args );

		// wp_count_terms can return a falsy value when the term has no children.
		if ( ! $total_terms ) {
			$total_terms = 0;
		}

		$response = array();

		foreach ( $query_result as $term ) {
			$data = $this->prepare_item_for_response( $term, $request );
			$response[] = $this->prepare_response_for_collection( $data );
		}

		$response = rest_ensure_response( $response );

		// Store pagination values for headers.
		if ( 0 < $prepared_args['number'] ) {
			$per_page  = (int) $prepared_args['number'];
			$page      = ceil( ( ( (int) $prepared_args['offset'] ) / $per_page ) + 1 );
			$max_pages = ceil( $total_terms / $per_page );
		} else {
			$page = 1;
			$max_pages = 1;
		}

		$response->header( 'X-WP-Total', (int) $total_terms );
		$response->header( 'X-WP-TotalPages', (int) $max_pages );

		$base = add_query_arg( $request->get_query_params(), rest_url( $this->namespace . '/' . $this->rest_base ) );
		if ( $page > 1 ) {
			$prev_page = $page - 1;

			if ( $prev_page > $max_pages ) {
				$prev_page = $max_pages;
			}

			$prev_link = add_query_arg( 'page', $prev_page, $base );
			$response->link_header( 'prev', $prev_link );
		}
		if ( $max_pages > $page ) {
			$next_page = $page + 1;
			$next_link = add_query_arg( 'page', $next_page, $base );

			$response->link_header( 'next', $next_link );
		}

		return $response;
	}

}
