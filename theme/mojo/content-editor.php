<?php
defined( 'ABSPATH' ) || exit;

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
		printf( '<div class="mc-field%s"><label for="%s">%s</label>', $long ? ' mc-wide' : '', esc_attr( $id ), esc_html( $label ) );
		$attrs = 'id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '"';
		if ( in_array( $key, array( 'bookable', 'showInDisciplines', 'cat' ), true ) ) {
			echo '<select ' . $attrs . '>';
			foreach ( 'cat' === $key ? array( 'riding','training','leisure' ) : array( 'yes','no' ) as $choice ) printf( '<option value="%s" %s>%s</option>', esc_attr( $choice ), selected( $value, $choice, false ), esc_html( ucfirst( $choice ) ) );
			echo '</select>';
		} elseif ( $long ) {
			echo '<textarea rows="3" ' . $attrs . '>' . esc_textarea( $value ) . '</textarea>';
		} else {
			echo '<input type="text" ' . $attrs . ' value="' . esc_attr( $value ) . '">';
		}
		if ( $image ) {
			$url = mojo_media_url( $value );
			echo '<div class="mc-media"><img alt="" loading="lazy" ' . ( $url ? 'src="' . esc_url( $url ) . '"' : 'hidden' ) . '><button type="button" class="button" data-media>Choose image</button></div>';
		}
		echo '</div>';
	}
	echo '</div>';
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
		foreach ( $keys as $group ) printf( '<a %s href="%s">%s</a>', $group === $key ? 'aria-current="page"' : '', esc_url( add_query_arg( array( 'page' => 'mojo-content', 'group' => $group ), admin_url( 'admin.php' ) ) ), esc_html( $groups[ $group ] ) );
		echo '</div>';
	}
	echo '</nav><form class="mc-form" method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '"><input type="hidden" name="action" value="mojo_save_content"><input type="hidden" name="group" value="' . esc_attr( $key ) . '">';
	wp_nonce_field( 'mojo_content_' . $key );
	echo '<div class="mc-bar"><h2>' . esc_html( $groups[ $key ] ) . '</h2><button class="button button-primary">Save changes</button></div>';
	if ( 'programs' === $key ) echo '<p>Enable Show In Disciplines to display a service on the home page.</p>';
	if ( 'contact' === $key ) echo '<p>Enter times in Oman local time (HH:MM). Separate lesson times and closed weekdays with commas. Sunday is 0 and Saturday is 6.</p>';
	if ( isset( $schema[0] ) ) {
		echo '<div data-rows>';
		foreach ( $value as $i => $row ) {
			if ( 'programs' === $key ) $row += array( 'showInDisciplines' => 'yes' );
			mojo_content_row( $row, $i );
		}
		echo '</div><template id="mojo-row">';
		mojo_content_row( array_fill_keys( array_keys( $schema[0] ), '' ), 'NEW' );
		echo '</template><button type="button" class="button mc-add" data-add>+ Add item</button>';
	} else {
		foreach ( mojo_editor_panels( $key, $value ) as $panel => $fields ) {
			echo '<section class="mc-card"><header><h3>' . esc_html( $panel ) . '</h3></header>';
			mojo_content_inputs( $fields, 'content' );
			echo '</section>';
		}
	}
	echo '</form></div></div>';
}
