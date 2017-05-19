=== REST API Taxonomy Boxes ===
Contributors: talyesin
Tags: rest api, taxonomies, dashboard
Requires at least: 4.7
Tested up to: 4.7.5
Stable tag: 1.1.0
License: GPLv3 or later
License URI: http://www.gnu.org/licenses/gpl-3.0.html

Update the default WordPress Taxonomy Meta Boxes to use Backbone.js and the REST API.

== Description ==

RATB is a plugin serving two purpose: offering new features to extend the usage of taxonomies meta boxes by plugins, and showcasing the power the WordPress REST API and Backbone.js REST client.

= How It Works =

RATB is a plugin meant to make it easy to use the REST API with taxonomies meta boxes using the Backbone.js client. Through extensive use of the combined REST API and Backbone.js client to interact with the API RATB basically replace the default taxonomies meta boxes with a Backbone.js powered set of views replicating the original meta boxes contents.

RATB provides a JavaScript API to easily manage terms programmatically: create and delete terms, save terms collections, reload meta boxes... More information can be found on the [official website](https://talyes.in/rest-api-taxonomy-boxes/).

= TL;DR =

1. Replace the default WordPress Taxonomy Meta Boxes with Backbone.js views
2. Use the Backbone.js Client and REST API to manipulate terms.

== Installation ==

= Using The WordPress Dashboard =

1. Navigate to the 'Add New' Plugin Dashboard
2. Select `rest-api-taxonomy-boxes.zip` from your computer
3. Upload
4. Activate the plugin on the WordPress Plugin Dashboard

= Using FTP =

1. Extract `rest-api-taxonomy-boxes.zip` to your computer
2. Upload the `rest-api-taxonomy-boxes.zip` directory to your `wp-content/plugins` directory
3. Activate the plugin on the WordPress Plugins Dashboard

== Screenshots ==


== Frequently Asked Questions ==


== Upgrade Notice == 


== Changelog ==

= 1.1 =
* Make plugin embeddable.
* Fix hierarchical taxonomies refresh.
* Fix hierarchical taxonomies meta boxes tabs CSS.

= 1.0 =
* First release.
