<?php
/*
* Set lines 17,130,131,135 for your app
*/

class AccessRouter {

	private $requestedRoute;

	public function __construct($options = array(
		'protected_routes' => array(),
		'dev' => array('host'=>'','saasid'=>''),
		'production' => array('host'=>'','saasid'=>'')
	)){
		$host = $_SERVER['HTTP_HOST'];
		$path = $_SERVER['REQUEST_URI'];
		$this->routes = $options['protected_routes'];
		$this->saasid = urlencode(self::get_saasid($options['dev'],$options['production']));
		$this->idpid = urlencode("");
		$this->requestedRoute = "https://{$host}{$path}";
	}

	public static function get_saasid($dev,$production){
		$host = $_SERVER['HTTP_HOST'];
		if($host === $dev['host']):
			return $dev['saasid'];
		elseif($host === $production['host']):
			return $production['saasid'];
		else:
			return false;
		endif;
	}

	// check if the page is in protected directory
	public function onProtectedRoute(){
		foreach($this->routes as $pattern):
			if( preg_match($pattern,$_SERVER['REQUEST_URI']) ){
				return true;
			}
		endforeach;
		return false;
	}

	# Create a new user session for this user, identified by "$username",
	# by the identity provider identified by "$idpId"
	#
	# Implement me!! Must validate that subject belongs to this idpId
	public function createUserSession($username, $idpid, $email){
		$_SESSION['authorized'] = 'Authorized';
		$_SESSION['visitorEmail'] = $email;
		$_SESSION['visitorName'] = $username;
	}

	protected function authorizeRoute(){
		header("location: {$this->requestedRoute}");
	}

	public function redirect(){
		header("location: https://sso.connect.pingidentity.com/sso/sp/initsso?saasid={$this->saasid}&idpid={$this->idpid}&appurl={$this->requestedRoute}");
	}

	public function checkRoute($exchanger){
		if(!$this->onProtectedRoute()):
			// not a protected page, continue rendering to browser
			return;
		else:
			switch(true):
				case(isset($_SESSION['authorized']) && !empty($_SESSION['authorized'])):
					// user is already authorized, continue rendering to browser
					return;
					break;
				case(isset($_POST['tokenid']) && isset($_POST['agentid']) ):
					// user not already authorized, but has been newly redirected SSO
					// check that the user id belogs to the user
					$user = $exchanger->exchangeToken($_POST['tokenid'],$_POST['agentid']);
					if($user !== false):
						// user matched
						// grant access and set session variables
						$this->createUserSession(
							$user['pingone.subject'],
							$user['pingone.idp.id'],
							$user['email']);
						// $this->authorizeRoute();
					else:
						// wrong login credentials
						echo 'Incorrect Login Credentials Provided';
						$this->redirect();
					endif;
					break;
				default:
					// no login credentials
					echo 'No Login Credentials Provided';
					$this->redirect();
			endswitch;
		endif;
	}
}

class SSOTokenExchanger {

	protected $restAuthUsername;
	protected $restApiKey;
	public $router;

	public function __construct($restAuthUsername,$restApiKey){
		$this->restAuthUsername = $restAuthUsername;
		$this->restApiKey = $restApiKey;
	}

	# Requires libcurl to be installed. For more info, see:
	# http://us.php.net/manual/en/book.curl.php
	public function exchangeToken($tokenId,$agentId){
		if(!is_null($tokenId)):
			$sso_service = "https://sso.connect.pingidentity.com/sso/TXS/2.0/1/{$tokenId}";
			$c = curl_init($sso_service);
			curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($c, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
			curl_setopt($c, CURLOPT_COOKIE, "agentid={$agentId}");
			curl_setopt($c, CURLOPT_USERPWD, $this->restAuthUsername.":".$this->restApiKey);
			$response = curl_exec($c);
			curl_close($c);
			$responseData = json_decode($response, true);
			return $responseData;
		else:
			return false;
		endif;
	}
};

$params = [
	'protected_routes'=>['/\/.*$/'],
	'production'=>[
		'host'=>'',
		'saasid'=>''
	],
	'dev'=>[
		'host'=>'onefiredev.com',
		'saasid'=>''
	]
];

$router = new AccessRouter($params);
$exchanger = new SSOTokenExchanger('e81689e2-25cc-4c08-8fb8-fb319043f85c','Pingdevelopers1');
$router->checkRoute($exchanger);

?>
