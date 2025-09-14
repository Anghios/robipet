<?php
// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_NAME', 'test_db');
define('DB_USER', 'root');
define('DB_PASS', '');

// Para SQLite (alternativa más simple)
define('DB_SQLITE_PATH', dirname(__DIR__) . '/db/database.sqlite');
?>