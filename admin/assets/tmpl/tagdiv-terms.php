<?php
/**
 * Non-Hierarchical Taxonomies Terms list Template.
 *
 * @since 1.0.0
 *
 * @param object data {
 *
 *     Object containing the template's required data.
 *
 *     @type    array     terms List of term models.
 *
 * }
 *
 * @package RestApiTaxonomyBoxes
 */

?>

<# _.each( data.terms, function( term, index ) { #>
		<span><button type="button" id="post_tag-check-num-{{ index }}" class="ntdelbutton" data-term-id="{{ term.id }}"><span class="remove-tag-icon" aria-hidden="true"></span><span class="screen-reader-text">{{ tagsSuggestL10n.removeTerm }}{{ term.name }}</span></button>&nbsp;{{ term.name }}</span>
<# } ); #>
