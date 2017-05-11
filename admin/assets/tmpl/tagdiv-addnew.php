<?php
/**
 * Non-Hierarchical Taxonomies 'Add-New' Form Template.
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
 *     @type    object    labels Taxonomy labels.
 *
 * }
 */
?>

		<div class="nojs-tags hidden">
			<label for="tax-input-{{ data.taxonomy.slug }}">{{ data.labels.add_or_remove_items }}</label>
			<textarea id="tax-input-{{ data.taxonomy.slug }}" name="tax_input[{{ data.taxonomy.slug }}]" class="the-tags" rows="3" cols="20">{{ _.pluck( data.terms, 'name' ).toString() }}</textarea>
		</div>
		<div class="ajaxtag">
			<label class="screen-reader-text" for="new-tag-{{ data.taxonomy.slug }}">{{ data.labels.add_new_item }}</label>
			<p><input type="text" id="new-tag-{{ data.taxonomy.slug }}" name="newtag[{{ data.taxonomy.slug }}]" class="newtag form-input-tip ui-autocomplete-input" size="16" autocomplete="off" value="" /><input type="button" class="button tagadd" value="{{ data.labels.add }}" /></p>
		</div>
		<p class="howto" id="new-tag-{{ data.taxonomy.slug }}-desc">{{ data.labels.separate_items_with_commas }}</p>
