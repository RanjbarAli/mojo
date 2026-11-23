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

function mojo_editor_url( $group, $page = 1 ) {
	return add_query_arg( array( 'page' => 'mojo-content', 'group' => $group, 'items_page' => $page ), admin_url( 'admin.php' ) );
}

function mojo_editor_submenu( $group ) {
	return 'admin.php?page=mojo-content&group=' . $group;
}

add_action( 'admin_menu', function () {
	add_menu_page( 'Mojo Content', 'Mojo Content', 'edit_theme_options', 'mojo-content', 'mojo_content_admin', 'dashicons-edit-page', 26 );
	foreach ( mojo_content_groups() as $group => $label ) {
		add_submenu_page( 'mojo-content', $label, $label, 'edit_theme_options', mojo_editor_submenu( $group ) );
	}
} );
add_filter( 'submenu_file', function ( $submenu, $parent ) {
	if ( 'mojo-content' !== $parent ) return $submenu;
	return mojo_editor_submenu( sanitize_key( $_GET['group'] ?? 'contact' ) );
}, 10, 2 );
// Keep bookmarks from the former Appearance submenu working.
add_action( 'admin_init', function () {
	global $pagenow;
	if ( 'themes.php' !== $pagenow || 'mojo-content' !== ( $_GET['page'] ?? '' ) ) return;
	$group = sanitize_key( $_GET['group'] ?? 'contact' );
	wp_safe_redirect( add_query_arg( array( 'page' => 'mojo-content', 'group' => $group ), admin_url( 'admin.php' ) ) );
	exit;
} );
add_action( 'admin_enqueue_scripts', function ( $hook ) {
	if ( 'toplevel_page_mojo-content' !== $hook ) return;
	wp_enqueue_media();
	wp_enqueue_style( 'mojo-content-admin', get_theme_file_uri( 'content-admin.css' ), array(), wp_get_theme()->get( 'Version' ) );
	wp_enqueue_script( 'mojo-content-admin', get_theme_file_uri( 'js/content-admin.js' ), array(), wp_get_theme()->get( 'Version' ), true );
} );

require_once get_template_directory() . '/content-editor.php';

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
	if ( empty( $_POST['mojo_complete'] ) ) wp_die( 'The form was incomplete. Return to the editor and try again.' );
	$rows = wp_unslash( $_POST['content'] ?? array() );
	$page = 1;
	if ( ! is_array( $rows ) ) wp_die( 'Invalid content.' );
	if ( isset( $groups[ $key ][0] ) ) {
		$current = array_values( mojo_content( $key ) );
		$page = max( 1, absint( $_POST['items_page'] ?? 1 ) );
		$offset = ( $page - 1 ) * MOJO_EDITOR_PAGE_SIZE;
		$revision = sanitize_text_field( wp_unslash( $_POST['collection_revision'] ?? '' ) );
		if ( $revision !== mojo_editor_revision( $current ) ) wp_die( 'This collection changed after you opened it. Reload the editor before saving.', '', array( 'response' => 409, 'back_link' => true ) );
		$replacement = array();
		$ids = array_fill_keys( array_column( $current, 'id' ), true );
		foreach ( $rows as $row ) {
			if ( ! is_array( $row ) ) continue;
			$item = mojo_clean_row( $row, $groups[ $key ][0] );
			if ( isset( $item['id'] ) && '' === $item['id'] ) {
				$slug = sanitize_title( $item['title'] ) ?: 'item';
				$item['id'] = $slug;
				for ( $suffix = 2; isset( $ids[ $item['id'] ] ); ++$suffix ) $item['id'] = $slug . '-' . $suffix;
				$ids[ $item['id'] ] = true;
			}
			$replacement[] = $item;
		}
		$clean = $current;
		array_splice( $clean, $offset, MOJO_EDITOR_PAGE_SIZE, $replacement );
		if ( in_array( $key, array( 'programs', 'packages' ), true ) && ( in_array( '', array_column( $clean, 'title' ), true ) || count( $clean ) !== count( array_unique( array_column( $clean, 'id' ) ) ) ) ) {
			wp_die( 'Each item needs a title and a unique ID.', '', array( 'back_link' => true ) );
		}
		$move = $_POST['move_page'] ?? '';
		if ( 'previous' === $move && $offset && $replacement ) {
			$item = $clean[ $offset ];
			$clean[ $offset ] = $clean[ $offset - 1 ];
			$clean[ $offset - 1 ] = $item;
			--$page;
		}
		if ( 'next' === $move && $replacement && isset( $clean[ $offset + count( $replacement ) ] ) ) {
			$last = $offset + count( $replacement ) - 1;
			$item = $clean[ $last ];
			$clean[ $last ] = $clean[ $last + 1 ];
			$clean[ $last + 1 ] = $item;
			++$page;
		}
		$page = min( $page, max( 1, (int) ceil( count( $clean ) / MOJO_EDITOR_PAGE_SIZE ) ) );
	} else {
		if ( 'contact' === $key ) {
			foreach ( array( 'closedDays', 'slots' ) as $field ) {
				$values = $rows[ $field ] ?? array();
				$rows[ $field ] = is_array( $values ) ? implode( ',', array_unique( array_filter( $values, 'is_string' ) ) ) : '';
			}
		}
		$clean = mojo_clean_row( $rows, $groups[ $key ] );
	}
	if ( 'contact' === $key ) {
		$times = array_merge( array( $clean['open'], $clean['close'] ), array_filter( array_map( 'trim', explode( ',', $clean['slots'] ) ) ) );
		foreach ( $times as $time ) if ( ! preg_match( '/^(?:[01]\d|2[0-3]):[0-5]\d$/D', $time ) ) wp_die( 'Use HH:MM for hours and lesson times.' );
		if ( $clean['open'] >= $clean['close'] || ! preg_match( '/^\s*(?:[0-6](?:\s*,\s*[0-6])*)?\s*$/D', $clean['closedDays'] ) ) wp_die( 'Check opening hours and closed weekdays.' );
	}
	update_option( 'mojo_content_' . $key, $clean, false );
	wp_safe_redirect( add_query_arg( 'saved', '1', mojo_editor_url( $key, $page ) ) );
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
