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

			default:
				# code...
				break;
		}
	}
	
	echo json_encode($result, JSON_FORCE_OBJECT);
		
?>