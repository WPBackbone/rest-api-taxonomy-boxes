<?php
/**
 * Hierarchical Taxonomies Panels Template.
 *
 * Category-like taxonomies uses two tab panels to show popular terms separately
 * from the full terms list.
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

		<ul id="{{ data.taxonomy.slug }}-tabs" class="category-tabs">
			<li class="tab tab-pop"><a href="#{{ data.taxonomy.slug }}-all" data-action="all">{{ data.labels.all_items }}</a></li>
			<li class="tab tab-all "><a href="#{{ data.taxonomy.slug }}-pop" data-action="pop">{{ data.labels.most_used }}</a></li>
		</ul>

		<div id="{{ data.taxonomy.slug }}-pop" class="tabs-panel panel-pop"></div>

		<div id="{{ data.taxonomy.slug }}-all" class="tabs-panel panel-all"></div>
