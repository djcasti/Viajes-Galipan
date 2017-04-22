<?php
	include_once('db_conector.php');

	class MainGalipan extends DBConnector {

		public function getPaises() {
			$query = $this->queryList("SELECT id_pais, nombre FROM pais WHERE codigo IN ('ES','VE')", []);	
			return $query->fetchAll(PDO::FETCH_ASSOC);	
		}

		public function getEstados($idPais) {
			$query = $this->queryList("SELECT id_estado, nombre FROM estado WHERE id_pais = :idPais", [':idPais' => $idPais]);	
			return $query->fetchAll(PDO::FETCH_ASSOC);			
		}

		public function getCiudades($idEstado) {
			$query = $this->queryList("SELECT id_ciudad, nombre FROM ciudad WHERE id_estado = :idEstado", [':idEstado' => $idEstado]);
			return $query->fetchAll(PDO::FETCH_ASSOC);			
		}

		public function getBancos($idPais) {
			$query = $this->queryList("SELECT id_banco, nombre FROM banco WHERE id_pais = :idPais", [':idPais' => $idPais]);	
			return $query->fetchAll(PDO::FETCH_ASSOC);			
		}

		public function getCurrency() {
			$query = $this->queryList("SELECT id_moneda, nombre, codigo, simbolo FROM moneda", []);	
			return $query->fetchAll(PDO::FETCH_ASSOC);			
		}

		public function getExchange($idCurrency) {
			$query = $this->queryList("SELECT t.id_tasa, t.monto, m.simbolo FROM tasa_cambio t INNER JOIN moneda m ON (t.id_moneda = m.id_moneda) WHERE t.id_moneda = :idCurrency", [':idCurrency' => $idCurrency]);	
			return $query->fetchAll(PDO::FETCH_ASSOC);			
		}

		public function guardarTransaccion($data) {
			$rem = $data['remitente'];
			$des = $data['destinatario'];
			$tran = $data['transaccion'];

			$query = $this->queryList("INSERT INTO `remitente` (`nombres`, `apellidos`, `nro_identificacion`, `telefono`, `direccion`, `nro_transferencia`, `id_ciudad`, `id_banco`) VALUES (:firstName, :lastName, :idNumber, :phone, :address, :transferNumber, :idCity, :idBank)", [ ':firstName'=>$rem['fisrtName'], ':lastName'=>$rem['lastName'], ':idNumber'=>$rem['idNumber'], ':phone'=>$rem['phone'], ':address'=>$rem['address'],':transferNumber'=>$rem['transferNumber'], ':idCity'=>$rem['city'], ':idBank'=>$rem['bank'] ]);

			if($query->rowCount() > 0){
				$senderId = $this->connection->lastInsertId();
				
				$query = $this->queryList("INSERT INTO `destinatario` (`nombres`, `apellidos`, `nro_identificacion`, `telefono`, `direccion`, `nro_cuenta`, `id_ciudad`, `id_banco`) VALUES (:firstName, :lastName, :idNumber, :phone, :address, :accountNumber, :idCity, :idBank)", [ ':firstName'=>$des['fisrtName'], ':lastName'=>$des['lastName'], ':idNumber'=>$des['idNumber'], ':phone'=>$des['phone'], ':address'=>$des['address'],':accountNumber'=>$des['accountNumber'], ':idCity'=>$des['city'], ':idBank'=>$des['bank'] ]);

				if ($query->rowCount() > 0) {
					$receiverId = $this->connection->lastInsertId();

					$query = $this->queryList("INSERT INTO `transaccion` (`monto_origen`, `cargo`, `monto_destino`, `id_remitente`, `id_destinatario`, `id_tasa_cambio`) VALUES (:amountSent, :charge, :amountReceived, :idRemitente, :idDestinatario, :idTasaCambio)", [ ':amountSent'=>$tran['amountSent'], ':charge'=>$tran['charge'], ':amountReceived'=>$tran['amountReceived'], ':idRemitente'=>$senderId, ':idDestinatario'=>$receiverId,':idTasaCambio'=>$tran['exchangeRate'] ]);

					if ($query->rowCount() > 0) {
						$transactionId = $this->connection->lastInsertId();
						$respuesta = array('response' => ['code' => 'OK', 'message' => 'Los datos fueron guardados de manera exitosa'],
										   'data' => ['tranxId' => $transactionId]);
					}
				}
			}

			return $respuesta;
		}
	}

	$db = new MainGalipan();
	$result = array();

	if(isset($_GET['option'])){
		
		switch ($_GET['option']) {
			case 'getPaises':
				$result = $db->getPaises();
				break;

			case 'getEstados':
				$result = $db->getEstados($_GET['idPais']);
				break;

			case 'getCiudades':
				$result = $db->getCiudades($_GET['idEstado']);
				break;

			case 'getBancos':
				$result = $db->getBancos($_GET['idPais']);
				break;

			case 'getCurrency':
				$result = $db->getCurrency();
				break;

			case 'guardarTransaccion':
				$result = $db->guardarTransaccion($_GET['data']);
				//var_dump($result);
				break;

			case 'getExchange':
				$result = $db->getExchange($_GET['idCurrency']);
			default:
				# code...
				break;
		}
	}
	
	echo json_encode($result, JSON_FORCE_OBJECT);
		
?>