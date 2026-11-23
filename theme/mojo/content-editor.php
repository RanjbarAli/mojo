<?php
defined( 'ABSPATH' ) || exit;

const MOJO_EDITOR_PAGE_SIZE = 4;

function mojo_editor_revision( $rows ) {
	return hash( 'sha256', serialize( $rows ) );
}

function mojo_content_inputs( $row, $prefix ) {
	$labels = array( 'img' => 'Image', 'src' => 'Image', 'cat' => 'Category', 'ar' => 'Aspect ratio', 'res' => 'Result', 'id' => 'Program or package ID', 'short' => 'Short description', 'body' => 'Full description', 'points' => 'Highlights (one per line)', 'alt' => 'Image description' );
	echo '<div class="mc-fields">';
	foreach ( $row as $key => $value ) {
		$key = (string) $key;
		$name = $prefix . '[' . $key . ']';
		$id = 'mc-' . sanitize_html_class( str_replace( array( '[', ']' ), array( '-', '' ), $name ) );
		$image = mojo_is_image_field( $key );
		$long = ! $image && ( in_array( $key, array( 'points', 'body', 'text', 'short', 'introduction', 'description' ), true ) || strlen( $value ) > 85 );
		$label = $labels[ $key ] ?? ucfirst( trim( str_replace( '_', ' ', preg_replace( '/([a-z])([A-Z])/', '$1 $2', preg_replace( '/^image_assets_img_(.+)_(webp|png)$/', '$1 image', $key ) ) ) ) );
		$attrs = 'id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '"';
		if ( 'id' === $key ) {
			echo '<input type="hidden" ' . $attrs . ' value="' . esc_attr( $value ) . '">';
			continue;
		}
		printf( '<div class="mc-field%s"><label for="%s">%s</label>', $long || in_array( $key, array( 'closedDays', 'slots' ), true ) ? ' mc-wide' : '', esc_attr( $id ), esc_html( $label ) );
		if ( $image ) {
			$url = mojo_media_url( $value );
			echo '<input type="hidden" data-image-value ' . $attrs . ' value="' . esc_attr( $value ) . '">';
			echo '<div class="mc-media"><img alt="Selected image" loading="lazy" ' . ( $url ? 'src="' . esc_url( $url ) . '"' : 'hidden' ) . '><span data-image-empty ' . ( $url ? 'hidden' : '' ) . '>No image selected</span><div class="mc-actions"><button type="button" class="button" data-media>Choose or upload image</button><button type="button" class="button" data-clear-image ' . ( $url ? '' : 'hidden' ) . '>Clear</button></div></div>';
		} elseif ( 'closedDays' === $key ) {
			echo '<div class="mc-options" id="' . esc_attr( $id ) . '">';
			$closed = array_map( 'trim', explode( ',', $value ) );
			foreach ( array( 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ) as $day => $label ) {
				printf( '<label><input type="checkbox" name="%s[]" value="%d" %s> %s</label>', esc_attr( $name ), $day, checked( in_array( (string) $day, $closed, true ), true, false ), esc_html( $label ) );
			}
			echo '</div>';
		} elseif ( 'slots' === $key ) {
			echo '<div class="mc-options" data-slots id="' . esc_attr( $id ) . '">';
			foreach ( array_filter( array_map( 'trim', explode( ',', $value ) ) ) as $time ) {
				printf( '<div><input type="time" aria-label="Lesson time" name="%s[]" value="%s"><button type="button" class="button" data-remove-slot>Remove time</button></div>', esc_attr( $name ), esc_attr( $time ) );
			}
			echo '</div><button type="button" class="button" data-add-slot data-name="' . esc_attr( $name ) . '[]">Add lesson time</button>';
		} elseif ( $choices = mojo_editor_choices( $key, $value ) ) {
			echo '<select ' . $attrs . '>';
			foreach ( $choices as $choice => $text ) printf( '<option value="%s" %s>%s</option>', esc_attr( $choice ), selected( $value, $choice, false ), esc_html( $text ) );
			echo '</select>';
		} elseif ( $long ) {
			echo '<textarea rows="3" ' . $attrs . '>' . esc_textarea( $value ) . '</textarea>';
		} else {
			$type = array( 'open' => 'time', 'close' => 'time', 'phone' => 'tel', 'email' => 'email' )[ $key ] ?? 'text';
			printf( '<input type="%s" %s value="%s"%s>', esc_attr( $type ), $attrs, esc_attr( $value ), 'title' === $key ? ' required' : '' );
		}
		echo '</div>';
	}
	echo '</div>';
}

function mojo_editor_choices( $key, $current ) {
	$choices = array(
		'cat' => array( 'riding' => 'Riding', 'training' => 'Training', 'leisure' => 'Leisure' ),
		'bookable' => array( 'yes' => 'Yes', 'no' => 'No' ),
		'showInDisciplines' => array( 'yes' => 'Yes', 'no' => 'No' ),
		'tone' => array( 'teal' => 'Teal', 'azure' => 'Blue', 'orange' => 'Orange' ),
		'ar' => array( '4/3' => 'Landscape', '1/1' => 'Square', '4/5' => 'Portrait' ),
	);
	if ( 'icon' === $key ) {
		$choices['icon'] = array( '' => 'Select an icon' );
		foreach ( array( 'programs', 'packages', 'achievements' ) as $group ) {
			foreach ( array_column( mojo_defaults()[ $group ], 'icon' ) as $icon ) $choices['icon'][ $icon ] = ucfirst( str_replace( '-', ' ', $icon ) );
		}
	}
	if ( ! isset( $choices[ $key ] ) ) return array();
	if ( '' !== $current && ! isset( $choices[ $key ][ $current ] ) ) $choices[ $key ][ $current ] = $current;
	return $choices[ $key ];
}

function mojo_content_row( $row, $index ) {
	$title = $row['title'] ?? $row['tag'] ?? $row['name'] ?? '';
	echo '<section class="mc-card" data-row><header><h3 data-row-title>' . esc_html( $title ?: 'New item' ) . '</h3><div class="mc-actions">';
	echo '<button class="button" type="button" data-up>Move up</button><button class="button" type="button" data-down>Move down</button><button class="button mc-remove" type="button" data-remove>Remove</button></div></header>';
	mojo_content_inputs( $row, 'content[' . $index . ']' );
	echo '</section>';
}

function mojo_editor_panels( $group, $values ) {
	$headings = array(
		'home' => array( 'introduction' => 'Hero', 'horses_count' => 'Club statistics', 'open' => 'Hero', 'programs' => 'Disciplines', 'about_us' => 'About the club', 'achievements' => 'Milestones', 'highlights' => 'Gallery', 'key_staff' => 'Coaching team', 'faq' => 'Frequently asked questions', 'join_today' => 'Demo enquiries', 'bookingTileLink' => 'Discipline feature cards' ),
		'about' => array( 'introduction' => 'Hero', 'our_story' => 'Club story', 'what_makes_us_different' => 'Club values', 'facilities' => 'Facilities', 'milestones' => 'Milestones', 'leadership' => 'Leadership' ),
		'services' => array( 'introduction' => 'Hero', 'all' => 'Program filters', 'how_it_works' => 'Booking steps' ),
		'events' => array( 'introduction' => 'Hero', 'host_with_us' => 'Packages', 'competitions' => 'Past events', 'plan_your_event' => 'Event enquiries' ),
		'booking' => array( 'introduction' => 'Hero', 'your_booking' => 'Booking summary' ),
		'contact-page' => array( 'introduction' => 'Hero', 'call_us' => 'Contact options' ),
	);
	$panels = array();
	$panel = 'Page content';
	foreach ( $values as $field => $text ) {
		if ( mojo_is_image_field( (string) $field ) ) {
			$panels['Images'][ $field ] = $text;
			continue;
		}
		$panel = $headings[ $group ][ $field ] ?? $panel;
		if ( 'contact' === $group ) {
			$panel = 'Contact details';
			if ( in_array( $field, array( 'open', 'close', 'closedDays', 'slots' ), true ) ) $panel = 'Booking schedule';
			if ( in_array( $field, array( 'map', 'mapEmbed', 'address' ), true ) ) $panel = 'Location';
		}
		$panels[ $panel ][ $field ] = $text;
	}
	if ( isset( $panels['Images'] ) ) {
		$images = $panels['Images'];
		unset( $panels['Images'] );
		$panels['Images'] = $images;
	}
	return $panels;
}

function mojo_content_admin() {
	$groups = mojo_content_groups();
	$key = sanitize_key( $_GET['group'] ?? 'contact' );
	if ( ! isset( $groups[ $key ] ) ) $key = 'contact';
	$value = mojo_content( $key );
	$collection = isset( mojo_defaults()[ $key ][0] );
	$total = $collection ? count( $value ) : 0;
	$pages = max( 1, (int) ceil( $total / MOJO_EDITOR_PAGE_SIZE ) );
	$page = min( $pages, max( 1, absint( $_GET['items_page'] ?? 1 ) ) );
	$offset = ( $page - 1 ) * MOJO_EDITOR_PAGE_SIZE;
	$schema = mojo_defaults()[ $key ];
	$sections = array(
		'Site settings' => array( 'contact', 'footer' ),
		'Collections' => array( 'programs', 'packages', 'gallery', 'achievements', 'sponsors' ),
		'Pages' => array( 'home', 'about', 'services', 'events', 'booking', 'contact-page', 'blog' ),
	);
	echo '<div class="wrap mc"><h1>Mojo Content</h1>';
	if ( isset( $_GET['saved'] ) ) echo '<div class="notice notice-success"><p>Changes saved.</p></div>';
	echo '<div class="mc-layout"><nav class="mc-nav" aria-label="Content sections">';
	foreach ( $sections as $section => $keys ) {
		echo '<h2>' . esc_html( $section ) . '</h2><div>';
		foreach ( $keys as $group ) printf( '<a %s href="%s">%s</a>', $group === $key ? 'aria-current="page"' : '', esc_url( mojo_editor_url( $group ) ), esc_html( $groups[ $group ] ) );
		echo '</div>';
	}
	echo '</nav><form class="mc-form" method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '"><input type="hidden" name="action" value="mojo_save_content"><input type="hidden" name="group" value="' . esc_attr( $key ) . '">';
	wp_nonce_field( 'mojo_content_' . $key );
	echo '<div class="mc-bar"><h2>' . esc_html( $groups[ $key ] ) . '</h2><div class="mc-actions">';
	if ( $collection ) echo '<button type="button" class="button mc-add" data-add>Add item</button>';
	echo '<button class="button button-primary">Save changes</button></div></div>';
	if ( 'programs' === $key ) echo '<p>Enable Show In Disciplines to display a service on the home page.</p>';
	if ( 'contact' === $key ) echo '<p>All times are local to Oman.</p>';
	if ( $collection ) {
		printf( '<input type="hidden" name="items_page" value="%d"><input type="hidden" name="collection_revision" value="%s">', $page, esc_attr( mojo_editor_revision( array_values( $value ) ) ) );
		$pagination = '';
		if ( $pages > 1 ) {
			$pagination = '<nav class="mc-pagination" aria-label="Collection pages"><span>' . esc_html( sprintf( 'Page %d of %d · %d items', $page, $pages, $total ) ) . '</span>';
			if ( $page > 1 ) $pagination .= '<a class="button" href="' . esc_url( mojo_editor_url( $key, $page - 1 ) ) . '">Previous</a>';
			if ( $page < $pages ) $pagination .= '<a class="button" href="' . esc_url( mojo_editor_url( $key, $page + 1 ) ) . '">Next</a>';
			$pagination .= '</nav>';
		}
		echo $pagination;
		printf( '<div data-rows data-previous="%d" data-next="%d">', $page > 1, $page < $pages );
		foreach ( array_slice( $value, $offset, MOJO_EDITOR_PAGE_SIZE ) as $i => $row ) {
			if ( 'programs' === $key ) $row += array( 'showInDisciplines' => 'yes' );
			mojo_content_row( $row, $i );
		}
		echo '</div><template id="mojo-row">';
		mojo_content_row( array_fill_keys( array_keys( $schema[0] ), '' ), 'NEW' );
		echo '</template>' . $pagination;
		echo '<input type="hidden" name="move_page" value="">';
	} else {
		foreach ( mojo_editor_panels( $key, $value ) as $panel => $fields ) {
			echo '<section class="mc-card"><header><h3>' . esc_html( $panel ) . '</h3></header>';
			mojo_content_inputs( $fields, 'content' );
			echo '</section>';
		}
	}
	echo '<input type="hidden" name="mojo_complete" value="1"></form></div></div>';
}
