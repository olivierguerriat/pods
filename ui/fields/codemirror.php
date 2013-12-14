<?php
wp_enqueue_script( 'pods-codemirror' );
wp_enqueue_script( 'pods-code-complete' );
wp_enqueue_style( 'pods-codemirror' );
wp_enqueue_script( 'pods-codemirror-loadmode' );

$type = 'textarea';
$attributes = array();
$attributes[ 'tabindex' ] = 2;
$attributes = PodsForm::merge_attributes( $attributes, $name, $form_field_type, $options, 'pods-ui-field-codemirror' );
?>
<div class="code-toolbar"><!-- Placeholder --></div>
<textarea<?php PodsForm::attributes( $attributes, $name, $form_field_type, $options ); ?>><?php echo esc_textarea( $value ); ?></textarea>
<div class="code-footer"><!-- Placeholder --></div>

<script>
    var $textarea_<?php echo pods_clean_name( $attributes[ 'name' ] ); ?>, codemirror_<?php echo pods_clean_name( $attributes[ 'name' ] ); ?>;

    jQuery( function ( $ ) {
        $textarea_<?php echo pods_clean_name( $attributes[ 'name' ] ); ?> = jQuery( 'textarea#<?php echo $attributes[ 'id' ]; ?>' );

        CodeMirror.modeURL = "<?php echo PODS_URL ?>ui/js/codemirror/mode/%N/%N.js";
        if ( 'undefined' == typeof codemirror_<?php echo pods_clean_name( $attributes[ 'name' ] ) ?> ) {

            codemirror_<?php echo pods_clean_name( $attributes[ 'name' ] ); ?> = CodeMirror.fromTextArea( document.getElementById( "<?php echo $attributes[ 'id' ] ?>" ), {
                lineNumbers : true,
                matchBrackets : true,                
                mode: "mustache",
                indentUnit : 4,
                indentWithTabs : false,
                lineWrapping : true,
                enterMode : "keep",
                tabMode : "shift",
                extraKeys: {"Ctrl-P": load_pod_dialog}
            } );
            //load_pod_dialog(cm);
            codemirror_<?php echo pods_clean_name( $attributes[ 'name' ] ); ?>.on('keyup', podFields);
            codemirror_<?php echo pods_clean_name( $attributes[ 'name' ] ); ?>.on('blur', function () {
                    var value = codemirror_<?php echo pods_clean_name( $attributes[ 'name' ] ); ?>.getValue();
                    $textarea_<?php echo pods_clean_name( $attributes[ 'name' ] ); ?>.val( value );
                });
            CodeMirror.autoLoadMode( codemirror_<?php echo pods_clean_name( $attributes[ 'name' ] ); ?>, 'php' );
        }
    } );
</script>
<div class="pods-ui-autocomplete-references hidden">
    Pod: <?php
    $api = pods_api();
    $_pods = $api->load_pods();
    echo '<select class="pod-switch" data-nonce="'.wp_create_nonce( 'pods-component-templates-load_pod' ).'" />';
    echo '<option value="">Select Pod to Use</option>';
    foreach($_pods as $pod){
        echo '<option value="'.$pod['name'].'" ' . ( $value == $pod['name'] ? 'selected="selected"' : '' ) . '>'.$pod['label'].'</option>';
    }
    echo '</select>'; ?>
</div>
<div class="pods-ui-autocomplete-references-table hidden"></div>