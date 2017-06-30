<?php
/**
 * Hierarchical Taxonomies Terms list Template.
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
 *     @type    array     popular List of popular term models.
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

			<input name="tax_input[{{ data.taxonomy.slug }}][]" value="0" type="hidden">
			<ul id="{{ data.taxonomy.slug }}checklist" class="categorychecklist form-no-clear">
				<# _.each( data.terms, function( term ) { #>
				<li id="{{ data.taxonomy.slug }}-{{ term.id || '' }}" class="<# if ( _.contains( data.popular, term.id ) ) { #>popular-category<# } #>"><label class="selectit"><input value="{{ term.id || '' }}" name="tax_input[{{ data.taxonomy.slug }}][]" id="in-{{ data.taxonomy.slug }}-{{ term.id || '' }}" type="checkbox"<# if ( _.contains( data.selected, term.id ) ) { #> checked="true"<# } #>> {{ term.name || '' }}</label></li>
				<# } ); #>
			</ul>
