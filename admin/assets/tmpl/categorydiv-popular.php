<?php
/**
 * Hierarchical Taxonomies Popular Terms list Template.
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
 *     @type    array     selected List of selected term models.
 *
 *     @type    object    labels Taxonomy labels.
 *
 * }
 *
 * @package RestApiTaxonomyBoxes
 */

?>

			<ul id="{{ data.taxonomy.slug }}checklist-pop" class="categorychecklist form-no-clear">
				<# _.each( data.terms || {}, function( term ) { #>
				<li id="popular-{{ data.taxonomy.slug }}-{{ term.id || '' }}" class="<# if ( _.contains( data.popular, term.id ) ) { #>popular-category<# } #>">
					<label class="selectit"><input id="in-popular-{{ data.taxonomy.slug }}-{{ term.id || '' }}" value="{{ term.id || '' }}" type="checkbox"<# if ( _.contains( data.selected, term.id ) ) { #> checked="true"<# } #>>{{ term.name || '' }}</label>
				</li>
				<# } ); #>
			</ul>
