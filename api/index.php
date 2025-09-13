<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';
require_once 'database.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = trim($path, '/');

// Remover el prefijo 'api/' si existe
if (strpos($path, 'api/') === 0) {
    $path = substr($path, 4);
}

// Debug para ver qué ruta está llegando
error_log("Ruta recibida: " . $path);

$database = new Database();

// Manejar rutas con expresiones regulares primero
if (preg_match('/^pets\/(\d+)\/complete$/', $path, $matches)) {
    $petId = $matches[1];
    error_log("Solicitando mascota completa ID: " . $petId);
    
    if ($method === 'GET') {
        try {
            $petComplete = $database->getPetComplete($petId);
            error_log("Pet complete resultado: " . ($petComplete ? "encontrado" : "no encontrado"));
            
            if ($petComplete) {
                // Calcular edad igual que en dog/complete
                $birthDate = new DateTime($petComplete['dog_info']['birth_date']);
                $today = new DateTime();
                $diff = $today->diff($birthDate);
                
                $ageYears = $diff->y;
                $ageMonths = $diff->m;
                $ageDays = $diff->days;
                
                // Cálculo más preciso incluyendo días
                // Convertir todo a días y luego a años decimales para mayor precisión
                $totalDays = $ageDays;
                $ageInYears = $totalDays / 365.25; // Usar 365.25 para años bisiestos
                
                $dogYears = 0;
                if ($ageInYears >= 1) {
                    // Más de un año: primer año = 15 años caninos, después 4 por año
                    $yearsAfterFirst = $ageInYears - 1;
                    $dogYears = 15 + ($yearsAfterFirst * 4);
                } else {
                    // Menos de un año: proporcional al primer año
                    $dogYears = $ageInYears * 15;
                }
                
                $petComplete['dog_info']['age_years'] = $ageYears;
                $petComplete['dog_info']['age_months'] = $ageMonths;
                $petComplete['dog_info']['age_days'] = $ageDays;
                $petComplete['dog_info']['age_days_only'] = $diff->d; // Solo los días del diff
                $petComplete['dog_info']['dog_years'] = round($dogYears, 1);
                
                error_log("Enviando respuesta JSON para pet ID: " . $petId);
                echo json_encode($petComplete);
            } else {
                error_log("Mascota no encontrada: " . $petId);
                http_response_code(404);
                echo json_encode(['error' => 'Mascota no encontrada']);
            }
        } catch (Exception $e) {
            error_log("Error en pets/{$petId}/complete: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Error interno del servidor: ' . $e->getMessage()]);
        }
    }
} elseif (preg_match('/^pets\/(\d+)\/weight\/(\d+)$/', $path, $matches)) {
    $petId = $matches[1];
    $weightId = $matches[2];
    if ($method === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);
        $result = $database->updateWeightRecord($petId, $weightId, $input);
        echo json_encode($result);
    } elseif ($method === 'DELETE') {
        $result = $database->deleteWeightRecord($petId, $weightId);
        echo json_encode($result);
    }
} elseif (preg_match('/^pets\/(\d+)\/vaccines\/(\d+)$/', $path, $matches)) {
    $petId = $matches[1];
    $vaccineId = $matches[2];
    if ($method === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);
        $result = $database->updatePetVaccine($petId, $vaccineId, $input);
        echo json_encode($result);
    } elseif ($method === 'DELETE') {
        $result = $database->deletePetVaccine($petId, $vaccineId);
        echo json_encode($result);
    }
} elseif (preg_match('/^pets\/(\d+)\/vaccines$/', $path, $matches)) {
    $petId = $matches[1];
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $result = $database->addPetVaccine($petId, $input);
        echo json_encode($result);
    } elseif ($method === 'GET') {
        $vaccines = $database->getPetVaccines($petId);
        echo json_encode($vaccines);
    }
} elseif (preg_match('/^pets\/(\d+)\/weight$/', $path, $matches)) {
    $petId = $matches[1];
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $result = $database->addWeightRecord($petId, $input);
        echo json_encode($result);
    } elseif ($method === 'GET') {
        $weightHistory = $database->getPetWeightHistory($petId);
        echo json_encode($weightHistory);
    }
} elseif (preg_match('/^pets\/(\d+)\/medical-reviews\/(\d+)$/', $path, $matches)) {
    $petId = $matches[1];
    $reviewId = $matches[2];
    if ($method === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);
        $result = $database->updatePetMedicalReview($petId, $reviewId, $input);
        echo json_encode($result);
    } elseif ($method === 'DELETE') {
        $result = $database->deletePetMedicalReview($petId, $reviewId);
        echo json_encode($result);
    }
} elseif (preg_match('/^pets\/(\d+)\/medical-reviews$/', $path, $matches)) {
    $petId = $matches[1];
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $result = $database->addPetMedicalReview($petId, $input);
        echo json_encode($result);
    } elseif ($method === 'GET') {
        $medicalReviews = $database->getPetMedicalReviews($petId);
        echo json_encode($medicalReviews);
    }
} elseif (preg_match('/^pets\/(\d+)\/medications\/(\d+)$/', $path, $matches)) {
    $petId = $matches[1];
    $medicationId = $matches[2];
    if ($method === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);
        $result = $database->updatePetMedication($petId, $medicationId, $input);
        echo json_encode($result);
    } elseif ($method === 'DELETE') {
        $result = $database->deletePetMedication($petId, $medicationId);
        echo json_encode($result);
    }
} elseif (preg_match('/^pets\/(\d+)\/medications$/', $path, $matches)) {
    $petId = $matches[1];
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $result = $database->addPetMedication($petId, $input);
        echo json_encode($result);
    } elseif ($method === 'GET') {
        $medications = $database->getPetMedications($petId);
        echo json_encode($medications);
    }
} elseif (preg_match('/^pets\/(\d+)\/dewormings\/(\d+)$/', $path, $matches)) {
    $petId = $matches[1];
    $dewormingId = $matches[2];
    if ($method === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);
        $result = $database->updatePetDeworming($petId, $dewormingId, $input);
        echo json_encode($result);
    } elseif ($method === 'DELETE') {
        $result = $database->deletePetDeworming($petId, $dewormingId);
        echo json_encode($result);
    }
} elseif (preg_match('/^pets\/(\d+)\/dewormings$/', $path, $matches)) {
    $petId = $matches[1];
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $result = $database->addPetDeworming($petId, $input);
        echo json_encode($result);
    } elseif ($method === 'GET') {
        $dewormings = $database->getPetDewormings($petId);
        echo json_encode($dewormings);
    }
} elseif (preg_match('/^pets\/(\d+)\/documents\/(\d+)\/files\/(\d+)\/rename$/', $path, $matches)) {
    $petId = $matches[1];
    $documentId = $matches[2];
    $fileId = $matches[3];
    
    if ($method === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (isset($input['newName'])) {
            $result = $database->renameDocumentFile($documentId, $fileId, $input['newName']);
            echo json_encode($result);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'newName is required']);
        }
    }
} elseif (preg_match('/^pets\/(\d+)\/documents\/(\d+)\/files\/(\d+)$/', $path, $matches)) {
    $petId = $matches[1];
    $documentId = $matches[2];
    $fileId = $matches[3];
    
    if ($method === 'DELETE') {
        $result = $database->deleteDocumentFile($documentId, $fileId);
        echo json_encode($result);
    }
} elseif (preg_match('/^pets\/(\d+)\/documents\/(\d+)\/files$/', $path, $matches)) {
    $petId = $matches[1];
    $documentId = $matches[2];
    
    if ($method === 'POST') {
        // Añadir archivos nuevos a documento existente
        if (isset($_FILES['files']) && !empty($_FILES['files']['name'][0])) {
            $uploadedFiles = [];
            
            for ($i = 0; $i < count($_FILES['files']['name']); $i++) {
                if ($_FILES['files']['error'][$i] === UPLOAD_ERR_OK) {
                    $originalName = $_FILES['files']['name'][$i];
                    $tmpName = $_FILES['files']['tmp_name'][$i];
                    
                    // Obtener nombre personalizado si existe
                    $customName = isset($_POST['fileNames']) && isset($_POST['fileNames'][$i]) 
                        ? $_POST['fileNames'][$i] 
                        : $originalName;
                    
                    // Generar nombre único para el archivo
                    $fileName = time() . '_' . uniqid() . '_' . $originalName;
                    $uploadPath = 'uploads/documents/' . $fileName;
                    $fullUploadPath = __DIR__ . '/' . $uploadPath;
                    
                    // Crear directorio si no existe
                    $uploadDir = dirname($fullUploadPath);
                    if (!file_exists($uploadDir)) {
                        mkdir($uploadDir, 0777, true);
                    }
                    
                    // Mover el archivo subido
                    if (move_uploaded_file($tmpName, $fullUploadPath)) {
                        $uploadedFiles[] = [
                            'file_name' => $customName,
                            'file_path' => $uploadPath,
                            'original_name' => $originalName
                        ];
                    }
                }
            }
            
            if (!empty($uploadedFiles)) {
                $result = $database->addFilesToDocument($documentId, $uploadedFiles);
                echo json_encode($result);
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'No se pudieron procesar los archivos']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'No se enviaron archivos']);
        }
    }
} elseif (preg_match('/^pets\/(\d+)\/documents\/(\d+)$/', $path, $matches)) {
    $petId = $matches[1];
    $documentId = $matches[2];
    if ($method === 'PUT') {
        
        $input = [];
        
        
        // Manejar upload de archivo si está presente (igual que en POST)
        if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
            try {
                $uploadedFile = $_FILES['file'];
                
                // Validar tamaño (máximo 10MB para documentos)
                if ($uploadedFile['size'] > 10 * 1024 * 1024) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'El archivo es demasiado grande. Máximo 10MB']);
                    exit;
                }
                
                // Crear directorio uploads/documents si no existe
                $uploadDir = __DIR__ . '/uploads/documents/';
                if (!file_exists($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }
                
                // Obtener el archivo anterior para eliminarlo (necesitamos crear un método en Database para esto)
                $oldDocument = null; // Por ahora, no eliminamos el archivo anterior - TODO: mejorar esto
                
                // Generar nombre único para el archivo nuevo
                $extension = pathinfo($uploadedFile['name'], PATHINFO_EXTENSION);
                $fileName = 'document_' . $petId . '_' . uniqid() . '_' . time() . '.' . $extension;
                $filePath = $uploadDir . $fileName;
                
                // Mover el archivo subido
                if (!move_uploaded_file($uploadedFile['tmp_name'], $filePath)) {
                    http_response_code(500);
                    echo json_encode(['success' => false, 'message' => 'Error al guardar el archivo']);
                    exit;
                }
                
                // Eliminar el archivo anterior si existía
                if ($oldDocument && !empty($oldDocument['file_path']) && file_exists(__DIR__ . '/' . $oldDocument['file_path'])) {
                    unlink(__DIR__ . '/' . $oldDocument['file_path']);
                }
                
                $input['file_path'] = 'uploads/documents/' . $fileName;
            } catch (Exception $e) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => $e->getMessage()]);
                exit;
            }
        }
        
        // Obtener datos del formulario
        foreach ($_POST as $key => $value) {
            // No sobrescribir file_path si ya se estableció por el upload de archivo
            if ($key === 'file_path' && isset($input['file_path'])) {
                continue;
            }
            $input[$key] = $value;
            error_log("index.php - PUT document - Added to input: $key = " . json_encode($value));
        }
        
        // Si no hay datos POST (JSON), intentar obtener JSON
        if (empty($input) || (!isset($input['document_name']) && empty($_FILES))) {
            $jsonInput = json_decode(file_get_contents('php://input'), true);
            if ($jsonInput) {
                $input = array_merge($input, $jsonInput);
                error_log("index.php - PUT document - Added JSON input: " . json_encode($jsonInput));
            }
        }
        
        // Debug: Log final input before calling updatePetDocument
        error_log("index.php - PUT document - Final input passed to updatePetDocument: " . json_encode($input));
        
        $result = $database->updatePetDocument($petId, $documentId, $input);
        echo json_encode($result);
    } elseif ($method === 'DELETE') {
        $result = $database->deletePetDocument($petId, $documentId);
        echo json_encode($result);
    }
} elseif (preg_match('/^pets\/(\d+)\/documents$/', $path, $matches)) {
    $petId = $matches[1];
    if ($method === 'POST') {
        
        // Manejar upload de archivos
        $input = [];
        $uploadedFiles = [];
        
        // Verificar si es upload múltiple (nuevo sistema)
        if (isset($_FILES['files']) && !empty($_FILES['files']['name'][0])) {
            error_log("Multiple files upload detected, processing...");
            error_log("FILES: " . print_r($_FILES, true));
            error_log("POST: " . print_r($_POST, true));
            try {
                // Crear directorio uploads/documents si no existe
                $uploadDir = __DIR__ . '/uploads/documents/';
                if (!file_exists($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }
                
                // Procesar cada archivo
                $fileCount = count($_FILES['files']['name']);
                for ($i = 0; $i < $fileCount; $i++) {
                    // Verificar que no hay error en este archivo
                    if ($_FILES['files']['error'][$i] !== UPLOAD_ERR_OK) {
                        continue;
                    }
                    
                    // Validar tamaño (máximo 10MB para documentos)
                    if ($_FILES['files']['size'][$i] > 10 * 1024 * 1024) {
                        http_response_code(400);
                        echo json_encode(['success' => false, 'message' => 'Uno de los archivos es demasiado grande. Máximo 10MB']);
                        exit;
                    }
                    
                    // Generar nombre único para el archivo
                    $extension = pathinfo($_FILES['files']['name'][$i], PATHINFO_EXTENSION);
                    $fileName = 'document_' . $petId . '_' . uniqid() . '_' . time() . '_' . $i . '.' . $extension;
                    $filePath = $uploadDir . $fileName;
                    
                    // Mover el archivo subido
                    if (!move_uploaded_file($_FILES['files']['tmp_name'][$i], $filePath)) {
                        http_response_code(500);
                        echo json_encode(['success' => false, 'message' => 'Error al guardar archivo: ' . $_FILES['files']['name'][$i]]);
                        exit;
                    }
                    
                    // Obtener el nombre personalizado del archivo
                    $customName = isset($_POST['file_names']) && isset($_POST['file_names'][$i]) 
                        ? $_POST['file_names'][$i] 
                        : pathinfo($_FILES['files']['name'][$i], PATHINFO_FILENAME);
                    
                    $uploadedFiles[] = [
                        'file_name' => $customName,
                        'file_path' => 'uploads/documents/' . $fileName,
                        'original_name' => $_FILES['files']['name'][$i]
                    ];
                }
                
                $input['uploaded_files'] = $uploadedFiles;
                $input['multiple_files'] = true;
                
            } catch (Exception $e) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => $e->getMessage()]);
                exit;
            }
        }
        // Manejar archivo único (sistema legacy)
        elseif (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
            error_log("Single file upload detected, processing...");
            try {
                $uploadedFile = $_FILES['file'];
                
                // Validar tamaño (máximo 10MB para documentos)
                if ($uploadedFile['size'] > 10 * 1024 * 1024) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'El archivo es demasiado grande. Máximo 10MB']);
                    exit;
                }
                
                // Crear directorio uploads/documents si no existe
                $uploadDir = __DIR__ . '/uploads/documents/';
                if (!file_exists($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }
                
                // Generar nombre único para el archivo
                $extension = pathinfo($uploadedFile['name'], PATHINFO_EXTENSION);
                $fileName = 'document_' . $petId . '_' . uniqid() . '_' . time() . '.' . $extension;
                $filePath = $uploadDir . $fileName;
                
                // Mover el archivo subido
                if (!move_uploaded_file($uploadedFile['tmp_name'], $filePath)) {
                    http_response_code(500);
                    echo json_encode(['success' => false, 'message' => 'Error al guardar el archivo']);
                    exit;
                }
                
                $input['file_path'] = 'uploads/documents/' . $fileName;
            } catch (Exception $e) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => $e->getMessage()]);
                exit;
            }
        }
        
        // Obtener datos del formulario
        foreach ($_POST as $key => $value) {
            // No sobrescribir file_path si ya se estableció por el upload de archivo
            if ($key === 'file_path' && isset($input['file_path'])) {
                continue;
            }
            $input[$key] = $value;
        }
        
        // Si no hay datos POST (JSON), intentar obtener JSON
        if (empty($input) || !isset($input['document_name'])) {
            $jsonInput = json_decode(file_get_contents('php://input'), true);
            if ($jsonInput) {
                // Filtrar file_path del JSON también si ya tenemos uno
                if (isset($input['file_path']) && isset($jsonInput['file_path'])) {
                    unset($jsonInput['file_path']);
                }
                $input = array_merge($input, $jsonInput);
            }
        }
        
        $result = $database->addPetDocument($petId, $input);
        echo json_encode($result);
    } elseif ($method === 'GET') {
        $documents = $database->getPetDocuments($petId);
        echo json_encode($documents);
    }
} elseif (preg_match('/^pets\/(\d+)$/', $path, $matches)) {
    $petId = $matches[1];
    if ($method === 'GET') {
        $pet = $database->getPetById($petId);
        if ($pet) {
            echo json_encode($pet);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Mascota no encontrada']);
        }
    } elseif ($method === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);
        $result = $database->updatePet($petId, $input);
        echo json_encode($result);
    } elseif ($method === 'DELETE') {
        $result = $database->deletePet($petId);
        echo json_encode($result);
    }
} elseif (preg_match('/^users\/(\d+)$/', $path, $matches)) {
    $userId = $matches[1];
    if ($method === 'GET') {
        $user = $database->getUserById($userId);
        if ($user) {
            echo json_encode($user);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Usuario no encontrado']);
        }
    } elseif ($method === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);
        $result = $database->updateUser($userId, $input);
        echo json_encode($result);
    } elseif ($method === 'DELETE') {
        $result = $database->deleteUser($userId);
        echo json_encode($result);
    }
} else {
    // Rutas simples con switch
    switch ($path) {
        case 'dog':
        case 'dog/info':
            if ($method === 'GET') {
                $dogInfo = $database->getDogInfo();
                if ($dogInfo) {
                    // Calcular edad en años humanos y caninos
                    $birthDate = new DateTime($dogInfo['birth_date']);
                    $today = new DateTime();
                    $diff = $today->diff($birthDate);
                    
                    $ageYears = $diff->y;
                    $ageMonths = $diff->m;
                    $ageDays = $diff->days;
                    
                    // Cálculo más preciso incluyendo días
                    // Convertir todo a días y luego a años decimales para mayor precisión
                    $totalDays = $ageDays;
                    $ageInYears = $totalDays / 365.25; // Usar 365.25 para años bisiestos
                    
                    // Conversión a edad canina (aproximada)
                    $dogYears = 0;
                    if ($ageInYears >= 1) {
                        // Más de un año: primer año = 15 años caninos, después 4 por año
                        $yearsAfterFirst = $ageInYears - 1;
                        $dogYears = 15 + ($yearsAfterFirst * 4);
                    } else {
                        // Menos de un año: proporcional al primer año
                        $dogYears = $ageInYears * 15;
                    }
                    
                    $dogInfo['age_years'] = $ageYears;
                    $dogInfo['age_months'] = $ageMonths;
                    $dogInfo['age_days'] = $ageDays;
                    $dogInfo['age_days_only'] = $diff->d; // Solo los días del diff
                    $dogInfo['dog_years'] = round($dogYears, 1);
                    
                    echo json_encode($dogInfo);
                } else {
                    echo json_encode(['error' => 'Dog not found']);
                }
            } elseif ($method === 'PUT') {
                $input = json_decode(file_get_contents('php://input'), true);
                $result = $database->updateDogInfo($input);
                echo json_encode($result);
            }
            break;
        
        case 'dog/vaccines':
            if ($method === 'GET') {
                $vaccines = $database->getVaccines();
                echo json_encode($vaccines);
            } elseif ($method === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                $result = $database->addVaccine($input);
                echo json_encode($result);
            }
            break;
        
        case 'dog/weight':
            if ($method === 'GET') {
                $weightHistory = $database->getWeightHistory();
                echo json_encode($weightHistory);
            }
            break;
        
        case 'dog/complete':
            if ($method === 'GET') {
                $dogInfo = $database->getDogInfo();
                $vaccines = $database->getVaccines();
                $weightHistory = $database->getWeightHistory();
                
                if ($dogInfo) {
                    // Calcular edad
                    $birthDate = new DateTime($dogInfo['birth_date']);
                    $today = new DateTime();
                    $diff = $today->diff($birthDate);
                    
                    $ageYears = $diff->y;
                    $ageMonths = $diff->m;
                    $ageDays = $diff->days;
                    
                    // Cálculo más preciso incluyendo días
                    // Convertir todo a días y luego a años decimales para mayor precisión
                    $totalDays = $ageDays;
                    $ageInYears = $totalDays / 365.25; // Usar 365.25 para años bisiestos
                    
                    $dogYears = 0;
                    if ($ageInYears >= 1) {
                        // Más de un año: primer año = 15 años caninos, después 4 por año
                        $yearsAfterFirst = $ageInYears - 1;
                        $dogYears = 15 + ($yearsAfterFirst * 4);
                    } else {
                        // Menos de un año: proporcional al primer año
                        $dogYears = $ageInYears * 15;
                    }
                    
                    $dogInfo['age_years'] = $ageYears;
                    $dogInfo['age_months'] = $ageMonths;
                    $dogInfo['age_days'] = $ageDays;
                    $dogInfo['age_days_only'] = $diff->d; // Solo los días del diff
                    $dogInfo['dog_years'] = round($dogYears, 1);
                    
                    echo json_encode([
                        'dog_info' => $dogInfo,
                        'vaccines' => $vaccines,
                        'weight_history' => $weightHistory
                    ]);
                } else {
                    echo json_encode(['error' => 'Dog not found']);
                }
            }
            break;
        
        case 'pets':
            if ($method === 'GET') {
                $pets = $database->getAllPets();
                echo json_encode($pets);
            } elseif ($method === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                $result = $database->createPet($input);
                echo json_encode($result);
            }
            break;
            
        case 'users':
            if ($method === 'GET') {
                $users = $database->getAllUsers();
                echo json_encode($users);
            } elseif ($method === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                $result = $database->createUser($input);
                echo json_encode($result);
            }
            break;
            
        case 'users/search':
            if ($method === 'GET' && isset($_GET['q'])) {
                $users = $database->searchUsers($_GET['q']);
                echo json_encode($users);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Query parameter required']);
            }
            break;
            
        case 'login':
            if ($method === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                if (isset($input['username']) && isset($input['password'])) {
                    $user = $database->authenticateUser($input['username'], $input['password']);
                    if ($user) {
                        echo json_encode(['success' => true, 'user' => $user]);
                    } else {
                        http_response_code(401);
                        echo json_encode(['success' => false, 'message' => 'Credenciales inválidas']);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'Username y contraseña requeridos']);
                }
            }
            break;
            
        case 'upload/image':
            if ($method === 'POST') {
                try {
                    // Verificar que se subió un archivo
                    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
                        throw new Exception('No se pudo subir la imagen');
                    }
                    
                    $uploadedFile = $_FILES['image'];
                    
                    // Validar que es una imagen
                    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                    if (!in_array($uploadedFile['type'], $allowedTypes)) {
                        throw new Exception('Tipo de archivo no permitido. Solo se permiten JPG, PNG, GIF y WebP');
                    }
                    
                    // Validar tamaño (máximo 5MB)
                    if ($uploadedFile['size'] > 5 * 1024 * 1024) {
                        throw new Exception('El archivo es demasiado grande. Máximo 5MB');
                    }
                    
                    // Crear directorio uploads si no existe
                    $uploadDir = __DIR__ . '/uploads/';
                    if (!file_exists($uploadDir)) {
                        mkdir($uploadDir, 0755, true);
                    }
                    
                    // Generar nombre único para el archivo
                    $extension = pathinfo($uploadedFile['name'], PATHINFO_EXTENSION);
                    $fileName = 'pet_' . uniqid() . '_' . time() . '.' . $extension;
                    $filePath = $uploadDir . $fileName;
                    
                    // Mover el archivo subido
                    if (!move_uploaded_file($uploadedFile['tmp_name'], $filePath)) {
                        throw new Exception('Error al guardar la imagen');
                    }
                    
                    // Generar URL pública para la imagen usando el host actual
                    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
                    $host = $_SERVER['HTTP_HOST'];
                    $imageUrl = $protocol . '://' . $host . '/api/uploads/' . $fileName;
                    
                    echo json_encode([
                        'success' => true,
                        'url' => $imageUrl,
                        'filename' => $fileName,
                        'message' => 'Imagen subida correctamente'
                    ]);
                    
                } catch (Exception $e) {
                    http_response_code(400);
                    echo json_encode([
                        'success' => false,
                        'message' => $e->getMessage()
                    ]);
                }
            }
            break;
            
        case 'debug':
            if ($method === 'GET') {
                try {
                    $pets = $database->getAllPets();
                    $dogInfo = $database->getDogInfo();
                    
                    $debug = [
                        'pets_count' => count($pets),
                        'pets' => $pets,
                        'dog_info' => $dogInfo,
                        'weight_history' => [],
                        'vaccines' => [],
                        'pet_complete_test' => null
                    ];
                    
                    if (count($pets) > 0) {
                        $firstPet = $pets[0];
                        $debug['weight_history'] = $database->getPetWeightHistory($firstPet['id']);
                        $debug['vaccines'] = $database->getPetVaccines($firstPet['id']);
                        $debug['pet_complete_test'] = $database->getPetComplete($firstPet['id']);
                    }
                    
                    echo json_encode($debug, JSON_PRETTY_PRINT);
                } catch (Exception $e) {
                    echo json_encode([
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ], JSON_PRETTY_PRINT);
                }
            }
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found']);
            break;
    }
}
?>