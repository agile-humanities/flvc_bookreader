# flvc_bookreader

## Introduction

Add page labels, chapter markers, and a Table of Contents tab to books with a TOC datastream.

## Requirements

This module requires the following modules/libraries:

* [Islandora Internet Archive BookReader](https://github.com/islandora/islandora_internet_archive_bookreader)
* [jsTree](https://github.com/vakata/jstree)

## Installation

Install as usual, see [this](https://drupal.org/documentation/install/modules-themes/modules-7) for further information.

Download/clone the [jsTree](https://github.com/vakata/jstree) library to `sites/all/libraries/jstree`. The module has been tested with the 3.3.1 release of jsTree.

## Configuration

Add a TOC datastream to any book object. Samples of TOC datastreams are in the examples directory.

## Troubleshooting

The Bookreader chapter markers do not appear in the navigation bar: if you have installed the jQuery Update module, you might have to lower the Default jQuery Version in its configuration settings.  Running under Islandora Vagrant, I had to set the jQuery version down to 1.7 before the Bookreader chapter markers would show up in the navigation bar.
