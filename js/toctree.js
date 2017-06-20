/**
 * @file
 * Create a jsTree for use in rendering a table of contents.
 */

Drupal.settings.tocTree_jQuery = jQuery.noConflict(true);
(function ($) {
    Drupal.behaviors.tocTree = {
        attach: function(context, settings) {
            $('#flvc_toc_tree_view').jstree({
                'core': {
                    'themes': { 'icons':false },
                    'data': settings.flvc_toc.data
                },
                'types': settings.flvc_toc.types,
                'plugins' : settings.flvc_toc.plugins
            });
            $('#flvc_toc_tree_view').bind("select_node.jstree", function(node, selected, event) {
                var mode = '/mode/' + settings.flvc_toc.mod + 'up';
                if (typeof selected.event != 'undefined') {
                    if (selected.event.type == 'click') {
                        window.location = Drupal.settings.basePath + 'islandora/object/' + settings.flvc_toc.object + '#page/n' + (selected.node.original.pagenum - 1) + mode;
                    }
                }
            });
        }
    };
})(Drupal.settings.tocTree_jQuery);
