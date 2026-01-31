
<?php
/**
 * OmniSend Pro - Core Backend Engine Optimized for CyberPanel/LiteSpeed
 */
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Detect base URL for proper routing
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $_SERVER['SERVER_PORT'] == 443 ? "https://" : "http://";
$host = $_SERVER['HTTP_HOST'];
$uri = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
$baseUrl = $protocol . $host . $uri;

// CORS Headers - Vital for live environments
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

$dataDir = __DIR__ . '/data/';

// Environment & Permission Sanitization
function check_environment($dir) {
    if (!file_exists($dir)) {
        if (!@mkdir($dir, 0755, true)) {
            return ["success" => false, "error" => "Cannot create data directory ($dir). Check parent folder permissions."];
        }
    }
    if (!is_writable($dir)) {
        return ["success" => false, "error" => "Data directory is not writable. Ensure CyberPanel user owns the folder."];
    }
    
    $htaccess = $dir . '.htaccess';
    if (!file_exists($htaccess)) {
        @file_put_contents($htaccess, "Deny from all");
    }
    return ["success" => true];
}

function get_json($filename) {
    $file = __DIR__ . '/data/' . $filename . '.json';
    if (!file_exists($file)) return [];
    $content = @file_get_contents($file);
    return json_decode($content, true) ?: [];
}

function save_json($filename, $data) {
    $file = __DIR__ . '/data/' . $filename . '.json';
    return @file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?: [];

try {
    $env = check_environment($dataDir);
    if (!$env['success'] && $action !== 'check_status') {
        echo json_encode($env);
        exit;
    }

    switch ($action) {
        case 'ping':
            echo json_encode(['success' => true, 'message' => 'pong', 'timestamp' => time()]);
            break;

        case 'get_contacts':
            echo json_encode(get_json('contacts'));
            break;
            
        case 'save_contact':
            $contacts = get_json('contacts');
            $new = $input;
            if (empty($new['email'])) {
                echo json_encode(['success' => false, 'error' => 'Email required']);
                break;
            }
            $new['id'] = uniqid();
            $new['added'] = date('Y-m-d H:i:s');
            $contacts[] = $new;
            save_json('contacts', $contacts);
            echo json_encode(['success' => true]);
            break;

        case 'bulk_import_contacts':
            $contacts = get_json('contacts');
            $incoming = $input['contacts'] ?? [];
            $count = 0;
            foreach ($incoming as $c) {
                if (!empty($c['email'])) {
                    $c['id'] = uniqid();
                    $c['added'] = date('Y-m-d H:i:s');
                    $contacts[] = $c;
                    $count++;
                }
            }
            save_json('contacts', $contacts);
            echo json_encode(['success' => true, 'imported' => $count]);
            break;

        case 'get_senders':
            echo json_encode(get_json('senders'));
            break;

        case 'save_sender':
            $senders = get_json('senders');
            $new = $input;
            $new['id'] = uniqid();
            $senders[] = $new;
            save_json('senders', $senders);
            echo json_encode(['success' => true]);
            break;

        case 'get_campaigns':
            echo json_encode(get_json('campaigns'));
            break;

        case 'save_campaign':
            $campaigns = get_json('campaigns');
            $new = $input;
            $new['id'] = $new['id'] ?? uniqid();
            $new['status'] = $new['status'] ?? 'draft';
            $new['created_at'] = date('Y-m-d H:i:s');
            $new['stats'] = $new['stats'] ?? ['sent' => 0, 'failed' => 0, 'opened' => 0, 'clicked' => 0];
            
            $found = false;
            foreach ($campaigns as &$c) {
                if ($c['id'] === $new['id']) {
                    $c = array_merge($c, $new);
                    $found = true;
                    break;
                }
            }
            if (!$found) $campaigns[] = $new;
            
            save_json('campaigns', $campaigns);
            echo json_encode(['success' => true, 'id' => $new['id']]);
            break;

        case 'get_logs':
            echo json_encode(get_json('logs'));
            break;

        case 'process_sending':
            $campaigns = get_json('campaigns');
            $logs = get_json('logs');
            $senders = get_json('senders');
            $contacts = get_json('contacts');
            
            $processed = 0;
            foreach ($campaigns as &$campaign) {
                if ($campaign['status'] === 'sending') {
                    $pool = $campaign['smtpPoolIds'] ?? [];
                    if (empty($pool) || empty($senders)) continue;
                    
                    $senderId = $pool[array_rand($pool)];
                    $activeSender = null;
                    foreach ($senders as $s) { if ($s['id'] === $senderId) $activeSender = $s; }
                    
                    if (!$activeSender || empty($contacts)) continue;

                    $recipient = $contacts[array_rand($contacts)];
                    $success = rand(0, 100) > 5; // 95% simulation
                    
                    $logEntry = [
                        'id' => uniqid(),
                        'senderName' => $activeSender['name'],
                        'recipient' => $recipient['email'],
                        'subject' => $campaign['subject'],
                        'status' => $success ? 'success' : 'failed',
                        'timestamp' => date('H:i:s'),
                        'campaignId' => $campaign['id']
                    ];
                    
                    array_unshift($logs, $logEntry);
                    if (count($logs) > 50) array_pop($logs);
                    
                    if ($success) {
                        $campaign['stats']['sent']++;
                    } else {
                        $campaign['stats']['failed']++;
                    }
                    $processed++;
                    break; 
                }
            }
            
            save_json('campaigns', $campaigns);
            save_json('logs', $logs);
            echo json_encode(['success' => true, 'processed' => $processed]);
            break;

        case 'check_status':
            $is_writable = is_writable($dataDir);
            echo json_encode([
                'online' => true,
                'php_version' => PHP_VERSION,
                'storage_writable' => $is_writable,
                'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
                'base_url' => $baseUrl
            ]);
            break;

        default:
            echo json_encode(['error' => 'Invalid action: ' . $action]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
exit;
