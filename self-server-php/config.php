<?php
return [
    'clientID' => '5170996c-2acb-42b4-b36e-aa294ccb52d9',
    'clientSecret' => '8e8083bc-49b4-4b96-ae5f-275c8358ab03',
    'frontendBaseUrl' => 'http://localhost:3000',  #REACT URL
    'backendBaseUrl' => 'http://localhost:8000',  #PHP URL
    'redirectUri' => 'http://localhost:8000',  
    'scope' => 'crm.objects.companies.read crm.objects.companies.write crm.objects.contacts.read crm.objects.contacts.write',
    'authUrl' => 'https://app.hubspot.com/oauth/authorize',
    'tokenUrl' => 'https://api.hubapi.com/oauth/v1/token/',
];
?>
