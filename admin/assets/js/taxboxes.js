/**
 * Build the TaxBoxes object.
 *
 * @since 1.0
 * @access public
 */

window.taxBoxes = window.taxBoxes || {};

( function( $ ) {

	/**
	 * Create a new taxonomy box object.
	 *
	 * @since 1.0
	 *
	 * @param {object} taxonomy Taxonomy model.
	 *
	 * @return {object} Taxonomy controller.
	 */
	var taxBox = function( taxonomy ) {

		var options = {
			taxonomy : taxonomy,
			post_id  : parseInt( document.querySelector( '#post_ID' ).value ) || ''
		};

		if ( taxonomy.hierarchical ) {

			el = document.querySelector( '#' + taxonomy.slug + 'div .inside' );

			controller = new taxBoxes.controller.categoryBox( options );

			view = new taxBoxes.view.category.Box({
				el         : el,
				controller : controller
			});

		} else {

			el = document.querySelector( '#tagsdiv-' + taxonomy.slug + ' .inside' );

			controller = new taxBoxes.controller.tagBox( options );

			view = new taxBoxes.view.tag.Box({
				el         : el,
				controller : controller
			});
		}

		this.taxonomy = taxonomy;
		this.controller = controller;
		this.view = view;

		return this;
	};

	/**
	 * Add a set of useful functions to prototype.
	 *
	 * @since 1.0
	 */
	_.extend( taxBox.prototype, {

		/**
		 * Retrieve a specific term.
		 *
		 * @since 1.0
		 *
		 * @param {int} term_id Term ID.
		 *
		 * @return {mixed}
		 */
		get : function( term_id ) {

			if ( this.controller.terms.has( term_id ) ) {
				return this.controller.terms.get( term_id );
			}

			return false;
		},

		/**
		 * Retrieve a specific term by its name or slug.
		 *
		 * @since 1.0
		 *
		 * @param {string} term Term name or slug.
		 *
		 * @return {mixed}
		 */
		find : function( term ) {

			var model = this.controller.terms.find( { name : term } );
			if ( ! _.isUndefined( model ) ) {
				return model;
			}

			model = this.controller.terms.find( { slug : term } );
			if ( ! _.isUndefined( model ) ) {
				return model;
			}

			return false;
		},

		/**
		 * Add a new term.
		 *
		 * @since 1.0
		 *
		 * @param {array|object} term Term data object or array of term data objects.
		 * @param {object} options Options.
		 *
		 * @return {object}
		 */
		add : function( term, options ) {

			return this.controller.terms.add( term, options );
		},

		/**
		 * Remove a specific term.
		 *
		 * @since 1.0
		 *
		 * @param {int} term_id Term ID.
		 * @param {object} options Options.
		 *
		 * @return {mixed}
		 */
		remove : function( term_id, options ) {

			if ( ! this.controller.terms.has( term_id ) ) {
				return false;
			}

			return this.controller.terms.remove( term_id, options );
		},

		/**
		 * Create a new term.
		 *
		 * @since 1.0
		 *
		 * @param {object} term Term data.
		 * @param {object} options Options.
		 *
		 * @return {mixed}
		 */
		create : function( term, options ) {

			var term = this.controller.createNewTerm( term ),
			 options = options || {};

			if ( ! options.silent ) {
				term.save().done( _.bind( function( model ) {
					return this.add( model );
				}, this ) );
			}

			return term;
		},

		/**
		 * Delete a specific term.
		 *
		 * @since 1.0
		 *
		 * @param {int} term_id Term ID.
		 * @param {object} options Options.
		 *
		 * @return {mixed}
		 */
		delete : function( term_id, options ) {

			if ( ! this.controller.terms.has( term_id ) ) {
				return false;
			}

			var term = this.controller.terms.get( term_id );

			// Required to delete terms.
			// See https://core.trac.wordpress.org/ticket/40672
			term.requireForceForDelete = true;

			return term.destroy();
		},

		/**
		 * Filter the list of terms.
		 *
		 * @since 1.0
		 *
		 * @param {object} options Filtering options.
		 *
		 * @return {array}
		 */
		filter : function( options ) {

			return this.controller.terms.filter( options );
		},

		/**
		 * Get the complete list of terms.
		 *
		 * @since 1.0
		 *
		 * @param {object} options Options.
		 *
		 * @return {array}
		 */
		getAll : function( options ) {

			return this.controller.terms.toArray();
		},

		/**
		 * Get the list of popular terms.
		 *
		 * @since 1.0
		 *
		 * @param {object} options Options.
		 *
		 * @return {array}
		 */
		getPopular : function( options ) {

			return this.controller.popular.toArray();
		},

		/**
		 * Get the list of selected terms.
		 *
		 * @since 1.0
		 *
		 * @param {object} options Options.
		 *
		 * @return {array}
		 */
		getSelection : function( options ) {

			return this.controller.selected.toArray();
		},

		/**
		 * Add term(s) to the selected terms list.
		 *
		 * @since 1.0
		 *
		 * @param {int|array} term Term ID, object or array of term objects.
		 * @param {object} options Options.
		 *
		 * @return {mixed}
		 */
		addToSelection : function( term, options ) {

			if ( _.isNumber( term ) ) {
				var term = this.controller.terms.get( term );
				if ( term ) {
					return this.controller.selected.add( term, options );
				}
			}

			if ( _.isArray( term ) ) {
				var terms = [];
				_.each( term, function( t ) {
					terms.push( this.addToSelection( t, options ) );
				}, this );

				return terms;
			}

			if ( _.isObject( term ) ) {
				return this.controller.selected.add( term, options );
			}

			return false;
		},

		/**
		 * Remove term(s) from the selected terms list.
		 *
		 * @since 1.0
		 *
		 * @param {int|array} term Term ID, object or array of term objects.
		 * @param {object} options Options.
		 *
		 * @return {mixed}
		 */
		removeFromSelection : function( term, options ) {

			if ( _.isNumber( term ) ) {
				if ( this.controller.selected.has( term ) ) {
					return this.controller.selected.remove( term, options );
				}
			}

			if ( _.isArray( term ) ) {
				var terms = [];
				_.each( term, function( t ) {
					terms.push( this.removeFromSelection( t, options ) );
				}, this );
				return terms;
			}

			if ( _.isObject( term ) ) {
				if ( term.id ) {
					return this.controller.selected.remove( term.id, options );
				}
			}

			return false;
		},

		/**
		 * Save the selected terms list.
		 *
		 * @since 1.0
		 *
		 * @param {object} options Options.
		 *
		 * @return {mixed}
		 */
		save : function( options ) {

			if ( ! taxBoxes.post ) {
				var modelClass = taxBoxes.utils.getApiModelClass( typenow || '' );
				if ( ! modelClass ) {
					return false;
				}

				taxBoxes.post = new modelClass({
					id : this.controller.get( 'post_id' )
				});
			}

			if ( 'category' === this.taxonomy.slug ) {
				taxBoxes.post.setCategoriesWithCollection( this.controller.selected );
			} else if ( 'post_tag' === this.taxonomy.slug ) {
				taxBoxes.post.setTagsWithCollection( this.controller.selected );
			}

			return this;
		},

		/**
		 * Empty the selected terms list.
		 *
		 * @since 1.0
		 *
		 * @param {object} options Options.
		 *
		 * @return {mixed}
		 */
		empty : function( options ) {

			return this.controller.selected.reset();
		},

		/**
		 * Reset the taxBox.
		 *
		 * @since 1.0
		 *
		 * @param {object} options Options.
		 *
		 * @return {mixed}
		 */
		reset : function( options ) {

			var taxonomy = _.clone( this.taxonomy );

			return taxBoxes.boxes[ taxonomy.slug ] = new taxBox( taxonomy );
		},

	} );

	/**
	 * TaxBoxes Wrapper.
	 *
	 * Store controllers, views and boxes objects.
	 *
	 * @since 1.0
	 */
	taxBoxes = {

		/**
		 * List of taxonomies boxes instance.
		 *
		 * This should not be used directly. Use taxBoxes.get()
		 * instead.
		 *
		 * @since 1.0
		 *
		 * @var object
		 */
		boxes : {},

		/**
		 * List of taxonomies controllers.
		 *
		 * @since 1.0
		 *
		 * @var object
		 */
		controller : {},

		/**
		 * List of taxonomies views.
		 *
		 * @since 1.0
		 *
		 * @var object
		 */
		view : {},

		/**
		 * TaxBoxes util functions.
		 *
		 * @since 1.0
		 *
		 * @var object
		 */
		utils : {

			/**
			 * Find a wp.api.models Class from a taxonomy
			 * slug.
			 *
			 * @since 1.0
			 *
			 * @param {string} slug Taxonomy Model slug.
			 *
			 * @return mixed
			 */
			getApiModelClass : function( slug ) {

				var className = wp.api.utils.capitalizeAndCamelCaseDashes( slug );

				if ( 'Post_tag' === className ) {
					className = 'Tag';
				}

				if ( _.has( wp.api.models, className ) ) {
					return wp.api.models[ className ];
				}

				return false;
			},

			/**
			 * Find a wp.api.collections Class from a taxonomy
			 * rest_base.
			 *
			 * @since 1.0
			 *
			 * @param {string} rest_base Taxonomy Collection rest_base.
			 *
			 * @return mixed Collection if any, false otherwise.
			 */
			getApiCollectionClass : function( rest_base ) {

				var className = wp.api.utils.capitalizeAndCamelCaseDashes( rest_base );

				if ( 'Post_tags' === className ) {
					className = 'Tags';
				}

				if ( _.has( wp.api.collections, className ) ) {
					return wp.api.collections[ className ];
				}

				return false;
			},

		},

		/**
		 * Retrieve a Taxonomy Controller.
		 *
		 * @since 1.0
		 *
		 * @param {string} taxonomy Taxonomy slug.
		 *
		 * @return {object} Taxonomy Controller.
		 */
		get : function( taxonomy ) {

			if ( ! _.has( this.boxes, taxonomy ) ) {
				return;
			}

			return this.boxes[ taxonomy ];
		},
	};

	/**
	 * Main Taxonomy Box Controller.
	 *
	 * @since 1.0
	 */
	taxBoxes.controller.taxonomyBox = Backbone.Model.extend({

		/**
		 * Let know we're ready to roll.
		 *
		 * Called after taxonomies were fetched and 'all'/'pop' collections
		 * were set.
		 *
		 * @since 1.0
		 *
		 * @return Returns itself to allow chaining.
		 */
		ready : function() {

			this.trigger( 'ready', this );
		},

		/**
		 * Set the required terms collections.
		 *
		 * @since 1.0
		 *
		 * @return Returns itself to allow chaining.
		 */
		setCollections : function() {

			var collectionClass = taxBoxes.utils.getApiCollectionClass( this.get( 'taxonomy' ).rest_base );
			if ( ! collectionClass ) {
				return;
			}

			this.terms    = new collectionClass( [], { comparator : 'name' } );
			this.selected = new collectionClass( [], { comparator : 'name' } );
			this.popular  = new collectionClass( [], { comparator : 'count' } );

			return this;
		},

		/**
		 * Fetch the terms.
		 *
		 * Once all terms are retrieved, populate the popular terms list.
		 *
		 * @since 1.0
		 *
		 * @param {object} options Query parameters.
		 *
		 * @return Returns itself to allow chaining.
		 */
		loadTerms : function( options ) {

			if ( ! this.terms ) {
				return;
			}

			var options = _.extend( options || {}, {
				data : {
					// Load all terms.
					number     : 0,
					// Including terms without any post.
					hide_empty : false
				}
			} );

			this.terms.fetch( options ).done(
				_.bind( this.ready, this )
			);

			return this;
		},

		/**
		 * Fetch the current Post terms.
		 *
		 * @since 1.0
		 *
		 * @param {object} options Query parameters.
		 *
		 * @return Returns itself to allow chaining.
		 */
		loadPostTerms : function( options ) {

			if ( ! this.selected ) {
				return;
			}

			var post_id = this.get( 'post_id' );
			this.selected.fetch( _.extend( options || {}, {
				data : {
					number : 0,
					post   : post_id
				}
			} ) );

			return this;
		},

		/**
		 * Set a Term as selected.
		 *
		 * @since 1.0
		 *
		 * @param {int} term_id Term ID.
		 *
		 * @return Returns itself to allow chaining.
		 */
		setSelected : function( term_id ) {

			var term = this.terms.get( term_id );
			if ( _.isUndefined( term ) ) {
				return this;
			}

			term.set( { selected : true } );

			this.selected.add( term );

			return this;
		},

		/**
		 * Remove a Term from the selected collection.
		 *
		 * @since 1.0
		 *
		 * @param {int} term_id Term ID.
		 *
		 * @return Returns itself to allow chaining.
		 */
		removeSelected : function( term_id ) {

			var term = this.terms.get( term_id );
			if ( _.isUndefined( term ) ) {
				return this;
			}

			term.unset( 'selected' );

			this.selected.remove( term );

			return this;
		},

		/**
		 * Create a new term.
		 *
		 * @since 1.0
		 *
		 * @param {object} term New Term.
		 *
		 * @return {object} term
		 */
		createNewTerm : function( term ) {

			var modelClass = taxBoxes.utils.getApiModelClass( this.get( 'taxonomy' ).slug );
			if ( ! modelClass ) {
				return;
			}

			var atts = { name : term.name };
			if ( _.has( modelClass.prototype.args, 'parent' ) ) {
				var parent = Math.max( 0, parseInt( term.parent ) ) || 0;
				if ( parent ) {
					atts.parent = parent;
				}
			}

			var term = new modelClass( atts );

			// Required if we want to properly delete terms.
			// @see https://core.trac.wordpress.org/ticket/40672.
			term.requireForceForDelete = true;

			return term;
		},

		/**
		 * Add a term to the collection.
		 *
		 * If a term already exists by that name, add it to the selected
		 * terms collection. If not, create a new term and add it to both
		 * collections.
		 *
		 * @since 1.0
		 *
		 * @param {object} model New Term Model.
		 *
		 * @return Returns itself to allow chaining.
		 */
		addTerm : function( model ) {

			if ( _.isEmpty( model.name ) ) {
				return this;
			}

			var term = this.terms.find( { name : model.name } );
			if ( _.isUndefined( term ) ) {
				term = this.createNewTerm( model );
				term.save().done( _.bind( function( term ) {
					this.terms.add( term, { silent : true } );
					this.setSelected( term.id );
				}, this ) );

			} else {
				this.setSelected( term.id );
			}

			return this;
		},

	});

	/**
	 * Hierarchical (Category-like) Taxonomies Controller.
	 *
	 * @since 1.0
	 */
	taxBoxes.controller.categoryBox = taxBoxes.controller.taxonomyBox.extend({

		/**
		 * Initialize the Controller.
		 *
		 * @since 1.0
		 *
		 * @param {object} attributes Controller parameters.
		 * @param {object} options Controller options.
		 */
		initialize : function( attributes, options ) {

			this.setCollections();

			this.loadTerms();
			this.loadPostTerms( { silent : true } );

			this.on( 'ready', this.setPopuparTerms, this );
		},

		/**
		 * Populate the popular terms list.
		 *
		 * @since 1.0
		 *
		 * @return Returns itself to allow chaining.
		 */
		setPopuparTerms : function() {

			if ( ! this.popular ) {
				return;
			}

			var terms = this.terms.sortBy( 'count' ).reverse();

			this.popular.add( _.map( terms.slice( 0, 10 ), function( term ) {
				term.set( { popular : true } );
				return term;
			} ) );

			return this;
		},

		/**
		 * Set a Term as selected, with context.
		 *
		 * @since 1.0
		 *
		 * @param {int} term_id Term ID.
		 * @param {string} context Context, 'all' or 'pop'.
		 *
		 * @return Returns itself to allow chaining.
		 */
		setSelected : function( term_id, context ) {

			var term = this.terms.get( term_id );
			if ( _.isUndefined( term ) ) {
				return this;
			}

			term.set( { selected : true } );

			this.selected.add( term, { context : context } );

			return this;
		},

		/**
		 * Remove a Term from the selected collection, with context.
		 *
		 * @since 1.0
		 *
		 * @param {int} term_id Term ID.
		 * @param {string} context Context, 'all' or 'pop'.
		 *
		 * @return Returns itself to allow chaining.
		 */
		removeSelected : function( term_id, context ) {

			var term = this.terms.get( term_id );
			if ( _.isUndefined( term ) ) {
				return this;
			}

			term.unset( 'selected' );

			this.selected.remove( term, { context : context } );

			return this;
		},

	});

	/**
	 * Non-hierarchical (Tag-like) Taxonomies Controller.
	 *
	 * @since 1.0
	 */
	taxBoxes.controller.tagBox = taxBoxes.controller.taxonomyBox.extend({

		/**
		 * Initialize the Controller.
		 *
		 * @since 1.0
		 *
		 * @param {object} attributes Controller parameters.
		 * @param {object} options Controller options.
		 */
		initialize : function( attributes, options ) {

			this.setCollections();

			this.loadTerms();
			this.loadPostTerms();

			this.on( 'ready', this.setPopuparTerms, this );
		},

		/**
		 * Set the required terms collections.
		 *
		 * @since 1.0
		 *
		 * @return Returns itself to allow chaining.
		 */
		setCollections : function() {

			taxBoxes.controller.taxonomyBox.prototype.setCollections.apply( this, arguments );

			this.selected.comparator = '';

			return this;
		},

		/**
		 * Fetch the current Post terms.
		 *
		 * @since 1.0
		 *
		 * @param  {object} options Query parameters.
		 *
		 * @return Returns itself to allow chaining.
		 */
		loadPostTerms : function( options ) {

			if ( ! this.selected ) {
				return;
			}

			var post_id = this.get( 'post_id' );

			this.selected.fetch( _.extend( options || {}, {
				data : {
					number : 0,
					post   : post_id
				}
			} ) );

			return this;
		},

		/**
		 * Populate the popular terms list.
		 *
		 * @since 1.0
		 *
		 * @return Returns itself to allow chaining.
		 */
		setPopuparTerms : function() {

			if ( ! this.popular ) {
				return;
			}

			var terms = this.terms.sortBy( 'count' ).reverse();

			this.popular.add( _.map( terms.slice( 0, 45 ), function( term ) {
				term.set( { popular : true } );
				return term;
			} ) );

			return this;
		},

	});

	/**
	 * Hierarchical (Category-like) Taxonomies main View.
	 *
	 * @since 1.0
	 */
	taxBoxes.view.category = {};

	/**
	 * All Terms Panel Subview.
	 *
	 * @since 1.0
	 */
	taxBoxes.view.category.Panel = wp.Backbone.View.extend({

		events : {
			'click input[type="checkbox"]' : 'setSelected'
		},

		slug : '',

		/**
		 * Initialize the View.
		 *
		 * @since 1.0
		 *
		 * @param {object} options View options.
		 */
		initialize : function( options ) {

			this.controller = options.controller;
			this.selected   = this.controller.selected;

			this.listenTo( this.selected, 'add remove', this.updateSelected );
		},

		/**
		 * Set a Term as (un)selected.
		 *
		 * @since 1.0
		 *
		 * @param {object} e 'click' Event.
		 *
		 * @return Returns itself to allow chaining.
		 */
		setSelected : function( e ) {

			var $input = this.$( e.currentTarget ),
			   checked = $input.is( ':checked' );

			if ( checked ) {
				this.controller.setSelected( $input.val(), this.slug );
			} else {
				this.controller.removeSelected( $input.val(), this.slug );
			}

			return this;
		},

		/**
		 * Update the View when a Term is (un)selected.
		 *
		 * The context -- 'all' vs. 'pop' terms -- is passed through
		 * the options parameter to avoid rendering both lists when
		 * only one should be.
		 *
		 * @since 1.0
		 *
		 * @param {object} model Term model.
		 * @param {object} collection Collection of selected terms.
		 * @param {object} options Options.
		 *
		 * @return Returns itself to allow chaining.
		 */
		updateSelected : function( model, collection, options ) {

			if ( this.slug !== options.context ) {
				this.render();
			}

			return this;
		},

		/**
		 * Prepare the View parameters.
		 *
		 * THe returned options will be passed to the template
		 * function prior to rendering.
		 *
		 * @since 1.0
		 *
		 * @param {object} options View options.
		 *
		 * @return {object} View parameters.
		 */
		prepare : function( options ) {

			var popular = this.collection.where( { popular : true } );

			var options = _.extend( this.views.parent.prepare() || {}, options || {}, {
				popular  : _.pluck( popular, 'id' ),
				selected : this.selected.pluck( 'id' ),
				terms    : this.collection.toJSON()
			} );

			return options;
		},

	});

	/**
	 * All Terms Panel Subview.
	 *
	 * @since 1.0
	 */
	taxBoxes.view.category.Terms = taxBoxes.view.category.Panel.extend({

		template : wp.template( 'categorydiv-terms' ),

		events : {
			'click input[type="checkbox"]' : 'setSelected'
		},

		slug : 'all',

		/**
		 * Initialize the View.
		 *
		 * @since 1.0
		 *
		 * @param {object} options View options.
		 */
		initialize : function( options ) {

			taxBoxes.view.category.Panel.prototype.initialize.apply( this, arguments );

			this.collection = this.controller.terms;

			this.listenTo( this.collection, 'update', this.render );
			this.listenTo( this.selected,   'update', this.render );
		},

		/**
		 * Hierarchize Terms List.
		 *
		 * Terms lists are rendered flat, without any indication
		 * of relation between parent and child terms. This loops
		 * through the child terms and set them as children of
		 * their parent terms by appending submenus to the list.
		 *
		 * @since 1.0
		 *
		 * @return Returns itself to allow chaining.
		 */
		hierarchize : function() {

			var children = this.collection.filter( function( term ) {
				return 0 !== term.get( 'parent' );
			} );

			_.each( children, function( child ) {

				if ( ! this.selected.has( child.get( 'parent' ) ) ) {

					var $item = this.$( '#category-' + child.get( 'id' ) ),
					$parent = this.$( '#category-' + child.get( 'parent' ) );

					if ( ! $parent.find( 'ul.children' ).length ) {
						$parent.append( '<ul class="children"></ul>' );
					}

					$parent.find( 'ul.children' ).append( $item );
				}

			}, this );

			return this;
		},

		/**
		 * Prioritize Terms List.
		 *
		 * Move all selected terms to the top of the list and
		 * remove the resulting empty children lists.
		 *
		 * @since 1.0
		 *
		 * @return Returns itself to allow chaining.
		 */
		prioritize : function() {

			var selected = _.clone( this.selected.models );
			_.each( selected.reverse(), function( term ) {

				var $item = this.$( '#category-' + term.get( 'id' ) ),
				    $list = this.$( '#categorychecklist' );

				$list.prepend( $item );

			}, this );

			var $sub = this.$( 'ul.children:empty' );
			_.each( $sub, function( menu ) {
				this.$( menu ).remove();
			}, this );

			return this;
		},

		/**
		 * Render the View.
		 *
		 * @since 1.0
		 *
		 * @return Returns itself to allow chaining.
		 */
		render : function() {

			wp.Backbone.View.prototype.render.apply( this, arguments );

			// Hierarchize the list.
			if ( this.collection.length ) {
				this.hierarchize();
				this.prioritize();
			}

			return this;
		},

	});

	/**
	 * Popular Terms Panel Subview.
	 *
	 * @since 1.0
	 */
	taxBoxes.view.category.Popular = taxBoxes.view.category.Panel.extend({

		template : wp.template( 'categorydiv-popular' ),

		events : {
			'click input[type="checkbox"]' : 'setSelected'
		},

		slug : 'pop',

		/**
		 * Initialize the View.
		 *
		 * @since 1.0
		 *
		 * @param {object} options View options.
		 */
		initialize : function( options ) {

			taxBoxes.view.category.Panel.prototype.initialize.apply( this, arguments );

			this.collection = this.controller.popular;

			this.listenTo( this.collection, 'update', this.render );
		},

		/**
		 * Prepare the View parameters.
		 *
		 * THe returned options will be passed to the template
		 * function prior to rendering.
		 *
		 * @since 1.0
		 *
		 * @param {object} options View options.
		 *
		 * @return {object} View parameters.
		 */
		prepare : function( options ) {

			var options = _.extend( this.views.parent.prepare() || {}, options || {}, {
				selected : this.selected.pluck( 'id' ),
				terms    : this.collection.toJSON()
			} );

			return options;
		},

	});

	/**
	 * Terms Panels Subview.
	 *
	 * @since 1.0
	 */
	taxBoxes.view.category.Panels = wp.Backbone.View.extend({

		className : 'category-panels all',

		template : wp.template( 'categorydiv-panels' ),

		events : {
			'click [data-action="all"]' : 'showAll',
			'click [data-action="pop"]' : 'showPopular',
		},

		/**
		 * Initialize the View.
		 *
		 * @since 1.0
		 *
		 * @param {object} options View options.
		 */
		initialize : function( options ) {

			this.controller = options.controller;

			this.setRegions();
		},

		/**
		 * Set the subviews.
		 *
		 * @since 1.0
		 *
		 * @return Returns itself to allow chaining.
		 */
		setRegions : function() {

			this.terms = new taxBoxes.view.category.Terms( { controller : this.controller } );
			this.popular = new taxBoxes.view.category.Popular( { controller : this.controller } );

			this.views.set( '.panel-all', this.terms );
			this.views.set( '.panel-pop', this.popular );

			return this;
		},

		/**
		 * Toggle the 'all' Tab.
		 *
		 * @since 1.0
		 *
		 * @param {object} e 'click' Event.
		 *
		 * @return Returns itself to allow chaining.
		 */
		showAll : function( e ) {

			e.preventDefault();

			this.$el.removeClass( 'popular' ).addClass( 'all' );

			return this;
		},

		/**
		 * Toggle the 'pop' Tab.
		 *
		 * @since 1.0
		 *
		 * @param {object} e 'click' Event.
		 *
		 * @return Returns itself to allow chaining.
		 */
		showPopular : function( e ) {

			e.preventDefault();

			this.$el.removeClass( 'all' ).addClass( 'popular' );

			return this;
		},

		/**
		 * Prepare the View parameters.
		 *
		 * THe returned options will be passed to the template
		 * function prior to rendering.
		 *
		 * @since 1.0
		 *
		 * @param {object} options View options.
		 *
		 * @return {object} View parameters.
		 */
		prepare : function( options ) {

			var taxonomy = this.controller.get( 'taxonomy' );
			var options = _.extend( options || {}, {
				taxonomy : taxonomy,
				labels   : _.extend(
					taxLabelsL10n[ taxonomy.slug ] || {}, {
						add       : taxLabelsL10n.add || '',
						most_used : taxLabelsL10n.most_used || ''
					}
				)
			} );

			return options;
		},

		/**
		 * Render the View.
		 *
		 * @since 1.0
		 *
		 * @return Returns itself to allow chaining.
		 */
		render : function() {

			var options = this.prepare();

			this.views.detach();

			if ( this.template ) {
				options = options || {};
				this.trigger( 'prepare', options );
				this.$el.html( this.template( options ) );
			}

			this.views.render();

			this.$el.prop( 'id', this.controller.get( 'taxonomy' ).slug + '-panel' );

			return this;
		},

	});

	/**
	 * Add-New-Term Form Subview.
	 *
	 * @since 1.0
	 */
	taxBoxes.view.category.AddNew = wp.Backbone.View.extend({

		className : 'wp-hidden-children',

		template : wp.template( 'categorydiv-addnew' ),

		events : {
			'click [data-action="add-toggle"]' : 'toggle',
			'click .category-add-submit'       : 'submit',
		},

		/**
		 * Initialize the View.
		 *
		 * @since 1.0
		 *
		 * @param {object} options View options.
		 */
		initialize : function( options ) {

			this.controller = options.controller;
			this.collection = this.controller.terms;
			this.selected   = this.controller.selected;

			this.listenTo( this.collection, 'update', this.render );
			this.listenTo( this.selected,   'update', this.render );
		},

		/**
		 * Toggle the View.
		 *
		 * The AddNew View is hidden by default. Put the text field
		 * on focus when unhiding.
		 *
		 * @since 1.0
		 *
		 * @param {object} e 'click' Event.
		 *
		 * @return Returns itself to allow chaining.
		 */
		toggle : function( e ) {

			e.preventDefault();

			// Display inputs.
			this.$el.toggleClass( 'wp-hidden-children' );

			// Ugly: reset tabs.
			this.views.parent.panels.showAll( e );

			// Focus on input.
			this.$( '#new' + this.controller.get( 'taxonomy' ).slug ).focus();

			return this;
		},

		/**
		 * Submit a new term.
		 *
		 * @since 1.0
		 *
		 * @return Returns itself to allow chaining.
		 */
		submit : function() {

			this.$( '.category-add-submit' ).prop( 'disabled', true );

			var name = this.$( '.new-category' ).val(),
			  parent = this.$( '.new-category-parent' ).val();

			this.controller.addTerm({
				name   : name,
				parent : parent
			});

			return this;
		},

		/**
		 * Hierarchize Terms List.
		 *
		 * Terms lists are rendered flat, without any indication
		 * of relation between parent and child terms. This loops
		 * through the child terms and set them as children of
		 * their parent terms.
		 *
		 * @since 1.0
		 *
		 * @return Returns itself to allow chaining.
		 */
		hierarchize : function() {

			var regexp = /^level-\d+$/g,
			  children = this.collection.filter( function( term ) {
					return 0 !== term.get( 'parent' );
			  } );

			_.each( children, function( child ) {

				var $item = this.$( 'option[value="' + child.get( 'id' ) + '"]' ),
				  $parent = this.$( 'option[value="' + child.get( 'parent' ) + '"]' ),
				    level = $parent.attr( 'data-level' );

				++level;

				$parent.after( $item );
				$item.removeClass()
				     .addClass( 'level-' + level )
				     .attr( 'data-level', level );

				$item.html( "&nbsp;".repeat( 4 * level ) + $item.html() );

			}, this );

			return this;
		},

		/**
		 * Prepare the View parameters.
		 *
		 * THe returned options will be passed to the template
		 * function prior to rendering.
		 *
		 * @since 1.0
		 *
		 * @param {object} options View options.
		 *
		 * @return {object} View parameters.
		 */
		prepare : function( options ) {

			var terms = this.controller.terms.toJSON(),
			 taxonomy = this.controller.get( 'taxonomy' );

			var options = _.extend( options || {}, {
				taxonomy : taxonomy,
				terms    : terms,
				labels   : _.extend(
					taxLabelsL10n[ taxonomy.slug ] || {}, {
						add       : taxLabelsL10n.add || '',
						most_used : taxLabelsL10n.most_used || ''
					}
				)
			} );

			return options;
		},

		/**
		 * Render the View.
		 *
		 * @since 1.0
		 *
		 * @return Returns itself to allow chaining.
		 */
		render : function() {

			wp.Backbone.View.prototype.render.apply( this, arguments );

			// Hierarchize the list.
			if ( this.collection.length ) {
				this.hierarchize();
			}

			this.$el.prop( 'id', this.controller.get( 'taxonomy' ).slug + '-adder' );

			return this;
		},

	});

	/**
	 * Main Hierarchical Taxonomies View.
	 *
	 * @since 1.0
	 */
	taxBoxes.view.category.Box = wp.Backbone.View.extend({

		events : {
			'click #category-tabs a' : 'switchTabs',
		},

		template : wp.template( 'categorydiv' ),

		/**
		 * Initialize the View.
		 *
		 * @since 1.0
		 *
		 * @param {object} options View options.
		 */
		initialize : function( options ) {

			this.controller = options.controller;

			this.listenTo( this.controller, 'ready', this.render );

			this.setRegions();
		},

		/**
		 * Set the subviews.
		 *
		 * @since 1.0
		 *
		 * @return Returns itself to allow chaining.
		 */
		setRegions : function() {

			this.panels = new taxBoxes.view.category.Panels( { controller : this.controller } );
			this.addnew = new taxBoxes.view.category.AddNew( { controller : this.controller } );

			this.views.add( '.categorydiv', this.panels );
			this.views.add( '.categorydiv', this.addnew );

			return this;
		},

		/**
		 * Prepare the View parameters.
		 *
		 * THe returned options will be passed to the template
		 * function prior to rendering.
		 *
		 * @since 1.0
		 *
		 * @param {object} options View options.
		 *
		 * @return {object} View parameters.
		 */
		prepare : function( options ) {

			var options = _.extend( options || {}, {
				taxonomy : this.controller.get( 'taxonomy' )
			} );

			return options;
		},

	});

	/**
	 * Non-hierarchical (Tag-like) Taxonomies main View.
	 *
	 * @since 1.0
	 */
	taxBoxes.view.tag = {};

	/**
	 * Add-New-Term Form Subview.
	 *
	 * @since 1.0
	 */
	taxBoxes.view.tag.AddNew = wp.Backbone.View.extend({

		className : 'jaxtag',

		template : wp.template( 'tagdiv-addnew' ),

		events : {
			'click .tagadd' : 'addTerms',
		},

		/**
		 * Initialize the View.
		 *
		 * @since 1.0
		 *
		 * @param {object} options View options.
		 */
		initialize : function( options ) {

			this.controller = options.controller;
			this.collection = this.controller.selected;

			this.listenTo( this.collection, 'update', this.render );
		},

		/**
		 * Add new terms to the collection.
		 *
		 * @since 1.0
		 *
		 * @return Returns itself to allow chaining.
		 */
		addTerms : function() {

			var tags = this.$( '.newtag' ).val();

			_.each( tags.trim().split( ',' ), function( tag ) {
				var name = tag.trim();
				if ( '' !== name ) {
					this.controller.addTerm({
						name : name
					});
				}
			}, this );

			this.$( '.newtag' ).val( '' );

			return this;
		},

		/**
		 * Prepare the View parameters.
		 *
		 * THe returned options will be passed to the template
		 * function prior to rendering.
		 *
		 * @since 1.0
		 *
		 * @param {object} options View options.
		 *
		 * @return {object} View parameters.
		 */
		prepare : function( options ) {

			var taxonomy = this.controller.get( 'taxonomy' );
			var options = _.extend( options || {}, {
				taxonomy : taxonomy,
				terms    : this.collection.toJSON(),
				labels   : _.extend(
					taxLabelsL10n[ taxonomy.slug ] || {}, {
						add       : taxLabelsL10n.add || '',
						most_used : taxLabelsL10n.most_used || ''
					}
				)
			} );

			return options;
		},

		/**
		 * Render the View.
		 *
		 * @since 1.0
		 *
		 * @return Returns itself to allow chaining.
		 */
		render : function() {

			wp.Backbone.View.prototype.render.apply( this, arguments );

			// Consider using REST.
			this.$( 'input.newtag' ).wpTagsSuggest();

			return this;
		},

	});

	/**
	 * All Terms Subview.
	 *
	 * @since 1.0
	 */
	taxBoxes.view.tag.Terms = wp.Backbone.View.extend({

		className : 'tagchecklist',

		template : wp.template( 'tagdiv-terms' ),

		events : {
			'click .ntdelbutton' : 'removeTerm'
		},

		/**
		 * Initialize the View.
		 *
		 * @since 1.0
		 *
		 * @param {object} options View options.
		 */
		initialize : function( options ) {

			this.controller = options.controller;
			this.collection = this.controller.selected;

			this.listenTo( this.collection, 'update', this.render );
		},

		/**
		 * Remove a term from the collection.
		 *
		 * @since 1.0
		 *
		 * @param {object} event JS 'click' Event.
		 *
		 * @return Returns itself to allow chaining.
		 */
		removeTerm : function( event ) {

			var $target = this.$( event.currentTarget ),
			    term_id = $target.data( 'term-id' );

			this.collection.remove( parseInt( term_id ) );

			return this;
		},

		/**
		 * Prepare the View parameters.
		 *
		 * THe returned options will be passed to the template
		 * function prior to rendering.
		 *
		 * @since 1.0
		 *
		 * @param {object} options View options.
		 *
		 * @return {object} View parameters.
		 */
		prepare : function( options ) {

			var options = _.extend( options || {}, {
				terms : this.collection.toJSON()
			} );

			return options;
		},

	});

	/**
	 * TagCloud Subview.
	 *
	 * @since 1.0
	 */
	taxBoxes.view.tag.Cloud = wp.Backbone.View.extend({

		className : 'the-tagcloud-wrapper',

		template : wp.template( 'tagdiv-cloud' ),

		events : {
			'click .tagcloud-link' : 'toggleCloud',
			'click .tag-link'      : 'addTerm',
		},

		/**
		 * Initialize the View.
		 *
		 * @since 1.0
		 *
		 * @param {object} options View options.
		 */
		initialize : function( options ) {

			this.controller = options.controller;
			this.collection = this.controller.popular;

			this.listenTo( this.collection, 'update', this.render );
		},

		/**
		 * Show/Hide the TagCloud.
		 *
		 * @since 1.0
		 *
		 * @return Returns itself to allow chaining.
		 */
		toggleCloud : function() {

			this.$( '.the-tagcloud' ).toggleClass( 'hidden' );

			return this;
		},

		/**
		 * Add a term to the collection.
		 *
		 * @since 1.0
		 *
		 * @param {object} event JS 'click' Event.
		 *
		 * @return Returns itself to allow chaining.
		 */
		addTerm : function( event ) {

			event.preventDefault();

			var $target = this.$( event.currentTarget ),
			    term_id = $target.data( 'term-id' );

			this.controller.setSelected( term_id );

			this.views.parent.addnew.$( '.newtag' ).focus();

			return this;
		},

		/**
		 * Calculate font size for each term of the cloud.
		 *
		 * Replicate wp_generate_tag_cloud() PHP function to build a tag
		 * cloud by Calculating font sizes based on the number of posts
		 * related to each term.
		 *
		 * @see wp_generate_tag_cloud()
		 * @see default_topic_count_scale()
		 *
		 * @since 1.0
		 *
		 * @param {array} terms Collection of term objects.
		 * @param {object} options Calculation options.
		 *
		 * @return {array} terms Collection of term objects.
		 */
		calculateFontSize : function( terms, options ) {

			if ( ! terms.length ) {
				return terms;
			}

			var counts = [], options = _.extend( options || {}, {
				unit     : 'pt',
				largest  : 22,
				smallest : 8,
			} );

			_.each( terms, function( term, index ) {
				// See default_topic_count_scale().
				counts[ index ] = Math.round( Math.log10( parseInt( term.count ) + 1 ) * 100 );
			}, this );

			var spread = _.max( counts ) - _.min( counts );
			if ( 0 >= spread ) {
				spread = 1;
			}

			_.each( terms, function( term, index ) {
				terms[ index ].fontSize = ( options.smallest + ( counts[ index ] - _.min( counts ) ) * ( ( options.largest - options.smallest ) / spread ) ) + options.unit;
			}, this );

			return terms;
		},

		/**
		 * Prepare the View parameters.
		 *
		 * THe returned options will be passed to the template
		 * function prior to rendering.
		 *
		 * @since 1.0
		 *
		 * @param {object} options View options.
		 *
		 * @return {object} View parameters.
		 */
		prepare : function( options ) {

			var terms = _.sortBy( this.collection.toJSON(), 'name' ),
			 taxonomy = this.controller.get( 'taxonomy' ),
			  options;

			var options = _.extend( options || {}, {
				taxonomy : taxonomy,
				terms    : this.calculateFontSize( terms ),
				labels   : _.extend(
					taxLabelsL10n[ taxonomy.slug ] || {}, {
						add       : taxLabelsL10n.add || '',
						most_used : taxLabelsL10n.most_used || '',
						n_topic   : taxLabelsL10n.n_topic || '',
						n_topics  : taxLabelsL10n.n_topics || '',
					}
				)
			} );

			return options;
		},

	});

	/**
	 * Main Non-hierarchical Taxonomies View.
	 *
	 * @since 1.0
	 */
	taxBoxes.view.tag.Box = wp.Backbone.View.extend({

		template : wp.template( 'tagdiv' ),

		/**
		 * Initialize the View.
		 *
		 * @since 1.0
		 *
		 * @param {object} options View options.
		 */
		initialize : function( options ) {

			this.controller = options.controller;

			this.listenTo( this.controller, 'ready', this.render );

			this.setRegions();
			this.render();
		},

		/**
		 * Set the subviews.
		 *
		 * @since 1.0
		 *
		 * @return Returns itself to allow chaining.
		 */
		setRegions : function() {

			this.addnew = new taxBoxes.view.tag.AddNew( { controller : this.controller } );
			this.terms  = new taxBoxes.view.tag.Terms( { controller : this.controller } );
			this.cloud  = new taxBoxes.view.tag.Cloud( { controller : this.controller } );

			this.views.add( '.tagsdiv', this.addnew );
			this.views.add( '.tagsdiv', this.terms );
			this.views.add( '.tagsdiv', this.cloud );

			return this;
		},

		/**
		 * Prepare the View parameters.
		 *
		 * THe returned options will be passed to the template
		 * function prior to rendering.
		 *
		 * @since 1.0
		 *
		 * @param {object} options View options.
		 *
		 * @return {object} View parameters.
		 */
		prepare : function( options ) {

			var options = _.extend( options || {}, {
				taxonomy : this.controller.get( 'taxonomy' )
			} );

			return options;
		},

	});

	/**
	 * Run Forrest, run!
	 *
	 * Fetch the current post type allowed taxonomies and create the
	 * corresponding controllers and views.
	 *
	 * @since 1.0
	 *
	 * @return Returns itself to allow chaining.
	 */
	taxBoxes.run = function() {

		var taxonomies = new wp.api.models.Taxonomy,
		       options = { data : { type : typenow || '' } };

		taxonomies.fetch( options ).done( function( taxonomies ) {
			_.each( taxonomies, function( taxonomy ) {
				taxBoxes.boxes[ taxonomy.slug ] = new taxBox( taxonomy );
			} );
		} );

		return taxBoxes;
	};

}() );

jQuery( document ).ready( function() {
	// Wait for the client to load.
	wp.api.loadPromise.done( taxBoxes.run );
} );
