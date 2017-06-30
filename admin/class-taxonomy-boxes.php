<?php
/**
 * TaxonomyBoxes: \RestApiTaxonomyBoxes\TaxonomyBoxes class.
 *
 * @package RestApiTaxonomyBoxes\Admin
 * @since   1.0.0
 */

namespace RestApiTaxonomyBoxes\Admin;

use WP_REST_Server;
use RestApiTaxonomyBoxes\REST;

/**
 * Replace the core taxonomies meta boxes to use Backbone REST API client.
 *
 * Also override the default REST API routes for taxonomies and filter the query
 * arguments and collection parameters.
 *
 * @since 1.0.0
 * @access public
 */
final class Taxonomy_Boxes {

	/**
	 * Initialize.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function init() {

		$this->register_hooks();
	}

	/**
	 * Register actions and filters.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function register_hooks() {

		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_styles' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'localize_scripts' ) );

		add_action( 'admin_footer-post.php',     array( $this, 'print_templates' ) );
		add_action( 'admin_footer-post-new.php', array( $this, 'print_templates' ) );

		add_action( 'rest_api_init', array( $this, 'register_routes' ), 99 );

		add_action( 'registered_taxonomy', array( $this, 'registered_taxonomy' ), 99 );

		// Only supported public, rest-enabled taxonomies.
		$taxonomies = get_taxonomies( array(
			'public'       => true,
			'show_in_rest' => true,
		) );

		foreach ( $taxonomies as $taxonomy ) {
			add_filter( "rest_{$taxonomy}_collection_params", array( $this, 'rest_taxonomy_collection_params' ), 10, 2 );
			add_filter( "rest_{$taxonomy}_query",             array( $this, 'rest_taxonomy_query' ), 10, 2 );
		}
	}

	/**
	 * Register the required styles.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function register_styles() {

		$path = plugin_dir_url( __FILE__ );

		wp_register_style( 'ratb', $path . 'assets/css/ratb.css', array(), RATB_VERSION, 'all' );
	}

	/**
	 * Enqueue admin styles.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param string $hook_suffix The current admin page.
	 */
	public function enqueue_styles( $hook_suffix ) {

		$this->register_styles();

		if ( 'post.php' === $hook_suffix || 'post-new.php' === $hook_suffix ) {
			wp_enqueue_style( 'ratb' );
		}
	}

	/**
	 * Register the required scripts.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function register_scripts() {

		$path = plugin_dir_url( __FILE__ );

		wp_register_script( 'ratb', $path . 'assets/js/ratb.js', array( 'jquery', 'wp-backbone', 'wp-api' ), RATB_VERSION, true );
	}

	/**
	 * Enqueue admin scripts.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param string $hook_suffix The current admin page.
	 */
	public function enqueue_scripts( $hook_suffix ) {

		$this->register_scripts();

		if ( 'post.php' === $hook_suffix || 'post-new.php' === $hook_suffix ) {
			wp_enqueue_script( 'ratb' );
		}
	}

	/**
	 * Localize scripts.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param string $hook_suffix The current admin page.
	 */
	public function localize_scripts( $hook_suffix ) {

		if ( 'post.php' === $hook_suffix || 'post-new.php' === $hook_suffix ) {

			$labels = array(
				'add'       => __( 'Add' ),
				'most_used' => __( 'Most Used' ),
				'topic'     => __( 'topic' ),
				'topics'    => __( 'topics' ),
			);

			$taxonomies = get_object_taxonomies( get_post_type(), 'objects' );
			foreach ( $taxonomies as $taxonomy => $taxonomy_object ) {
				$labels[ $taxonomy ] = $taxonomy_object->labels;
			}

			wp_localize_script( 'ratb', 'ratbLabelsL10n', $labels );
		}
	}

	/**
	 * Print a JavaScript templates.
	 *
	 * The template slug must match the template's filename without the
	 * extension.
	 *
	 * @since 1.0.0
	 * @access private
	 *
	 * @param string $template_id Template slug.
	 */
	private function print_template( $template_id ) {

		$template = plugin_dir_path( __FILE__ ) . "assets/tmpl/{$template_id}.php";
		if ( ! file_exists( $template ) ) {
			return false;
		}

		ob_start();
?>
		<script type="text/html" id="tmpl-<?php echo esc_attr( $template_id ); ?>">

<?php
		require $template;
?>

		</script>
<?php
	}

	/**
	 * Print the required JavaScript templates.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function print_templates() {

		$this->print_template( 'categorydiv-panels' );
		$this->print_template( 'categorydiv-terms' );
		$this->print_template( 'categorydiv-popular' );
		$this->print_template( 'categorydiv-addnew' );
		$this->print_template( 'categorydiv' );

		$this->print_template( 'tagdiv-addnew' );
		$this->print_template( 'tagdiv-terms' );
		$this->print_template( 'tagdiv-cloud' );
		$this->print_template( 'tagdiv' );
	}

	/**
	 * Replace each taxonomy REST Controller class with an updated
	 * Controller class.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function register_routes() {

		$taxonomies = get_taxonomies( array(
			'public' => true,
			'show_in_rest' => true,
		) );

		foreach ( $taxonomies as $taxonomy ) {
			$controller = new REST\Terms_Controller( $taxonomy );
			$controller->register_routes();
		}
	}

	/**
	 * Filter registered taxonomies to replace defaults metaboxes.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param string $taxonomy Taxonomy slug.
	 */
	public function registered_taxonomy( $taxonomy ) {

		if ( ! taxonomy_exists( $taxonomy ) ) {
			return false;
		}

		global $wp_taxonomies;

		$taxonomy_object = $wp_taxonomies[ $taxonomy ];
		if ( ! isset( $taxonomy_object->meta_box_cb ) ) {
			return false;
		}

		if ( 'post_categories_meta_box' === $taxonomy_object->meta_box_cb ) {
			$taxonomy_object->meta_box_cb = array( $this, 'post_categories_meta_box' );
		} elseif ( 'post_tags_meta_box' === $taxonomy_object->meta_box_cb ) {
			$taxonomy_object->meta_box_cb = array( $this, 'post_tags_meta_box' );
		}

		$wp_taxonomies[ $taxonomy ] = $taxonomy_object;
	}

	/**
	 * Replace the default hierarchical taxonomies metabox.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param WP_Post $post Post object.
	 * @param array   $box Categories meta box arguments.
	 */
	public function post_categories_meta_box( $post, $box ) {

		$defaults = array(
			'taxonomy' => 'category',
		);

		if ( ! isset( $box['args'] ) || ! is_array( $box['args'] ) ) {
			$args = array();
		} else {
			$args = $box['args'];
		}

		$r = wp_parse_args( $args, $defaults );
		$tax_name = esc_attr( $r['taxonomy'] );
		$taxonomy = get_taxonomy( $r['taxonomy'] );
		$popular_ids = wp_popular_terms_checklist( $tax_name, 0, 10, false );
?>
	<div id="taxonomy-<?php echo $tax_name; ?>" class="categorydiv">
		<div class="hide-if-js">
			<ul id="<?php echo $tax_name; ?>-tabs" class="category-tabs">
				<li class="tabs"><a href="#<?php echo $tax_name; ?>-all"><?php echo $taxonomy->labels->all_items; ?></a></li>
				<li class="hide-if-no-js"><a href="#<?php echo $tax_name; ?>-pop"><?php _e( 'Most Used' ); ?></a></li>
			</ul>

			<div id="<?php echo $tax_name; ?>-all" class="tabs-panel">
				<?php
				$name = ( $tax_name === 'category' ) ? 'post_category' : 'tax_input[' . $tax_name . ']';
				echo "<input type='hidden' name='{$name}[]' value='0' />"; // Allows for an empty term set to be sent. 0 is an invalid Term ID and will be ignored by empty() checks.
				?>
				<ul id="<?php echo $tax_name; ?>checklist" data-wp-lists="list:<?php echo $tax_name; ?>" class="categorychecklist form-no-clear">
					<?php wp_terms_checklist( $post->ID, array(
						'taxonomy' => $tax_name,
						'popular_cats' => $popular_ids,
					) ); ?>
				</ul>
			</div>
		</div>
	</div>
<?php
	}

	/**
	 * Replace the default non-hierarchical taxonomies metabox.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param WP_Post $post Post object.
	 * @param array   $box Tags meta box arguments.
	 */
	public function post_tags_meta_box( $post, $box ) {

		$defaults = array(
			'taxonomy' => 'post_tag',
		);

		if ( ! isset( $box['args'] ) || ! is_array( $box['args'] ) ) {
			$args = array();
		} else {
			$args = $box['args'];
		}

		$r = wp_parse_args( $args, $defaults );
		$tax_name = esc_attr( $r['taxonomy'] );
		$taxonomy = get_taxonomy( $r['taxonomy'] );
		$user_can_assign_terms = current_user_can( $taxonomy->cap->assign_terms );
		$comma = _x( ',', 'tag delimiter' );

		$terms_to_edit = get_terms_to_edit( $post->ID, $tax_name );
		if ( ! is_string( $terms_to_edit ) ) {
			$terms_to_edit = '';
		}
?>
	<div class="tagsdiv" id="<?php echo $tax_name; ?>">
		<div class="hide-if-js">
			<div class="nojs-tags">
				<label for="tax-input-<?php echo $tax_name; ?>"><?php echo $taxonomy->labels->add_or_remove_items; ?></label>
				<p><textarea name="<?php echo "tax_input[$tax_name]"; ?>" rows="3" cols="20" class="the-tags" id="tax-input-<?php echo $tax_name; ?>" <?php disabled( ! $user_can_assign_terms ); ?> aria-describedby="new-tag-<?php echo $tax_name; ?>-desc"><?php echo str_replace( ',', $comma . ' ', $terms_to_edit ); // textarea_escaped by esc_attr() ?></textarea></p>
			</div>
			<p class="howto" id="new-tag-<?php echo $tax_name; ?>-desc"><?php echo $taxonomy->labels->separate_items_with_commas; ?></p>
		</div>
	</div>
<?php
	}

	/**
	 * Filter collection parameters for the terms controller.
	 *
	 * Allow minimum int(0) value for number parameters to return all existing
	 * terms. The default parameters only allow a minimum of one to be returned
	 * and we need to bypass that to generate a proper tagbox.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param array       $query_params JSON Schema-formatted collection parameters.
	 * @param WP_Taxonomy $taxonomy Taxonomy object.
	 *
	 * @return array $query_params Filtered query parameters.
	 */
	public function rest_taxonomy_collection_params( $query_params, $taxonomy ) {

		if ( ! empty( $query_params['per_page']['minimum'] ) ) {
			$query_params['per_page']['minimum'] = 0;
		}

		return $query_params;
	}

	/**
	 * Filters the taxonomy query arguments.
	 *
	 * If int(0) is set as number parameters, adjust arguments to query all
	 * existing terms.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param array           $prepared_args Array of arguments to be passed to get_terms().
	 * @param WP_REST_Request $request       The current request.
	 *
	 * @return array
	 */
	public function rest_taxonomy_query( $prepared_args, $request ) {

		$number = absint( $request['number'] );
		if ( 0 === $number ) {
			$prepared_args['offset'] = 0;
			$prepared_args['number'] = 0;
		}

		return $prepared_args;
	}

	/**
	 * Run Forrest, run!
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function run() {

		$this->init();
	}
}
