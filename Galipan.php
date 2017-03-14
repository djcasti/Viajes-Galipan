<?php
	include_once('db_conector.php');

	class MainGalipan extends DBConnector {

		public function getPaises() {
			$query = $this->queryList("SELECT * FROM PAIS", []);	
			return $query->fetchAll(PDO::FETCH_ASSOC);			
		}
	}

	$db = new MainGalipan();
	$result = array();

	if(isset($_GET['option'])){
		
		switch ($_GET['option']) {
			case 'getPaises':
				$result[] = $db->getPaises();
				break;
			
			default:
				# code...
				break;
		}
	}
	
	echo json_encode($result);
		
?>