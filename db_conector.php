<?php
	abstract class DBConnector{
        const USERNAME="root";
        const PASSWORD="";
        const HOST="localhost";
        const DB="galipandb";

        private function getConnection(){
            $username = self::USERNAME;
            $password = self::PASSWORD;
            $host = self::HOST;
            $db = self::DB;

            try {
            	$connection = new PDO("mysql:dbname=$db;host=$host;charset=utf8", $username, $password);
            	return $connection;
            }
            catch (PDOException $e) {
				echo $e->getMessage();
			}
        }
        
        protected function queryList($sql, $args){
            $connection = $this->getConnection();
            $stmt = $connection->prepare($sql);
            $stmt->execute($args) or die(print_r($stmt->errorInfo(), true));
            return $stmt;            
        }
    }
?>