-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema galipandb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema galipandb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `galipandb` DEFAULT CHARACTER SET utf8 ;
USE `galipandb` ;

-- -----------------------------------------------------
-- Table `galipandb`.`pais`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galipandb`.`pais` (
  `id_pais` INT NOT NULL AUTO_INCREMENT,
  `codigo` INT NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id_pais`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `galipandb`.`ciudad`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galipandb`.`ciudad` (
  `id_ciudad` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `pais_id_pais` INT NOT NULL,
  PRIMARY KEY (`id_ciudad`),
  INDEX `fk_ciudad_pais_idx` (`pais_id_pais` ASC),
  CONSTRAINT `fk_ciudad_pais`
    FOREIGN KEY (`pais_id_pais`)
    REFERENCES `galipandb`.`pais` (`id_pais`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `galipandb`.`remitente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galipandb`.`remitente` (
  `id_remitente` INT NOT NULL AUTO_INCREMENT,
  `nombres` VARCHAR(45) NOT NULL,
  `apellidos` VARCHAR(45) NOT NULL,
  `nro_identificacion` VARCHAR(45) NOT NULL,
  `telefono` VARCHAR(15) NOT NULL,
  `direccion` VARCHAR(100) NOT NULL,
  `ciudad_id_ciudad` INT NOT NULL,
  PRIMARY KEY (`id_remitente`),
  INDEX `fk_remitente_ciudad1_idx` (`ciudad_id_ciudad` ASC),
  CONSTRAINT `fk_remitente_ciudad1`
    FOREIGN KEY (`ciudad_id_ciudad`)
    REFERENCES `galipandb`.`ciudad` (`id_ciudad`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `galipandb`.`banco`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galipandb`.`banco` (
  `id_banco` INT NOT NULL AUTO_INCREMENT,
  `codigo_bic` VARCHAR(11) NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `pais_id_pais` INT NOT NULL,
  PRIMARY KEY (`id_banco`),
  INDEX `fk_banco_pais1_idx` (`pais_id_pais` ASC),
  CONSTRAINT `fk_banco_pais1`
    FOREIGN KEY (`pais_id_pais`)
    REFERENCES `galipandb`.`pais` (`id_pais`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `galipandb`.`destinatario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galipandb`.`destinatario` (
  `id_destinatario` INT NOT NULL AUTO_INCREMENT,
  `nombres` VARCHAR(45) NOT NULL,
  `apellidos` VARCHAR(45) NOT NULL,
  `nro_identificacion` VARCHAR(45) NOT NULL,
  `telefono` VARCHAR(15) NOT NULL,
  `nro_cuenta` VARCHAR(34) NOT NULL,
  `direccion` VARCHAR(100) NOT NULL,
  `ciudad_id_ciudad` INT NOT NULL,
  `banco_id_banco` INT NOT NULL,
  PRIMARY KEY (`id_destinatario`),
  INDEX `fk_destinatario_ciudad1_idx` (`ciudad_id_ciudad` ASC),
  INDEX `fk_destinatario_banco1_idx` (`banco_id_banco` ASC),
  CONSTRAINT `fk_destinatario_ciudad1`
    FOREIGN KEY (`ciudad_id_ciudad`)
    REFERENCES `galipandb`.`ciudad` (`id_ciudad`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_destinatario_banco1`
    FOREIGN KEY (`banco_id_banco`)
    REFERENCES `galipandb`.`banco` (`id_banco`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `galipandb`.`moneda`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galipandb`.`moneda` (
  `id_moneda` INT NOT NULL AUTO_INCREMENT,
  `codigo` CHAR(3) NOT NULL,
  `nombre` VARCHAR(45) NOT NULL,
  `pais_id_pais` INT NOT NULL,
  PRIMARY KEY (`id_moneda`),
  INDEX `fk_moneda_pais1_idx` (`pais_id_pais` ASC),
  CONSTRAINT `fk_moneda_pais1`
    FOREIGN KEY (`pais_id_pais`)
    REFERENCES `galipandb`.`pais` (`id_pais`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `galipandb`.`tasa_cambio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galipandb`.`tasa_cambio` (
  `id_tasa` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME NOT NULL,
  `monto` DECIMAL(15,2) NOT NULL,
  `moneda_id_moneda` INT NOT NULL,
  PRIMARY KEY (`id_tasa`),
  INDEX `fk_tasa_cambio_moneda1_idx` (`moneda_id_moneda` ASC),
  CONSTRAINT `fk_tasa_cambio_moneda1`
    FOREIGN KEY (`moneda_id_moneda`)
    REFERENCES `galipandb`.`moneda` (`id_moneda`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `galipandb`.`transaccion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `galipandb`.`transaccion` (
  `id_transaccion` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME NOT NULL,
  `monto_origen` DECIMAL(15,2) NOT NULL,
  `monto_destino` DECIMAL(15,2) NOT NULL,
  `concepto` VARCHAR(100) NOT NULL,
  `observaciones` VARCHAR(200) NULL,
  `destinatario_id_destinatario` INT NOT NULL,
  `remitente_id_remitente` INT NOT NULL,
  `tasa_cambio_id_tasa` INT NOT NULL,
  PRIMARY KEY (`id_transaccion`),
  INDEX `fk_transaccion_destinatario1_idx` (`destinatario_id_destinatario` ASC),
  INDEX `fk_transaccion_remitente1_idx` (`remitente_id_remitente` ASC),
  INDEX `fk_transaccion_tasa_cambio1_idx` (`tasa_cambio_id_tasa` ASC),
  CONSTRAINT `fk_transaccion_destinatario1`
    FOREIGN KEY (`destinatario_id_destinatario`)
    REFERENCES `galipandb`.`destinatario` (`id_destinatario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_transaccion_remitente1`
    FOREIGN KEY (`remitente_id_remitente`)
    REFERENCES `galipandb`.`remitente` (`id_remitente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_transaccion_tasa_cambio1`
    FOREIGN KEY (`tasa_cambio_id_tasa`)
    REFERENCES `galipandb`.`tasa_cambio` (`id_tasa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
