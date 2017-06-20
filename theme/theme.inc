<?php

/**
 * @file
 * Theme hooks.
 */

/**
 * Implements hook_preprocess_theme().
 */
function flvc_bookreader_preprocess_flvc_tocview(array &$variables) {
  $object = $variables['object'];

  if (isset($object['TOC'])) {
    $toc_entries = drupal_json_decode($object['TOC']->content);
    $tree_entries = array();
    $last_parent = '#';
    for ($i=0; $i < count($toc_entries['table_of_contents']); $i++) {
      $tree_entry = array();
      $id = 'TC' . $i;
      $tree_entry['id'] = $id;
      $tree_entry['type'] = $toc_entries['table_of_contents'][$i]['type'];
      $tree_entry['text'] = $toc_entries['table_of_contents'][$i]['title'];
      $tree_entry['pagenum'] = $toc_entries['table_of_contents'][$i]['pagenum'];
      if ($toc_entries['table_of_contents'][$i]['level'] == 1) {
        $tree_entry['parent'] = '#';
        $last_parent = $id;
      }
      else {
        $tree_entry['parent'] = $last_parent;
      }
      $tree_entries[] = $tree_entry;
    }
  }

  $toc_settings = array(
    'data' => $tree_entries,
    'types' => array(
      'chapter' => array(),
      'page' => array(),
    ),
    'plugins' => array(
      'types',
      'ui',
      'state',
    ),
    'object' => $object->id,
    'mode' => (int) variable_get('islandora_internet_archive_bookreader_default_page_view', 1),
  );

  $data_array = array(
    'flvc_toc' => $toc_settings,
  );

  drupal_add_js($data_array, 'setting');

  $module_path = drupal_get_path('module', 'flvc_bookreader');
  $library_path = libraries_get_path('jstree');
  drupal_add_css("$library_path/dist/themes/default/style.min.css", array(
    'group' => CSS_SYSTEM,
  ));
  drupal_add_js("$module_path/js/jquery.min.js", array(
    'group' => JS_LIBRARY,
    'weight' => -5,
  ));
  drupal_add_js("$library_path/dist/jstree.min.js", array(
    'group' => JS_LIBRARY,
    'weight' => -5,
  ));

  drupal_add_js("$module_path/js/toctree.js", array(
    'group' => JS_LIBRARY,
    'weight' => -5,
  ));
}
