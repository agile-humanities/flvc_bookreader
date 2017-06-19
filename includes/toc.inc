<?php

/**
 * Wrppaer to add Table of Content to Book Pbject
 */
function flvc_add_toc($object) {
  module_load_include('inc', 'islandora', 'includes/breadcrumb');
  module_load_include('inc', 'islandora', 'includes/utilities');
  drupal_set_breadcrumb(islandora_get_breadcrumbs($object));
  return drupal_get_form('flvc_toc_upload_form', $object->id);
}

/**
 * Defines the TOC upload form.
 *
 * @param array $form
 *   The Drupal form definition.
 * @param array $form_state
 *   The Drupal form state.
 * @param string $book_pid
 *   PID of book into which pages are being ingested.
 *
 * @return array
 *   Drupal form definition.
 */
function flvc_toc_upload_form($form, $form_state, $book_pid) {

  $book_object = islandora_object_load($book_pid);
  $submit_prompt = isset($book_object['TOC']) ? t('Update Table of Contents') : t('Add Table of Contents');
  $upload_size = min((int) ini_get('post_max_size'), (int) ini_get('upload_max_filesize'));
  $extensions = array('json');
  $form = array();


  $form['file'] = array(
    '#title' => t('TOC JSON file.'),
    '#type' => 'managed_file',
    '#required' => TRUE,
    '#description' => t('Select file to upload.<br/>Files must be less than <b>@size MB.</b><br/>Allowed file types: <b>@ext.</b>', array('@size' => $upload_size, '@ext' => $extensions[0])),
    '#default_value' => isset($form_state['values']['files']) ? $form_state['values']['files'] : NULL,
    '#upload_location' => 'temporary://',
    '#upload_validators' => array(
      'file_validate_extensions' => $extensions,
      'file_validate_size' => array($upload_size * 1024 * 1024),
    ),
  );

  $form['book_pid'] = array(
    '#type' => 'hidden',
    '#value' => $book_pid,
  );
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => $submit_prompt,
  );
  return $form;
}

/**
 * Submit handler for uploaded TOC file.
 *
 * @param array $form
 *   The Drupal form definition.
 * @param array $form_state
 *   The Drupal form state.
 */
function flvc_toc_upload_form_submit(array $form, array &$form_state) {
  $book_pid = $form_state['values']['book_pid'];
  $book_object = islandora_object_load($book_pid);
  if (!$book_object) {
    drupal_set_message(t("This book does not exist in this repository"), 'warning');
    return;
  }
  $json_file = file_load($form_state['values']['file']);
  $json = file_get_contents($json_file->uri);
  if (isset($book_object['TOC'])) {
    $book_object['TOC']->content = $json;
    drupal_set_message(t('Table of Contents Updated'));
  }
  else {
    $ds = $book_object->constructDatastream('TOC', 'M');
    $ds->setContentFromString($json, FALSE);
    $ds->label = 'TOC';
    $ds->mimetype = 'application/json';
    $book_object->ingestDatastream($ds);
    drupal_set_message(t('Table of Contents Added'));
  }
  $form_state['redirect'] = "islandora/object/$book_pid";
}
