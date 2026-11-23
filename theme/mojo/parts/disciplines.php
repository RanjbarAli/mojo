<?php
defined( 'ABSPATH' ) || exit;
$programs = array_values( array_filter( mojo_content( 'programs' ), static fn( $program ) => 'no' !== ( $program['showInDisciplines'] ?? 'yes' ) ) );
$home = mojo_content( 'home' );
$tiles = $programs;
array_splice( $tiles, 2, 0, array( 'booking' ) );
array_splice( $tiles, 4, 0, array( 'about' ) );
$number = 0;
?>
<div class="bento" id="bento">
<?php foreach ( $tiles as $tile ) : ?>
	<?php if ( 'booking' === $tile ) : ?>
		<a class="tile tile--flat tile--orange" href="<?php echo esc_url( mojo_url( 'booking' ) ); ?>"><span class="ico"><i data-lucide="sprout"></i></span>
			<span><b><?php echo esc_html( $home['promoTitle'] ); ?></b><br><span><?php echo esc_html( $home['promoCopy'] ); ?></span></span><span class="link-w"><?php echo esc_html( $home['bookingTileLink'] ); ?> <i data-lucide="arrow-right"></i></span></a>
	<?php elseif ( 'about' === $tile ) : ?>
		<a class="tile tile--flat tile--azure" href="<?php echo esc_url( mojo_url( 'about' ) ); ?>"><span class="big"><?php echo esc_html( $home['horses_count'] ); ?>+</span>
			<span><b><?php echo esc_html( $home['horseLabel'] ); ?></b><br><span><?php echo esc_html( $home['horseCopy'] ); ?></span></span><span class="link-w"><?php echo esc_html( $home['stableTileLink'] ); ?> <i data-lucide="arrow-right"></i></span></a>
	<?php else : ++$number; ?>
		<button type="button" class="tile<?php echo in_array( $number, array( 1, 4 ), true ) ? ' tile--w' : ''; ?>" data-program="<?php echo esc_attr( $tile['id'] ); ?>" aria-label="<?php echo esc_attr( $tile['title'] ); ?>">
			<img src="<?php echo esc_url( mojo_media_url( $tile['img'] ) ); ?>" alt="" loading="lazy"><span class="bib tile__bib">No.<?php echo esc_html( sprintf( '%02d', $number ) ); ?></span>
			<span class="tile__go"><i data-lucide="arrow-up-right"></i></span>
			<span class="tile__body"><b><?php echo esc_html( $tile['title'] ); ?></b><small><?php echo esc_html( $tile['duration'] . ' · ' . $tile['level'] ); ?></small></span>
		</button>
	<?php endif; ?>
<?php endforeach; ?>
</div>
