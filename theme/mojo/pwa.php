<?php
defined( 'ABSPATH' ) || exit;

add_action( 'template_redirect', function () {
	$type = $_GET['mojo_pwa'] ?? '';
	if ( ! in_array( $type, array( 'manifest', 'worker' ), true ) ) return;
	status_header( 200 );
	nocache_headers();
	$home = home_url( '/' );
	if ( 'manifest' === $type ) {
		header( 'Content-Type: application/manifest+json; charset=UTF-8' );
		$icons = array();
		foreach ( array( 192, 512 ) as $size ) $icons[] = array( 'src' => get_theme_file_uri( "assets/pwa/icon-$size.png" ), 'sizes' => "$size" . 'x' . $size, 'type' => 'image/png', 'purpose' => 'any maskable' );
		echo wp_json_encode( array( 'id' => $home, 'start_url' => $home, 'scope' => $home, 'display' => 'standalone', 'name' => get_bloginfo( 'name' ), 'short_name' => 'Mojo', 'theme_color' => '#0c2540', 'background_color' => '#ffffff', 'icons' => $icons ) );
	} else {
		header( 'Content-Type: application/javascript; charset=UTF-8' );
		echo 'const offlineURL = ' . wp_json_encode( get_theme_file_uri( 'assets/pwa/offline.html' ) ) . ";\n";
		echo 'const cachePrefix = ' . wp_json_encode( 'mojo-offline-' . md5( $home ) . '-' ) . ";\n";
		echo 'const cacheName = cachePrefix + ' . wp_json_encode( wp_get_theme()->get( 'Version' ) ) . ";\n";
		readfile( get_theme_file_path( 'js/worker.js' ) );
	}
	exit;
}, 0 );
add_action( 'wp_head', function () {
	printf( '<link rel="manifest" href="%s"><link rel="apple-touch-icon" href="%s"><meta name="theme-color" content="#0c2540">', esc_url( add_query_arg( 'mojo_pwa', 'manifest', home_url( '/' ) ) ), esc_url( get_theme_file_uri( 'assets/pwa/icon-192.png' ) ) );
} );
