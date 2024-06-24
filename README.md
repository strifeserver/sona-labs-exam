**Installation**
Clone the Repository:

bash
> git clone https://github.com/strifeserver/sona-labs-exam


Frontend Setup:
Navigate to sona-labs-exam/sona-labs-fe directory:

bash
> cd sona-labs-exam/sona-labs-fe

Install dependencies:

bash
> npm install

Start the frontend server:

bash
> npm start

Backend Setup:

Ensure PHP is installed.

Edit sona-labs-exam/self-server-php/config.php file to change necessary credentials for testing:

php
> return [
    'clientID' => '5170996c-2acb-42b4-b36e-aa294ccb52d9',
    'clientSecret' => '8e8083bc-49b4-4b96-ae5f-275c8358ab03',
    'frontendBaseUrl' => 'http://localhost:3000', // REACT URL
    'backendBaseUrl' => 'http://localhost:8000', // PHP URL
    'redirectUri' => 'http://localhost:8000',
    'scope' => 'crm.objects.companies.read crm.objects.companies.write crm.objects.contacts.read crm.objects.contacts.write',
    'authUrl' => 'https://app.hubspot.com/oauth/authorize',
    'tokenUrl' => 'https://api.hubapi.com/oauth/v1/token/',
];

Run PHP Server:
Start the PHP server:

bash
> cd sona-labs-exam/self-server-php
php -S localhost:8000


