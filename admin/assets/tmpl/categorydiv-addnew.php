<?php
/**
 * Hierarchical Taxonomies 'Add-New' Form Template.
 *
 * @since 1.0.0
 *
 * @param object data {
 *
 *     Object containing the template's required data.
 *
 *     @type    object    taxonomy {
 *
 *         Current Taxonomy data.
 *
 *         @type    string     description Taxonomy description.
 *
 *         @type    boolean    hierarchical Hierarchical or non-hierarchical taxonomy.
 *
 *         @type    string     name Taxonomy name.
 *
 *         @type    string     rest_base Taxonomy rest base.
 *
 *         @type    string     slug Taxonomy slug.
 *
 *         @type    array      types Taxonomy post types.
 *     }
 *
 *     @type    array     terms List of term models.
 *
 *     @type    object    labels Taxonomy labels.
 *
 * }
 *
 * @package RestApiTaxonomyBoxes
 */

?>

		<a id="{{ data.taxonomy.slug }}-add-toggle" href="#{{ data.taxonomy.slug }}-add" data-action="add-toggle" class="hide-if-no-js taxonomy-add-new">+ {{ data.labels.add_new_item }}</a>
		<p id="{{ data.taxonomy.slug }}-add" class="category-add wp-hidden-child">
			<label class="screen-reader-text" for="new{{ data.taxonomy.slug }}">{{ data.labels.add_new_item }}</label>
			<input name="new{{ data.taxonomy.slug }}" id="new{{ data.taxonomy.slug }}" class="form-required form-input-tip new-category" placeholder="{{ data.labels.new_item_name }}" aria-required="true" type="text">
			<label class="screen-reader-text" for="new{{ data.taxonomy.slug }}_parent">{{ data.labels.parent_item_colon }}</label>
			<select name="new{{ data.taxonomy.slug }}_parent" id="new{{ data.taxonomy.slug }}_parent" class="postform new-category-parent">
				<option value="-1">— {{ data.labels.parent_item }} —</option>
				<# _.each( data.terms, function( term ) { #>
				<option class="level-0" data-level="0" value="{{ term.id }}">{{ term.name }}</option>
				<# } ); #>
			</select>
			<input id="{{ data.taxonomy.slug }}-add-submit" class="button category-add-submit" value="{{ data.labels.add_new_item }}" type="button">
			<input id="_ajax_nonce-add-{{ data.taxonomy.slug }}" name="_ajax_nonce-add-{{ data.taxonomy.slug }}" value="" type="hidden">
			<span id="{{ data.taxonomy.slug }}-ajax-response"></span>
		</p>
