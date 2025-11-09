<?php
class Database {
    private $connection;

    /**
     * Helper para manejar errores de BD de forma segura
     * Loguea el error real y devuelve mensaje genérico
     */
    private function handleDbError(PDOException $e, $context = 'operación') {
        // Loguear el error real en el servidor
        error_log("Database Error [$context]: " . $e->getMessage());

        // Devolver mensaje genérico al usuario
        return ['success' => false, 'message' => 'Error al procesar la solicitud'];
    }

    public function __construct() {
        try {
            // Crear la carpeta db si no existe
            $dbDir = dirname(DB_SQLITE_PATH);
            if (!is_dir($dbDir)) {
                mkdir($dbDir, 0755, true);
            }

            // Usando SQLite para simplicidad
            $this->connection = new PDO('sqlite:' . DB_SQLITE_PATH);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            // Habilitar claves foráneas en SQLite
            $this->connection->exec('PRAGMA foreign_keys = ON');
            $this->initDatabase();
        } catch (PDOException $e) {
            die('Connection failed: ' . $e->getMessage());
        }
    }
    
    private function initDatabase() {
        // Tabla para información de mascotas (actualizada para múltiples mascotas)
        $petsInfoSql = "CREATE TABLE IF NOT EXISTS pets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            breed TEXT,
            birth_date DATE NOT NULL,
            weight_kg REAL,
            color TEXT,
            microchip TEXT,
            species TEXT DEFAULT 'dog',
            gender TEXT DEFAULT 'male',
            size TEXT DEFAULT 'medium',
            neutered BOOLEAN DEFAULT 0,
            photo_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )";
        
        // Mantener compatibilidad con dog_info para datos existentes
        $dogInfoSql = "CREATE TABLE IF NOT EXISTS dog_info (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            breed TEXT,
            birth_date DATE NOT NULL,
            weight_kg REAL,
            color TEXT,
            microchip TEXT,
            photo_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )";
        
        // Tabla para vacunas (actualizada para múltiples mascotas)
        $vaccinesSql = "CREATE TABLE IF NOT EXISTS vaccines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pet_id INTEGER,
            vaccine_name TEXT NOT NULL,
            vaccine_date DATE NOT NULL,
            next_due_date DATE,
            veterinarian TEXT,
            notes TEXT,
            status TEXT NOT NULL DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (pet_id) REFERENCES pets (id)
        )";
        
        // Tabla para historial de peso (actualizada para múltiples mascotas)
        $weightHistorySql = "CREATE TABLE IF NOT EXISTS weight_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pet_id INTEGER,
            weight_kg REAL NOT NULL,
            measurement_date DATE NOT NULL,
            notes TEXT,
            added_by_user TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (pet_id) REFERENCES pets (id)
        )";
        
        // Añadir columna added_by_user si no existe
        try {
            $this->connection->exec("ALTER TABLE weight_history ADD COLUMN added_by_user TEXT");
        } catch (PDOException $e) {
            // La columna ya existe, no hacer nada
        }
        
        // Migrar vaccines de dog_id a pet_id si es necesario
        try {
            // Verificar si la columna pet_id existe en vaccines
            $result = $this->connection->query("PRAGMA table_info(vaccines)");
            $columns = $result->fetchAll(PDO::FETCH_ASSOC);
            $hasPetId = false;
            foreach ($columns as $column) {
                if ($column['name'] === 'pet_id') {
                    $hasPetId = true;
                    break;
                }
            }
            
            if (!$hasPetId) {
                // Añadir columna pet_id y copiar datos de dog_id
                $this->connection->exec("ALTER TABLE vaccines ADD COLUMN pet_id INTEGER");
                $this->connection->exec("UPDATE vaccines SET pet_id = dog_id WHERE pet_id IS NULL");
            }
        } catch (PDOException $e) {
            // Error en migración, continuar
        }
        
        // Migrar weight_history de dog_id a pet_id si es necesario
        try {
            // Verificar si hay registros con dog_id en weight_history
            $result = $this->connection->query("PRAGMA table_info(weight_history)");
            $columns = $result->fetchAll(PDO::FETCH_ASSOC);
            $hasDogId = false;
            foreach ($columns as $column) {
                if ($column['name'] === 'dog_id') {
                    $hasDogId = true;
                    break;
                }
            }
            
            if ($hasDogId) {
                // Copiar datos de dog_id a pet_id si pet_id está NULL
                $this->connection->exec("UPDATE weight_history SET pet_id = dog_id WHERE pet_id IS NULL");
            }
        } catch (PDOException $e) {
            // Error en migración, continuar
        }
        
        // Añadir columna size si no existe en pets
        try {
            $this->connection->exec("ALTER TABLE pets ADD COLUMN size TEXT DEFAULT 'medium'");
        } catch (PDOException $e) {
            // La columna ya existe, no hacer nada
        }
        
        // Añadir columna size si no existe en dog_info para compatibilidad
        try {
            $this->connection->exec("ALTER TABLE dog_info ADD COLUMN size TEXT DEFAULT 'medium'");
        } catch (PDOException $e) {
            // La columna ya existe, no hacer nada
        }
        
        // Añadir columna neutered si no existe en pets
        try {
            $this->connection->exec("ALTER TABLE pets ADD COLUMN neutered BOOLEAN DEFAULT 0");
        } catch (PDOException $e) {
            // La columna ya existe, no hacer nada
        }
        
        // Añadir columna neutered si no existe en dog_info para compatibilidad
        try {
            $this->connection->exec("ALTER TABLE dog_info ADD COLUMN neutered BOOLEAN DEFAULT 0");
        } catch (PDOException $e) {
            // La columna ya existe, no hacer nada
        }
        
        // Tabla para usuarios
        $usersSql = "CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT,
            username TEXT UNIQUE NOT NULL,
            password TEXT,
            role TEXT DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )";
        
        // Tabla para revisiones médicas
        $medicalReviewsSql = "CREATE TABLE IF NOT EXISTS medical_reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pet_id INTEGER NOT NULL,
            visit_date DATE NOT NULL,
            visit_type TEXT NOT NULL DEFAULT 'routine',
            veterinarian TEXT,
            clinic_name TEXT,
            reason TEXT,
            cost DECIMAL(10,2),
            diagnosis TEXT,
            treatment TEXT,
            next_visit DATE,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (pet_id) REFERENCES pets (id) ON DELETE CASCADE
        )";
        
        // Tabla para medicamentos
        $medicationsSql = "CREATE TABLE IF NOT EXISTS medications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pet_id INTEGER NOT NULL,
            medication_name TEXT NOT NULL,
            dosage TEXT,
            frequency_hours INTEGER,
            start_date DATE NOT NULL,
            end_date DATE,
            veterinarian TEXT,
            notes TEXT,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (pet_id) REFERENCES pets (id) ON DELETE CASCADE
        )";
        
        // Tabla para desparasitaciones
        $dewormingsSql = "CREATE TABLE IF NOT EXISTS dewormings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pet_id INTEGER NOT NULL,
            product_name TEXT NOT NULL,
            treatment_date DATE NOT NULL,
            weight_at_treatment DECIMAL(5,2),
            next_treatment_date DATE,
            veterinarian TEXT,
            notes TEXT,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (pet_id) REFERENCES pets (id) ON DELETE CASCADE
        )";
        
        // Tabla para documentos
        $documentsSql = "CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pet_id INTEGER NOT NULL,
            document_name TEXT NOT NULL,
            document_type TEXT CHECK(document_type IN ('certificate', 'medical', 'insurance', 'identification', 'other')) NOT NULL,
            upload_date TEXT NOT NULL,
            file_path TEXT,
            description TEXT,
            expiry_date TEXT,
            veterinarian TEXT,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (pet_id) REFERENCES pets (id) ON DELETE CASCADE
        )";
        
        // Tabla para archivos de documentos (múltiples archivos por documento)
        $documentFilesSql = "CREATE TABLE IF NOT EXISTS document_files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id INTEGER NOT NULL,
            file_name TEXT NOT NULL,
            file_path TEXT NOT NULL,
            original_name TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE
        )";
        
        $this->connection->exec($petsInfoSql);
        $this->connection->exec($dogInfoSql);
        $this->connection->exec($vaccinesSql);
        $this->connection->exec($weightHistorySql);
        $this->connection->exec($usersSql);
        $this->connection->exec($medicalReviewsSql);
        $this->connection->exec($medicationsSql);
        $this->connection->exec($dewormingsSql);
        $this->connection->exec($documentsSql);
        $this->connection->exec($documentFilesSql);
        
        // Crear usuario admin por defecto si no existe
        
        // Migración: Añadir columna status a vaccines si no existe
        try {
            $this->connection->exec("ALTER TABLE vaccines ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'");
        } catch (PDOException $e) {
            // La columna ya existe, no hacer nada
        }
        
        // Migración: Añadir columna updated_at a vaccines si no existe
        try {
            $this->connection->exec("ALTER TABLE vaccines ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP");
        } catch (PDOException $e) {
            // La columna ya existe, no hacer nada
        }
        
        // Crear admin por defecto solo si no hay usuarios
        $this->createDefaultAdmin();
    }
    
    public function getDogInfo() {
        $stmt = $this->connection->query("SELECT * FROM dog_info WHERE id = 1");
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function getVaccines() {
        $stmt = $this->connection->query("SELECT * FROM vaccines WHERE dog_id = 1 ORDER BY vaccine_date DESC, created_at DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getWeightHistory() {
        $stmt = $this->connection->query("SELECT * FROM weight_history WHERE dog_id = 1 ORDER BY measurement_date DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function updateDogInfo($data) {
        try {
            $stmt = $this->connection->prepare("UPDATE dog_info SET name = ?, breed = ?, birth_date = ?, weight_kg = ?, color = ?, microchip = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1");
            $stmt->execute([
                $data['name'],
                $data['breed'],
                $data['birth_date'],
                $data['weight_kg'],
                $data['color'],
                $data['microchip']
            ]);
            
            return ['success' => true, 'message' => 'Información actualizada'];
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    public function addVaccine($data) {
        try {
            $stmt = $this->connection->prepare("INSERT INTO vaccines (dog_id, vaccine_name, vaccine_date, next_due_date, veterinarian, notes) VALUES (1, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['vaccine_name'],
                $data['vaccine_date'],
                $data['next_due_date'] ?? null,
                $data['veterinarian'] ?? '',
                $data['notes'] ?? ''
            ]);
            
            return ['success' => true, 'message' => 'Vacuna agregada', 'id' => $this->connection->lastInsertId()];
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    // Métodos para múltiples mascotas
    public function getAllPets() {
        $stmt = $this->connection->query("SELECT * FROM pets ORDER BY created_at ASC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getPetById($id) {
        $stmt = $this->connection->prepare("SELECT * FROM pets WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function createPet($data) {
        try {
            $stmt = $this->connection->prepare("INSERT INTO pets (name, breed, birth_date, weight_kg, color, microchip, species, gender, size, neutered, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['name'],
                $data['breed'],
                $data['birth_date'],
                $data['weight_kg'] ?? 0,
                $data['color'] ?? '',
                $data['microchip'] ?? '',
                $data['species'] ?? 'dog',
                $data['gender'] ?? 'male',
                $data['size'] ?? 'medium',
                isset($data['neutered']) ? ($data['neutered'] === true || $data['neutered'] === 1 || $data['neutered'] === '1' || $data['neutered'] === 'true' ? 1 : 0) : 0,
                $data['photo_url'] ?? null
            ]);
            
            return ['success' => true, 'message' => 'Mascota creada', 'id' => $this->connection->lastInsertId()];
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    public function updatePet($id, $data) {
        try {
            $neuteredValue = isset($data['neutered']) ? ($data['neutered'] === true || $data['neutered'] === 1 || $data['neutered'] === '1' || $data['neutered'] === 'true' ? 1 : 0) : 0;
            
            $stmt = $this->connection->prepare("UPDATE pets SET name = ?, breed = ?, birth_date = ?, weight_kg = ?, color = ?, microchip = ?, species = ?, gender = ?, size = ?, neutered = ?, photo_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
            $stmt->execute([
                $data['name'],
                $data['breed'],
                $data['birth_date'],
                $data['weight_kg'],
                $data['color'],
                $data['microchip'],
                $data['species'],
                $data['gender'],
                $data['size'] ?? 'medium',
                $neuteredValue,
                $data['photo_url'] ?? null,
                $id
            ]);
            
            return ['success' => true, 'message' => 'Mascota actualizada'];
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    public function deletePet($id) {
        try {
            // Eliminar registros relacionados usando pet_id
            // Intentar primero con pet_id, si la columna no existe intentar con dog_id
            try {
                $this->connection->prepare("DELETE FROM vaccines WHERE pet_id = ?")->execute([$id]);
            } catch (PDOException $e) {
                // Si falla, intentar con dog_id por compatibilidad
                $this->connection->prepare("DELETE FROM vaccines WHERE dog_id = ?")->execute([$id]);
            }
            
            try {
                $this->connection->prepare("DELETE FROM weight_history WHERE pet_id = ?")->execute([$id]);
            } catch (PDOException $e) {
                // Si falla, intentar con dog_id por compatibilidad
                $this->connection->prepare("DELETE FROM weight_history WHERE dog_id = ?")->execute([$id]);
            }
            
            // Eliminar registros de las nuevas tablas médicas
            $this->connection->prepare("DELETE FROM medical_reviews WHERE pet_id = ?")->execute([$id]);
            $this->connection->prepare("DELETE FROM medications WHERE pet_id = ?")->execute([$id]);
            $this->connection->prepare("DELETE FROM dewormings WHERE pet_id = ?")->execute([$id]);
            $this->connection->prepare("DELETE FROM documents WHERE pet_id = ?")->execute([$id]);
            
            // Eliminar mascota
            $stmt = $this->connection->prepare("DELETE FROM pets WHERE id = ?");
            $stmt->execute([$id]);
            
            return ['success' => true, 'message' => 'Mascota eliminada'];
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    public function getPetVaccines($petId) {
        // Primero intentar con pet_id, si falla usar dog_id
        try {
            $stmt = $this->connection->prepare("SELECT * FROM vaccines WHERE pet_id = ? ORDER BY vaccine_date DESC, created_at DESC");
            $stmt->execute([$petId]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Si falla con pet_id, intentar con dog_id
            $stmt = $this->connection->prepare("SELECT * FROM vaccines WHERE dog_id = ? ORDER BY vaccine_date DESC, created_at DESC");
            $stmt->execute([$petId]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }
    
    public function getPetWeightHistory($petId) {
        // Primero intentar con pet_id, si falla usar dog_id
        try {
            $stmt = $this->connection->prepare("SELECT * FROM weight_history WHERE pet_id = ? ORDER BY measurement_date DESC");
            $stmt->execute([$petId]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Si falla con pet_id, intentar con dog_id
            $stmt = $this->connection->prepare("SELECT * FROM weight_history WHERE dog_id = ? ORDER BY measurement_date DESC");
            $stmt->execute([$petId]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }
    
    
    // Métodos para usuarios
    public function getAllUsers() {
        $stmt = $this->connection->query("SELECT id, name, email, username, role, created_at FROM users ORDER BY created_at DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getUserById($id) {
        $stmt = $this->connection->prepare("SELECT id, name, email, username, role, created_at FROM users WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function createUser($data) {
        try {
            $password = !empty($data['password']) ? password_hash($data['password'], PASSWORD_DEFAULT) : null;
            
            $stmt = $this->connection->prepare("INSERT INTO users (name, email, username, password, role) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['name'],
                $data['email'] ?? '',
                $data['username'],
                $password,
                $data['role'] ?? 'user'
            ]);
            
            return ['success' => true, 'message' => 'Usuario creado', 'id' => $this->connection->lastInsertId()];
        } catch (PDOException $e) {
            if ($e->errorInfo[1] == 19) { // UNIQUE constraint failed
                return ['success' => false, 'message' => 'El username ya está en uso'];
            }
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    public function updateUser($id, $data) {
        try {
            $sql = "UPDATE users SET name = ?, email = ?, username = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            $params = [$data['name'], $data['email'] ?? '', $data['username'], $data['role'] ?? 'user', $id];
            
            // Si se proporciona nueva contraseña, incluirla
            if (!empty($data['password'])) {
                $sql = "UPDATE users SET name = ?, email = ?, username = ?, password = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
                $params = [$data['name'], $data['email'] ?? '', $data['username'], password_hash($data['password'], PASSWORD_DEFAULT), $data['role'] ?? 'user', $id];
            }
            
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            
            return ['success' => true, 'message' => 'Usuario actualizado'];
        } catch (PDOException $e) {
            if ($e->errorInfo[1] == 19) { // UNIQUE constraint failed
                return ['success' => false, 'message' => 'El username ya está en uso'];
            }
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    public function deleteUser($id) {
        try {
            $stmt = $this->connection->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$id]);
            
            return ['success' => true, 'message' => 'Usuario eliminado'];
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    public function searchUsers($query) {
        $stmt = $this->connection->prepare("SELECT id, name, email, username, role, created_at FROM users WHERE name LIKE ? OR username LIKE ? OR email LIKE ? ORDER BY created_at DESC");
        $searchTerm = '%' . $query . '%';
        $stmt->execute([$searchTerm, $searchTerm, $searchTerm]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function authenticateUser($username, $password) {
        $stmt = $this->connection->prepare("SELECT id, name, email, username, password, role FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            // No devolver la contraseña
            unset($user['password']);
            return $user;
        }
        
        return false;
    }
    
    // Métodos para gestión de peso
    public function addWeightRecord($petId, $data) {
        try {
            // Intentar primero con pet_id, si falla usar dog_id para compatibilidad
            try {
                $stmt = $this->connection->prepare("INSERT INTO weight_history (pet_id, weight_kg, measurement_date, notes, added_by_user) VALUES (?, ?, ?, ?, ?)");
            } catch (PDOException $e) {
                // Si falla, intentar con dog_id
                $stmt = $this->connection->prepare("INSERT INTO weight_history (dog_id, weight_kg, measurement_date, notes, added_by_user) VALUES (?, ?, ?, ?, ?)");
            }

            $stmt->execute([
                $petId,
                $data['weight_kg'],
                $data['measurement_date'],
                $data['notes'] ?? null,
                $data['added_by_user'] ?? 'Usuario'
            ]);

            // Actualizar el peso actual en la tabla pets con el registro más reciente por fecha
            $this->updateCurrentWeight($petId);

            return ['success' => true, 'message' => 'Registro de peso añadido', 'id' => $this->connection->lastInsertId()];
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    public function updateWeightRecord($petId, $weightId, $data) {
        try {
            // Intentar primero con pet_id, si falla usar dog_id
            try {
                $stmt = $this->connection->prepare("UPDATE weight_history SET weight_kg = ?, measurement_date = ?, notes = ? WHERE id = ? AND pet_id = ?");
            } catch (PDOException $e) {
                $stmt = $this->connection->prepare("UPDATE weight_history SET weight_kg = ?, measurement_date = ?, notes = ? WHERE id = ? AND dog_id = ?");
            }

            $stmt->execute([
                $data['weight_kg'],
                $data['measurement_date'],
                $data['notes'] ?? null,
                $weightId,
                $petId
            ]);

            // Actualizar el peso actual con el registro más reciente por fecha
            $this->updateCurrentWeight($petId);

            return ['success' => true, 'message' => 'Registro de peso actualizado'];
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }

    public function deleteWeightRecord($petId, $weightId) {
        try {
            // Intentar primero con pet_id, si falla usar dog_id
            try {
                $stmt = $this->connection->prepare("DELETE FROM weight_history WHERE id = ? AND pet_id = ?");
            } catch (PDOException $e) {
                $stmt = $this->connection->prepare("DELETE FROM weight_history WHERE id = ? AND dog_id = ?");
            }
            $stmt->execute([$weightId, $petId]);
            
            // Actualizar el peso actual con el registro más reciente por fecha
            $this->updateCurrentWeight($petId);
            
            return ['success' => true, 'message' => 'Registro de peso eliminado'];
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    // Método para actualizar el peso actual basado en el registro más reciente por fecha
    private function updateCurrentWeight($petId) {
        try {
            // Buscar el peso más reciente por fecha (no por ID)
            // Intentar primero con pet_id, si falla usar dog_id
            try {
                $latestStmt = $this->connection->prepare("SELECT weight_kg FROM weight_history WHERE pet_id = ? ORDER BY measurement_date DESC, created_at DESC, id DESC LIMIT 1");
            } catch (PDOException $e) {
                $latestStmt = $this->connection->prepare("SELECT weight_kg FROM weight_history WHERE dog_id = ? ORDER BY measurement_date DESC, created_at DESC, id DESC LIMIT 1");
            }
            $latestStmt->execute([$petId]);
            $latestWeight = $latestStmt->fetchColumn();

            if ($latestWeight !== false) {
                // Actualizar el peso en la tabla pets
                $updateStmt = $this->connection->prepare("UPDATE pets SET weight_kg = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
                $updateStmt->execute([$latestWeight, $petId]);
            }
        } catch (PDOException $e) {
            // Log del error pero no fallar la operación principal
            error_log("Error actualizando peso actual: " . $e->getMessage());
        }
    }
    
    // Métodos para gestión de vacunas de mascotas específicas
    public function addPetVaccine($petId, $data) {
        try {
            // Intentar primero con pet_id, si falla usar dog_id
            try {
                $stmt = $this->connection->prepare("INSERT INTO vaccines (pet_id, vaccine_name, vaccine_date, next_due_date, veterinarian, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
            } catch (PDOException $e) {
                $stmt = $this->connection->prepare("INSERT INTO vaccines (dog_id, vaccine_name, vaccine_date, next_due_date, veterinarian, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
            }
            
            $stmt->execute([
                $petId,
                $data['vaccine_name'],
                $data['vaccine_date'],
                $data['next_due_date'] ?? null,
                $data['veterinarian'] ?? '',
                $data['notes'] ?? '',
                $data['status'] ?? 'pending'
            ]);
            
            return ['success' => true, 'message' => 'Vacuna agregada', 'id' => $this->connection->lastInsertId()];
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    public function updatePetVaccine($petId, $vaccineId, $data) {
        try {
            // Construir la consulta SQL dinámicamente basada en qué datos se proporcionan
            $setClauses = [];
            $params = [];
            
            if (isset($data['vaccine_name'])) {
                $setClauses[] = "vaccine_name = ?";
                $params[] = $data['vaccine_name'];
            }
            if (isset($data['vaccine_date'])) {
                $setClauses[] = "vaccine_date = ?";
                $params[] = $data['vaccine_date'];
            }
            if (isset($data['next_due_date'])) {
                $setClauses[] = "next_due_date = ?";
                $params[] = $data['next_due_date'];
            }
            if (isset($data['veterinarian'])) {
                $setClauses[] = "veterinarian = ?";
                $params[] = $data['veterinarian'];
            }
            if (isset($data['notes'])) {
                $setClauses[] = "notes = ?";
                $params[] = $data['notes'];
            }
            if (isset($data['status'])) {
                $setClauses[] = "status = ?";
                $params[] = $data['status'];
            }
            
            if (empty($setClauses)) {
                return ['success' => false, 'message' => 'No data to update'];
            }
            
            $params[] = $vaccineId;
            $params[] = $petId;
            
            $setClause = implode(', ', $setClauses);
            
            // Intentar primero con pet_id, si falla usar dog_id
            try {
                $sql = "UPDATE vaccines SET $setClause WHERE id = ? AND pet_id = ?";
                $stmt = $this->connection->prepare($sql);
                $stmt->execute($params);
            } catch (PDOException $e) {
                $sql = "UPDATE vaccines SET $setClause WHERE id = ? AND dog_id = ?";
                $stmt = $this->connection->prepare($sql);
                $stmt->execute($params);
            }
            
            return ['success' => true, 'message' => 'Vacuna actualizada'];
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    public function deletePetVaccine($petId, $vaccineId) {
        try {
            // Intentar primero con pet_id, si falla usar dog_id
            try {
                $stmt = $this->connection->prepare("DELETE FROM vaccines WHERE id = ? AND pet_id = ?");
            } catch (PDOException $e) {
                $stmt = $this->connection->prepare("DELETE FROM vaccines WHERE id = ? AND dog_id = ?");
            }
            $stmt->execute([$vaccineId, $petId]);
            
            return ['success' => true, 'message' => 'Vacuna eliminada'];
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    // ==================== REVISIONES MÉDICAS ====================
    
    public function getPetMedicalReviews($petId) {
        try {
            $stmt = $this->connection->prepare("SELECT * FROM medical_reviews WHERE pet_id = ? ORDER BY visit_date DESC");
            $stmt->execute([$petId]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return [];
        }
    }
    
    public function addPetMedicalReview($petId, $data) {
        try {
            $stmt = $this->connection->prepare("INSERT INTO medical_reviews (pet_id, visit_date, visit_type, veterinarian, clinic_name, reason, cost, diagnosis, treatment, next_visit, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $petId,
                $data['visit_date'],
                $data['visit_type'] ?? 'routine',
                $data['veterinarian'] ?? '',
                $data['clinic_name'] ?? '',
                $data['reason'] ?? '',
                $data['cost'] ?? null,
                $data['diagnosis'] ?? '',
                $data['treatment'] ?? '',
                $data['next_visit'] ?? null,
                $data['notes'] ?? ''
            ]);
            
            $reviewId = $this->connection->lastInsertId();
            return ['success' => true, 'message' => 'Revisión médica agregada', 'id' => $reviewId];
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    public function updatePetMedicalReview($petId, $reviewId, $data) {
        try {
            // Construir la consulta SQL dinámicamente basada en qué datos se proporcionan
            $setClauses = [];
            $params = [];
            
            if (isset($data['visit_date'])) {
                $setClauses[] = "visit_date = ?";
                $params[] = $data['visit_date'];
            }
            if (isset($data['visit_type'])) {
                $setClauses[] = "visit_type = ?";
                $params[] = $data['visit_type'];
            }
            if (isset($data['veterinarian'])) {
                $setClauses[] = "veterinarian = ?";
                $params[] = $data['veterinarian'];
            }
            if (isset($data['clinic_name'])) {
                $setClauses[] = "clinic_name = ?";
                $params[] = $data['clinic_name'];
            }
            if (isset($data['reason'])) {
                $setClauses[] = "reason = ?";
                $params[] = $data['reason'];
            }
            if (isset($data['cost'])) {
                $setClauses[] = "cost = ?";
                $params[] = $data['cost'];
            }
            if (isset($data['diagnosis'])) {
                $setClauses[] = "diagnosis = ?";
                $params[] = $data['diagnosis'];
            }
            if (isset($data['treatment'])) {
                $setClauses[] = "treatment = ?";
                $params[] = $data['treatment'];
            }
            if (isset($data['next_visit'])) {
                $setClauses[] = "next_visit = ?";
                $params[] = $data['next_visit'];
            }
            if (isset($data['notes'])) {
                $setClauses[] = "notes = ?";
                $params[] = $data['notes'];
            }
            
            if (empty($setClauses)) {
                return ['success' => false, 'message' => 'No data to update'];
            }
            
            // Añadir updated_at si la columna existe
            $setClauses[] = "updated_at = CURRENT_TIMESTAMP";
            
            $params[] = $reviewId;
            $params[] = $petId;
            
            $setClause = implode(', ', $setClauses);
            $sql = "UPDATE medical_reviews SET $setClause WHERE id = ? AND pet_id = ?";
            
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            
            return ['success' => true, 'message' => 'Revisión médica actualizada'];
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    public function deletePetMedicalReview($petId, $reviewId) {
        try {
            $stmt = $this->connection->prepare("DELETE FROM medical_reviews WHERE id = ? AND pet_id = ?");
            $stmt->execute([$reviewId, $petId]);
            
            return ['success' => true, 'message' => 'Revisión médica eliminada'];
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    // ==================== MEDICAMENTOS ====================
    
    public function getPetMedications($petId) {
        try {
            $stmt = $this->connection->prepare("SELECT * FROM medications WHERE pet_id = ? ORDER BY start_date DESC");
            $stmt->execute([$petId]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return [];
        }
    }
    
    public function addPetMedication($petId, $data) {
        try {
            $stmt = $this->connection->prepare("INSERT INTO medications (pet_id, medication_name, dosage, frequency_hours, start_date, end_date, veterinarian, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $petId,
                $data['medication_name'],
                $data['dosage'] ?? '',
                $data['frequency_hours'] ?? null,
                $data['start_date'],
                $data['end_date'] ?? null,
                $data['veterinarian'] ?? '',
                $data['notes'] ?? '',
                $data['status'] ?? 'pending'
            ]);
            
            $medicationId = $this->connection->lastInsertId();
            return ['success' => true, 'message' => 'Medicamento agregado', 'id' => $medicationId];
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    public function updatePetMedication($petId, $medicationId, $data) {
        try {
            // Construir la consulta SQL dinámicamente basada en qué datos se proporcionan
            $setClauses = [];
            $params = [];
            
            if (isset($data['medication_name'])) {
                $setClauses[] = "medication_name = ?";
                $params[] = $data['medication_name'];
            }
            if (isset($data['dosage'])) {
                $setClauses[] = "dosage = ?";
                $params[] = $data['dosage'];
            }
            if (isset($data['frequency_hours'])) {
                $setClauses[] = "frequency_hours = ?";
                $params[] = $data['frequency_hours'];
            }
            if (isset($data['start_date'])) {
                $setClauses[] = "start_date = ?";
                $params[] = $data['start_date'];
            }
            if (isset($data['end_date'])) {
                $setClauses[] = "end_date = ?";
                $params[] = $data['end_date'];
            }
            if (isset($data['veterinarian'])) {
                $setClauses[] = "veterinarian = ?";
                $params[] = $data['veterinarian'];
            }
            if (isset($data['notes'])) {
                $setClauses[] = "notes = ?";
                $params[] = $data['notes'];
            }
            if (isset($data['status'])) {
                $setClauses[] = "status = ?";
                $params[] = $data['status'];
            }
            
            if (empty($setClauses)) {
                return ['success' => false, 'message' => 'No data to update'];
            }
            
            // Añadir updated_at si la columna existe
            $setClauses[] = "updated_at = CURRENT_TIMESTAMP";
            
            $params[] = $medicationId;
            $params[] = $petId;
            
            $setClause = implode(', ', $setClauses);
            $sql = "UPDATE medications SET $setClause WHERE id = ? AND pet_id = ?";
            
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            
            return ['success' => true, 'message' => 'Medicamento actualizado'];
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    public function deletePetMedication($petId, $medicationId) {
        try {
            $stmt = $this->connection->prepare("DELETE FROM medications WHERE id = ? AND pet_id = ?");
            $stmt->execute([$medicationId, $petId]);
            
            return ['success' => true, 'message' => 'Medicamento eliminado'];
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    // ==================== DESPARASITACIONES ====================
    
    public function getPetDewormings($petId) {
        try {
            $stmt = $this->connection->prepare("SELECT * FROM dewormings WHERE pet_id = ? ORDER BY treatment_date DESC");
            $stmt->execute([$petId]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return [];
        }
    }
    
    public function addPetDeworming($petId, $data) {
        try {
            $stmt = $this->connection->prepare("INSERT INTO dewormings (pet_id, product_name, treatment_date, weight_at_treatment, next_treatment_date, veterinarian, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $petId,
                $data['product_name'],
                $data['treatment_date'],
                $data['weight_at_treatment'] ?? null,
                ($data['next_treatment_date'] === '' || $data['next_treatment_date'] === null) ? null : $data['next_treatment_date'],
                $data['veterinarian'] ?? '',
                $data['notes'] ?? '',
                $data['status'] ?? 'pending'
            ]);
            
            $dewormingId = $this->connection->lastInsertId();
            return ['success' => true, 'message' => 'Desparasitación agregada', 'id' => $dewormingId];
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    public function updatePetDeworming($petId, $dewormingId, $data) {
        try {
            // Debug: Log de los datos recibidos
            error_log("updatePetDeworming - Datos recibidos: " . json_encode($data));
            
            // Construir la consulta SQL dinámicamente basada en qué datos se proporcionan
            $setClauses = [];
            $params = [];
            
            if (array_key_exists('product_name', $data)) {
                $setClauses[] = "product_name = ?";
                $params[] = $data['product_name'];
            }
            if (array_key_exists('treatment_date', $data)) {
                $setClauses[] = "treatment_date = ?";
                $params[] = $data['treatment_date'];
            }
            if (array_key_exists('weight_at_treatment', $data)) {
                $setClauses[] = "weight_at_treatment = ?";
                $params[] = ($data['weight_at_treatment'] === '' || $data['weight_at_treatment'] === null) ? null : $data['weight_at_treatment'];
            }
            if (array_key_exists('next_treatment_date', $data)) {
                $setClauses[] = "next_treatment_date = ?";
                // Convertir cadenas vacías a null
                $nextDateValue = ($data['next_treatment_date'] === '' || $data['next_treatment_date'] === null) ? null : $data['next_treatment_date'];
                $params[] = $nextDateValue;
                error_log("updatePetDeworming - next_treatment_date original: '" . $data['next_treatment_date'] . "', valor final: " . ($nextDateValue === null ? 'NULL' : $nextDateValue));
            }
            if (array_key_exists('veterinarian', $data)) {
                $setClauses[] = "veterinarian = ?";
                $params[] = ($data['veterinarian'] === '' || $data['veterinarian'] === null) ? null : $data['veterinarian'];
            }
            if (array_key_exists('notes', $data)) {
                $setClauses[] = "notes = ?";
                $params[] = ($data['notes'] === '' || $data['notes'] === null) ? null : $data['notes'];
            }
            if (array_key_exists('status', $data)) {
                $setClauses[] = "status = ?";
                $params[] = $data['status'];
            }
            
            if (empty($setClauses)) {
                return ['success' => false, 'message' => 'No data to update'];
            }
            
            // Añadir updated_at si la columna existe
            $setClauses[] = "updated_at = CURRENT_TIMESTAMP";
            
            $params[] = $dewormingId;
            $params[] = $petId;
            
            $setClause = implode(', ', $setClauses);
            $sql = "UPDATE dewormings SET $setClause WHERE id = ? AND pet_id = ?";
            
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            
            return ['success' => true, 'message' => 'Desparasitación actualizada'];
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    public function deletePetDeworming($petId, $dewormingId) {
        try {
            $stmt = $this->connection->prepare("DELETE FROM dewormings WHERE id = ? AND pet_id = ?");
            $stmt->execute([$dewormingId, $petId]);
            
            return ['success' => true, 'message' => 'Desparasitación eliminada'];
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    // ==================== DOCUMENTOS ====================
    
    public function getPetDocuments($petId) {
        try {
            // Obtener todos los documentos
            $stmt = $this->connection->prepare("SELECT * FROM documents WHERE pet_id = ? ORDER BY upload_date DESC, created_at DESC");
            $stmt->execute([$petId]);
            $documents = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Para cada documento, obtener sus archivos asociados
            $fileStmt = $this->connection->prepare("SELECT * FROM document_files WHERE document_id = ? ORDER BY created_at ASC");
            foreach ($documents as &$document) {
                $fileStmt->execute([$document['id']]);
                $files = $fileStmt->fetchAll(PDO::FETCH_ASSOC);
                $document['files'] = $files;
            }
            
            return $documents;
        } catch (PDOException $e) {
            return [];
        }
    }
    
    public function addPetDocument($petId, $data) {
        try {
            // Comenzar transacción para asegurar consistencia
            $this->connection->beginTransaction();
            
            // Insertar el documento principal
            $stmt = $this->connection->prepare("INSERT INTO documents (pet_id, document_name, document_type, upload_date, file_path, description, expiry_date, veterinarian, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $petId,
                $data['document_name'],
                $data['document_type'],
                $data['upload_date'],
                $data['file_path'] ?? null, // Mantener compatibilidad con archivos únicos
                $data['description'] ?? '',
                $data['expiry_date'] ?? null,
                $data['veterinarian'] ?? '',
                $data['notes'] ?? ''
            ]);
            
            $documentId = $this->connection->lastInsertId();
            
            // Si hay múltiples archivos, insertarlos en document_files
            if (isset($data['uploaded_files']) && is_array($data['uploaded_files'])) {
                $fileStmt = $this->connection->prepare("INSERT INTO document_files (document_id, file_name, file_path, original_name) VALUES (?, ?, ?, ?)");
                foreach ($data['uploaded_files'] as $file) {
                    $fileStmt->execute([
                        $documentId,
                        $file['file_name'],
                        $file['file_path'],
                        $file['original_name'] ?? null
                    ]);
                }
            }
            
            // Confirmar transacción
            $this->connection->commit();
            
            return ['success' => true, 'message' => 'Documento agregado', 'id' => $documentId];
        } catch (PDOException $e) {
            // Revertir transacción en caso de error
            $this->connection->rollBack();
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    public function updatePetDocument($petId, $documentId, $data) {
        try {
            $setClauses = [];
            $params = [];
            
            if (isset($data['document_name'])) {
                $setClauses[] = "document_name = ?";
                $params[] = $data['document_name'];
            }
            if (isset($data['document_type'])) {
                $setClauses[] = "document_type = ?";
                $params[] = $data['document_type'];
            }
            if (isset($data['upload_date'])) {
                $setClauses[] = "upload_date = ?";
                $params[] = $data['upload_date'];
            }
            if (isset($data['file_path'])) {
                $setClauses[] = "file_path = ?";
                $params[] = $data['file_path'];
            }
            if (isset($data['description'])) {
                $setClauses[] = "description = ?";
                $params[] = $data['description'];
            }
            if (isset($data['veterinarian'])) {
                $setClauses[] = "veterinarian = ?";
                $params[] = $data['veterinarian'];
            }
            if (isset($data['notes'])) {
                $setClauses[] = "notes = ?";
                $params[] = $data['notes'];
            }
            
            if (empty($setClauses)) {
                return ['success' => false, 'message' => 'No data to update'];
            }
            
            $setClauses[] = "updated_at = CURRENT_TIMESTAMP";
            $params[] = $documentId;
            $params[] = $petId;
            
            $setClause = implode(', ', $setClauses);
            $sql = "UPDATE documents SET $setClause WHERE id = ? AND pet_id = ?";
            
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            
            return ['success' => true, 'message' => 'Documento actualizado'];
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }

    // Renombrar un archivo específico
    public function renameDocumentFile($documentId, $fileId, $newName) {
        try {
            $stmt = $this->connection->prepare("UPDATE document_files SET file_name = ? WHERE id = ? AND document_id = ?");
            $stmt->execute([$newName, $fileId, $documentId]);
            
            if ($stmt->rowCount() > 0) {
                return ['success' => true, 'message' => 'Archivo renombrado'];
            } else {
                return ['success' => false, 'message' => 'Archivo no encontrado'];
            }
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }

    // Eliminar un archivo específico
    public function deleteDocumentFile($documentId, $fileId) {
        try {
            // Obtener info del archivo para eliminarlo físicamente
            $stmt = $this->connection->prepare("SELECT file_path FROM document_files WHERE id = ? AND document_id = ?");
            $stmt->execute([$fileId, $documentId]);
            $fileData = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($fileData) {
                // Eliminar archivo físico
                $fullPath = __DIR__ . '/' . $fileData['file_path'];
                if (file_exists($fullPath)) {
                    unlink($fullPath);
                }
                
                // Eliminar registro de la base de datos
                $deleteStmt = $this->connection->prepare("DELETE FROM document_files WHERE id = ? AND document_id = ?");
                $deleteStmt->execute([$fileId, $documentId]);
                
                return ['success' => true, 'message' => 'Archivo eliminado'];
            } else {
                return ['success' => false, 'message' => 'Archivo no encontrado'];
            }
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }

    // Añadir archivos nuevos a un documento existente
    public function addFilesToDocument($documentId, $files) {
        try {
            $addedFiles = [];
            
            foreach ($files as $fileData) {
                // Insertar registro en document_files
                $stmt = $this->connection->prepare("INSERT INTO document_files (document_id, file_name, file_path, original_name) VALUES (?, ?, ?, ?)");
                $stmt->execute([
                    $documentId,
                    $fileData['file_name'],
                    $fileData['file_path'],
                    $fileData['original_name']
                ]);
                
                $addedFiles[] = [
                    'id' => $this->connection->lastInsertId(),
                    'file_name' => $fileData['file_name'],
                    'file_path' => $fileData['file_path'],
                    'original_name' => $fileData['original_name']
                ];
            }
            
            return ['success' => true, 'message' => 'Archivos añadidos', 'files' => $addedFiles];
        } catch (PDOException $e) {
            return $this->handleDbError($e, 'database operation');
        }
    }
    
    public function deletePetDocument($petId, $documentId) {
        try {
            // 1. Obtener info del documento legacy para eliminar archivo
            $stmt = $this->connection->prepare("SELECT file_path FROM documents WHERE id = ? AND pet_id = ?");
            $stmt->execute([$documentId, $petId]);
            $document = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // 2. Obtener todos los archivos asociados de la tabla document_files
            $filesStmt = $this->connection->prepare("SELECT file_path FROM document_files WHERE document_id = ?");
            $filesStmt->execute([$documentId]);
            $documentFiles = $filesStmt->fetchAll(PDO::FETCH_ASSOC);
            
            // 3. Eliminar registros de las tablas (usando CASCADE o manualmente)
            // Primero eliminar archivos de document_files
            $deleteFilesStmt = $this->connection->prepare("DELETE FROM document_files WHERE document_id = ?");
            $deleteFilesStmt->execute([$documentId]);
            
            // Luego eliminar el documento principal
            $deleteDocStmt = $this->connection->prepare("DELETE FROM documents WHERE id = ? AND pet_id = ?");
            $deleteDocStmt->execute([$documentId, $petId]);
            
            // 4. Eliminar archivo físico legacy si existe
            if ($document && !empty($document['file_path'])) {
                $fullPath = __DIR__ . '/' . $document['file_path'];
                if (file_exists($fullPath)) {
                    unlink($fullPath);
                }
            }
            
            // 5. Eliminar todos los archivos físicos de document_files
            foreach ($documentFiles as $file) {
                if (!empty($file['file_path'])) {
                    $fullPath = __DIR__ . '/' . $file['file_path'];
                    if (file_exists($fullPath)) {
                        unlink($fullPath);
                    }
                }
            }
            
            $totalFiles = count($documentFiles) + ($document && !empty($document['file_path']) ? 1 : 0);
            $message = $totalFiles > 0 
                ? "Documento eliminado junto con $totalFiles archivo(s) adjunto(s)"
                : 'Documento eliminado';
                
            return ['success' => true, 'message' => $message];
        } catch (Exception $e) {
            error_log("Exception in deletePetDocument: " . $e->getMessage());
            return $this->handleDbError($e, 'database operation');
        }
    }

    // Método actualizado getPetComplete para incluir todas las tablas médicas
    public function getPetComplete($petId) {
        try {
            $pet = $this->getPetById($petId);
            if (!$pet) return null;
            
            $vaccines = $this->getPetVaccines($petId);
            $weightHistory = $this->getPetWeightHistory($petId);
            $medicalReviews = $this->getPetMedicalReviews($petId);
            $medications = $this->getPetMedications($petId);
            $dewormings = $this->getPetDewormings($petId);
            $documents = $this->getPetDocuments($petId);
            
            return [
                'dog_info' => $pet,
                'vaccines' => $vaccines,
                'weight_history' => $weightHistory,
                'medical_reviews' => $medicalReviews,
                'medications' => $medications,
                'dewormings' => $dewormings,
                'documents' => $documents
            ];
        } catch (Exception $e) {
            error_log("Error en getPetComplete: " . $e->getMessage());
            return null;
        }
    }
    
    public function getConnection() {
        return $this->connection;
    }

    private function createDefaultAdmin() {
        try {
            // Verificar si existe algún usuario en la base de datos
            $stmt = $this->connection->prepare("SELECT COUNT(*) FROM users");
            $stmt->execute();
            $totalUsers = $stmt->fetchColumn();
            
            // Solo crear admin si la tabla users está vacía
            if ($totalUsers == 0) {
                // Crear usuario admin por defecto
                $adminPassword = password_hash('admin123', PASSWORD_DEFAULT);
                $stmt = $this->connection->prepare("
                    INSERT INTO users (name, email, username, password, role) 
                    VALUES (?, ?, ?, ?, ?)
                ");
                $stmt->execute([
                    'Administrador',
                    'admin@robipet.com',
                    'admin',
                    $adminPassword,
                    'admin'
                ]);
                error_log("Base de datos inicializada: Usuario admin creado (username: admin, password: admin123)");
            }
        } catch (PDOException $e) {
            error_log("Error creando usuario admin por defecto: " . $e->getMessage());
        }
    }
}
?>