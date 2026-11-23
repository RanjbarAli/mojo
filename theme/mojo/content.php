<?php
defined( 'ABSPATH' ) || exit;

function mojo_defaults() {
	static $defaults;
	if ( null === $defaults ) {
		$defaults = json_decode( file_get_contents( get_theme_file_path( 'content/defaults.json' ) ), true );
	}
	return $defaults;
}

// add_option never replaces data when an installed theme is upgraded or reactivated.
add_action( 'after_setup_theme', function () {
	if ( '3' === get_option( 'mojo_content_schema' ) ) return;
	foreach ( mojo_defaults() as $group => $initial ) {
		add_option( 'mojo_content_' . $group, $initial, '', false );
	}
	update_option( 'mojo_content_schema', '3' );
} );

function mojo_content( $group ) {
	$defaults = mojo_defaults()[ $group ];
	$value = get_option( 'mojo_content_' . $group, $defaults );
	return isset( $defaults[0] ) ? $value : array_replace( $defaults, array_intersect_key( $value, $defaults ) );
}
function mojo_field( $group, $key ) {
	return mojo_content( $group )[ $key ] ?? '';
}
function mojo_media_url( $value ) {
	if ( ctype_digit( (string) $value ) ) return wp_get_attachment_image_url( (int) $value, 'full' ) ?: '';
	if ( str_starts_with( $value, 'assets/img/' ) ) return get_theme_file_uri( $value );
	return esc_url_raw( $value, array( 'http', 'https' ) );
}
function mojo_browser_content() {
	$result = array();
	$groups = array( 'home' => array( 'programs', 'gallery', 'sponsors', 'achievements' ), 'about' => array( 'sponsors' ), 'services' => array( 'programs' ), 'booking' => array( 'programs' ) );
	foreach ( $groups[ mojo_view() ] ?? array() as $group ) {
		$result[ $group ] = array();
		foreach ( mojo_content( $group ) as $item ) {
			foreach ( $item as $key => &$value ) {
				if ( 'points' === $key ) {
					$value = array_map( 'esc_html', preg_split( '/\R/', $value, -1, PREG_SPLIT_NO_EMPTY ) );
				} elseif ( 'img' === $key || 'src' === $key ) {
					$value = esc_url( mojo_media_url( $value ) );
				} else {
					$value = esc_attr( $value );
				}
			}
			unset( $value );
			$result[ $group ][] = $item;
		}
	}
	$result['contact'] = mojo_content( 'contact' );
	return $result;
}

function mojo_schedule_label() {
	$contact = mojo_content( 'contact' );
	$closed = preg_split( '/\s*,\s*/', $contact['closedDays'], -1, PREG_SPLIT_NO_EMPTY );
	$days = array_diff_key( array( 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ), array_flip( $closed ) );
	return implode( ', ', $days ) . ' · ' . $contact['open'] . ' – ' . $contact['close'];
}

function mojo_content_groups() {
	return array( 'contact' => 'Contact, hours & booking times', 'programs' => 'Services & Disciplines', 'gallery' => 'Gallery',
		'achievements' => 'Milestones', 'sponsors' => 'Sponsors', 'home' => 'Home page', 'about' => 'About page',
		'services' => 'Programs page', 'events' => 'Events page', 'packages' => 'Event packages', 'booking' => 'Booking page',
		'contact-page' => 'Contact page', 'blog' => 'Journal page', 'footer' => 'Footer' );
}
function mojo_is_image_field( $key ) {
	return in_array( $key, array( 'img', 'src' ), true ) || str_starts_with( $key, 'image_' );
}

add_action( 'admin_menu', function () {
	add_theme_page( 'Mojo Content', 'Mojo Content', 'edit_theme_options', 'mojo-content', 'mojo_content_admin' );
} );
add_action( 'admin_enqueue_scripts', function ( $hook ) {
	if ( 'appearance_page_mojo-content' !== $hook ) return;
	wp_enqueue_media();
	wp_enqueue_script( 'mojo-content-admin', get_theme_file_uri( 'js/content-admin.js' ), array(), '1.1', true );
} );

function mojo_content_inputs( $row, $prefix ) {
	foreach ( $row as $key => $value ) {
		$name = $prefix . '[' . $key . ']';
		$label = ucfirst( str_replace( '_', ' ', preg_replace( '/([a-z])([A-Z])/', '$1 $2', $key ) ) );
		echo '<p><label><strong>' . esc_html( $label ) . '</strong><br>';
		if ( in_array( $key, array( 'bookable', 'showInDisciplines', 'cat' ), true ) ) {
			$choices = 'cat' === $key ? array( 'riding', 'training', 'leisure' ) : array( 'yes', 'no' );
			echo '<select name="' . esc_attr( $name ) . '">';
			foreach ( $choices as $choice ) printf( '<option %s>%s</option>', selected( $value, $choice, false ), esc_html( $choice ) );
			echo '</select>';
		} elseif ( in_array( $key, array( 'points', 'body', 'text' ), true ) || strlen( $value ) > 90 ) {
			printf( '<textarea class="large-text" rows="3" name="%s">%s</textarea>', esc_attr( $name ), esc_textarea( $value ) );
		} else {
			printf( '<input class="regular-text" name="%s" value="%s">', esc_attr( $name ), esc_attr( $value ) );
		}
		echo '</label>';
		if ( mojo_is_image_field( $key ) ) echo ' <button class="button" type="button" data-media>Media library</button>';
		echo '</p>';
	}
}
function mojo_content_row( $row, $index ) {
	echo '<details data-row style="background:white;border:1px solid #ccd0d4;padding:12px;margin-bottom:8px"><summary><strong>' . esc_html( $row['title'] ?? $row['tag'] ?? $row['name'] ?? 'Item' ) . '</strong></summary>';
	mojo_content_inputs( $row, 'content[' . $index . ']' );
	echo '<button class="button" type="button" data-up>Move up</button> <button class="button" type="button" data-down>Move down</button> <button class="button-link-delete" type="button" data-remove>Remove item</button></details>';
}
function mojo_content_admin() {
	$groups = mojo_content_groups();
	$key = sanitize_key( $_GET['group'] ?? 'contact' );
	if ( ! isset( $groups[ $key ] ) ) $key = 'contact';
	$value = mojo_content( $key );
	$schema = mojo_defaults()[ $key ];
	echo '<div class="wrap"><h1>Mojo Content</h1><nav class="nav-tab-wrapper">';
	foreach ( $groups as $group => $label ) printf( '<a class="nav-tab %s" href="%s">%s</a>', $key === $group ? 'nav-tab-active' : '', esc_url( add_query_arg( array( 'page' => 'mojo-content', 'group' => $group ), admin_url( 'themes.php' ) ) ), esc_html( $label ) );
	echo '</nav>';
	if ( isset( $_GET['saved'] ) ) echo '<div class="notice notice-success"><p>Changes saved.</p></div>';
	echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '"><input type="hidden" name="action" value="mojo_save_content"><input type="hidden" name="group" value="' . esc_attr( $key ) . '">';
	wp_nonce_field( 'mojo_content_' . $key );
	if ( 'programs' === $key ) echo '<p>Add or reorder service cards here. Set Show In Disciplines to Yes to also display a card on the home page.</p>';
	if ( 'contact' === $key ) echo '<p>Use 24-hour times (HH:MM). List closed weekdays as numbers from 0 (Sunday) to 6 (Saturday), and separate lesson times with commas. Times are local to Oman.</p>';
	if ( isset( $schema[0] ) ) {
		echo '<div data-rows>';
		foreach ( $value as $i => $row ) {
			if ( 'programs' === $key ) $row += array( 'showInDisciplines' => 'yes' );
			mojo_content_row( $row, $i );
		}
		echo '</div><template id="mojo-row">';
		mojo_content_row( array_fill_keys( array_keys( $schema[0] ), '' ), 'NEW' );
		echo '</template><button type="button" class="button" data-add>Add item</button>';
	} else {
		mojo_content_inputs( $value, 'content' );
	}
	submit_button();
	echo '</form></div>';
}

function mojo_clean_row( $raw, $schema ) {
	$clean = array();
	foreach ( $schema as $key => $default ) {
		$value = isset( $raw[ $key ] ) && is_string( $raw[ $key ] ) ? trim( $raw[ $key ] ) : '';
		if ( mojo_is_image_field( $key ) ) {
			if ( ctype_digit( $value ) ) $value = wp_attachment_is_image( (int) $value ) ? $value : '';
			elseif ( ! preg_match( '~^assets/img/(?:[\w-]+/)*[\w.-]+$~D', $value ) ) $value = esc_url_raw( $value, array( 'https', 'http' ) );
		} elseif ( in_array( $key, array( 'map','mapEmbed','facebook','instagram','whatsapp','creditUrl' ), true ) ) {
			$value = esc_url_raw( $value, array( 'https', 'http' ) );
		} elseif ( 'email' === $key ) $value = sanitize_email( $value );
		elseif ( in_array( $key, array( 'id', 'icon', 'tone' ), true ) ) $value = sanitize_title( $value );
		elseif ( 'showInDisciplines' === $key ) $value = 'no' === $value ? 'no' : 'yes';
		elseif ( 'cat' === $key && ! in_array( $value, array( 'riding','training','leisure' ), true ) ) $value = 'riding';
		elseif ( 'ar' === $key && ! preg_match( '~^\d+(?:\.\d+)?/\d+(?:\.\d+)?$~D', $value ) ) $value = '4/3';
		else $value = sanitize_textarea_field( $value );
		$clean[ $key ] = $value;
	}
	return $clean;
}
add_action( 'admin_post_mojo_save_content', function () {
	if ( ! current_user_can( 'edit_theme_options' ) ) wp_die( 'Forbidden', '', array( 'response' => 403 ) );
	$key = sanitize_key( $_POST['group'] ?? '' );
	$groups = mojo_defaults();
	if ( ! isset( $groups[ $key ] ) ) wp_die( 'Unknown group.' );
	check_admin_referer( 'mojo_content_' . $key );
	$rows = wp_unslash( $_POST['content'] ?? array() );
	if ( ! is_array( $rows ) ) wp_die( 'Invalid content.' );
	if ( isset( $groups[ $key ][0] ) ) {
		$clean = array();
		foreach ( $rows as $row ) {
			if ( ! is_array( $row ) ) continue;
			$item = mojo_clean_row( $row, $groups[ $key ][0] );
			if ( in_array( $key, array( 'programs', 'packages' ), true ) && ( ! $item['title'] || ! $item['id'] || in_array( $item['id'], array_column( $clean, 'id' ), true ) ) ) wp_die( 'Each item needs a title and a unique ID.' );
			$clean[] = $item;
		}
	} else {
		$clean = mojo_clean_row( $rows, $groups[ $key ] );
	}
	if ( 'contact' === $key ) {
		$times = array_merge( array( $clean['open'], $clean['close'] ), array_map( 'trim', explode( ',', $clean['slots'] ) ) );
		foreach ( $times as $time ) if ( ! preg_match( '/^(?:[01]\d|2[0-3]):[0-5]\d$/D', $time ) ) wp_die( 'Use HH:MM for hours and lesson times.' );
		if ( $clean['open'] >= $clean['close'] || ! preg_match( '/^\s*(?:[0-6](?:\s*,\s*[0-6])*)?\s*$/D', $clean['closedDays'] ) ) wp_die( 'Check opening hours and closed weekdays.' );
	}
	update_option( 'mojo_content_' . $key, $clean, false );
	wp_safe_redirect( add_query_arg( array( 'page' => 'mojo-content', 'group' => $key, 'saved' => 1 ), admin_url( 'themes.php' ) ) );
	exit;
} );

add_action( 'customize_register', function ( $customizer ) {
	$customizer->add_section( 'mojo_colors', array( 'title' => 'Mojo colors' ) );
	foreach ( array( 'orange' => 'Button and accent', 'text' => 'Text', 'ink' => 'Dark surfaces', 'bg' => 'Background' ) as $key => $label ) {
		$id = 'mojo_color_' . $key;
		$customizer->add_setting( $id, array( 'sanitize_callback' => 'sanitize_hex_color' ) );
		$customizer->add_control( new WP_Customize_Color_Control( $customizer, $id, array( 'section' => 'mojo_colors', 'label' => $label ) ) );
	}
} );
add_action( 'wp_enqueue_scripts', function () {
	$css = '';
	foreach ( array( 'orange', 'text', 'ink', 'bg' ) as $key ) {
		$color = sanitize_hex_color( get_theme_mod( 'mojo_color_' . $key, '' ) );
		if ( $color ) $css .= '--' . $key . ':' . $color . ';';
	}
	if ( $css ) wp_add_inline_style( 'mojo', ':root{' . $css . '}' );
}, 20 );
