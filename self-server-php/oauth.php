<?php
require 'vendor/autoload.php';

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

$config = include 'config.php';

$clientID = $config['clientID'];
$clientSecret = $config['clientSecret'];
$redirectUri = $config['redirectUri'];
$scope = $config['scope'];
$authUrl = $config['authUrl'];
$tokenUrl = $config['tokenUrl'];
$frontendBaseUrl = $config['frontendBaseUrl'];
$backendBaseUrl = $config['backendBaseUrl'];

$client = new Client();

// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (!isset($_GET['code'])) {
    $authorizationUrl = $authUrl . '?' . http_build_query([
        'client_id' => $clientID,
        'redirect_uri' => $backendBaseUrl,
        'scope' => $scope,
        'response_type' => 'code',
    ]);

    header('Location: ' . $authorizationUrl);
    exit;
} else {
    try {
        $response = $client->post($tokenUrl, [
            'form_params' => [
                'grant_type' => 'authorization_code',
                'client_id' => $clientID,
                'client_secret' => $clientSecret,
                'redirect_uri' => $backendBaseUrl . '/oauth.php',
                'code' => $_GET['code'],
            ],
        ]);

        $data = json_decode($response->getBody(), true);
        http_response_code(200);
        $redirectUri = $frontendBaseUrl . '/?&code=' . $data['access_token'];
        header('Location: ' . $redirectUri);
    } catch (RequestException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to obtain access token: ' . $e->getMessage()]);
    }
}
