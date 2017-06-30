<?php
/**
 * REST API Taxonomy Boxes
 *
 * @package     RestApiTaxonomyBoxes
 * @author      Talyes.in
 * @copyright   2017 Talyes.in
 * @license     GPL-3.0+
 *
 * @wordpress-plugin
 * Plugin Name: REST API Taxonomy Boxes
 * Plugin URI:  https://talyes.in/rest-api-taxonomy-boxes/
 * Description: Update the default WordPress Taxonomy Meta Boxes to use Backbone.js and the REST API.
 * Version:     1.1.0
 * Author:      Talyes.in
 * Author URI:  https://talyes.in/
 * Text Domain: rest-api-taxonomy-boxes
 * License:     GPL-3.0+
 * License URI: http://www.gnu.org/licenses/gpl-3.0.txt
 */

add_action( 'init', 'ratb_110', 9999 );

if ( ! function_exists( 'ratb_110' ) ) {
	/**
	 * Let the fun begin.
	 *
	 * @since 1.1.0
	 * @access public
	 */
	function ratb_110() {

		// Let's load!
		if ( ! defined( 'RATB_LOADED' ) ) {

			define( 'RATB_LOADED',   true );
			define( 'RATB_VERSION', '1.1.0' );

			require_once trailingslashit( plugin_dir_path( __FILE__ ) ) . 'includes/rest/class-terms-controller.php';
			require_once trailingslashit( plugin_dir_path( __FILE__ ) ) . 'admin/class-taxonomy-boxes.php';

			$ratb = new \RestApiTaxonomyBoxes\Admin\Taxonomy_Boxes();
			$ratb->run();
		}
	}
}
