<?php
/**
 * @file
 *
 */
?>
<?php if (isset($toc_entries['title'])): ?>
  <?php $booktitle = $toc_entries['title']; ?>
  <?php print "<h3>$booktitle</h3>"; ?>
<?php endif; ?>
<h4>Table of Contents</h4>
<div id="flvc_toc_tree_view"></div>
