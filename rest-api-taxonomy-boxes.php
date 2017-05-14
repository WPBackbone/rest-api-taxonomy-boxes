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
 * Version:     1.0.0
 * Author:      Talyes.in
 * Author URI:  https://talyes.in/
 * Text Domain: rest-api-taxboxes
 * License:     GPL-3.0+
 * License URI: http://www.gnu.org/licenses/gpl-3.0.txt
 */

namespace RestApiTaxonomyBoxes;

define( 'RATB_VERSION', '1.0.0' );

require_once plugin_dir_path( __FILE__ ) . 'includes/rest/class-terms-controller.php';
require_once plugin_dir_path( __FILE__ ) . 'admin/class-taxonomy-boxes.php';

add_action( 'plugins_loaded', '\RestApiTaxonomyBoxes\run' );

/**
 * Let the fun begin.
 */
function run() {

	$taxboxes = new Admin\TaxonomyBoxes();
	$taxboxes->run();
}
