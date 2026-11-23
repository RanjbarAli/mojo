<?php
defined( 'ABSPATH' ) || exit;

add_action( 'init', function () {
	register_post_type( 'mojo_request', array(
		'label' => 'Riding enquiries', 'public' => false, 'show_ui' => true,
		'show_in_rest' => false, 'supports' => array( 'title', 'editor' ),
		'capabilities' => array_fill_keys( array( 'edit_post', 'read_post', 'delete_post', 'edit_posts', 'edit_others_posts', 'publish_posts', 'read_private_posts', 'delete_posts', 'delete_private_posts', 'delete_published_posts', 'delete_others_posts', 'edit_private_posts', 'edit_published_posts' ), 'manage_options' ),
		'map_meta_cap' => false,
	) );
} );

function mojo_submit_request() {
	check_ajax_referer( 'mojo-request', 'nonce' );
	$forms = array(
		'demoForm' => array( 'name', 'phone', 'phone_code', 'interest', 'level', 'whatsapp' ),
		'eventForm' => array( 'name', 'phone', 'phone_code', 'type', 'date', 'guests', 'addon', 'notes' ),
		'bookForm' => array( 'fullname', 'phone', 'phone_code', 'email', 'program', 'date', 'time', 'ltype', 'riders', 'dob', 'nationality', 'member', 'rlevel', 'notes', 'reminders', 'terms' ),
		'contactForm' => array( 'name', 'email', 'phone', 'phone_code', 'topic', 'message', 'copy' ),
	);
	$required = array( 'demoForm' => array( 'name', 'phone', 'level', 'interest' ), 'eventForm' => array( 'name', 'phone', 'type', 'date', 'guests' ), 'bookForm' => array( 'fullname', 'email', 'phone', 'date', 'time', 'program', 'terms', 'dob', 'rlevel', 'ltype', 'riders', 'nationality' ), 'contactForm' => array( 'name', 'email', 'message', 'topic' ) );
	$kind = sanitize_text_field( wp_unslash( $_POST['kind'] ?? '' ) );
	if ( ! isset( $forms[ $kind ] ) ) wp_send_json_error( null, 400 );
	$fields = array();
	foreach ( $forms[ $kind ] as $key ) {
		$value = wp_unslash( $_POST[ $key ] ?? '' );
		if ( ! is_string( $value ) || strlen( $value ) > 6000 ) wp_send_json_error( null, 400 );
		$fields[ $key ] = sanitize_textarea_field( $value );
	}
	foreach ( $required[ $kind ] as $key ) {
		if ( '' === $fields[ $key ] ) wp_send_json_error( null, 422 );
	}
	if ( ! empty( $fields['email'] ) && ! is_email( $fields['email'] ) ) wp_send_json_error( null, 422 );
	$choices = array(
		'level' => array( 'none', 'some', 'regular' ), 'interest' => array( 'riding', 'jumping', 'dressage', 'kids' ),
		'topic' => array( 'lessons', 'jumping', 'leasing', 'young', 'events', 'cafe', 'other' ),
		'rlevel' => array( 'Beginner', 'Intermediate', 'Advanced' ), 'ltype' => array( 'Private', 'Semi-private', 'Group' ),
		'terms' => array( 'on' ),
	);
	if ( 'eventForm' === $kind ) $choices['type'] = array_merge( array_column( mojo_content( 'packages' ), 'id' ), array( 'school', 'other' ) );
	foreach ( $choices as $key => $allowed ) {
		if ( isset( $fields[ $key ] ) && ! in_array( $fields[ $key ], $allowed, true ) ) wp_send_json_error( null, 422 );
	}
	if ( mb_strlen( $fields['name'] ?? $fields['fullname'] ) < 3
		|| ( $fields['phone'] && strlen( preg_replace( '/\D/', '', $fields['phone'] ) ) < 7 )
		|| ( isset( $fields['message'] ) && ( mb_strlen( $fields['message'] ) < 10 || mb_strlen( $fields['message'] ) > 600 ) )
		|| ( isset( $fields['notes'] ) && mb_strlen( $fields['notes'] ) > ( 'bookForm' === $kind ? 300 : 400 ) ) ) wp_send_json_error( null, 422 );
	if ( isset( $fields['nationality'] ) && ! preg_match( '/^[A-Z]{2}$/D', $fields['nationality'] ) ) wp_send_json_error( null, 422 );
	if ( ! empty( $fields['addon'] ) && array_diff( array_map( 'trim', explode( ',', $fields['addon'] ) ), array( 'catering', 'pony', 'photo' ) ) ) wp_send_json_error( null, 422 );
	foreach ( array( 'riders' => array( 1, 6 ), 'guests' => array( 5, 200 ) ) as $field => $bounds ) {
		if ( isset( $fields[ $field ] ) && ( ! ctype_digit( $fields[ $field ] ) || $fields[ $field ] < $bounds[0] || $fields[ $field ] > $bounds[1] ) ) wp_send_json_error( null, 422 );
	}
	if ( 'eventForm' === $kind || 'bookForm' === $kind ) {
		$is_event = 'eventForm' === $kind;
		$value = $fields[ $is_event ? 'date' : 'dob' ];
		$zone = new DateTimeZone( 'Asia/Muscat' );
		$date = DateTimeImmutable::createFromFormat( '!d/m/Y', $value, $zone );
		$today = new DateTimeImmutable( 'today', $zone );
		if ( ! $date || $date->format( 'd/m/Y' ) !== $value || ( $is_event ? $date < $today : ( $date > $today || $date->format( 'Y' ) <= 1920 ) ) ) wp_send_json_error( null, 422 );
	}
	if ( 'bookForm' === $kind ) {
		$programs = array_filter( mojo_content( 'programs' ), static fn( $p ) => 'yes' === $p['bookable'] );
		$schedule = mojo_content( 'contact' );
		$zone = new DateTimeZone( 'Asia/Muscat' );
		$stamp = $fields['date'] . ' ' . $fields['time'];
		$when = DateTimeImmutable::createFromFormat( '!Y-m-d H:i', $stamp, $zone );
		if ( ! in_array( $fields['program'], array_column( $programs, 'id' ), true )
			|| ! $when || $when->format( 'Y-m-d H:i' ) !== $stamp || $when <= new DateTimeImmutable( 'now', $zone )
			|| $when >= new DateTimeImmutable( 'today +61 days', $zone )
			|| in_array( $when->format( 'w' ), array_map( 'trim', explode( ',', $schedule['closedDays'] ) ), true )
			|| ! in_array( $fields['time'], array_map( 'trim', explode( ',', $schedule['slots'] ) ), true )
			|| $fields['time'] < $schedule['open'] || $fields['time'] >= $schedule['close'] ) wp_send_json_error( null, 422 );
	}
	$limit = 'mojo_req_' . wp_hash( $kind . '|' . ( $_SERVER['REMOTE_ADDR'] ?? '' ) );
	if ( get_transient( $limit ) ) wp_send_json_error( null, 429 );
	$lines = array();
	foreach ( array_filter( $fields, 'strlen' ) as $key => $value ) {
		$lines[] = ucfirst( $key ) . ': ' . $value;
	}
	$id = wp_insert_post( wp_slash( array( 'post_type' => 'mojo_request', 'post_status' => 'private',
		'post_title' => str_replace( 'Form', '', ucfirst( $kind ) ) . ' — ' . ( $fields['fullname'] ?? $fields['name'] ),
		'post_content' => implode( "\n", $lines ),
	) ), true );
	if ( is_wp_error( $id ) ) wp_send_json_error( null, 500 );
	set_transient( $limit, 1, 15 );
	wp_send_json_success( array( 'reference' => 'MJ-' . $id ) );
}
add_action( 'wp_ajax_mojo_request', 'mojo_submit_request' );
add_action( 'wp_ajax_nopriv_mojo_request', 'mojo_submit_request' );
