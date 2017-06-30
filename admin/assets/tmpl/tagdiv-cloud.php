<?php
/**
 * Non-Hierarchical Taxonomies TagCloud Template.
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

		<button type="button" id="link-{{ data.taxonomy.slug }}" class="button-link tagcloud-link">{{ data.labels.choose_from_most_used }}</button>
		<div id="tagcloud-{{ data.taxonomy.slug }}" class="the-tagcloud hidden">
<#
if ( data.terms.length ) {
	_.each( data.terms, function( term, index ) { #>
			<a href="#" data-term-id="{{ term.id }}" class="tag-link tag-link-{{ term.id }} tag-link-position-{{ index }}" title="<# if ( 1 <= term.count ) { #>{{ term.count + ' ' + data.labels.n_topic }}<# } else { #>{{ term.count + ' ' + data.labels.n_topics }}<# } #>" style="font-size: {{ term.fontSize }};">{{ term.name }}</a>
<#
	} );
} else {
#>
			<p>{{ data.labels.no_terms }}</p>
<# } #>
		</div>
