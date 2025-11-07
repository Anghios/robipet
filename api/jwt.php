<?php
/**
 * Clase JWT (JSON Web Token)
 * Implementación simple sin dependencias externas
 */
class JWT {

    /**
     * Obtiene la clave secreta para firmar los tokens
     * Usa variable de entorno JWT_SECRET o genera una por defecto
     */
    private static function getSecretKey() {
        // Intentar obtener de variable de entorno
        $secret = getenv('JWT_SECRET');

        // Si no existe o usa el valor por defecto, advertir
        if (!$secret || $secret === 'CHANGE_THIS_IN_PRODUCTION_USE_A_SECURE_RANDOM_STRING') {
            // Log de advertencia para producción
            error_log('WARNING: Using default JWT secret key. This is insecure for production! Set JWT_SECRET environment variable.');

            // Generar una clave basada en DB_SQLITE_PATH para consistencia en desarrollo
            $secret = hash('sha256', DB_SQLITE_PATH . 'robipet_jwt_secret_key_2024');
        }

        return $secret;
    }

    /**
     * Codifica en base64url (variante segura para URLs)
     */
    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * Decodifica desde base64url
     */
    private static function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/'));
    }

    /**
     * Genera un JWT
     * @param array $payload - Datos a incluir en el token (userId, username, role, etc.)
     * @param int $expirationHours - Horas hasta que expire el token (default: 24)
     * @return string - Token JWT
     */
    public static function generate($payload, $expirationHours = 24) {
        // Header del JWT
        $header = [
            'typ' => 'JWT',
            'alg' => 'HS256'
        ];

        // Agregar timestamps al payload
        $now = time();
        $payload['iat'] = $now; // Issued at
        $payload['exp'] = $now + ($expirationHours * 3600); // Expiration

        // Codificar header y payload
        $headerEncoded = self::base64UrlEncode(json_encode($header));
        $payloadEncoded = self::base64UrlEncode(json_encode($payload));

        // Crear firma
        $signature = hash_hmac('sha256', "$headerEncoded.$payloadEncoded", self::getSecretKey(), true);
        $signatureEncoded = self::base64UrlEncode($signature);

        // Retornar token completo
        return "$headerEncoded.$payloadEncoded.$signatureEncoded";
    }

    /**
     * Valida y decodifica un JWT
     * @param string $token - Token JWT a validar
     * @return array|false - Payload decodificado o false si es inválido
     */
    public static function validate($token) {
        // Verificar formato
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return false;
        }

        list($headerEncoded, $payloadEncoded, $signatureEncoded) = $parts;

        // Verificar firma
        $signature = self::base64UrlDecode($signatureEncoded);
        $expectedSignature = hash_hmac('sha256', "$headerEncoded.$payloadEncoded", self::getSecretKey(), true);

        if (!hash_equals($expectedSignature, $signature)) {
            return false; // Firma inválida
        }

        // Decodificar payload
        $payload = json_decode(self::base64UrlDecode($payloadEncoded), true);

        if (!$payload) {
            return false; // Payload inválido
        }

        // Verificar expiración
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return false; // Token expirado
        }

        return $payload;
    }

    /**
     * Extrae el token del header Authorization
     * @return string|null - Token o null si no existe
     */
    public static function getTokenFromHeader() {
        // Verificar header Authorization en múltiples ubicaciones
        $authHeader = null;

        // Método 1: HTTP_AUTHORIZATION
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        }
        // Método 2: REDIRECT_HTTP_AUTHORIZATION (para servidores con CGI/FastCGI)
        elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }
        // Método 3: Authorization directamente
        elseif (isset($_SERVER['Authorization'])) {
            $authHeader = $_SERVER['Authorization'];
        }
        // Método 4: apache_request_headers()
        elseif (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            if (isset($headers['Authorization'])) {
                $authHeader = $headers['Authorization'];
            } elseif (isset($headers['authorization'])) {
                $authHeader = $headers['authorization'];
            }
        }
        // Método 5: getallheaders()
        elseif (function_exists('getallheaders')) {
            $headers = getallheaders();
            if (isset($headers['Authorization'])) {
                $authHeader = $headers['Authorization'];
            } elseif (isset($headers['authorization'])) {
                $authHeader = $headers['authorization'];
            }
        }

        if (!$authHeader) {
            return null;
        }

        // Formato esperado: "Bearer <token>"
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return $matches[1];
        }

        return null;
    }

    /**
     * Middleware para verificar autenticación JWT
     * @param Database $database - Instancia de la base de datos
     * @return array|false - Datos del usuario o false si no está autenticado
     */
    public static function verifyAuth($database) {
        // Obtener token del header
        $token = self::getTokenFromHeader();

        if (!$token) {
            return false;
        }

        // Validar token
        $payload = self::validate($token);

        if (!$payload) {
            return false;
        }

        // Verificar que el usuario aún existe en la base de datos
        if (!isset($payload['userId'])) {
            return false;
        }

        $user = $database->getUserById($payload['userId']);

        if (!$user) {
            return false;
        }

        // Retornar datos del usuario del payload (incluye role)
        return [
            'userId' => $payload['userId'],
            'username' => $payload['username'] ?? $user['username'],
            'role' => $payload['role'] ?? $user['role'],
            'name' => $user['name']
        ];
    }
}
?>
