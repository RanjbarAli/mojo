<?php
defined( 'ABSPATH' ) || exit;

// The toolbar belongs in the dashboard, outside the public theme.
add_filter( 'show_admin_bar', '__return_false', PHP_INT_MAX );

// Puravi's scroll-to-top template requires functions from its own theme.
add_action( 'wp', function () {
	if ( class_exists( 'PuraviPlusSiteToTop', false ) && ! function_exists( 'puravi_get_template_part' ) ) {
		remove_action( 'wp_footer', array( PuraviPlusSiteToTop::instance(), 'load_template' ), 999 );
	}
} );

add_action( 'after_setup_theme', function () {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'custom-logo', array( 'flex-width' => true, 'flex-height' => true ) );
	add_post_type_support( 'page', 'excerpt' );
	register_nav_menu( 'primary', 'Primary navigation' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'html5', array( 'gallery', 'caption', 'search-form', 'style', 'script' ) );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'editor.css' );
	add_image_size( 'mojo-card', 760, 480, true );
} );
add_filter( 'use_block_editor_for_post_type', function ( $enabled, $type ) {
	return in_array( $type, array( 'post', 'page' ), true ) ? false : $enabled;
}, 10, 2 );
add_filter( 'use_widgets_block_editor', '__return_false' );

require_once get_template_directory() . '/content.php';

function mojo_pages() {
	return array( 'about' => 'About', 'services' => 'Programs', 'events' => 'Events', 'blog' => 'Journal', 'contact' => 'Contact', 'booking' => 'Book a lesson' );
}

function mojo_page_id( $key ) {
	static $ids = array();
	if ( ! isset( $ids[ $key ] ) ) {
		$assigned = get_posts( array( 'post_type' => 'page', 'numberposts' => 1, 'fields' => 'ids',
			'meta_key' => '_wp_page_template', 'meta_value' => 'layouts/' . $key . '.php' ) );
		$page = $assigned ? null : get_page_by_path( $key );
		if ( ! $assigned && ( ! $page || 'publish' !== $page->post_status ) && 'about' === $key ) {
			$page = get_page_by_path( 'about-2' );
		}
		$ids[ $key ] = $assigned[0] ?? ( $page && 'publish' === $page->post_status ? $page->ID : 0 );
	}
	return $ids[ $key ];
}

function mojo_url( $key, $suffix = '' ) {
	$id  = 'home' === $key ? 0 : mojo_page_id( $key );
	$url = $id ? get_permalink( $id ) : home_url( '/' );
	if ( str_starts_with( $suffix, '?' ) ) {
		wp_parse_str( substr( $suffix, 1 ), $args );
		return add_query_arg( $args, $url );
	}
	return $url . $suffix;
}

add_action( 'after_switch_theme', function () {
	foreach ( mojo_pages() as $key => $title ) {
		if ( ! mojo_page_id( $key ) ) {
			wp_insert_post( array( 'post_type' => 'page', 'post_status' => 'publish', 'post_name' => $key,
				'post_title' => $title, 'page_template' => 'layouts/' . $key . '.php' ) );
		}
	}
} );

function mojo_view() {
	if ( is_page() && post_password_required() ) return 'entry';
	if ( is_front_page() ) return 'home';
	if ( is_home() ) return 'blog';
	if ( is_page() ) {
		foreach ( mojo_pages() as $key => $label ) {
			if ( get_queried_object_id() === mojo_page_id( $key ) || is_page_template( 'layouts/' . $key . '.php' ) ) return $key;
		}
	}
	return 'entry';
}
function mojo_current( $key ) {
	if ( mojo_view() === $key ) echo 'aria-current="page"';
}

add_action( 'wp_enqueue_scripts', function () {
	$v = wp_get_theme()->get( 'Version' );
	wp_enqueue_style( 'mojo-fonts', 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,500..900&family=Inter:wght@400;500;600;700&display=swap', array(), null );
	wp_enqueue_style( 'mojo', get_stylesheet_uri(), array(), $v );
	$libs = array( 'lucide' => 'lucide@0.460.0/dist/umd/lucide', 'gsap' => 'gsap@3.13.0/dist/gsap', 'ScrollTrigger' => 'gsap@3.13.0/dist/ScrollTrigger', 'ScrollSmoother' => 'gsap@3.13.0/dist/ScrollSmoother' );
	foreach ( $libs as $key => $path ) {
		$deps = in_array( $key, array( 'lucide', 'gsap' ), true ) ? array() : array( 'gsap' );
		wp_enqueue_script( $key, 'https://cdn.jsdelivr.net/npm/' . $path . '.min.js', $deps, null, true );
	}
	wp_enqueue_script( 'mojo-data', get_theme_file_uri( 'js/data.js' ), array(), $v, true );
	wp_add_inline_script( 'mojo-data', 'window.MOJO_WP=' . wp_json_encode( array(
		'content' => mojo_browser_content(),
		'about' => mojo_url( 'about' ), 'home' => home_url( '/' ),
		'booking' => mojo_url( 'booking' ),
		'ajax' => admin_url( 'admin-ajax.php' ), 'nonce' => wp_create_nonce( 'mojo-request' ),
	), JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT ) . ';', 'before' );
	wp_enqueue_script( 'mojo-core', get_theme_file_uri( 'js/core.js' ), array_merge( array_keys( $libs ), array( 'mojo-data' ) ), $v, true );
	wp_enqueue_script( 'mojo-pages', get_theme_file_uri( 'js/pages.js' ), array( 'mojo-core' ), $v, true );
} );

function mojo_primary_menu() {
	wp_nav_menu( array( 'theme_location' => 'primary', 'container' => false, 'items_wrap' => '%3$s', 'depth' => 1, 'fallback_cb' => false ) );
}
add_filter( 'nav_menu_link_attributes', function ( $attrs, $item, $args ) {
	if ( 'primary' === $args->theme_location ) $attrs['class'] = 'nav-link';
	return $attrs;
}, 10, 3 );

// Preserve imported builder content until an editor explicitly replaces it.
add_action( 'post_updated', function ( $id, $after, $before ) {
	if ( 'page' === $after->post_type && $after->post_content !== $before->post_content && is_admin()
		&& isset( $_POST['action'] ) && 'editpost' === $_POST['action'] && current_user_can( 'edit_page', $id ) ) {
		update_post_meta( $id, '_mojo_classic_content', 1 );
	}
}, 10, 3 );

require get_template_directory() . '/requests.php';
require get_template_directory() . '/events.php';
require get_template_directory() . '/pwa.php';
