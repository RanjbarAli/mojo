<?php
defined( 'ABSPATH' ) || exit;

add_action( 'init', function () {
	register_post_type( 'mojo_event', array(
		'labels' => array( 'name' => 'Events', 'singular_name' => 'Event', 'add_new_item' => 'Add event', 'edit_item' => 'Edit event' ),
		'public' => true, 'menu_icon' => 'dashicons-calendar-alt', 'rewrite' => array( 'slug' => 'event' ),
		'supports' => array( 'title', 'editor', 'thumbnail', 'page-attributes', 'revisions' ),
	) );
	if ( get_option( 'mojo_events_imported' ) ) return;
	global $wpdb;
	$lock = 'mojo_events_' . md5( DB_NAME . $wpdb->prefix );
	if ( '1' !== (string) $wpdb->get_var( $wpdb->prepare( 'SELECT GET_LOCK(%s, 0)', $lock ) ) ) return;
	try {
		if ( get_option( 'mojo_events_imported' ) ) return;
		foreach ( mojo_content( 'past-events' ) as $index => $row ) {
			$key = 'import-' . $index;
			if ( get_posts( array( 'post_type' => 'mojo_event', 'post_status' => 'any', 'meta_key' => '_mojo_source', 'meta_value' => $key, 'fields' => 'ids' ) ) ) continue;
			$meta = array( '_mojo_source' => $key );
			foreach ( array( 'year', 'tag', 'icon', 'img', 'alt' ) as $field ) $meta[ '_mojo_' . $field ] = $row[ $field ];
			$id = wp_insert_post( wp_slash( array( 'post_type' => 'mojo_event', 'post_status' => 'publish', 'post_title' => $row['title'],
				'post_content' => $row['text'], 'menu_order' => $index, 'meta_input' => $meta ) ), true );
			if ( is_wp_error( $id ) ) return;
			if ( ctype_digit( (string) $row['img'] ) ) set_post_thumbnail( $id, (int) $row['img'] );
		}
		update_option( 'mojo_events_imported', 1 );
		flush_rewrite_rules( false );
	} finally {
		$wpdb->get_var( $wpdb->prepare( 'SELECT RELEASE_LOCK(%s)', $lock ) );
	}
}, 20 );

add_action( 'add_meta_boxes_mojo_event', function () {
	add_meta_box( 'mojo_event_details', 'Event card', function ( $post ) {
		wp_nonce_field( 'mojo_event_save', 'mojo_event_nonce' );
		foreach ( array( 'year' => 'Season', 'tag' => 'Badge', 'icon' => 'Lucide icon', 'alt' => 'Image description', 'img' => 'Fallback image URL or theme asset' ) as $field => $label ) {
			printf( '<p><label>%s<br><input class="widefat" name="mojo_event[%s]" value="%s"></label></p>', esc_html( $label ), esc_attr( $field ), esc_attr( get_post_meta( $post->ID, '_mojo_' . $field, true ) ) );
		}
	}, 'mojo_event' );
} );
add_action( 'save_post_mojo_event', function ( $id ) {
	if ( ! isset( $_POST['mojo_event_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['mojo_event_nonce'] ), 'mojo_event_save' ) || ! current_user_can( 'edit_post', $id ) ) return;
	foreach ( array( 'year', 'tag', 'icon', 'img', 'alt' ) as $key ) {
		update_post_meta( $id, '_mojo_' . $key, sanitize_text_field( wp_unslash( $_POST['mojo_event'][ $key ] ?? '' ) ) );
	}
} );
function mojo_event_cards() {
	$cards = array();
	foreach ( get_posts( array( 'post_type' => 'mojo_event', 'numberposts' => -1, 'orderby' => 'menu_order date', 'order' => 'ASC', 'has_password' => false ) ) as $post ) {
		$row = array( 'title' => $post->post_title, 'text' => get_the_excerpt( $post ), 'url' => get_permalink( $post ) );
		foreach ( array( 'year', 'tag', 'icon', 'img', 'alt' ) as $field ) $row[ $field ] = get_post_meta( $post->ID, '_mojo_' . $field, true );
		if ( has_post_thumbnail( $post ) ) $row['img'] = (string) get_post_thumbnail_id( $post );
		$cards[] = $row;
	}
	return $cards;
}
