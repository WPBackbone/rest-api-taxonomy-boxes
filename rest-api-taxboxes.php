<?php
/**
 * REST API TaxBoxes
 *
 * @package     RestApiTaxBoxes
 * @author      Charlie Merland
 * @copyright   2016 Charlie Merland
 * @license     GPL-3.0+
 *
 * @wordpress-plugin
 * Plugin Name: REST API TaxBoxes
 * Plugin URI:  https://wordpress.org/rest-api-taxboxes
 * Description: Update the default WordPress TaxBoxes to use Backbone and the REST API.
 * Version:     1.0.0
 * Author:      Charlie Merland
 * Author URI:  https://www.caercam.org
 * Text Domain: rest-api-taxboxes
 * License:     GPL-3.0+
 * License URI: http://www.gnu.org/licenses/gpl-3.0.txt
 */

namespace RestApiTaxBoxes;

define( 'RATB_VERSION', '1.0.0' );

require_once plugin_dir_path( __FILE__ ) . 'includes/rest/class-terms-controller.php';
require_once plugin_dir_path( __FILE__ ) . 'admin/class-taxboxes.php';

add_action( 'plugins_loaded', '\RestApiTaxBoxes\run' );

/**
 * Let the fun begin.
 */
function run() {

	$taxboxes = new Admin\TaxBoxes();
	$taxboxes->run();
}
