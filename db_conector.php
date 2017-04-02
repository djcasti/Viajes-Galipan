<?php
	abstract class DBConnector{
        const USERNAME="root";
        const PASSWORD="";
        const HOST="localhost";
        const DB="galipandb";

        protected $connection = null;

        private function getConnection(){
            $username = self::USERNAME;
            $password = self::PASSWORD;
            $host = self::HOST;
            $db = self::DB;

            try {
            	$this->connection = new PDO("mysql:dbname=$db;host=$host;charset=utf8", $username, $password);
            }
            catch (PDOException $e) {
				echo $e->getMessage();
			}
        }
        
        protected function queryList($sql, $args){
            $this->getConnection();
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($args);
            return $stmt;            
        }
    }
?>