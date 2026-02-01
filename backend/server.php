<?php

$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)
);

// Check if the request is for a real file or directory
if ($uri !== '/' && file_exists(__DIR__.'/public'.$uri)) {
    return false;
}

// If it is not, load the index.php file (Laravel's public/index.php)
require_once __DIR__.'/public/index.php';
