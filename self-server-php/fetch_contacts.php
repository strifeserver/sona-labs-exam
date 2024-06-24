<?php

require 'vendor/autoload.php';

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

class HubSpotAPI
{
    private $client;
    private $accessToken;

    public function __construct($accessToken)
    {
        $this->client = new Client();
        $this->accessToken = $accessToken;
    }

    public function fetchContacts()
    {
        $returns = ['status' => 'error', 'code' => 500, 'message' => '', 'result' => null];

        try {
            $response = $this->client->get('https://api.hubapi.com/crm/v3/objects/contacts', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->accessToken,
                    'Content-Type' => 'application/json',
                ],
            ]);
            $data = json_decode($response->getBody(), true);
            $returns['status'] = 'success';
            $returns['code'] = 200;
            $returns['message'] = 'Successfully fetched contacts';
            $returns['result'] = $data;

        } catch (RequestException $e) {
            http_response_code(500);
            $returns['message'] = 'Failed to fetch contacts';
            $returns['result'] = $e->getMessage();
        }

        return $returns;
    }
    public function checkContactData()
    {
        $returns = ['status' => 'error', 'code' => 500, 'message' => '', 'result' => null];

        try {
            $body = json_encode([
                "filterGroups" => [
                    [
                        "filters" => [
                            [
                                "propertyName" => "createdate",
                                "operator" => "GTE",
                                "value" => "2024-06-01T00:00:00.000Z",
                            ],
                            [
                                "propertyName" => "createdate",
                                "operator" => "LTE",
                                "value" => "2025-06-24T23:59:59.999Z",
                            ],
                        ],
                    ],
                ],
                "limit" => 0,
                "properties" => [
                    "total",
                ],
            ]);

            $response = $this->client->post('https://api.hubapi.com/crm/v3/objects/contacts/search', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->accessToken,
                    'Content-Type' => 'application/json',
                ],
                'body' => $body,
            ]);

            $data = json_decode($response->getBody(), true);

            $returns['status'] = 'success';
            $returns['code'] = 200;
            $returns['message'] = 'Successfully fetched contact data';
            $returns['result'] = ['total' => $data['total']];

        } catch (RequestException $e) {
            http_response_code(500);
            $returns['message'] = 'Failed to fetch contacts data';
            $returns['result'] = $e->getMessage();
        }

        return $returns;
    }

    public function fetchContactsFilterPaginated()
    {
        $returns = ['status' => 'error', 'code' => 500, 'message' => '', 'result' => null];
        $allContacts = [];
        $after = null;
        $limit = 100;

        $now = new DateTime();
        $defaultFromDate = (clone $now)->modify('-90 days')->format('Y-m-d');
        $defaultToDate = $now->format('Y-m-d');
        $from = null;
        $to = null;
        
        if (isset($_GET['selected_filter'], $_GET['raw_value'])) {
            $readValue = json_decode($_GET['raw_value'], true);
        
            if (isset($readValue['startDate'], $readValue['endDate'])) {
                $from = new DateTime($readValue['startDate']);
                $to = new DateTime($readValue['endDate']);
                $from = $from->modify('+1 day')->format('Y-m-d');
                $to = $to->modify('+1 day')->format('Y-m-d');
            } else {
       
            }
        }
        
        $fromDate = $from ?? $defaultFromDate;
        $toDate = $to ?? $defaultToDate;
        
        // print_r($fromDate);
        // echo '--';
        // print_r($toDate);
        // exit;

        try {
            do {
                $body = [
                    "filterGroups" => [
                        [
                            "filters" => [
                                [
                                    "propertyName" => "createdate",
                                    "operator" => "GTE",
                                    "value" => $fromDate,
                                ],
                                [
                                    "propertyName" => "createdate",
                                    "operator" => "LTE",
                                    "value" => $toDate,
                                ],
                            ],
                        ],
                    ],
                    "limit" => $limit,
                    "properties" => [
                        "total",
                        "createdate",
                        "email",
                        "firstname",
                        "lastname",
                        "hs_object_id",
                        "lastmodifieddate",
                    ],
                ];

                if ($after) {
                    $body['after'] = $after;
                }

                $response = $this->client->post('https://api.hubapi.com/crm/v3/objects/contacts/search', [
                    'headers' => [
                        'Authorization' => 'Bearer ' . $this->accessToken,
                        'Content-Type' => 'application/json',
                    ],
                    'body' => json_encode($body),
                ]);

                $data = json_decode($response->getBody(), true);

                $allContacts = array_merge($allContacts, $data['results']);

                $allContacts = [
                    'total'=>count($allContacts),
                    'results'=>$allContacts,
                ];
                
           
 
                if (isset($data['paging']['next']['after'])) {
                    $after = $data['paging']['next']['after'];
                } else {
                    $after = null;
                }

                sleep(1);

            } while ($after);

            $returns['status'] = 'success';
            $returns['code'] = 200;
            $returns['message'] = 'Successfully fetched contact data';
            $returns['result'] =  $allContacts;

        } catch (RequestException $e) {
            http_response_code(500);
            $returns['message'] = 'Failed to fetch contacts data';
            $returns['result'] = $e->getMessage();
        }

        return $returns;
    }

}

$returns = ['status' => 'error', 'code' => 500, 'message' => '', 'result' => null];

if (!isset($_GET['access_token'])) {
    http_response_code(500);
    $returns['message'] = 'Access token is not available';
    echo json_encode($returns);
    exit;
}

$mode = isset($_GET['mode']) ? $_GET['mode'] : '';

$hubSpotAPI = new HubSpotAPI($_GET['access_token']);

switch ($mode) {
    case 'fetch_contact':
        $returns = $hubSpotAPI->fetchContacts();
        break;
    case 'check_contact':
        $returns = $hubSpotAPI->checkContactData();
        break;
    case 'all_contact':
        $returns = $hubSpotAPI->fetchContactsFilterPaginated();
        break;
    default:
        $returns['message'] = 'Invalid mode provided';
        break;
}

echo json_encode($returns);
