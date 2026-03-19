CREATE DATABASE  IF NOT EXISTS `ipos_myk` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ipos_myk`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ipos_myk
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ax_access_right`
--

DROP TABLE IF EXISTS `ax_access_right`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ax_access_right` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `Action` varchar(100) NOT NULL,
  `IsDefault` tinyint NOT NULL,
  `Category` varchar(255) NOT NULL,
  `DateCreated` datetime NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  `UpdatedBy` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`)
) ENGINE=InnoDB AUTO_INCREMENT=377 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ax_access_right`
--

LOCK TABLES `ax_access_right` WRITE;
/*!40000 ALTER TABLE `ax_access_right` DISABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ax_billing`
--

DROP TABLE IF EXISTS `ax_billing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ax_billing` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `TxDate` datetime NOT NULL,
  `RecNumber` varchar(45) NOT NULL,
  `TenantId` int NOT NULL,
  `Status` varchar(45) NOT NULL,
  `Document` longblob,
  `PaidAmount` decimal(18,2) DEFAULT NULL,
  `IsInvoice` tinyint NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Company_Billing_idx` (`TenantId`),
  KEY `User1_Billing_idx` (`CreatedBy`),
  KEY `User2_Billing_idx` (`UpdatedBy`),
  CONSTRAINT `Tenant_Billing` FOREIGN KEY (`TenantId`) REFERENCES `ax_tenant` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User1_Billing` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_Billing` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ax_billing`
--

LOCK TABLES `ax_billing` WRITE;
/*!40000 ALTER TABLE `ax_billing` DISABLE KEYS */;
INSERT INTO `ax_billing` VALUES (141,'019a2384-53e4-76e3-8064-24faf0cdfe18','2025-10-26 00:00:00','00000001',1,'Pending',NULL,NULL,1,1,'2025-10-27 10:34:27',NULL,NULL);
/*!40000 ALTER TABLE `ax_billing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ax_billing_collection`
--

DROP TABLE IF EXISTS `ax_billing_collection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ax_billing_collection` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `TxDate` datetime NOT NULL,
  `RecNumber` varchar(45) NOT NULL,
  `TransactionId` varchar(255) DEFAULT NULL,
  `Currency` varchar(45) NOT NULL,
  `UserId` int NOT NULL,
  `BillingId` int NOT NULL,
  `PaymentMethod` varchar(45) NOT NULL,
  `Amount` decimal(18,2) NOT NULL,
  `Status` enum('Success','Pending','Failed') NOT NULL,
  `DateCreated` datetime NOT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `User_BillingCollection_idx` (`UserId`),
  KEY `Billing_BillingCollection_idx` (`BillingId`),
  CONSTRAINT `Billing_BillingCollection` FOREIGN KEY (`BillingId`) REFERENCES `ax_billing` (`Id`),
  CONSTRAINT `User_BillingCollection` FOREIGN KEY (`UserId`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ax_billing_collection`
--

LOCK TABLES `ax_billing_collection` WRITE;
/*!40000 ALTER TABLE `ax_billing_collection` DISABLE KEYS */;
/*!40000 ALTER TABLE `ax_billing_collection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ax_billing_discount`
--

DROP TABLE IF EXISTS `ax_billing_discount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ax_billing_discount` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `BillingId` int NOT NULL,
  `Name` varchar(255) NOT NULL,
  `DiscountType` enum('Percent','Amount') NOT NULL,
  `DiscountAmount` decimal(18,2) DEFAULT NULL,
  `DiscountRate` decimal(18,2) DEFAULT NULL,
  `IsVATExempt` tinyint NOT NULL,
  `IsGovermentMandated` tinyint NOT NULL,
  `Customer` json DEFAULT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `User12_idx` (`UpdatedBy`),
  KEY `User11_idx` (`CreatedBy`),
  KEY `BIlling_BIllingDiscount_idx` (`BillingId`),
  CONSTRAINT `BIlling_BIllingDiscount` FOREIGN KEY (`BillingId`) REFERENCES `ax_billing` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User1_AdminDiscount` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_AdminDiscount` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ax_billing_discount`
--

LOCK TABLES `ax_billing_discount` WRITE;
/*!40000 ALTER TABLE `ax_billing_discount` DISABLE KEYS */;
/*!40000 ALTER TABLE `ax_billing_discount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ax_billing_product`
--

DROP TABLE IF EXISTS `ax_billing_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ax_billing_product` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `BillingId` int NOT NULL,
  `ProductId` int NOT NULL,
  `Quantity` decimal(18,2) NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Billing_BillingProduct_idx` (`BillingId`),
  KEY `User1_BillingProduct_idx` (`CreatedBy`),
  KEY `User2_BillingProduct_idx` (`UpdatedBy`),
  CONSTRAINT `Billing_BillingProduct` FOREIGN KEY (`BillingId`) REFERENCES `ax_billing` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User1_BillingProduct` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_BillingProduct` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ax_billing_product`
--

LOCK TABLES `ax_billing_product` WRITE;
/*!40000 ALTER TABLE `ax_billing_product` DISABLE KEYS */;
INSERT INTO `ax_billing_product` VALUES (141,'019a2384-2d98-7448-a995-8f594089a9f7',141,3,2.00,1,'2025-10-27 10:10:10',NULL,NULL);
/*!40000 ALTER TABLE `ax_billing_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ax_feedback`
--

DROP TABLE IF EXISTS `ax_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ax_feedback` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `Details` text NOT NULL,
  `Area` varchar(255) NOT NULL,
  `Image` text,
  `DateCreated` datetime NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  `UpdatedBy` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ax_feedback`
--

LOCK TABLES `ax_feedback` WRITE;
/*!40000 ALTER TABLE `ax_feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `ax_feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ax_period`
--

DROP TABLE IF EXISTS `ax_period`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ax_period` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `RecNumber` varchar(50) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `IsDefault` tinyint NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `User2_Period_idx` (`UpdatedBy`),
  KEY `User1_Period` (`CreatedBy`),
  CONSTRAINT `User1_Period` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_Period` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ax_period`
--

LOCK TABLES `ax_period` WRITE;
/*!40000 ALTER TABLE `ax_period` DISABLE KEYS */;
INSERT INTO `ax_period` VALUES (1,'0198c0f2-a185-7279-8085-21c936eaa4b7','00000001','01','Initial Period 001',1,1,'2025-01-08 00:00:00',1,'2025-09-05 05:27:17'),(2,'0198c0f2-a18e-72fb-8d7a-1ce2e5a08182','00000002','02','Second Period 002',1,1,'2025-01-08 00:00:00',1,'2025-09-05 05:29:52'),(3,'0198c0f2-a191-7209-878a-c1ab93b17ac6','00000003','03','Third Period 003',1,1,'2025-01-08 00:00:00',1,'2025-09-05 05:31:56'),(4,'0198c0f2-a194-7089-b38b-34fdb13f21ab','00000004','04','Fourth Period 004',1,1,'2025-01-08 00:00:00',1,'2025-09-05 05:31:59'),(5,'0198c0f2-a197-76c9-b98d-71c3394b4315','00000005','05','Fifth Period 005',1,1,'2025-01-08 00:00:00',1,'2025-09-05 05:32:02'),(6,'0198c0f2-a19a-761d-9e0a-ff3af25ce5bd','00000006','06','Sixth Period 006',1,1,'2025-01-08 00:00:00',1,'2025-09-05 05:32:05'),(8,'0198c0f2-a19d-774e-96d1-cf75bda96ab5','00000008','08','Eight Period 008',1,1,'2025-01-08 00:00:00',1,'2025-09-05 05:32:08'),(9,'0198c0f2-a19f-74a3-a2c9-fcae66477588','00000009','09','Ninth Period 009',1,1,'2025-01-08 00:00:00',1,'2025-09-05 05:32:11'),(10,'0198c0f2-a1a1-77db-b156-18ac73011c26','00000010','10','Tenth Period 010',1,1,'2025-01-08 00:00:00',1,'2025-09-05 05:32:14');
/*!40000 ALTER TABLE `ax_period` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ax_product`
--

DROP TABLE IF EXISTS `ax_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ax_product` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `RecNumber` varchar(45) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Category` varchar(255) NOT NULL,
  `Price` decimal(18,2) NOT NULL,
  `IsDefault` tinyint NOT NULL,
  `DateCreated` datetime NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  `UpdatedBy` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ax_product`
--

LOCK TABLES `ax_product` WRITE;
/*!40000 ALTER TABLE `ax_product` DISABLE KEYS */;
INSERT INTO `ax_product` VALUES (1,'0199163a-815b-7603-9b60-ec43d6e10f7c','00000001','POS Retail','Software',1999.00,1,'2025-09-05 03:36:10',1,'2025-09-05 03:44:52',1),(2,'01991642-6ceb-7309-85ed-88abce6043b5','00000002','POS Touch','Software',1999.00,1,'2025-09-05 03:44:48',1,'2025-09-05 15:41:09',1),(3,'01991642-af2c-76a6-9c35-eef81e05c887','00000003','POS Hotel','Software',1999.00,1,'2025-09-05 03:45:05',1,'2025-09-05 15:41:12',1),(4,'01991642-e3ca-773c-88ae-890167de35e2','00000004','Branch-Free','Add-ons',0.00,1,'2025-09-05 03:47:23',1,'2025-09-05 15:39:24',1),(5,'01991645-0143-73df-acf1-535966573bac','00000005','Terminal-Free','Add-ons',0.00,1,'2025-09-05 03:47:30',1,'2025-09-05 15:39:21',1),(6,'01991661-0e76-7248-9976-3a624207b6cf','00000006','Terminal','Add-ons',500.00,0,'2025-09-05 04:18:09',1,'2025-09-05 15:41:20',1),(7,'019918c8-5f7d-737d-8dd2-87ab1f291d50','00000007','Branch','Add-ons',3000.00,0,'2025-09-05 15:30:21',1,NULL,NULL),(8,'019918d0-6bf7-77ae-a685-6e01ff49ca73','00000008','Training - Free (16hrs/2days)','Session',0.00,1,'2025-09-05 15:39:12',1,'2025-09-05 15:39:16',1),(9,'019918d2-054c-7069-9938-e94ead2e1080','00000009','Training - (8hrs/1day)','Session',3000.00,0,'2025-09-05 15:41:04',1,NULL,NULL),(10,'0199422f-2b9f-76fc-83b0-41395379417a','00000010','Reconnection Fee','Additional Fee',500.00,1,'2025-09-13 16:27:25',1,NULL,NULL),(14,'0199ae2e-b79b-716c-940a-652d2b229ae5','00000011','Voucher','Discount',-100.00,0,'2025-10-04 15:45:39',1,NULL,NULL);
/*!40000 ALTER TABLE `ax_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ax_request`
--

DROP TABLE IF EXISTS `ax_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ax_request` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `Type` varchar(45) NOT NULL DEFAULT '// demo, training',
  `Session` int DEFAULT NULL,
  `ContactPerson` varchar(255) NOT NULL,
  `ContactNumber` varchar(45) NOT NULL,
  `Details` text NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ax_request`
--

LOCK TABLES `ax_request` WRITE;
/*!40000 ALTER TABLE `ax_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `ax_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ax_software_update`
--

DROP TABLE IF EXISTS `ax_software_update`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ax_software_update` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `Version` varchar(255) NOT NULL,
  `Details` text NOT NULL,
  `PublishDate` datetime NOT NULL,
  `Author` varchar(255) NOT NULL,
  `DateCreated` datetime NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  `UpdatedBy` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ax_software_update`
--

LOCK TABLES `ax_software_update` WRITE;
/*!40000 ALTER TABLE `ax_software_update` DISABLE KEYS */;
/*!40000 ALTER TABLE `ax_software_update` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ax_subscription`
--

DROP TABLE IF EXISTS `ax_subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ax_subscription` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `RecNumber` varchar(45) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Description` text,
  `Duration` int NOT NULL,
  `IsDefault` tinyint NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`)
) ENGINE=InnoDB AUTO_INCREMENT=160 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ax_subscription`
--

LOCK TABLES `ax_subscription` WRITE;
/*!40000 ALTER TABLE `ax_subscription` DISABLE KEYS */;
INSERT INTO `ax_subscription` VALUES (125,'0199176f-97d7-745b-ab8b-70fbfdc95f44','00000001','Basic Plan - Retail','Basic Plan\nPOS Retail\nMono branch\nShared server environment\nStandard Support',30,1,1,'2025-09-05 09:14:20',1,'2025-09-05 15:45:59'),(126,'01991860-23c0-7389-b57c-994ccc544de8','00000002','Basic Plan - Touch','Basic Plan\n POS Touch\nMono branch\nShared server environment\nStandard Support',30,1,1,'2025-09-05 13:36:36',1,'2025-09-05 16:03:54'),(128,'019918ef-37a8-7184-9a5e-f81822fbdb7a','00000003','Basic Plan - Hotel','Basic Plan\nPOS Retail\nMono branch\nShared server environment\nStandard Support',30,1,1,'2025-09-05 16:12:46',1,'2025-09-06 10:32:41'),(137,'01991cdc-75fd-7053-9fdc-5e97e20b6589','00000004','Pro Plan - Retail','Pro Plan\nPOS Retail\nMulti branch\nShared server environment\nStandard Support',30,1,1,'2025-09-06 10:31:04',1,'2025-09-06 10:32:26'),(138,'01991cde-7013-76e0-918b-9b5173bccf27','00000005','Pro Plan - Touch','Pro Plan\nPOS Touch\nMulti branch\nShared server environment\nStandard Support',30,1,1,'2025-09-06 10:33:04',1,'2025-09-06 10:50:55'),(139,'01991cf0-47ff-7488-b751-88249370d648','00000006','Pro Plan - Hotel','Pro Plan\nPOS Touch\nMulti branch\nShared server environment\nStandard Support',30,1,1,'2025-09-06 10:52:24',NULL,NULL),(140,'01991cf9-f534-734d-a100-f22dfce409c0','00000007','Enterprise Plan - Retail','Enterprise Plan\nPOS Retail\nMulti branch\nDedicated Virtual Private Server (VPS)\nPremium Support',30,1,1,'2025-09-06 11:17:55',1,'2025-09-06 11:24:54'),(141,'01991d0a-63e1-76ec-8fe7-4675ca91e886','00000008','Enterprise Plan - Touch','Enterprise Plan\nPOS Touch\nMulti branch\nDedicated Virtual Private Server (VPS)\nPremium Support',30,1,1,'2025-09-06 11:21:00',1,'2025-10-21 13:49:13'),(142,'01991d0c-c043-737d-8c3f-51f2647ed1a3','00000009','Enterprise Plan - Hotel','Enterprise Plan\nPOS Hotel\nMulti branch\nDedicated Virtual Private Server (VPS)\nPremium Support',30,0,1,'2025-09-06 11:23:42',1,'2025-09-30 14:48:17');
/*!40000 ALTER TABLE `ax_subscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ax_subscription_product`
--

DROP TABLE IF EXISTS `ax_subscription_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ax_subscription_product` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `SubscriptionId` int NOT NULL,
  `ProductId` int NOT NULL,
  `Quantity` int NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Subscription_SubscriptionProduct_idx` (`SubscriptionId`),
  KEY `Product_SubscriptionProduct_idx` (`ProductId`),
  CONSTRAINT `Product_SubscriptionProduct` FOREIGN KEY (`ProductId`) REFERENCES `ax_product` (`Id`),
  CONSTRAINT `Subscription_SubscriptionProduct` FOREIGN KEY (`SubscriptionId`) REFERENCES `ax_subscription` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ax_subscription_product`
--

LOCK TABLES `ax_subscription_product` WRITE;
/*!40000 ALTER TABLE `ax_subscription_product` DISABLE KEYS */;
INSERT INTO `ax_subscription_product` VALUES (1,'019917e3-fa97-73cb-a98b-10f3e65bc50d',125,1,1,1,'2025-09-05 11:20:45',1,'2025-09-05 15:23:02'),(4,'019918c1-e662-720c-b649-7278c1f4f436',125,4,1,1,'2025-09-05 15:23:23',NULL,NULL),(5,'019918c2-3f2f-7623-bdbb-15cc1e62cbf4',125,5,5,1,'2025-09-05 15:23:41',1,'2025-09-05 15:27:19'),(6,'019918cc-661d-73f2-9637-3a93aea078f8',126,2,1,1,'2025-09-05 15:34:41',NULL,NULL),(7,'019918cc-90cc-763e-9299-931b4727f801',126,4,1,1,'2025-09-05 15:34:53',NULL,NULL),(8,'019918cc-ba19-7042-990e-95a790e48b2f',126,5,1,1,'2025-09-05 15:35:00',NULL,NULL),(9,'019918d3-76a9-7509-9bdc-ee770332847e',125,8,1,1,'2025-09-05 15:42:21',NULL,NULL),(10,'019918ef-8fd5-724d-81c0-b9587ee3154b',128,3,1,1,'2025-09-05 16:13:02',NULL,NULL),(11,'019918ef-aaf6-7025-bcea-39762944ccf0',128,5,5,1,'2025-09-05 16:13:09',1,'2025-09-05 16:13:15'),(12,'019918ef-d8ca-71e4-b82c-bb19bc4c9c95',128,4,1,1,'2025-09-05 16:13:22',NULL,NULL),(13,'019918ef-fab0-717b-9194-751d04f7a6a7',128,8,1,1,'2025-09-05 16:13:28',NULL,NULL),(33,'01991cdc-f376-7217-a1c3-138019c4ea0c',137,1,1,1,'2025-09-06 10:31:10',NULL,NULL),(34,'01991cdd-0554-715d-9a73-e91375415dc8',137,4,2,1,'2025-09-06 10:31:15',1,'2025-09-06 10:51:09'),(35,'01991cdd-1b5b-710d-b98d-15ed5c523b5d',137,5,15,1,'2025-09-06 10:31:24',NULL,NULL),(36,'01991cdd-e8a8-758e-a82f-087a35f70410',137,8,1,1,'2025-09-06 10:32:17',NULL,NULL),(37,'01991cde-c642-718b-aa43-038c50a0d6f0',138,2,1,1,'2025-09-06 10:33:09',NULL,NULL),(39,'01991cde-eef8-757e-b4c1-6f28b380e827',138,5,15,1,'2025-09-06 10:33:26',NULL,NULL),(40,'01991cdf-826a-724b-b436-7f5e93e072a4',138,8,1,1,'2025-09-06 10:33:59',NULL,NULL),(41,'01991ce0-9d87-7764-a5df-053713ff03a3',138,7,1,1,'2025-09-06 10:35:11',1,'2025-09-06 10:35:37'),(42,'01991ce1-56ed-728e-9801-fac06ee87012',138,4,2,1,'2025-09-06 10:35:58',NULL,NULL),(43,'01991ce1-7595-719b-beb8-4a7bb47ef704',138,6,2,1,'2025-09-06 10:36:16',NULL,NULL),(44,'01991cef-535e-7459-8a96-d7b5ee22a3bf',137,7,1,1,'2025-09-06 10:51:16',NULL,NULL),(45,'01991cef-724c-7203-b61e-bc0f79dda932',137,6,2,1,'2025-09-06 10:51:24',NULL,NULL),(46,'01991cf0-7b05-755d-8723-dc2dd9dcb79e',139,3,1,1,'2025-09-06 10:52:31',NULL,NULL),(47,'01991cf0-9305-75a6-97bf-d0434da147b0',139,4,2,1,'2025-09-06 10:52:37',NULL,NULL),(48,'01991cf0-a9d6-73ab-9f87-dc596f9f71f9',139,7,1,1,'2025-09-06 10:52:43',NULL,NULL),(49,'01991cf0-be4f-77fe-a2ce-10b9dcf28647',139,6,2,1,'2025-09-06 10:52:50',NULL,NULL),(50,'01991d07-d69e-7779-890a-d2cfcbe4e879',140,1,1,1,'2025-09-06 11:18:01',NULL,NULL),(51,'01991d07-eb87-75c6-b3ca-f0f7a84c94d0',140,4,3,1,'2025-09-06 11:18:11',NULL,NULL),(52,'01991d08-1012-75b8-91c5-b792bf0cfde4',140,7,2,1,'2025-09-06 11:18:18',NULL,NULL),(53,'01991d08-34fa-7468-93de-9c073efb36da',140,6,2,1,'2025-09-06 11:18:29',NULL,NULL),(54,'01991d08-54b9-75cb-ada7-0ad2861c6763',140,8,1,1,'2025-09-06 11:18:36',NULL,NULL),(55,'01991d0a-a663-74e8-9280-903d3942f28a',141,2,1,1,'2025-09-06 11:21:24',NULL,NULL),(56,'01991d0b-0280-734b-8d63-8afb30ae7c61',141,4,3,1,'2025-09-06 11:21:39',NULL,NULL),(57,'01991d0b-433e-7305-93ce-41726c567b1c',141,7,2,1,'2025-09-06 11:21:48',NULL,NULL),(58,'01991d0b-9ad6-77fb-acf5-24c4e036f627',141,6,2,1,'2025-09-06 11:22:08',NULL,NULL),(59,'01991d0b-ae35-7608-b0f6-25d108d33f3c',141,5,25,1,'2025-09-06 11:22:30',NULL,NULL),(60,'01991d0c-361f-7442-b282-7f8e4277d6e8',140,5,25,1,'2025-09-06 11:22:48',NULL,NULL),(61,'01991d0d-27c8-7759-8ad1-2890c8e956c2',142,9,1,1,'2025-09-06 11:23:50',1,'2025-09-26 10:38:57'),(62,'01991d0d-41cd-72de-b0f7-7cb092d31ec3',142,4,3,1,'2025-09-06 11:24:00',NULL,NULL),(63,'01991d0d-611e-715f-9e04-9b75d66cd79d',142,7,2,1,'2025-09-06 11:24:08',NULL,NULL),(64,'01991d0d-881e-7215-828b-811ecc554216',142,5,25,1,'2025-09-06 11:24:16',NULL,NULL),(65,'01991d0d-a080-71ae-a6f8-be324eac17dd',142,6,2,1,'2025-09-06 11:24:20',NULL,NULL),(66,'01991d0d-aeee-76dc-ae7c-fb69e176cecc',142,8,1,1,'2025-09-06 11:24:24',NULL,NULL),(67,'01991d0d-d35e-744a-a4be-6448eabf3a20',141,8,1,1,'2025-09-06 11:24:32',NULL,NULL),(68,'019983e2-b7e4-75d9-b7bf-9bc84bbfa769',142,1,2,1,'2025-09-26 10:38:23',NULL,NULL),(69,'019983e3-7f70-732c-b027-193b02766645',142,3,7,1,'2025-09-26 10:39:14',NULL,NULL),(74,'0199939a-a4b0-72e8-8d1b-e481397457d8',142,2,3,1,'2025-09-29 11:53:33',NULL,NULL);
/*!40000 ALTER TABLE `ax_subscription_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ax_tenant`
--

DROP TABLE IF EXISTS `ax_tenant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ax_tenant` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(255) NOT NULL,
  `RecNumber` varchar(45) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `OperatedBy` varchar(255) NOT NULL,
  `ContactNumber` varchar(100) NOT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `TIN` varchar(100) NOT NULL,
  `CreditLimit` decimal(18,2) NOT NULL,
  `IsDefault` tinyint DEFAULT NULL,
  `IsActive` tinyint NOT NULL,
  `IsTerminated` tinyint NOT NULL,
  `TerminatedBy` int DEFAULT NULL,
  `DateTerminated` datetime DEFAULT NULL,
  `TerminationRemarks` varchar(255) DEFAULT NULL,
  `Image` text,
  `CreatedBy` int DEFAULT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `User_Company_idx` (`CreatedBy`),
  KEY `User2_Company_idx` (`UpdatedBy`),
  CONSTRAINT `User1_Company` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_Company` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ax_tenant`
--

LOCK TABLES `ax_tenant` WRITE;
/*!40000 ALTER TABLE `ax_tenant` DISABLE KEYS */;
INSERT INTO `ax_tenant` VALUES (1,'01978c42-bf6c-71bd-a917-cc22ab3dc89f','00000001','Cebu Innosoft Solution Servicecs Inc.','Nutech JIY Tower, Katipunan St., Cebu City, 6000','Mark Dinglasa','+639278645960','innosoft.inquiry@gmail.com','744085819005',3000.00,1,1,0,0,NULL,NULL,'https://res.cloudinary.com/dxu0qijb9/image/upload/v1761541347/images/4f5758a94062326793069f408db0ef961761541339314.png',1,'2025-01-01 00:00:00',1,'2025-10-27 10:22:49');
/*!40000 ALTER TABLE `ax_tenant` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `company_AFTER_INSERT` AFTER INSERT ON `ax_tenant` FOR EACH ROW BEGIN
	
    -- insert default branch
	/*INSERT INTO `msx_branch` (`CompanyId`, `Uid`, `RecNumber`, `Name`, `Description`, `IsDefault`, `CreatedBy`, `DateCreated`) VALUES 
	(NEW.Id, CONCAT('temp-1',NEW.Id),'00000001', 'Main','Main Branch',true, NEW.CreatedBy, NEW.DateCreated);
	
    -- default chart of accounts
    INSERT INTO `msx_account` (`CompanyId`, `Uid`, `RecNumber`, `Name`, `AccountType`, `AccountCode`, `IsDefault`, `CreatedBy`, `DateCreated`) VALUES 
    (NEW.Id, CONCAT('temp-1',NEW.Id), '00000001', 'Cash on hand', 'Asset', '1100', true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-2',NEW.Id), '00000002', 'Accounts Receivable - Sales', 'Asset', '1200',true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-3',NEW.Id), '00000003', 'Inventory', 'Asset', '1400', NEW.CreatedBy, true, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-4',NEW.Id), '00000004', 'VAT payable - output', 'Liability', '2200',true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-5',NEW.Id), '00000005', 'VAT payable - input', 'Liability', '2300', true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-6',NEW.Id), '00000006', 'Sales', 'Sales', '4100', true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-7',NEW.Id), '00000007', 'Cost of Sales', 'Expenses', '5100',true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-8',NEW.Id), '00000008', 'Local tax payable', 'Liability', '2400',true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-9',NEW.Id), '00000009', 'Accounts payable', 'Liability', '2100',true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-10',NEW.Id), '00000010', 'Accounts receivable - others', 'Asset', '1300',true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-11',NEW.Id), '00000011', 'Returns', 'Expenses', '5101',true, NEW.CreatedBy, NEW.DateCreated);
	
	-- insert default tax
INSERT INTO `msx_tax`(`CompanyId`, `Uid`, `RecNumber`, `Name`, `Description`, `TaxCode`, `Rate`, `AccountId`, `IsDefault`, `CreatedBy`, `DateCreated`) VALUES 
    (NEW.Id, CONCAT('temp-1',NEW.Id), '00000001', 'VAT', 'Value Added Tax', 'Inclusive',12, 4, true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-2',NEW.Id), '00000002', 'Non-VAT', 'Non-VATable', 'Inclusive',0, 4, true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-3',NEW.Id), '00000003', 'LOCAL', 'Value Added Tax', 'Exclusive',5, 4, true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-4',NEW.Id), '00000004', 'VAT-Exclusive', 'Value Added Tax - Exclusive', 'Exclusive',0, 4, true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-5',NEW.Id), '00000005', 'VAT-Exempt', 'Value Added Tax - Exempted', 'Inclusive',0, 4, true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-6',NEW.Id), '00000006', 'Zero Rated', 'Zero Rated Tax', 'Inclusive',0, 4, true, NEW.CreatedBy, NEW.DateCreated);
    
    -- insert default unit
    INSERT INTO `msx_unit`(`CompanyId`,`Uid`,`RecNumber`,`Name`, `Description`,`IsDefault`,`CreatedBy`, `DateCreated`) VALUES 
    (NEW.Id, CONCAT('temp-1',NEW.Id), '00000001', 'Pc(s)', 'Pc(s)', true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-2',NEW.Id), '00000002', 'Box(s)', 'Box(s)', true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-3',NEW.Id), '00000003', 'Pack(s)', 'Pack(s)', true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-4',NEW.Id), '00000004', 'Can(s)', 'Can(s)', true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-5',NEW.Id), '00000005', 'Gallon(s)', 'Gallon(s)', true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-6',NEW.Id), '00000006', 'Gram(s)', 'Gram(s)', true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-7',NEW.Id), '00000007', 'Kg(s)', 'KIg(s)', true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-8',NEW.Id), '00000008', 'Liter(s)', 'Liter(s)', true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-9',NEW.Id), '00000009', 'Order(s)', 'Order(s)', true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-10',NEW.Id), '00000010', 'Roll(s)', 'Roll(s)', true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-11',NEW.Id), '00000011', 'Sachet(s)', 'Sachet(s)', true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-12',NEW.Id), '00000012', 'Serving(s)', 'Serving(s)', true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-13',NEW.Id), '00000013', 'Batch(s)', 'Batch(s)', true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-14',NEW.Id), '00000014', 'Bar(s)', 'Bar(s)', true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-15',NEW.Id), '00000015', 'Case(s)', 'Case(s)', true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-16',NEW.Id), '00000016', 'Container(s)', 'Container(s)', true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-17',NEW.Id), '00000017', 'Unit(s)', 'Unit(s)', true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-18',NEW.Id), '00000018', 'Bot(s)', 'Bot(s)', true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-19',NEW.Id), '00000019', 'Bundle(s)', 'Bundle(s)', true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-20',NEW.Id), '00000020', 'Cubic(s)', 'Cubic(s)', true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-21',NEW.Id), '00000021', 'Drum(s)', 'Drum(s)', true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-22',NEW.Id), '00000022', 'Ft(s)', 'Ft(s)', true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-23',NEW.Id), '00000023', 'Hundred(s)', 'Hundred(s)', true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-24',NEW.Id), '00000024', 'Inch(s)', 'Inch(s)', true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-25',NEW.Id), '00000025', 'Bag(s)', 'Bag(s)', true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-26',NEW.Id), '00000026', 'Meter(s)', 'Meter(s)', true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-27',NEW.Id), '00000027', 'Pad(s)', 'Pad(s)', true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-28',NEW.Id), '00000028', 'Pail(s)', 'Pail(s)', true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-29',NEW.Id), '00000029', 'Pair(s)', 'Pair(s)', true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-30',NEW.Id), '00000030', 'Peso(s)', 'Peso(s)', true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-31',NEW.Id), '00000031', 'Pint(s)', 'Pint(s)', true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-32',NEW.Id), '00000032', 'Quart(s)', 'Quart(s)', true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-33',NEW.Id), '00000033', 'Ream(s)', 'Ream(s)', true, NEW.CreatedBy, NEW.DateCreated),
   	(NEW.Id, CONCAT('temp-34',NEW.Id), '00000034', 'Sack(s)', 'Sack(s)', true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-35',NEW.Id), '00000035', 'Set(s)', 'Set(s)', true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-36',NEW.Id), '00000036', 'Sheet(s)', 'Sheet(s)', true, NEW.CreatedBy, NEW.DateCreated),
   	(NEW.Id, CONCAT('temp-37',NEW.Id), '00000037', 'Tank(s)', 'Tank(s)', true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-38',NEW.Id), '00000038', 'Cup(s)', 'Cup(s)', true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-39',NEW.Id), '00000039', 'Glass(s)', 'Glass(s)', true, NEW.CreatedBy, NEW.DateCreated),
   	(NEW.Id, CONCAT('temp-40',NEW.Id), '00000040', 'Trip(s)', 'Trip(s)', true, NEW.CreatedBy, NEW.DateCreated);
   
    -- insert default discount
    INSERT INTO `msx_discount` (`CompanyId`,`Uid`, `RecNumber`, `Name`, `DiscountRate`, `IsVATExempt`, `IsGovernmentMandated`, `IsDateScheduled`, `DateStart`, `DateEnd`, `IsDayScheduled`, `IsMonday`, `IsTuesday`, `IsWednesday`, `IsThursday`, `IsFriday`, `IsSaturday`, `IsSunday`, `IsDefault`, `CreatedBy`, `DateCreated`) VALUES 
    (NEW.Id, CONCAT('temp-1',NEW.Id), '00000001','Zero', 0,0,0,0,null,null,0,0,0,0,0,0,0,0,true, NEW.CreatedBy,NEW.DateCreated),
	(NEW.Id, CONCAT('temp-2',NEW.Id), '00000002','Variable', 0,0,0,0,null,null,0,0,0,0,0,0,0,0,true, NEW.CreatedBy,NEW.DateCreated),
	(NEW.Id, CONCAT('temp-3',NEW.Id), '00000003','Senior Citizen',1,1,20,0,null,null,0,0,0,0,0,0,0,0,true, NEW.CreatedBy,NEW.DateCreated),
    (NEW.Id, CONCAT('temp-4',NEW.Id), '00000004','PWD',1,1,2,0,null,null,0,0,0,0,0,0,0,0,true, NEW.CreatedBy,NEW.DateCreated);
    
    -- insert default supplier
    INSERT INTO `msx_supplier` (`CompanyId`, `Uid`, `RecNumber`, `Name`, `Address`, `ContactNumber`, `TermId`, `TIN`, `AccountId`, `IsDefault`, `CreatedBy`, `DateCreated`) VALUES 
    (NEW.Id, CONCAT('temp-1',NEW.Id), '00000001', 'Return from Customer', null, null, 6, null, 9, true, NEW.CreatedBy, NEW.DateCreated);
    
    -- insert default customer
    INSERT INTO `msx_customer` (`CompanyId`, `Uid`, `RecNumber`, `Name`, `Address`, `ContactPerson`, `ContactNumber`, `CreditLimit`, `TermId`, `TIN`, `WithReward`, `RewardConversion`, `RewardNumber`, `AccountId`, `DefaultPrice`, `IsDefault`, `CreatedBy`, `DateCreated`) VALUES 
    (NEW.Id, CONCAT('temp-1',NEW.Id), '00000001', 'Walk In', null, null, null, 0, 6, null, 0, 0, 0, 2,0,true,  NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-2',NEW.Id), '00000002', 'Delivery', null, null, null, 0, 6, null, 0, 0, 0, 2,0,true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-3',NEW.Id), '00000003', 'Hospitality', null, null, null, 0, 6, null, 0, 0, 0, 2,0,true, NEW.CreatedBy, NEW.DateCreated);
    
    -- insert defulat role 
    INSERT INTO `msx_role` (`CompanyId`, `Uid`, `RecNumber`, `Name`, `Description`,`IsDefault`, `CreatedBy`, `DateCreated`) VALUES 
    (NEW.Id, CONCAT('temp-1',NEW.Id), '00000001', 'Administrator', 'Administrator', true, NEW.CreatedBy, NEW.DateCreated),
    (NEW.Id, CONCAT('temp-2',NEW.Id), '00000002', 'Cashier', 'Cashier', true, NEW.CreatedBy, NEW.DateCreated),
	(NEW.Id, CONCAT('temp-3',NEW.Id), '00000003', 'Teller', 'Teller', true, NEW.CreatedBy, NEW.DateCreated);*/
    
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `ax_tenant_subscription`
--

DROP TABLE IF EXISTS `ax_tenant_subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ax_tenant_subscription` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `TenantId` int NOT NULL,
  `SubscriptionId` int NOT NULL,
  `IsActive` tinyint NOT NULL,
  `IsCancelled` tinyint NOT NULL,
  `DateStart` datetime NOT NULL,
  `DateEnd` datetime NOT NULL,
  `DateCreated` varchar(45) NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateUpdated` varchar(45) DEFAULT NULL,
  `UpdatedBy` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Tenant_TenantSubscription_idx` (`TenantId`),
  KEY `Subscription_TenantSubscription_idx` (`SubscriptionId`),
  CONSTRAINT `Subscription_TenantSubscription` FOREIGN KEY (`SubscriptionId`) REFERENCES `ax_subscription` (`Id`),
  CONSTRAINT `Tenant_TenantSubscription` FOREIGN KEY (`TenantId`) REFERENCES `ax_tenant` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ax_tenant_subscription`
--

LOCK TABLES `ax_tenant_subscription` WRITE;
/*!40000 ALTER TABLE `ax_tenant_subscription` DISABLE KEYS */;
INSERT INTO `ax_tenant_subscription` VALUES (4,'01992861-289c-738f-a95d-ca5da763a358',1,139,1,0,'2025-09-08 16:11:20','2025-10-08 16:11:20','2025-09-08 16:11:20',1,'2025-10-21 22:57:34',1);
/*!40000 ALTER TABLE `ax_tenant_subscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ax_term`
--

DROP TABLE IF EXISTS `ax_term`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ax_term` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `RecNumber` varchar(50) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `NoDays` int NOT NULL,
  `IsDefault` tinyint NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `User1_Term_idx` (`CreatedBy`),
  KEY `User2_Term_idx` (`UpdatedBy`),
  CONSTRAINT `User1_Term` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_Term` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ax_term`
--

LOCK TABLES `ax_term` WRITE;
/*!40000 ALTER TABLE `ax_term` DISABLE KEYS */;
INSERT INTO `ax_term` VALUES (1,'0198c0f3-4fc7-722e-a4f5-1743e409dd5d','00000001','15 Days',15,1,1,'2025-01-09 13:56:54',1,'2025-09-05 05:45:29'),(2,'0198c0f3-4fce-70d1-b626-716fd96a88c0','00000002','30 Days',30,1,1,'2025-01-09 13:57:04',1,'2025-09-05 05:46:20'),(3,'0198c0f3-4fd2-7748-ace0-19510bd963d9','00000003','60 Days',60,1,1,'2025-01-09 13:57:12',1,'2025-09-05 05:46:17'),(4,'0198c0f3-4fd4-77ff-9b76-e2f43ac2e49b','00000004','90 Days',90,1,1,'2025-01-09 13:57:21',1,'2025-09-05 05:46:22'),(5,'0198c0f3-4fd7-7315-b742-2309f79ae96c','00000005','120 Days',120,1,1,'2025-01-09 13:57:29',1,'2025-09-05 05:46:25'),(6,'0198c0f3-4fd9-71da-bb65-1d85391a3849','00000006','COD',0,1,1,'2025-01-09 13:57:41',1,'2025-09-05 05:46:57'),(8,'0198c0f3-4fdc-76a1-8f4f-3b51fa2db149','00000007','Not Applicable',0,1,1,'2025-06-20 00:56:46',1,'2025-09-05 05:47:15');
/*!40000 ALTER TABLE `ax_term` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `msx_account`
--

DROP TABLE IF EXISTS `msx_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msx_account` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(255) NOT NULL,
  `TenantId` int NOT NULL,
  `RecNumber` varchar(50) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `AccountType` varchar(100) NOT NULL,
  `AccountCode` varchar(50) NOT NULL,
  `IsDefault` tinyint NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Company_AccountFK_idx` (`TenantId`),
  KEY `User1_Account_idx` (`CreatedBy`),
  KEY `User2_Account_idx` (`UpdatedBy`),
  CONSTRAINT `Tenant_Account` FOREIGN KEY (`TenantId`) REFERENCES `ax_tenant` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User1_Account` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_Account` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=1179 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msx_account`
--

LOCK TABLES `msx_account` WRITE;
/*!40000 ALTER TABLE `msx_account` DISABLE KEYS */;
INSERT INTO `msx_account` VALUES (1,'0198c0f3-eac3-736a-a588-47eb8d0484b2',1,'00000001','Cash on hand','Asset','1100',0,1,'2024-12-23 11:11:09',1,'2025-01-11 10:00:44'),(2,'0198c0f3-eacb-749c-af0e-537315d75043',1,'00000002','Accounts Receivable - Sales','Asset','1200',0,1,'2024-12-24 10:41:49',1,'2025-01-09 11:29:35'),(3,'0198c0f3-eace-733c-ab29-343521c1a60b',1,'00000003','Inventory','Asset','1400',0,1,'2025-01-09 11:14:09',1,'2025-01-09 11:29:47'),(4,'0198c0f3-ead0-7508-84cd-f311f4cdb706',1,'00000004','VAT payable - output','Liability','2200',0,1,'2025-01-09 11:14:55',1,'2025-01-09 11:30:31'),(5,'0198c0f3-ead2-755f-9b5c-3f2517943e67',1,'00000005','VAT payable - input','Liability','2300',0,1,'2025-01-09 11:15:22',1,'2025-01-09 11:30:41'),(6,'0198c0f3-ead4-7655-b081-b79f97417202',1,'00000006','Sales','Sales','4100',0,1,'2025-01-09 11:15:55',1,'2025-01-09 11:30:55'),(7,'0198c0f3-ead7-72e4-b563-d22db7601d09',1,'00000007','Cost of Sales','Expenses','5100',0,1,'2025-01-09 11:16:16',1,'2025-01-09 11:31:14'),(8,'0198c0f3-ead9-75bb-96b2-e99811ee6a14',1,'00000008','Local tax payable','Liability','2400',0,1,'2025-01-09 11:16:31',1,'2025-01-09 11:32:10'),(9,'0198c0f3-eadc-762b-ae4d-9407c77008e4',1,'00000009','Accounts payable','Liability','2100',0,1,'2025-01-09 11:16:47',1,'2025-01-09 11:32:57'),(10,'0198c0f3-eadf-733f-87a9-642cdb391472',1,'00000010','Accounts receivable - others','Asset','1300',0,1,'2025-01-09 11:17:07',1,'2025-01-09 11:33:47'),(11,'0198c0f3-eae1-76a4-be8d-d0768c51dda3',1,'00000011','Returns','Expenses','5101',0,1,'2025-01-09 11:17:31',1,'2025-01-09 11:33:33'),(21,'0198c0f3-eae4-7082-a050-18503df7b99f',1,'00000012','Janes','Assets','223',0,1,'2025-06-22 23:35:36',1,'2025-06-22 23:35:54'),(22,'0198c0f3-eae5-7199-aa2f-69b11ec591b3',1,'00000013','tests','Assets','9905633',0,1,'2025-07-06 01:46:47',3,'2025-07-21 10:37:44');
/*!40000 ALTER TABLE `msx_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `msx_branch`
--

DROP TABLE IF EXISTS `msx_branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msx_branch` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(255) NOT NULL,
  `TenantId` int NOT NULL,
  `RecNumber` varchar(50) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `IsDefault` tinyint NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Company_BranchFK_idx` (`TenantId`),
  KEY `User_Account_idx` (`CreatedBy`),
  KEY `User2_Branch_idx` (`UpdatedBy`),
  CONSTRAINT `Tenant_Branch` FOREIGN KEY (`TenantId`) REFERENCES `ax_tenant` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User1_Branch` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_Branch` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=282 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msx_branch`
--

LOCK TABLES `msx_branch` WRITE;
/*!40000 ALTER TABLE `msx_branch` DISABLE KEYS */;
INSERT INTO `msx_branch` VALUES (1,'0198c0f4-4c81-74dc-80d8-659cb9e97fdd',1,'00000001','Main',NULL,'Main Branch',0,1,'2025-01-25 00:00:00',NULL,NULL),(2,'0198c0f4-4c9e-7628-a196-c4d3c5452cf6',1,'00000002','Emall',NULL,'Elizabeth Mall',0,1,'2025-01-25 15:59:40',1,'2025-06-23 09:21:47'),(243,'01978c42-bf6c-71bd-a917-cc22ab3dc89f',1,'00000001','Main',NULL,'Main Branch',1,1,'2025-10-01 16:21:13',NULL,NULL),(254,'68d4bd11-3740-8333-a9ed-7e59dc3e3b04',1,'00000001','Main',NULL,'Main Branch',1,1,'2025-10-01 16:27:31',NULL,NULL);
/*!40000 ALTER TABLE `msx_branch` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `branch_AFTER_INSERT` AFTER INSERT ON `msx_branch` FOR EACH ROW BEGIN
	
    -- insert default pay-type
	/*INSERT INTO `msx_pay_type`(`BranchId`, `Uid`, `RecNumber`, `Name`, `AccountId`,`SortNumber`, `IsDefault`, `CreatedBy`,`DateCreated`) VALUES 
    (NEW.Id, CONCAT('temp-dr-1',NEW.Uid), '00000001', 'Cash', 1, null,true, NEW.CreatedBy, NOW()),
    (NEW.Id, CONCAT('temp-dr-2',NEW.Uid), '00000002', 'Check', 1, null,true, NEW.CreatedBy, NOW()),
    (NEW.Id, CONCAT('temp-dr-3',NEW.Uid), '00000003', 'Credit Card', 1, null,true, NEW.CreatedBy, NOW()),
    (NEW.Id, CONCAT('temp-dr-4',NEW.Uid), '00000004', 'Gift Check', 1, null,true, NEW.CreatedBy, NOW()),
    (NEW.Id, CONCAT('temp-dr-5',NEW.Uid), '00000005', 'Exchange', 1, null,true, NEW.CreatedBy, NOW()),
    (NEW.Id, CONCAT('temp-dr-6',NEW.Uid), '00000006', 'Rewards', 1, null,true, NEW.CreatedBy, NOW()),
    (NEW.Id, CONCAT('temp-dr-7',NEW.Uid), '00000007', 'Charge', 1, null,true, NEW.CreatedBy, NOW()),
	(NEW.Id, CONCAT('temp-dr-8',NEW.Uid), '00000008', 'Other', 1, null,true, NEW.CreatedBy, NOW());
    
    -- insert default table-group
	INSERT INTO `msx_table_group`(`BranchId`,`Uid`,`RecNumber`,`Name`,`CreatedBy`,`IsDefault`,`DateCreated`) VALUES 
	(NEW.Id, CONCAT('temp-dr-1',NEW.Uid), '00000001','Walk-In', true, NEW.CreatedBy,NOW()),
	(NEW.Id, CONCAT('temp-dr-2',NEW.Uid), '00000002','Dine-In', true, NEW.CreatedBy,NOW()),
	(NEW.Id, CONCAT('temp-dr-3',NEW.Uid), '00000003','Delivery', true, NEW.CreatedBy,NOW());*/
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `msx_branch_staff`
--

DROP TABLE IF EXISTS `msx_branch_staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msx_branch_staff` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `BranchId` int NOT NULL,
  `UserId` int NOT NULL,
  `IsDefault` tinyint NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `BranchLine_idx` (`BranchId`),
  KEY `User_BranchLineFK_idx` (`UserId`),
  KEY `User2_BranchStaff_idx` (`CreatedBy`),
  KEY `User2_BranchStaff_idx1` (`UpdatedBy`),
  CONSTRAINT `Branch_BranchStaff` FOREIGN KEY (`BranchId`) REFERENCES `msx_branch` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User1_BranchStaff` FOREIGN KEY (`UserId`) REFERENCES `msx_user` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User2_BranchStaff` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msx_branch_staff`
--

LOCK TABLES `msx_branch_staff` WRITE;
/*!40000 ALTER TABLE `msx_branch_staff` DISABLE KEYS */;
INSERT INTO `msx_branch_staff` VALUES (6,'0198c0f4-a038-71eb-a54e-4e04ee0602c7',1,3,1,1,'2025-01-28 01:38:11',NULL,NULL),(7,'0198c0f4-a040-70dd-8999-aeb959d6e24a',1,4,0,1,'2025-01-28 01:38:23',NULL,NULL),(10,'0198c0f4-a043-7199-83f3-a9a4a1ce5d01',1,8,0,1,'2025-02-24 14:00:37',NULL,NULL),(12,'0198c0f4-a046-746c-85ae-5e63a5acbcd9',1,9,0,1,'2025-02-24 14:00:50',NULL,NULL),(13,'0198c0f4-a048-712a-9fec-0e82fff15319',2,9,0,1,'2025-02-24 14:00:53',NULL,NULL),(15,'0198c0f4-a04a-749f-96ac-166395db1687',2,10,0,1,'2025-02-24 14:17:12',NULL,'2025-06-23 16:29:44'),(22,'0198c0f4-a04c-74db-bcda-ad1e78d7570f',1,1,1,1,'2025-06-10 08:28:04',NULL,'2025-06-27 09:05:22'),(39,'0198c0f4-a04e-73f9-831c-1bed03b7c090',2,1,0,1,'2025-06-23 16:10:49',NULL,'2025-06-23 16:59:48'),(44,'0198c0f4-a050-7706-a54e-c4233533df27',1,2,0,3,'2025-07-18 10:54:14',3,'2025-07-18 10:54:31'),(45,'0198c0f4-a053-76cf-a081-1b945e454d55',1,10,0,3,'2025-07-21 10:30:28',NULL,NULL);
/*!40000 ALTER TABLE `msx_branch_staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `msx_customer`
--

DROP TABLE IF EXISTS `msx_customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msx_customer` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(255) NOT NULL,
  `TenantId` int NOT NULL,
  `RecNumber` varchar(50) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `ContactPerson` varchar(50) DEFAULT NULL,
  `ContactNumber` varchar(50) DEFAULT NULL,
  `CreditLimit` decimal(18,2) NOT NULL,
  `TermId` int NOT NULL,
  `TIN` varchar(50) DEFAULT NULL,
  `WithReward` tinyint NOT NULL,
  `RewardConversion` decimal(18,2) NOT NULL,
  `RewardNumber` varchar(50) DEFAULT NULL,
  `AccountId` int NOT NULL,
  `DefaultPrice` varchar(45) DEFAULT NULL,
  `IsDefault` tinyint NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Company_CustomerFK_idx` (`TenantId`),
  KEY `Term_Customer_idx` (`TermId`),
  KEY `Account_Customer_idx` (`AccountId`),
  KEY `User1_Customer_idx` (`CreatedBy`),
  KEY `User2_Customer_idx` (`UpdatedBy`),
  CONSTRAINT `Account_Customer` FOREIGN KEY (`AccountId`) REFERENCES `msx_account` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `Tenant_Customer` FOREIGN KEY (`TenantId`) REFERENCES `ax_tenant` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Term_Customer` FOREIGN KEY (`TermId`) REFERENCES `ax_term` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `User1_Customer` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_Customer` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=489 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msx_customer`
--

LOCK TABLES `msx_customer` WRITE;
/*!40000 ALTER TABLE `msx_customer` DISABLE KEYS */;
INSERT INTO `msx_customer` VALUES (1,'01978c42-bf6c-71bd-a917-cc22ab3dc89f',1,'00000001','Walk In',NULL,'NA','NA',0.00,6,NULL,0,0.00,'NA',2,'0',0,1,'2025-01-09 12:17:38',NULL,NULL),(2,'01978c75-fbe8-762b-a877-114bba252175',1,'00000002','Delivery',NULL,'NA','NA',0.00,6,NULL,0,0.00,'NA',2,'0',0,1,'2025-01-09 12:18:55',NULL,NULL),(3,'019796b8-7488-741b-9bd7-07e2cd2663b2',1,'00000003','Hospitality',NULL,'NA','NA',0.00,6,NULL,0,0.00,'NA',2,'0',0,1,'2025-01-09 12:19:05',NULL,NULL);
/*!40000 ALTER TABLE `msx_customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `msx_discount`
--

DROP TABLE IF EXISTS `msx_discount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msx_discount` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(255) NOT NULL,
  `TenantId` int NOT NULL,
  `RecNumber` varchar(50) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `DiscountRate` decimal(18,2) NOT NULL,
  `IsVATExempt` tinyint NOT NULL,
  `IsGovernmentMandated` tinyint NOT NULL,
  `IsDateScheduled` tinyint NOT NULL,
  `DateStart` datetime DEFAULT NULL,
  `DateEnd` datetime DEFAULT NULL,
  `IsDayScheduled` tinyint NOT NULL,
  `IsMonday` tinyint NOT NULL,
  `IsTuesday` tinyint NOT NULL,
  `IsWednesday` tinyint NOT NULL,
  `IsThursday` tinyint NOT NULL,
  `IsFriday` tinyint NOT NULL,
  `IsSaturday` tinyint NOT NULL,
  `IsSunday` tinyint NOT NULL,
  `IsDefault` tinyint NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Company_DiscountFK_idx` (`TenantId`),
  KEY `User1_Discount_idx` (`CreatedBy`),
  KEY `User2_Discount_idx` (`UpdatedBy`),
  CONSTRAINT `Tenant_Discount` FOREIGN KEY (`TenantId`) REFERENCES `ax_tenant` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User1_Discount` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_Discount` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=371 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msx_discount`
--

LOCK TABLES `msx_discount` WRITE;
/*!40000 ALTER TABLE `msx_discount` DISABLE KEYS */;
INSERT INTO `msx_discount` VALUES (1,'01978c42-bf6c-71bd-a917-cc22ab3dc89f',1,'00000001','Zero',0.00,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,1,'2025-01-09 12:46:33',NULL,NULL),(2,'01978c75-fbe8-762b-a877-114bba252175',1,'00000002','Variable',0.00,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,1,'2025-01-09 12:47:26',NULL,NULL),(3,'019796b8-7488-741b-9bd7-07e2cd2663b2',1,'00000003','Senior Citizen',20.00,1,1,0,NULL,NULL,0,0,0,0,0,0,0,0,0,1,'2025-01-09 12:47:49',1,'2025-06-18 14:40:04'),(4,'019796c5-eaa6-7507-88bb-053e3c69e112',1,'00000004','Person With Disability',20.00,1,1,0,NULL,NULL,0,0,0,0,0,0,0,0,0,1,'2025-01-09 12:53:28',NULL,NULL);
/*!40000 ALTER TABLE `msx_discount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `msx_discount_item`
--

DROP TABLE IF EXISTS `msx_discount_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msx_discount_item` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `DiscountId` int NOT NULL,
  `ItemId` int NOT NULL,
  `IsAutoDiscount` tinyint DEFAULT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `DistcountItem_idx` (`DiscountId`),
  KEY `User1_DiscountItem_idx` (`CreatedBy`),
  KEY `User2_DiscountItem_idx` (`UpdatedBy`),
  KEY `Item_DiscountItem_idx` (`ItemId`),
  CONSTRAINT `DistcountItem` FOREIGN KEY (`DiscountId`) REFERENCES `msx_discount` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Item_DiscountItem` FOREIGN KEY (`ItemId`) REFERENCES `msx_item` (`Id`),
  CONSTRAINT `User1_DiscountItem` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_DiscountItem` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msx_discount_item`
--

LOCK TABLES `msx_discount_item` WRITE;
/*!40000 ALTER TABLE `msx_discount_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `msx_discount_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `msx_item`
--

DROP TABLE IF EXISTS `msx_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msx_item` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(255) NOT NULL,
  `BranchId` int NOT NULL,
  `UnitId` int NOT NULL,
  `RecNumber` varchar(50) NOT NULL,
  `ItemSKU` varchar(100) NOT NULL,
  `Description` varchar(255) NOT NULL,
  `Alias` varchar(255) NOT NULL,
  `GenericName` varchar(255) NOT NULL,
  `Category` varchar(255) NOT NULL,
  `SalesAccountId` int NOT NULL,
  `AssetAccountId` int NOT NULL,
  `CostAccountId` int NOT NULL,
  `InTaxId` int NOT NULL,
  `OutTaxId` int NOT NULL,
  `SupplierId` int NOT NULL,
  `Cost` decimal(18,2) DEFAULT NULL,
  `MarkUp` decimal(18,2) DEFAULT NULL,
  `Price` decimal(18,2) NOT NULL,
  `ReorderQuantity` decimal(18,2) NOT NULL,
  `OnhandQuantity` decimal(18,2) NOT NULL,
  `IsInventory` tinyint NOT NULL,
  `ExpiryDate` datetime DEFAULT NULL,
  `LotNumber` varchar(50) DEFAULT NULL,
  `Remarks` varchar(255) DEFAULT NULL,
  `IsPackage` tinyint DEFAULT NULL,
  `KitchenReport` varchar(50) DEFAULT NULL,
  `Image` text,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Branch_ItemFK_idx` (`BranchId`),
  KEY `AssetAccount_ItemFK_idx` (`AssetAccountId`),
  KEY `SalesAccount_ItemFK_idx` (`SalesAccountId`),
  KEY `CostAccount_ItemFK_idx` (`CostAccountId`),
  KEY `PurchaseTax_ItemFK_idx` (`InTaxId`),
  KEY `SalesTax_ItemFK_idx` (`OutTaxId`),
  KEY `Unit_ItemFK_idx` (`UnitId`),
  KEY `Supplier_ItemFK_idx` (`SupplierId`),
  KEY `User1_Item_idx` (`CreatedBy`),
  KEY `User2_Item_idx` (`UpdatedBy`),
  CONSTRAINT `AssetAccount_ItemFK` FOREIGN KEY (`AssetAccountId`) REFERENCES `msx_account` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `Branch_ItemFK` FOREIGN KEY (`BranchId`) REFERENCES `msx_branch` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CostAccount_ItemFK` FOREIGN KEY (`CostAccountId`) REFERENCES `msx_account` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `PurchaseTax_ItemFK` FOREIGN KEY (`InTaxId`) REFERENCES `msx_tax` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `SalesAccount_ItemFK` FOREIGN KEY (`SalesAccountId`) REFERENCES `msx_account` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `SalesTax_ItemFK` FOREIGN KEY (`OutTaxId`) REFERENCES `msx_tax` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `Supplier_ItemFK` FOREIGN KEY (`SupplierId`) REFERENCES `msx_supplier` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `Unit_ItemFK` FOREIGN KEY (`UnitId`) REFERENCES `msx_unit` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `User1_Item` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_Item` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=1043 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msx_item`
--

LOCK TABLES `msx_item` WRITE;
/*!40000 ALTER TABLE `msx_item` DISABLE KEYS */;
INSERT INTO `msx_item` VALUES (7,'01978c42-bf6c-71bd-a917-cc22ab3dc89f',1,1,'00000001','361339568','Nescafe stick 1.9g','Nescafe stick 1.9g','Nescafe stick 1.91g','tste',6,3,7,1,1,1,0.00,0.00,3.62,0.00,0.00,0,NULL,NULL,NULL,0,NULL,NULL,1,'2025-01-25 15:51:34',1,'2025-06-23 00:55:08'),(1029,'01979fb7-5ea7-7488-89f4-12f1a5360606',1,11,'00000002','000074','1988 Clubhouse Sandwich','1988 Clubhouse Sandwich','1988 Clubhouse Sandwich','Foods',1,1,1,1,1,1,0.00,0.00,399.00,0.00,0.00,1,NULL,NULL,NULL,0,NULL,NULL,1,'2025-06-24 10:15:51',NULL,NULL),(1030,'01979fb8-93b7-73f6-a4a5-7792c805be11',1,1,'00000003','000090','1988 Dark Chocolate Cake','1988 Dark Chocolate Cake','1988 Dark Chocolate Cake','DESSERTS',3,1,2,4,1,1,3.00,4.00,3.12,0.00,0.00,1,NULL,NULL,NULL,0,NULL,NULL,1,'2025-06-24 10:17:14',3,'2025-07-06 02:37:10'),(1031,'01979fb9-b339-7692-a813-14ddf664669f',1,1,'00000004','000051','Aeropress Brewed Coffee','Aeropress Brewed Coffee','Aeropress Brewed Coffee','ESPRESSO',1,1,1,1,1,1,0.00,0.00,39.00,0.00,0.00,1,NULL,NULL,NULL,0,NULL,NULL,1,'2025-06-24 10:18:07',NULL,NULL),(1032,'01979fbb-4dc0-7797-bc6b-7e8e9697291c',1,1,'00000005','000042','1988 Fish and Chips w/ Tartar Sauce','1988 Fish and Chips w/ Tartar Sauce','1988 Fish and Chips w/ Tartar Sauce','SEAFOODS',1,1,1,1,1,1,0.00,0.00,199.00,0.00,0.00,1,NULL,NULL,NULL,0,NULL,NULL,1,'2025-06-24 10:19:41',NULL,NULL),(1033,'01979fbd-9716-75dc-a7f1-befd52010298',1,1,'00000006','000014','Australian Black Tea 12oz','Australian Black Tea 12oz','Australian Black Tea 12oz','SPECIAL',1,1,1,1,1,1,66.00,0.00,170.00,0.00,0.00,1,NULL,NULL,NULL,0,NULL,NULL,1,'2025-06-24 10:22:58',3,'2025-07-31 15:28:19'),(1034,'01979fbf-03f8-711b-8d43-28bb8e0a47fe',1,1,'00000007','000108','Blue Berry Muffin','Blue Berry Muffin','Blue Berry Muffin','PASTIRES',1,1,1,1,1,1,0.00,0.00,179.00,0.00,0.00,1,NULL,NULL,NULL,0,NULL,NULL,1,'2025-06-24 10:25:22',NULL,NULL),(1035,'01979fc1-9414-77bd-af82-743ecedf25d1',1,1,'00000008','000063','1988 Grilled Chicken Salad','1988 Grilled Chicken Salad','1988 Grilled Chicken Salad','SALAD',1,1,1,1,1,1,0.00,0.00,169.00,0.00,0.00,1,NULL,NULL,NULL,0,NULL,NULL,1,'2025-06-24 10:27:01',NULL,NULL),(1036,'01979fc2-ae26-7378-9a0e-5684cdaa8883',1,1,'00000009','000302','1988 Native Chicken Soup','1988 Native Chicken Soup','1988 Native Chicken Soup','SOUP',1,1,1,1,1,1,0.00,0.00,259.00,0.00,0.00,1,NULL,NULL,NULL,0,NULL,NULL,1,'2025-06-24 10:27:48',NULL,NULL),(1037,'01979fc3-61d7-741e-b6b9-20c2b231220e',1,1,'00000010','000020','Blueberry Cheesecake','Blueberry Cheesecake','Blueberry Cheesecake','PASTIRES',1,1,1,1,1,1,0.00,0.00,299.00,0.00,0.00,1,NULL,NULL,NULL,0,NULL,NULL,1,'2025-06-24 10:28:35',NULL,NULL),(1038,'01979fc5-040d-705f-9f39-04ab18435593',1,1,'00000011','0000844','Bottled Water 500ml','Bottled Water 500ml','Bottled Water 500ml','BEVERAGES',1,1,1,1,1,1,0.00,0.00,70.00,0.00,0.00,1,NULL,NULL,NULL,0,NULL,NULL,1,'2025-06-24 10:30:51',NULL,NULL),(1039,'01979fc6-d346-701d-afd2-6edd3b00f371',1,1,'00000012','000109','Brownies','Brownies','Brownies','PASTIRES',1,1,1,1,1,1,0.00,0.00,90.00,0.00,0.00,1,NULL,NULL,NULL,0,NULL,NULL,1,'2025-06-24 10:32:09',NULL,NULL),(1040,'01979fc7-77b2-7458-acee-fe4f085cfa2e',1,1,'00000013','000164','1988 Tinto de Verano','1988 Tinto de Verano','1988 Tinto de Verano','COCKTAIL',1,1,1,1,1,1,0.00,0.00,199.00,0.00,0.00,1,NULL,NULL,NULL,0,NULL,NULL,1,'2025-06-24 10:32:58',NULL,NULL),(1041,'01979fc8-191b-7567-a90c-3524a6276480',1,1,'00000014','000110','Brownies w/ ice cream','Brownies w/ ice cream','Brownies w/ ice cream','PASTIRES',1,1,1,1,1,1,0.00,0.00,99.00,0.00,0.00,1,NULL,NULL,NULL,0,NULL,NULL,1,'2025-06-24 10:33:34',NULL,NULL);
/*!40000 ALTER TABLE `msx_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `msx_item_component`
--

DROP TABLE IF EXISTS `msx_item_component`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msx_item_component` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `ItemId` int NOT NULL,
  `ComponentId` int NOT NULL,
  `UnitId` int NOT NULL,
  `Quantity` decimal(18,2) NOT NULL,
  `Cost` decimal(18,2) NOT NULL,
  `Amount` decimal(18,2) NOT NULL,
  `IsPrinted` tinyint NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Item_ItemComponentFK_idx` (`ItemId`),
  KEY `Item_ItemComponent2FK_idx` (`ComponentId`),
  KEY `User1_ItemComponent_idx` (`CreatedBy`),
  KEY `User_ItemComponent_idx` (`UpdatedBy`),
  CONSTRAINT `Item_ItemComponent2FK` FOREIGN KEY (`ComponentId`) REFERENCES `msx_item` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Item_ItemComponentFK` FOREIGN KEY (`ItemId`) REFERENCES `msx_item` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User1_ItemComponent` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User_ItemComponent` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msx_item_component`
--

LOCK TABLES `msx_item_component` WRITE;
/*!40000 ALTER TABLE `msx_item_component` DISABLE KEYS */;
/*!40000 ALTER TABLE `msx_item_component` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `msx_item_group`
--

DROP TABLE IF EXISTS `msx_item_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msx_item_group` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(255) NOT NULL,
  `BranchId` int NOT NULL,
  `RecNumber` varchar(50) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `KitchenReport` varchar(255) NOT NULL,
  `Image` text,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Branch_ItemGroupFK_idx` (`BranchId`),
  KEY `User1_ItemGroup_idx` (`CreatedBy`),
  KEY `User2_ItemGroup_idx` (`UpdatedBy`),
  CONSTRAINT `Branch_ItemGroupFK` FOREIGN KEY (`BranchId`) REFERENCES `msx_branch` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User1_ItemGroup` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_ItemGroup` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msx_item_group`
--

LOCK TABLES `msx_item_group` WRITE;
/*!40000 ALTER TABLE `msx_item_group` DISABLE KEYS */;
INSERT INTO `msx_item_group` VALUES (29,'019811fe-9126-71ce-b885-6a4e0841bffa',1,'00000001','test44','Kitchen 1',NULL,3,'2025-07-16 14:49:17',3,'2025-07-29 16:50:19');
/*!40000 ALTER TABLE `msx_item_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `msx_item_group_item`
--

DROP TABLE IF EXISTS `msx_item_group_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msx_item_group_item` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `ItemId` int NOT NULL,
  `ItemGroupId` int NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `ItemGroupLine_idx` (`ItemGroupId`),
  KEY `ItemGroup_idx` (`ItemId`),
  KEY `User1_ItemGroupItem_idx` (`CreatedBy`),
  KEY `User2_ItemGroupItem_idx` (`UpdatedBy`),
  CONSTRAINT `ItemGroup` FOREIGN KEY (`ItemId`) REFERENCES `msx_item` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ItemGroupLine` FOREIGN KEY (`ItemGroupId`) REFERENCES `msx_item_group` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User1_ItemGroupItem` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_ItemGroupItem` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=233 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msx_item_group_item`
--

LOCK TABLES `msx_item_group_item` WRITE;
/*!40000 ALTER TABLE `msx_item_group_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `msx_item_group_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `msx_item_package`
--

DROP TABLE IF EXISTS `msx_item_package`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msx_item_package` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `ItemId` int NOT NULL,
  `PackageItemId` int NOT NULL,
  `UnitId` int NOT NULL,
  `Quantity` decimal(18,2) NOT NULL,
  `IsOptional` tinyint NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `ItemPackage_idx` (`ItemId`),
  KEY `Item_PackageItem_idx` (`PackageItemId`),
  KEY `User1_ItemPackage_idx` (`CreatedBy`),
  KEY `User2_ItemPackage_idx` (`UpdatedBy`),
  CONSTRAINT `Item1_ItemPackage` FOREIGN KEY (`PackageItemId`) REFERENCES `msx_item` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Item2_ItemPackage` FOREIGN KEY (`ItemId`) REFERENCES `msx_item` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User1_ItemPackage` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_ItemPackage` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msx_item_package`
--

LOCK TABLES `msx_item_package` WRITE;
/*!40000 ALTER TABLE `msx_item_package` DISABLE KEYS */;
/*!40000 ALTER TABLE `msx_item_package` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `msx_item_price`
--

DROP TABLE IF EXISTS `msx_item_price`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msx_item_price` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `ItemId` int NOT NULL,
  `Description` varchar(255) NOT NULL,
  `Price` decimal(18,2) NOT NULL,
  `TriggerQuantity` decimal(18,2) NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Item_ItemPriceFK_idx` (`ItemId`),
  KEY `User1_ItemPrice_idx` (`CreatedBy`),
  KEY `User2_ItemPrice_idx` (`UpdatedBy`),
  CONSTRAINT `Item_ItemPriceFK` FOREIGN KEY (`ItemId`) REFERENCES `msx_item` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User1_ItemPrice` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_ItemPrice` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msx_item_price`
--

LOCK TABLES `msx_item_price` WRITE;
/*!40000 ALTER TABLE `msx_item_price` DISABLE KEYS */;
/*!40000 ALTER TABLE `msx_item_price` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `msx_kitchen`
--

DROP TABLE IF EXISTS `msx_kitchen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msx_kitchen` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `BranchId` int NOT NULL,
  `KitchenReport` varchar(255) NOT NULL,
  `Copies` int NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Branch_KitchenFK_idx` (`BranchId`),
  KEY `User1_Kitchen_idx` (`CreatedBy`),
  KEY `User2_Kitchen_idx` (`UpdatedBy`),
  CONSTRAINT `Branch_KitchenFK` FOREIGN KEY (`BranchId`) REFERENCES `msx_branch` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User1_Kitchen` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_Kitchen` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msx_kitchen`
--

LOCK TABLES `msx_kitchen` WRITE;
/*!40000 ALTER TABLE `msx_kitchen` DISABLE KEYS */;
/*!40000 ALTER TABLE `msx_kitchen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `msx_pay_type`
--

DROP TABLE IF EXISTS `msx_pay_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msx_pay_type` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `BranchId` int NOT NULL,
  `RecNumber` varchar(50) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `AccountId` int NOT NULL,
  `SortNumber` int DEFAULT NULL,
  `IsDefault` tinyint NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Branch_PayType_idx` (`BranchId`),
  KEY `Account_PayType_idx` (`AccountId`),
  KEY `User1_PayTyoe_idx` (`CreatedBy`),
  KEY `User2_PayType_idx` (`UpdatedBy`),
  CONSTRAINT `Account_PayType` FOREIGN KEY (`AccountId`) REFERENCES `msx_account` (`Id`),
  CONSTRAINT `Branch_PayType` FOREIGN KEY (`BranchId`) REFERENCES `msx_branch` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User1_PayType` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_PayType` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=1171 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msx_pay_type`
--

LOCK TABLES `msx_pay_type` WRITE;
/*!40000 ALTER TABLE `msx_pay_type` DISABLE KEYS */;
INSERT INTO `msx_pay_type` VALUES (1,'0198c0f6-ef23-724c-9160-1324b0a0165e',1,'00000001','Cash',1,NULL,0,1,'2025-01-09 11:55:36',NULL,NULL),(2,'0198c0f6-ef2b-76e8-b790-46539457cd10',1,'00000002','Check',1,NULL,0,1,'2025-01-09 11:55:42',NULL,NULL),(3,'0198c0f6-ef2e-7450-adfe-310d435d70eb',1,'00000003','Credit Card',10,NULL,0,1,'2025-01-09 11:55:50',1,'2025-01-09 12:02:51'),(4,'0198c0f6-ef31-745b-bbca-59af61185e55',1,'00000004','Gift Check',10,NULL,0,1,'2025-01-09 12:03:24',NULL,NULL),(5,'0198c0f6-ef33-72a6-941a-5b479f0d174d',1,'00000005','Exchange',10,NULL,0,1,'2025-01-09 12:03:55',NULL,NULL),(6,'0198c0f6-ef36-76cc-93c8-57003ff538ea',1,'00000006','Rewards',10,NULL,0,1,'2025-01-09 12:04:08',NULL,NULL),(7,'0198c0f6-ef38-72e1-ad9d-8cca36161561',1,'00000007','Charge',10,NULL,0,1,'2025-01-09 12:04:13',NULL,NULL),(8,'0198c0f6-ef3b-72eb-bc78-0d457227002a',1,'00000008','Others',10,NULL,0,1,'2025-01-09 12:04:48',NULL,NULL),(9,'0198c0f6-ef3d-7569-a011-cccf475e906b',1,'00000009','Debit',10,NULL,0,1,'2025-01-09 12:04:52',NULL,NULL),(10,'0198c0f6-ef40-7629-aa06-2a72ca26c726',1,'00000010','Coupon',10,NULL,0,1,'2025-01-09 12:04:57',NULL,NULL),(11,'0198c0f6-ef43-74cb-a536-b8e937809edb',1,'00000011','SMAC',10,NULL,0,1,'2025-01-09 12:05:08',NULL,NULL),(12,'0198c0f6-ef46-76e2-9725-0bc642159e7c',1,'00000012','American Express',10,NULL,0,1,'2025-01-09 12:05:12',NULL,NULL),(13,'0198c0f6-ef48-72f3-a038-0373bf6ed63d',1,'00000013','Online Deals',10,NULL,0,1,'2025-01-09 12:05:17',NULL,NULL),(14,'0198c0f6-ef4b-72c9-9936-b1fc0e911e61',1,'00000014','Mastercard',10,NULL,0,1,'2025-01-09 12:05:23',NULL,NULL),(15,'0198c0f6-ef4d-778a-a737-00dd584bd321',1,'00000015','GCash',10,NULL,0,1,'2025-01-09 12:05:34',NULL,NULL),(16,'0198c0f6-ef4f-75c5-829d-c2d8018bcf85',1,'00000016','PayMaya',10,NULL,0,1,'2025-01-09 12:05:42',NULL,NULL),(17,'0198c0f6-ef52-7169-b104-a772261d3063',1,'00000017','Grab',10,NULL,0,1,'2025-01-09 12:05:45',NULL,NULL),(18,'0198c0f6-ef55-7059-b72c-d6683735d1f4',1,'00000018','FoodPanda',10,NULL,0,1,'2025-01-09 12:05:49',NULL,NULL),(20,'0198c0f6-ef58-752e-8fef-141d551e75c6',1,'00000020','ShopeePay',10,NULL,0,1,'2025-01-09 12:06:10',NULL,NULL),(1123,'temp-dr-101978c42-bf6c-71bd-a917-cc22ab3dc89f',243,'00000001','Cash',1,NULL,1,1,'2025-10-01 16:21:13',NULL,NULL),(1124,'temp-dr-201978c42-bf6c-71bd-a917-cc22ab3dc89f',243,'00000002','Check',1,NULL,1,1,'2025-10-01 16:21:13',NULL,NULL),(1125,'temp-dr-301978c42-bf6c-71bd-a917-cc22ab3dc89f',243,'00000003','Credit Card',1,NULL,1,1,'2025-10-01 16:21:13',NULL,NULL),(1126,'temp-dr-401978c42-bf6c-71bd-a917-cc22ab3dc89f',243,'00000004','Gift Check',1,NULL,1,1,'2025-10-01 16:21:13',NULL,NULL),(1127,'temp-dr-501978c42-bf6c-71bd-a917-cc22ab3dc89f',243,'00000005','Exchange',1,NULL,1,1,'2025-10-01 16:21:13',NULL,NULL),(1128,'temp-dr-601978c42-bf6c-71bd-a917-cc22ab3dc89f',243,'00000006','Rewards',1,NULL,1,1,'2025-10-01 16:21:13',NULL,NULL),(1129,'temp-dr-701978c42-bf6c-71bd-a917-cc22ab3dc89f',243,'00000007','Charge',1,NULL,1,1,'2025-10-01 16:21:13',NULL,NULL),(1130,'temp-dr-801978c42-bf6c-71bd-a917-cc22ab3dc89f',243,'00000008','Other',1,NULL,1,1,'2025-10-01 16:21:13',NULL,NULL),(1131,'temp-dr-168d4bd11-3740-8333-a9ed-7e59dc3e3b04',254,'00000001','Cash',1,NULL,1,1,'2025-10-01 16:27:31',NULL,NULL),(1132,'temp-dr-268d4bd11-3740-8333-a9ed-7e59dc3e3b04',254,'00000002','Check',1,NULL,1,1,'2025-10-01 16:27:31',NULL,NULL),(1133,'temp-dr-368d4bd11-3740-8333-a9ed-7e59dc3e3b04',254,'00000003','Credit Card',1,NULL,1,1,'2025-10-01 16:27:31',NULL,NULL),(1134,'temp-dr-468d4bd11-3740-8333-a9ed-7e59dc3e3b04',254,'00000004','Gift Check',1,NULL,1,1,'2025-10-01 16:27:31',NULL,NULL),(1135,'temp-dr-568d4bd11-3740-8333-a9ed-7e59dc3e3b04',254,'00000005','Exchange',1,NULL,1,1,'2025-10-01 16:27:31',NULL,NULL),(1136,'temp-dr-668d4bd11-3740-8333-a9ed-7e59dc3e3b04',254,'00000006','Rewards',1,NULL,1,1,'2025-10-01 16:27:31',NULL,NULL),(1137,'temp-dr-768d4bd11-3740-8333-a9ed-7e59dc3e3b04',254,'00000007','Charge',1,NULL,1,1,'2025-10-01 16:27:31',NULL,NULL),(1138,'temp-dr-868d4bd11-3740-8333-a9ed-7e59dc3e3b04',254,'00000008','Other',1,NULL,1,1,'2025-10-01 16:27:31',NULL,NULL);
/*!40000 ALTER TABLE `msx_pay_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `msx_permission`
--

DROP TABLE IF EXISTS `msx_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msx_permission` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `RoleId` int NOT NULL,
  `AccessRightId` int NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Role_Permission_idx` (`RoleId`),
  KEY `AccessRight_Permission_idx` (`AccessRightId`),
  KEY `User1_Permission_idx` (`CreatedBy`),
  KEY `User2_Permission_idx` (`UpdatedBy`),
  CONSTRAINT `AccessRight_Permission` FOREIGN KEY (`AccessRightId`) REFERENCES `ax_access_right` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Role_Permission` FOREIGN KEY (`RoleId`) REFERENCES `msx_role` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User1_Permission` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_Permission` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=504 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msx_permission`
--

LOCK TABLES `msx_permission` WRITE;
/*!40000 ALTER TABLE `msx_permission` DISABLE KEYS */;
INSERT INTO `msx_permission` VALUES (1,'0198c0f7-8f47-753b-bbb4-9604f487e7ac',2,1,1,'2025-01-21 09:55:25',NULL,NULL),(2,'0198c0f7-8f4f-77dd-8859-adefa51fbf25',2,2,1,'2025-01-21 10:37:43',NULL,NULL),(3,'0198c0f7-8f51-74b8-82ed-26e1d6ac83d5',2,3,1,'2025-01-28 00:01:18',NULL,NULL),(4,'0198c0f7-8f53-736f-b73c-cf02d9d9f386',2,4,1,'2025-01-28 00:01:20',NULL,NULL),(6,'0198c0f7-8f55-774c-afff-a118b84f79d6',2,6,1,'2025-01-28 00:01:25',NULL,NULL),(7,'0198c0f7-8f57-7481-a8f4-43540f01dbd7',2,7,1,'2025-01-28 00:01:28',NULL,NULL),(8,'0198c0f7-8f59-73d9-941b-9ba311095036',2,8,1,'2025-01-28 00:01:31',NULL,NULL),(9,'0198c0f7-8f5b-733d-8d2d-11d66c3dc080',2,9,1,'2025-01-28 00:01:34',NULL,NULL),(10,'0198c0f7-8f5c-731a-a485-6e8fb8c8d52b',2,10,1,'2025-01-28 00:01:37',NULL,NULL),(11,'0198c0f7-8f5f-736f-8113-5f450b9b718b',2,11,1,'2025-01-28 00:01:39',NULL,NULL),(12,'0198c0f7-8f61-7312-8bd0-0803f302bf91',2,12,1,'2025-01-28 00:01:41',NULL,NULL),(13,'0198c0f7-8f62-773e-bf10-f4b860de59fe',2,13,1,'2025-01-28 00:01:43',NULL,NULL),(14,'0198c0f7-8f64-70bf-bb29-fd95f104f4d9',2,14,1,'2025-01-28 00:01:46',NULL,NULL),(15,'0198c0f7-8f67-737b-8eea-d27e2b324ac3',2,15,1,'2025-01-28 00:01:49',NULL,NULL),(16,'0198c0f7-8f69-71fe-b724-832b8bede753',2,16,1,'2025-01-28 00:01:51',NULL,NULL),(21,'0198c0f7-8f6c-7729-aaa6-6673d8dfa15a',2,21,1,'2025-01-28 00:02:07',NULL,NULL),(22,'0198c0f7-8f6e-769e-a3c3-a016b74e5c5e',2,22,1,'2025-01-28 00:02:08',NULL,NULL),(23,'0198c0f7-8f70-73dd-8bb5-77b97959c563',2,23,1,'2025-01-28 00:02:11',NULL,NULL),(24,'0198c0f7-8f71-7680-a1d3-474d128b9477',2,24,1,'2025-01-28 00:02:14',NULL,NULL),(25,'0198c0f7-8f74-7439-ab34-1aa9bd138ed9',2,25,1,'2025-01-28 00:02:17',NULL,NULL),(29,'0198c0f7-8f75-7659-942b-fcdf54ab2d6b',2,29,1,'2025-01-28 00:02:26',NULL,NULL),(30,'0198c0f7-8f78-7528-bcec-e1c293e0cbed',2,30,1,'2025-01-28 00:02:29',NULL,NULL),(31,'0198c0f7-8f7a-70f2-90d3-5a4aaeb657f0',2,31,1,'2025-01-28 00:02:31',NULL,NULL),(32,'0198c0f7-8f7d-7248-b636-3c4aa9c0c159',2,32,1,'2025-01-28 00:02:34',NULL,NULL),(33,'0198c0f7-8f7f-7718-8d4d-01be19babf65',2,33,1,'2025-01-28 00:02:37',NULL,NULL),(34,'0198c0f7-8f81-75ed-be1c-6dccaa5baa05',2,34,1,'2025-01-28 00:02:40',NULL,NULL),(35,'0198c0f7-8f83-732a-b09b-50ad7305a697',2,35,1,'2025-01-28 00:02:42',NULL,NULL),(36,'0198c0f7-8f85-75c9-bd11-038ff885122e',2,36,1,'2025-01-28 00:02:45',NULL,NULL),(37,'0198c0f7-8f87-77af-9b7e-e5810c1cf6f1',2,37,1,'2025-01-28 00:02:49',NULL,NULL),(38,'0198c0f7-8f89-7608-8c57-eae8507530af',2,38,1,'2025-01-28 00:02:55',NULL,NULL),(39,'0198c0f7-8f8b-73bb-8fb1-0bea6eb6cd51',2,39,1,'2025-01-28 00:02:57',NULL,NULL),(40,'0198c0f7-8f8d-7381-ba68-cebb84428e87',2,40,1,'2025-01-28 00:03:00',NULL,NULL),(41,'0198c0f7-8f8f-733b-adeb-d0612672edf1',2,41,1,'2025-01-28 00:03:02',NULL,NULL),(42,'0198c0f7-8f91-72fc-9cb3-66111fb7edac',2,42,1,'2025-01-28 00:03:05',NULL,NULL),(43,'0198c0f7-8f93-7008-b334-ec441998c78c',2,43,1,'2025-01-28 00:03:13',NULL,NULL),(44,'0198c0f7-8f96-758a-805c-c73296eff607',2,44,1,'2025-01-28 00:03:15',NULL,NULL),(45,'0198c0f7-8f99-70c9-b7e7-c32433297e6e',2,45,1,'2025-01-28 00:03:18',NULL,NULL),(46,'0198c0f7-8f9b-70dc-ae36-7b6527ffc589',2,46,1,'2025-01-28 00:03:21',NULL,NULL),(47,'0198c0f7-8f9d-7739-9f1e-4a73f42756bc',2,47,1,'2025-01-28 00:03:24',NULL,NULL),(48,'0198c0f7-8f9f-706d-9983-0330c12598d7',2,48,1,'2025-01-28 00:03:27',NULL,NULL),(53,'0198c0f7-8fa1-74ef-902d-1449737f63f1',2,53,1,'2025-01-28 00:05:06',NULL,NULL),(54,'0198c0f7-8fa3-7071-a685-0e007b166ec8',2,54,1,'2025-01-28 00:05:11',NULL,NULL),(55,'0198c0f7-8fa5-77dd-9210-b519f4834744',2,55,1,'2025-01-28 00:05:14',NULL,NULL),(56,'0198c0f7-8fa7-711c-b8f6-39f889018cbd',2,56,1,'2025-01-28 00:05:16',NULL,NULL),(57,'0198c0f7-8fa9-70ea-8dc0-9f9bc24d9ea9',2,57,1,'2025-01-28 00:05:18',NULL,NULL),(58,'0198c0f7-8fab-7324-82f4-1b9931e255be',2,58,1,'2025-01-28 00:05:20',NULL,NULL),(59,'0198c0f7-8fae-711c-940f-b6f50d1a5edb',2,59,1,'2025-01-28 00:05:23',NULL,NULL),(60,'0198c0f7-8fb1-753d-a039-fac98256f148',2,65,1,'2025-01-28 00:05:25',NULL,NULL),(61,'0198c0f7-8fb3-7509-a78e-430078f73268',2,60,1,'2025-01-28 00:05:28',NULL,NULL),(62,'0198c0f7-8fb5-70ff-b19f-42eb710b1bc0',2,66,1,'2025-01-28 00:05:31',NULL,NULL),(63,'0198c0f7-8fb6-7348-9177-60c8ea4313bf',2,67,1,'2025-01-28 00:05:34',NULL,NULL),(64,'0198c0f7-8fb8-72fe-85bf-13c3f2bacdce',2,68,1,'2025-01-28 00:05:36',NULL,NULL),(65,'0198c0f7-8fba-75c8-a88d-704122492b7b',2,69,1,'2025-01-28 00:05:39',NULL,NULL),(66,'0198c0f7-8fbd-7116-8945-c09f6cd2c16f',2,70,1,'2025-01-28 00:05:42',NULL,NULL),(67,'0198c0f7-8fc3-727f-a0f7-7e44859b82b8',2,71,1,'2025-01-28 00:05:46',NULL,NULL),(68,'0198c0f7-8fc6-708a-be87-abd8581a890d',2,72,1,'2025-01-28 00:05:48',NULL,NULL),(69,'0198c0f7-8fca-76c2-9bfe-744a40a4dd4d',2,73,1,'2025-01-28 00:05:50',NULL,NULL),(70,'0198c0f7-8fce-74ee-bc3e-7e0464d01a90',2,74,1,'2025-01-28 00:05:52',NULL,NULL),(71,'0198c0f7-8fd1-71ea-92c1-f702a6981918',2,75,1,'2025-01-28 00:05:54',NULL,NULL),(72,'0198c0f7-8fd5-75ac-b128-14c958f58e27',2,76,1,'2025-01-28 00:05:56',NULL,NULL),(73,'0198c0f7-8fd8-708f-9270-bf862bf5edd5',2,77,1,'2025-01-28 00:05:59',NULL,NULL),(74,'0198c0f7-8fdc-7028-a606-a536306a9c13',2,78,1,'2025-01-28 00:06:01',NULL,NULL),(75,'0198c0f7-8fdf-776a-9adc-9dac59f4ccf7',2,79,1,'2025-01-28 00:06:04',NULL,NULL),(76,'0198c0f7-8fe2-71ca-a58f-844f11c0bfa0',2,80,1,'2025-01-28 00:06:06',NULL,NULL),(77,'0198c0f7-8fe6-7329-9be9-45c56c6e76b0',2,81,1,'2025-01-28 00:06:08',NULL,NULL),(78,'0198c0f7-8fe9-72a0-b5f8-f460853daaa1',2,82,1,'2025-01-28 00:06:10',NULL,NULL),(79,'0198c0f7-8fec-7749-8d4b-8da7ef17c18e',2,83,1,'2025-01-28 00:06:12',NULL,NULL),(80,'0198c0f7-8ff0-7718-8e08-8f9de4f72a90',2,84,1,'2025-01-28 00:06:15',NULL,NULL),(81,'0198c0f7-8ff4-708c-9dc6-5cf64657b278',2,85,1,'2025-01-28 00:06:18',NULL,NULL),(82,'0198c0f7-8ff8-706b-8187-c114902f1b64',2,86,1,'2025-01-28 00:06:21',NULL,NULL),(83,'0198c0f7-8ffb-75fd-a3bd-e1d41cdf8ab0',2,87,1,'2025-01-28 00:06:23',NULL,NULL),(84,'0198c0f7-8ffe-7233-924a-eb33b36ce4cd',2,88,1,'2025-01-28 00:06:25',NULL,NULL),(85,'0198c0f7-9001-7798-83a3-138d4830a0af',2,89,1,'2025-01-28 00:06:27',NULL,NULL),(86,'0198c0f7-9003-73da-a432-73b0899b023b',2,90,1,'2025-01-28 00:06:30',NULL,NULL),(87,'0198c0f7-9005-7499-9843-20e6485833eb',2,91,1,'2025-01-28 00:06:33',NULL,NULL),(88,'0198c0f7-9008-777a-9593-97da4b400b29',2,92,1,'2025-01-28 00:06:35',NULL,NULL),(89,'0198c0f7-900a-723e-9b26-371a900d42cc',2,93,1,'2025-01-28 00:06:41',NULL,NULL),(90,'0198c0f7-900c-7387-8041-f0490ada4c80',2,94,1,'2025-01-28 00:06:45',NULL,NULL),(91,'0198c0f7-900e-777c-82cd-2498d0878f70',2,95,1,'2025-01-28 00:06:48',NULL,NULL),(92,'0198c0f7-9011-706e-b17f-d1e18106eb83',2,96,1,'2025-01-28 00:06:51',NULL,NULL),(93,'0198c0f7-9013-73dc-98a4-a649ee205ffa',2,97,1,'2025-01-28 00:06:54',NULL,NULL),(94,'0198c0f7-9015-734f-ba60-8a8c2c2b1f9a',2,98,1,'2025-01-28 00:06:57',NULL,NULL),(95,'0198c0f7-9017-72f5-92b0-88b07acf8561',2,99,1,'2025-01-28 00:06:59',NULL,NULL),(96,'0198c0f7-9019-712b-b59e-b98f3337759f',2,100,1,'2025-01-28 00:07:01',NULL,NULL),(97,'0198c0f7-901b-7788-b33b-56243a7e3a2e',2,101,1,'2025-01-28 00:07:04',NULL,NULL),(98,'0198c0f7-901d-71b0-8285-20d9c7ba7b09',2,102,1,'2025-01-28 00:07:06',NULL,NULL),(99,'0198c0f7-901f-769a-87ef-ca4bdd99cde0',2,103,1,'2025-01-28 00:07:08',NULL,NULL),(100,'0198c0f7-9023-7320-8a8f-3556602e6df1',2,104,1,'2025-01-28 00:07:11',NULL,NULL),(101,'0198c0f7-9025-7379-ac28-350d00073252',2,105,1,'2025-01-28 00:07:14',NULL,NULL),(102,'0198c0f7-9028-779b-b63b-ecdf1d1e546c',2,106,1,'2025-01-28 00:07:23',NULL,NULL),(103,'0198c0f7-902b-756c-be96-59ea2cae1f7c',2,107,1,'2025-01-28 00:07:26',NULL,NULL),(104,'0198c0f7-902e-762d-b930-b88e39abcf6c',2,108,1,'2025-01-28 00:07:29',NULL,NULL),(105,'0198c0f7-9031-76de-950b-163e78f576c8',2,109,1,'2025-01-28 00:07:31',NULL,NULL),(106,'0198c0f7-9034-72cb-a516-ee2dcfcb89fb',2,110,1,'2025-01-28 00:07:34',NULL,NULL),(107,'0198c0f7-9036-753c-8992-d58168af09da',2,111,1,'2025-01-28 00:07:37',NULL,NULL),(108,'0198c0f7-9038-75f6-82e2-ef1f43d12e7e',2,112,1,'2025-01-28 00:07:40',NULL,NULL),(109,'0198c0f7-903a-70ea-9e68-6a3fb3f5da59',2,113,1,'2025-01-28 00:07:42',NULL,NULL),(110,'0198c0f7-903c-70aa-acb5-a991b8e54342',2,114,1,'2025-01-28 00:07:45',NULL,NULL),(111,'0198c0f7-903f-701a-88cc-5a47edf9bdb2',2,115,1,'2025-01-28 00:07:47',NULL,NULL),(112,'0198c0f7-9042-764e-947a-f0943bedd0fd',2,116,1,'2025-01-28 00:07:50',NULL,NULL),(113,'0198c0f7-9044-73d8-a273-b069d56c2044',2,117,1,'2025-01-28 00:07:52',NULL,NULL),(114,'0198c0f7-9046-7510-bad2-c08d23ae9b4e',2,118,1,'2025-01-28 00:07:55',NULL,NULL),(115,'0198c0f7-9048-73fb-8d2e-4cd3dd76e753',2,119,1,'2025-01-28 00:07:59',NULL,NULL),(116,'0198c0f7-904b-71d8-bca7-e4fa998b855f',2,120,1,'2025-01-28 00:08:01',NULL,NULL),(117,'0198c0f7-904e-70cf-9604-67438317d271',2,121,1,'2025-01-28 00:08:04',NULL,NULL),(118,'0198c0f7-9050-7389-a0ca-b3a3e6d09a8e',2,122,1,'2025-01-28 00:08:07',NULL,NULL),(119,'0198c0f7-9053-717a-b854-8ca49324a4a8',2,123,1,'2025-01-28 00:08:10',NULL,NULL),(120,'0198c0f7-9055-70e9-8db6-3c97a72b8ec6',2,124,1,'2025-01-28 00:08:14',NULL,NULL),(121,'0198c0f7-9057-709a-9b69-5d9af6c1ce24',2,125,1,'2025-01-28 00:08:17',NULL,NULL),(122,'0198c0f7-9059-744f-ad0c-21cbfe140a73',2,126,1,'2025-01-28 00:08:25',NULL,NULL),(123,'0198c0f7-905b-77a9-bf24-7f389775db2e',2,127,1,'2025-01-28 00:08:29',NULL,NULL),(124,'0198c0f7-905d-7039-979a-b4c53f5ef462',2,128,1,'2025-01-28 00:08:31',NULL,NULL),(125,'0198c0f7-905e-768b-8fa2-aabcfc32c457',2,129,1,'2025-01-28 00:08:34',NULL,NULL),(126,'0198c0f7-9061-749b-bf9d-68aa274c190c',2,130,1,'2025-01-28 00:08:36',NULL,NULL),(127,'0198c0f7-9064-7032-bdbe-dde7b86ae6da',2,131,1,'2025-01-28 00:08:39',NULL,NULL),(128,'0198c0f7-9067-74c9-9b47-a3e7338e31cc',2,132,1,'2025-01-28 00:08:42',NULL,NULL),(129,'0198c0f7-9069-71a5-ac8a-13db8d412775',2,133,1,'2025-01-28 00:08:45',NULL,NULL),(130,'0198c0f7-906b-778f-a6a7-a3e036a83099',2,134,1,'2025-01-28 00:08:47',NULL,NULL),(131,'0198c0f7-906d-7300-b099-17365bf4812c',2,135,1,'2025-01-28 00:08:51',NULL,NULL),(132,'0198c0f7-906f-73dc-bbb2-476b7d91baa0',2,136,1,'2025-01-28 00:08:53',NULL,NULL),(133,'0198c0f7-9071-74cb-bc31-c6d824a12b62',2,137,1,'2025-01-28 00:08:57',NULL,NULL),(134,'0198c0f7-9074-73ac-9ddc-527d1278b11d',2,138,1,'2025-01-28 00:09:00',NULL,NULL),(135,'0198c0f7-9076-70f5-846d-2bc691f887bd',2,139,1,'2025-01-28 00:09:03',NULL,NULL),(136,'0198c0f7-9079-760b-aa0c-a397079f69c9',2,140,1,'2025-01-28 00:09:05',NULL,NULL),(137,'0198c0f7-907b-747f-a39c-8fd5e62cf5c0',2,141,1,'2025-01-28 00:09:07',NULL,NULL),(138,'0198c0f7-907e-7308-b509-3f7b04c0a9b2',2,142,1,'2025-01-28 00:09:11',NULL,NULL),(139,'0198c0f7-9080-753c-a185-65dd8fd0e044',2,143,1,'2025-01-28 00:09:14',NULL,NULL),(140,'0198c0f7-9082-70b2-b670-face48f81c81',2,144,1,'2025-01-28 00:09:17',NULL,NULL),(141,'0198c0f7-9085-70bf-92e9-95aeb6974dde',2,145,1,'2025-01-28 00:09:19',NULL,NULL),(142,'0198c0f7-9087-771c-a5e7-ed68e9b1422d',2,146,1,'2025-01-28 00:09:22',NULL,NULL),(143,'0198c0f7-908b-735d-a15b-b44daa4ed0cd',2,147,1,'2025-01-28 00:09:25',NULL,NULL),(144,'0198c0f7-908d-741c-b6a4-b29c6695d121',2,148,1,'2025-01-28 00:09:27',NULL,NULL),(145,'0198c0f7-9090-7189-ad10-2f3ae5037ff6',2,149,1,'2025-01-28 00:09:29',NULL,NULL),(146,'0198c0f7-9093-74d9-9367-e1d2b3d0428c',2,150,1,'2025-01-28 00:09:33',NULL,NULL),(147,'0198c0f7-9095-72bd-83a8-d55984efa747',2,151,1,'2025-01-28 00:09:35',NULL,NULL),(148,'0198c0f7-9098-7319-876b-ddd0e9c2d90b',2,152,1,'2025-01-28 00:09:40',NULL,NULL),(149,'0198c0f7-909a-728f-834d-4f99c2c99d94',2,153,1,'2025-01-28 00:09:42',NULL,NULL),(150,'0198c0f7-909c-7423-bfe9-a4994e27ee7a',2,154,1,'2025-01-28 00:09:45',NULL,NULL),(151,'0198c0f7-909e-755c-abad-39c4afbe9c2d',2,155,1,'2025-01-28 00:09:47',NULL,NULL),(152,'0198c0f7-90a0-72d8-aab7-f9f15f636ddf',2,156,1,'2025-01-28 00:09:49',NULL,NULL),(153,'0198c0f7-90a2-70df-b912-d554cf49ff01',2,157,1,'2025-01-28 00:09:51',NULL,NULL),(154,'0198c0f7-90a4-710c-98c6-3ffd681fe2c0',2,158,1,'2025-01-28 00:09:53',NULL,NULL),(155,'0198c0f7-90a6-714c-acad-3b21d69d1e2a',2,159,1,'2025-01-28 00:09:55',NULL,NULL),(156,'0198c0f7-90a9-74a3-a11a-74a38df30272',2,160,1,'2025-01-28 00:09:58',NULL,NULL),(157,'0198c0f7-90ab-716a-ac60-37aabed55865',2,161,1,'2025-01-28 00:10:01',NULL,NULL),(158,'0198c0f7-90ae-7391-a342-3ffb3c081bcc',2,162,1,'2025-01-28 00:10:03',NULL,NULL),(163,'0198c0f7-90b0-742a-b95a-b6d674831cc0',2,167,1,'2025-01-28 00:10:17',NULL,NULL),(164,'0198c0f7-90b3-7360-ab5b-46877af6887d',2,168,1,'2025-01-28 00:10:21',NULL,NULL),(165,'0198c0f7-90b6-7109-a5ae-531c51b5a631',2,169,1,'2025-01-28 00:10:25',NULL,NULL),(166,'0198c0f7-90b9-7733-8611-ec26be972814',2,170,1,'2025-01-28 00:10:27',NULL,NULL),(167,'0198c0f7-90bb-75b9-b2fb-d05ccb511eb4',2,171,1,'2025-01-28 00:10:29',NULL,NULL),(168,'0198c0f7-90bd-72ef-8669-bb4f509a3c40',2,172,1,'2025-01-28 00:10:31',NULL,NULL),(169,'0198c0f7-90bf-731f-b3c5-ad8e0d75f90b',2,173,1,'2025-01-28 00:10:35',NULL,NULL),(170,'0198c0f7-90c1-709f-baab-9f3b896e7684',2,174,1,'2025-01-28 00:10:40',NULL,NULL),(171,'0198c0f7-90c3-705e-a697-0908f522c1e7',2,175,1,'2025-01-28 00:10:43',NULL,NULL),(172,'0198c0f7-90c6-775e-ab7c-2bdb646e5cc5',2,176,1,'2025-01-28 00:10:45',NULL,NULL),(173,'0198c0f7-90c9-7779-85d3-9187ad00fb03',2,177,1,'2025-01-28 00:10:48',NULL,NULL),(174,'0198c0f7-90cb-750c-9c19-5b685e76080c',2,178,1,'2025-01-28 00:10:50',NULL,NULL),(175,'0198c0f7-90cd-73a7-91dd-16d8e5b8dbff',2,179,1,'2025-01-28 00:10:53',NULL,NULL),(176,'0198c0f7-90cf-74af-a8b8-d08ebdc4717b',2,180,1,'2025-01-28 00:10:57',NULL,NULL),(177,'0198c0f7-90d2-7272-be69-1730b7f70562',2,181,1,'2025-01-28 00:10:59',NULL,NULL),(178,'0198c0f7-90d4-71da-ac6a-b5f412d73997',2,182,1,'2025-01-28 00:11:01',NULL,NULL),(179,'0198c0f7-90d7-761b-93cc-5c4530e0358a',2,183,1,'2025-01-28 00:11:06',NULL,NULL),(180,'0198c0f7-90d9-76e6-b16e-73cde68d119f',2,184,1,'2025-01-28 00:11:09',NULL,NULL),(181,'0198c0f7-90db-7019-a4cb-e7b793ebd21b',2,185,1,'2025-01-28 00:11:11',NULL,NULL),(182,'0198c0f7-90dd-71f6-9727-d18fa7b7a512',2,187,1,'2025-01-28 00:11:14',NULL,NULL),(183,'0198c0f7-90df-73a8-8428-1ea7f8b542fd',2,186,1,'2025-01-28 00:11:17',NULL,NULL),(184,'0198c0f7-90e1-7111-a4a7-431b1ff05860',2,188,1,'2025-01-28 00:11:19',NULL,NULL),(185,'0198c0f7-90e3-767a-8387-4d279253dde4',2,189,1,'2025-01-28 00:11:22',NULL,NULL),(186,'0198c0f7-90e5-779e-8bbc-0b271401df19',2,190,1,'2025-01-28 00:11:24',NULL,NULL),(187,'0198c0f7-90e8-7167-ad1c-ce7dfd6d2623',2,191,1,'2025-01-28 00:11:26',NULL,NULL),(188,'0198c0f7-90ea-770c-b1e1-7e71ddd551a1',2,192,1,'2025-01-28 00:11:29',NULL,NULL),(189,'0198c0f7-90ec-747c-9d8e-79379cd865e0',2,193,1,'2025-01-28 00:11:31',NULL,NULL),(190,'0198c0f7-90ee-756c-9f02-52e15288cd50',2,194,1,'2025-01-28 00:11:33',NULL,NULL),(191,'0198c0f7-90f0-762c-ac48-e5ce4c133f9e',2,195,1,'2025-01-28 00:11:35',NULL,NULL),(192,'0198c0f7-90f2-75a2-ae96-d21dd6ee71d2',2,196,1,'2025-01-28 00:11:37',NULL,NULL),(193,'0198c0f7-90f4-70e0-b75d-411645052e34',2,197,1,'2025-01-28 00:11:39',NULL,NULL),(194,'0198c0f7-90fa-73cb-aad9-4e6d632372d8',2,198,1,'2025-01-28 00:11:41',NULL,NULL),(195,'0198c0f7-90fe-7480-af69-cb9fb4d3d825',2,199,1,'2025-01-28 00:11:44',NULL,NULL),(196,'0198c0f7-9101-714a-8d6e-24bf3245db1f',2,200,1,'2025-01-28 00:11:54',NULL,NULL),(197,'0198c0f7-9105-7273-93d0-13fdd8cec12b',2,201,1,'2025-01-28 00:11:59',NULL,NULL),(198,'0198c0f7-9108-727b-b070-30cd02ec1251',2,202,1,'2025-01-28 00:12:02',NULL,NULL),(199,'0198c0f7-910c-73fd-91b8-4ddf65da51a3',2,203,1,'2025-01-28 00:12:05',NULL,NULL),(200,'0198c0f7-9110-779e-b755-3d594fb7b5e0',2,204,1,'2025-01-28 00:12:07',NULL,NULL),(201,'0198c0f7-9114-7537-ac9a-34aafe415d40',2,205,1,'2025-01-28 00:12:09',NULL,NULL),(202,'0198c0f7-9116-74cd-8e8f-021020b89e93',2,206,1,'2025-01-28 00:12:14',NULL,NULL),(203,'0198c0f7-9119-73fa-8435-4e11156ebdaa',2,207,1,'2025-01-28 00:12:16',NULL,NULL),(204,'0198c0f7-911d-742c-92c2-c8d8777c4a9b',2,208,1,'2025-01-28 00:12:19',NULL,NULL),(205,'0198c0f7-9120-742e-8e90-c8738dc308ed',2,209,1,'2025-01-28 00:12:21',NULL,NULL),(206,'0198c0f7-9125-754c-9d97-2fcfdbef06e9',2,210,1,'2025-01-28 00:12:24',NULL,NULL),(207,'0198c0f7-9127-74d9-8595-2faf222e207e',2,211,1,'2025-01-28 00:12:27',NULL,NULL),(208,'0198c0f7-912c-72c3-9588-602c440eaa3a',2,212,1,'2025-01-28 00:12:28',NULL,NULL),(209,'0198c0f7-912f-76af-a8d8-8c1436314cbc',2,213,1,'2025-01-28 00:12:31',NULL,NULL),(210,'0198c0f7-9131-77d3-8b25-0f4ef2842a32',2,214,1,'2025-01-28 00:12:34',NULL,NULL),(211,'0198c0f7-9133-7529-a893-07ba38dacf85',2,215,1,'2025-01-28 00:12:36',NULL,NULL),(212,'0198c0f7-9135-7588-82eb-667ee83e6759',2,216,1,'2025-01-28 00:12:38',NULL,NULL),(213,'0198c0f7-9137-7117-b817-6108ee8ed828',2,217,1,'2025-01-28 00:12:42',NULL,NULL),(214,'0198c0f7-9139-71d2-a773-b6f447ae6fcd',2,218,1,'2025-01-28 00:12:46',NULL,NULL),(215,'0198c0f7-913b-7402-bc83-6179369c2294',2,219,1,'2025-01-28 00:12:50',NULL,NULL),(216,'0198c0f7-913e-7717-ae81-9db1a68f6ebc',2,220,1,'2025-01-28 00:12:52',NULL,NULL),(217,'0198c0f7-9140-701e-84e8-c26e6136dc1b',2,221,1,'2025-01-28 00:12:54',NULL,NULL),(218,'0198c0f7-9142-7122-a3f2-6b34d75a82be',2,222,1,'2025-01-28 00:12:56',NULL,NULL),(219,'0198c0f7-9144-7366-a87c-42a1e8685bfa',2,223,1,'2025-01-28 00:12:59',NULL,NULL),(220,'0198c0f7-9146-7133-91fb-ea7cdda97386',2,224,1,'2025-01-28 00:13:01',NULL,NULL),(221,'0198c0f7-9148-71ce-a445-2b3a86caa404',2,225,1,'2025-01-28 00:13:03',NULL,NULL),(222,'0198c0f7-914a-70c8-9b62-122d8936d714',2,226,1,'2025-01-28 00:13:06',NULL,NULL),(223,'0198c0f7-914c-757e-81b4-a149ed2b0acd',2,227,1,'2025-01-28 00:13:08',NULL,NULL),(224,'0198c0f7-914e-741c-851f-f26381f573ae',2,228,1,'2025-01-28 00:13:11',NULL,NULL),(225,'0198c0f7-9151-7518-b57c-146458345d72',2,229,1,'2025-01-28 00:13:13',NULL,NULL),(226,'0198c0f7-9153-732c-9f6b-4def224a0bab',2,230,1,'2025-01-28 00:13:15',NULL,NULL),(227,'0198c0f7-9155-72fd-a070-cbd9e6e84316',2,231,1,'2025-01-28 00:13:18',NULL,NULL),(228,'0198c0f7-9157-7316-b336-b5dd2e7de8d2',2,232,1,'2025-01-28 00:13:20',NULL,NULL),(229,'0198c0f7-9159-759c-bd25-01cfe97d2bee',2,233,1,'2025-01-28 00:13:23',NULL,NULL),(230,'0198c0f7-915c-735b-861e-4a8a26d3347a',2,234,1,'2025-01-28 00:13:25',NULL,NULL),(231,'0198c0f7-915f-7061-8155-9cad523ff314',2,235,1,'2025-01-28 00:13:28',NULL,NULL),(232,'0198c0f7-9162-7635-9fc1-a3a00cbbc046',2,236,1,'2025-01-28 00:13:31',NULL,NULL),(233,'0198c0f7-9164-7580-a627-12a8d1495ccc',2,237,1,'2025-01-28 00:13:38',NULL,NULL),(234,'0198c0f7-9166-77e1-b043-eef688c1691e',2,238,1,'2025-01-28 00:13:41',NULL,NULL),(235,'0198c0f7-9169-73fd-aad3-68667b06e62d',2,239,1,'2025-01-28 00:13:43',NULL,NULL),(236,'0198c0f7-916b-73eb-a960-b84f06925b9e',2,240,1,'2025-01-28 00:13:46',NULL,NULL),(237,'0198c0f7-916e-7719-b329-2d1143d14824',2,241,1,'2025-01-28 00:13:48',NULL,NULL),(238,'0198c0f7-9171-7369-88d6-2b1b7e44392d',2,242,1,'2025-01-28 00:15:46',NULL,NULL),(239,'0198c0f7-9173-7368-b687-8e3092f8736d',2,244,1,'2025-01-28 00:15:49',NULL,NULL),(240,'0198c0f7-9176-717b-8dab-c0d7b49431fd',2,245,1,'2025-01-28 00:15:52',NULL,NULL),(241,'0198c0f7-9179-7009-af6b-0426118d3721',2,246,1,'2025-01-28 00:15:55',NULL,NULL),(242,'0198c0f7-917b-73bb-a2e3-44e01c0ae8a1',2,247,1,'2025-01-28 00:15:57',NULL,NULL),(243,'0198c0f7-917d-748e-b6d8-6b7f01a8d64a',2,248,1,'2025-01-28 00:15:59',NULL,NULL),(244,'0198c0f7-9180-72b8-b317-7c31324708db',2,249,1,'2025-01-28 00:16:02',NULL,NULL),(245,'0198c0f7-9183-7764-9c9f-9c3f8e89cc24',2,250,1,'2025-01-28 00:16:05',NULL,NULL),(246,'0198c0f7-9185-701c-9851-0e943ee5c2a9',2,251,1,'2025-01-28 00:16:07',NULL,NULL),(247,'0198c0f7-9188-719a-9c52-7d2a39f2d5e6',2,252,1,'2025-01-28 00:16:09',NULL,NULL),(248,'0198c0f7-918a-75b8-853c-242a5701dcfb',2,253,1,'2025-01-28 00:16:11',NULL,NULL),(249,'0198c0f7-918c-7359-b4c9-d59e0586ec88',2,254,1,'2025-01-28 00:16:14',NULL,NULL),(250,'0198c0f7-918f-71ac-a06f-1f61f4e2f210',2,255,1,'2025-01-28 00:16:17',NULL,NULL),(252,'0198c0f7-9192-744a-a3ae-f65eebe1d8e9',2,257,1,'2025-01-28 00:16:22',NULL,NULL),(253,'0198c0f7-9194-7234-a117-0a3f36ac06d3',2,258,1,'2025-01-28 00:16:24',NULL,NULL),(254,'0198c0f7-9197-70ef-9a18-5b75a66b125d',2,259,1,'2025-01-28 00:16:26',NULL,NULL),(255,'0198c0f7-9199-77b6-945e-7b71b0f7724d',2,260,1,'2025-01-28 00:16:28',NULL,NULL),(256,'0198c0f7-919b-73ed-b6bd-4697c842838d',2,262,1,'2025-01-28 00:16:30',NULL,NULL),(257,'0198c0f7-919d-75ae-8607-c9d00d32316e',2,261,1,'2025-01-28 00:16:32',NULL,NULL),(258,'0198c0f7-91a0-77ac-8b5c-48c39085bf3e',2,263,1,'2025-01-28 00:16:34',NULL,NULL),(259,'0198c0f7-91a2-71a6-a024-ae8b83f2e543',2,264,1,'2025-01-28 00:16:36',NULL,NULL),(260,'0198c0f7-91a5-75c9-9bb6-753794be4071',2,265,1,'2025-01-28 00:16:38',NULL,NULL),(261,'0198c0f7-91a7-707a-b45b-1e7dc0ff86c2',2,266,1,'2025-01-28 00:16:40',NULL,NULL),(262,'0198c0f7-91a9-7557-9155-94217c824392',2,267,1,'2025-01-28 00:16:44',NULL,NULL),(263,'0198c0f7-91ac-70c4-b934-211e36f71964',2,268,1,'2025-01-28 00:16:46',NULL,NULL),(264,'0198c0f7-91af-72e4-9e90-188a13d10c28',2,269,1,'2025-01-28 00:16:47',NULL,NULL),(265,'0198c0f7-91b1-70d1-8615-19b22b4f6f4f',2,270,1,'2025-01-28 00:16:49',NULL,NULL),(266,'0198c0f7-91b4-747d-b297-81adc83b9de1',2,271,1,'2025-01-28 00:16:56',NULL,NULL),(267,'0198c0f7-91b6-73fd-9d68-df49abad1fbd',2,272,1,'2025-01-28 00:16:59',NULL,NULL),(268,'0198c0f7-91b8-75da-b588-41c9b904c6c5',2,273,1,'2025-01-28 00:17:01',NULL,NULL),(269,'0198c0f7-91ba-709b-a47a-3f919290019d',2,274,1,'2025-01-28 00:17:24',NULL,NULL),(270,'0198c0f7-91bc-742c-9aef-66e0901661ee',2,275,1,'2025-01-28 00:17:27',NULL,NULL),(271,'0198c0f7-91be-747a-bed8-048ba5fce0b6',2,276,1,'2025-01-28 00:17:29',NULL,NULL),(272,'0198c0f7-91c1-7606-a357-166e69db0f89',2,277,1,'2025-01-28 00:17:36',NULL,NULL),(273,'0198c0f7-91c4-755b-a5fd-f4cc32d16dfc',2,278,1,'2025-01-28 00:17:39',NULL,NULL),(274,'0198c0f7-91c6-73e1-9da2-62144b82ae07',2,279,1,'2025-01-28 00:17:41',NULL,NULL),(275,'0198c0f7-91c8-71f2-bc8e-f4d28d230099',2,280,1,'2025-01-28 00:18:00',NULL,NULL),(276,'0198c0f7-91ca-733b-b577-aed59b183ac7',2,281,1,'2025-01-28 00:18:02',NULL,NULL),(277,'0198c0f7-91cc-741a-815e-1ce0bb84b480',2,282,1,'2025-01-28 00:18:04',NULL,NULL),(278,'0198c0f7-91ce-73ef-bc4c-bc5579013345',3,95,1,'2025-01-28 00:34:58',NULL,NULL),(279,'0198c0f7-91d1-77ab-81ff-d69df03f832b',3,96,1,'2025-01-28 00:35:03',NULL,NULL),(280,'0198c0f7-91d4-75c2-96de-ddf7ee69a96b',3,97,1,'2025-01-28 00:35:07',NULL,NULL),(281,'0198c0f7-91d5-7509-9c4d-b9550efc8a92',3,98,1,'2025-01-28 00:35:11',NULL,NULL),(282,'0198c0f7-91d7-701f-9cce-21592d32198b',3,99,1,'2025-01-28 00:35:18',NULL,NULL),(283,'0198c0f7-91d9-7258-97b1-9694cdbd2ada',3,100,1,'2025-01-28 00:35:23',NULL,NULL),(284,'0198c0f7-91db-7392-8701-55ad0f002897',3,101,1,'2025-01-28 00:35:27',NULL,NULL),(285,'0198c0f7-91dd-70c9-900c-2267fb97186f',3,102,1,'2025-01-28 00:35:30',NULL,NULL),(286,'0198c0f7-91df-7409-852b-609613a467d8',3,103,1,'2025-01-28 00:35:32',NULL,NULL),(287,'0198c0f7-91e2-7368-a94b-d8e4e20d92e7',3,104,1,'2025-01-28 00:35:35',NULL,NULL),(288,'0198c0f7-91e4-76f9-83c8-cbb6c3171a69',3,121,1,'2025-01-28 00:35:42',NULL,NULL),(289,'0198c0f7-91e6-7448-94bb-712c159f34f2',3,122,1,'2025-01-28 00:35:45',NULL,NULL),(290,'0198c0f7-91e8-77bc-9158-43b19d83f9c2',3,123,1,'2025-01-28 00:35:47',NULL,NULL),(291,'0198c0f7-91ea-721a-9262-e345beb27e66',3,124,1,'2025-01-28 00:35:49',NULL,NULL),(292,'0198c0f7-91ec-747f-a0fc-70fbc057418f',3,125,1,'2025-01-28 00:35:51',NULL,NULL),(293,'0198c0f7-91ee-7759-8a4f-1a853459c829',3,126,1,'2025-01-28 00:35:53',NULL,NULL),(294,'0198c0f7-91ef-71d8-9ae9-c16ed9179ac9',3,127,1,'2025-01-28 00:35:55',NULL,NULL),(295,'0198c0f7-91f2-70d3-baa5-662e869c97b4',3,128,1,'2025-01-28 00:35:58',NULL,NULL),(296,'0198c0f7-91f4-77df-8933-dff5767b9593',3,129,1,'2025-01-28 00:36:00',NULL,NULL),(297,'0198c0f7-91f6-7062-a2a0-7e2436e7f8fd',3,130,1,'2025-01-28 00:36:04',NULL,NULL),(298,'0198c0f7-91f8-726c-9a71-8a93ad43a8c1',3,131,1,'2025-01-28 00:36:07',NULL,NULL),(299,'0198c0f7-91fa-72cf-aa74-5e034ca9560e',3,111,1,'2025-01-28 00:36:18',NULL,NULL),(300,'0198c0f7-91fc-7497-9545-493ffec2654c',3,112,1,'2025-01-28 00:36:20',NULL,NULL),(301,'0198c0f7-91fe-76c0-b41d-2ae58b22e0ad',3,113,1,'2025-01-28 00:36:22',NULL,NULL),(302,'0198c0f7-9200-768e-9e60-720c0717039a',3,114,1,'2025-01-28 00:36:24',NULL,NULL),(303,'0198c0f7-9203-7238-bb20-9cca608ffdf5',3,115,1,'2025-01-28 00:36:27',NULL,NULL),(304,'0198c0f7-9206-727d-bd65-b18fba61b1d8',3,116,1,'2025-01-28 00:36:29',NULL,NULL),(305,'0198c0f7-9208-7160-ade7-b6249f7de0a1',3,118,1,'2025-01-28 00:36:32',NULL,NULL),(306,'0198c0f7-920a-746e-8e10-49d6c7ba972b',3,117,1,'2025-01-28 00:36:34',NULL,NULL),(307,'0198c0f7-920c-726b-a5e7-33bbfb7bfec7',3,119,1,'2025-01-28 00:36:36',NULL,NULL),(308,'0198c0f7-920f-719f-818d-f654523b528b',3,120,1,'2025-01-28 00:36:38',NULL,NULL),(309,'0198c0f7-9211-77a4-bd6d-12ee056d841c',3,105,1,'2025-01-28 00:36:46',NULL,NULL),(310,'0198c0f7-9214-748a-bf41-a8b83cbf11f1',3,106,1,'2025-01-28 00:36:52',NULL,NULL),(311,'0198c0f7-9216-71f6-8548-b9db876a70de',3,107,1,'2025-01-28 00:36:54',NULL,NULL),(312,'0198c0f7-9219-77cd-aa79-001433d75645',3,108,1,'2025-01-28 00:36:56',NULL,NULL),(313,'0198c0f7-921c-75df-b4cf-02d2b06d4e5c',3,109,1,'2025-01-28 00:36:58',NULL,NULL),(314,'0198c0f7-921e-7459-b5a7-6a6bf6485990',3,110,1,'2025-01-28 00:37:01',NULL,NULL),(315,'0198c0f7-9221-762d-8cb4-840673809846',3,142,1,'2025-01-28 00:37:10',NULL,NULL),(318,'0198c0f7-9223-703c-bcd3-4dbe2806d3ad',3,143,1,'2025-01-28 00:43:25',NULL,NULL),(319,'0198c0f7-9226-76ec-a10b-af372537a702',3,144,1,'2025-01-28 00:43:30',NULL,NULL),(320,'0198c0f7-9228-706b-9bfe-dfe814d1abb7',3,145,1,'2025-01-28 00:43:33',NULL,NULL),(321,'0198c0f7-922a-77ad-82c5-fa89e08738c4',3,146,1,'2025-01-28 00:43:37',NULL,NULL),(322,'0198c0f7-922c-7777-b0a7-486746c57fb0',3,147,1,'2025-01-28 00:43:40',NULL,NULL),(323,'0198c0f7-922e-7328-b58c-68fe446cbb57',3,148,1,'2025-01-28 00:43:43',NULL,NULL),(324,'0198c0f7-9230-70cc-87ee-87f44dfc7dfb',3,149,1,'2025-01-28 00:43:46',NULL,NULL),(325,'0198c0f7-9232-7659-9af0-05ae2c52f154',3,150,1,'2025-01-28 00:43:48',NULL,NULL),(326,'0198c0f7-9234-7621-a4da-3bf15aee7007',3,151,1,'2025-01-28 00:43:51',NULL,NULL),(327,'0198c0f7-9236-74ac-9f54-c58b0faa39ff',3,152,1,'2025-01-28 00:43:53',NULL,NULL),(328,'0198c0f7-923a-719f-8958-fe48f3107698',3,153,1,'2025-01-28 00:44:03',NULL,NULL),(329,'0198c0f7-923c-7159-bfd3-14e50d515772',3,154,1,'2025-01-28 00:44:06',NULL,NULL),(330,'0198c0f7-923e-7166-be44-9f9e995219f8',3,155,1,'2025-01-28 00:44:09',NULL,NULL),(331,'0198c0f7-9240-7319-91bb-988420ff9857',3,156,1,'2025-01-28 00:44:11',NULL,NULL),(332,'0198c0f7-9242-7638-8abf-c3df1369ff33',3,157,1,'2025-01-28 00:44:13',NULL,NULL),(333,'0198c0f7-9245-741b-9510-0b6b67f60035',3,158,1,'2025-01-28 00:44:15',NULL,NULL),(334,'0198c0f7-9247-743b-b852-0a3c5225ff4a',3,159,1,'2025-01-28 00:44:20',NULL,NULL),(335,'0198c0f7-924a-71fa-a899-4909f0532b12',3,160,1,'2025-01-28 00:44:23',NULL,NULL),(336,'0198c0f7-924c-717c-b196-b4ccc4e89276',3,161,1,'2025-01-28 00:44:25',NULL,NULL),(337,'0198c0f7-924e-7777-80c0-63ceb4743257',3,162,1,'2025-01-28 00:44:28',NULL,NULL),(338,'0198c0f7-9250-7509-ad37-c06fcf28aa8a',3,231,1,'2025-01-28 00:45:16',NULL,NULL),(339,'0198c0f7-9252-72fe-b711-aa33489be00c',3,223,1,'2025-01-28 00:45:48',NULL,NULL),(340,'0198c0f7-9255-730c-acd5-d9345d74fdab',3,215,1,'2025-01-28 00:45:53',NULL,NULL),(341,'0198c0f7-9258-72bb-aa37-5cb165ee62af',3,216,1,'2025-01-28 00:45:58',NULL,NULL),(342,'0198c0f7-925a-700d-aff2-f18ade46355e',3,217,1,'2025-01-28 00:46:02',NULL,NULL),(343,'0198c0f7-925c-730e-96d3-d1ee616abcfb',3,219,1,'2025-01-28 00:46:09',NULL,NULL),(344,'0198c0f7-925f-74fe-a977-dc9821a17bc4',3,218,1,'2025-01-28 00:46:12',NULL,NULL),(345,'0198c0f7-9261-7222-898c-15f2057c6bc0',3,220,1,'2025-01-28 00:46:15',NULL,NULL),(346,'0198c0f7-9263-71e1-abb3-8d3290856878',3,221,1,'2025-01-28 00:46:18',NULL,NULL),(347,'0198c0f7-9265-73de-893f-1bcbb1f12959',3,224,1,'2025-01-28 00:47:34',NULL,NULL),(348,'0198c0f7-9268-77ae-84f8-2a6313cc422c',3,234,1,'2025-01-28 00:47:38',NULL,NULL),(349,'0198c0f7-926a-74b4-a78b-20198ab20193',3,222,1,'2025-01-28 00:47:42',NULL,NULL),(350,'0198c0f7-926c-776d-9ebb-2a09ceda2d7f',4,121,1,'2025-01-28 00:48:30',NULL,NULL),(354,'0198c0f7-926e-7125-86e1-0848286e3a46',4,125,1,'2025-01-28 00:48:43',NULL,NULL),(355,'0198c0f7-9270-745a-9dca-5ccd4c3d9ecd',4,126,1,'2025-01-28 00:48:45',NULL,NULL),(356,'0198c0f7-9272-70ee-bbb3-921928d21256',4,127,1,'2025-01-28 00:48:48',NULL,NULL),(357,'0198c0f7-9274-75cc-8a38-edb30996eae8',4,128,1,'2025-01-28 00:48:50',NULL,NULL),(358,'0198c0f7-9277-715e-8c28-a427f42b9f55',4,129,1,'2025-01-28 00:48:52',NULL,NULL),(359,'0198c0f7-9279-767c-a71f-d3e598ff3bb0',4,130,1,'2025-01-28 00:48:56',NULL,NULL),(360,'0198c0f7-927b-734a-a863-682a05ebcbd0',4,131,1,'2025-01-28 00:48:59',NULL,NULL),(361,'0198c0f7-927d-739c-ae17-cc553f9ed52f',4,182,1,'2025-02-05 11:53:18',NULL,NULL),(362,'0198c0f7-927f-7688-883a-eafc53d91024',4,179,1,'2025-02-05 11:53:26',NULL,NULL),(363,'0198c0f7-9281-743e-8386-a5413d17dc9d',4,177,3,'2025-02-05 11:54:55',NULL,NULL),(435,'0198c0f7-9284-766a-807a-d02660f8adc0',2,292,1,'2025-06-17 10:10:06',NULL,NULL),(444,'0198c0f7-9286-761f-aab9-fe141c7d698e',2,26,3,'2025-07-06 02:43:19',NULL,NULL),(446,'0198c0f7-9289-7512-9699-50ccc1a77827',2,5,3,'2025-07-06 02:43:38',NULL,NULL),(447,'0198c0f7-928c-76de-bfdd-10004378ad73',2,283,3,'2025-07-06 02:43:49',NULL,NULL),(448,'0198c0f7-928e-713f-bff2-3e65a403e779',2,284,3,'2025-07-06 02:45:18',NULL,NULL),(449,'0198c0f7-9291-7009-885b-35e78cdff7f0',2,285,3,'2025-07-06 02:46:11',NULL,NULL),(450,'0198c0f7-9293-70b8-aaed-3ebf6c325943',2,287,3,'2025-07-06 02:46:14',NULL,NULL),(451,'0198c0f7-9296-729f-b763-ed92795b6f52',2,286,3,'2025-07-06 02:46:16',NULL,NULL),(452,'0198c0f7-9298-752d-9489-9b9f4c4324df',2,288,3,'2025-07-06 02:46:19',NULL,NULL),(453,'0198c0f7-929b-759a-93ff-a106aa3c0e68',2,289,3,'2025-07-06 02:46:22',NULL,NULL),(454,'0198c0f7-929d-768f-a9c2-8023ec39b9c7',2,290,3,'2025-07-06 02:46:24',NULL,NULL),(455,'0198c0f7-929f-705c-b088-cad9aebe5289',2,291,3,'2025-07-06 02:46:27',NULL,NULL),(456,'0198c0f7-92a2-749c-84d5-31e5fc57f773',2,293,3,'2025-07-06 02:46:30',NULL,NULL),(457,'0198c0f7-92a5-7183-a478-183160e1cd11',2,294,3,'2025-07-06 02:46:33',NULL,NULL),(458,'0198c0f7-92a8-753c-b0fd-261fa55a2828',2,295,3,'2025-07-06 02:46:37',NULL,NULL),(459,'0198c0f7-92ac-7028-a4db-f507b40d1097',2,296,3,'2025-07-06 02:46:39',NULL,NULL),(460,'0198c0f7-92b0-718c-927d-c7df7ed98f15',2,297,3,'2025-07-06 02:46:41',NULL,NULL),(461,'0198c0f7-92b3-77da-9ece-47f3ed175d0a',2,298,3,'2025-07-07 10:59:16',NULL,NULL),(462,'0198c0f7-92b6-76af-b340-2c321358816a',2,299,3,'2025-07-07 10:59:19',NULL,NULL),(463,'0198c0f7-92b9-7063-bf21-fecfcae37f63',2,300,3,'2025-07-07 10:59:22',NULL,NULL),(464,'0198c0f7-92bc-700a-a107-8b403f1e88aa',2,301,3,'2025-07-07 10:59:25',NULL,NULL),(465,'0198c0f7-92bf-758b-b133-0696d35825b3',2,302,3,'2025-07-07 10:59:26',NULL,NULL),(466,'0198c0f7-92c2-715c-bbfe-4ab99cf8a3c9',2,303,3,'2025-07-07 10:59:28',NULL,NULL),(467,'0198c0f7-92c5-70ee-be40-61c354bb13e3',2,304,3,'2025-07-07 10:59:30',NULL,NULL),(468,'0198c0f7-92c8-752a-8244-8d612b9ab7bb',2,305,3,'2025-07-07 10:59:32',NULL,NULL),(469,'0198c0f7-92cc-76c7-a418-11af95ba31d6',2,306,3,'2025-07-07 10:59:34',NULL,NULL),(470,'0198c0f7-92cf-750e-8412-72e9f8539314',2,307,3,'2025-07-07 10:59:36',NULL,NULL),(471,'0198c0f7-92d2-7226-8129-6da6f4b74b9b',2,308,3,'2025-07-07 11:13:18',NULL,NULL),(472,'0198c0f7-92d4-7346-bf1e-18aa8436f734',2,309,3,'2025-07-07 11:13:20',NULL,NULL),(473,'0198c0f7-92d6-704c-aa4d-e2268c669406',2,310,3,'2025-07-07 11:13:22',NULL,NULL),(474,'0198c0f7-92d9-738d-a867-f9e7f53a0f6f',2,311,3,'2025-07-07 11:13:24',NULL,NULL),(475,'0198c0f7-92db-76bf-9c00-9865c308c385',2,312,3,'2025-07-07 11:13:26',NULL,NULL),(476,'0198c0f7-92de-7674-bb77-da2c410d70fd',2,313,3,'2025-07-07 11:13:27',NULL,NULL),(477,'0198c0f7-92e1-76df-9b81-2c3569e3be72',2,314,3,'2025-07-07 11:13:29',NULL,NULL),(478,'0198c0f7-92e4-7774-bd07-a261ba100984',1,1,1,'2025-07-07 00:00:00',NULL,NULL),(479,'0198c0f7-92e7-76ae-b286-af3d051423ac',1,2,1,'2025-07-07 00:00:00',NULL,NULL),(480,'0198c0f7-92ea-7759-aed7-487f4102b83b',1,3,1,'2025-07-07 00:00:00',NULL,NULL),(481,'0198c0f7-92ed-708b-a2f2-88b6dbdb71f3',4,1,3,'2025-07-09 10:18:10',NULL,NULL),(482,'0198c0f7-92f0-748a-86cd-946df2efb248',4,2,3,'2025-07-09 10:27:35',NULL,NULL),(483,'0198c0f7-92f3-7137-973e-4570d910046b',4,3,3,'2025-07-09 10:27:42',NULL,NULL),(484,'0198c0f7-92f6-750c-a5f7-c3a88e6b72fa',4,5,3,'2025-07-09 10:27:44',NULL,NULL),(485,'0198c0f7-92f8-7262-841c-b1a732c55b14',4,4,3,'2025-07-09 10:27:45',NULL,NULL),(496,'0198c0f7-9317-71b3-ab93-a388f0df2226',2,27,3,'2025-07-16 11:02:55',NULL,NULL),(497,'0198c0f7-931a-75f7-99cc-66d90e4dcd7e',2,28,3,'2025-07-16 11:02:58',NULL,NULL),(498,'0198c0f7-931d-72cb-b1fe-6f1d6d1dba3f',1,1,1,'2025-08-11 14:13:38',NULL,NULL),(499,'0198c0f7-931f-7493-9338-48fe1fe32ad7',1,2,1,'2025-08-11 14:13:38',NULL,NULL),(500,'0198c0f7-9321-73b4-abaa-47718dd01e4b',1,1,1,'2025-08-11 14:16:56',NULL,NULL),(501,'0198c0f7-9323-769a-9684-8ae4f2399c1f',1,2,1,'2025-08-11 14:16:56',NULL,NULL),(502,'0198c0f7-9325-7210-962d-a2eeee4af183',1,1,1,'2025-08-11 14:23:46',NULL,NULL),(503,'0198c0f7-9327-7291-bdd1-70f1311ffa89',1,2,1,'2025-08-11 14:23:46',NULL,NULL);
/*!40000 ALTER TABLE `msx_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `msx_role`
--

DROP TABLE IF EXISTS `msx_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msx_role` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(255) NOT NULL,
  `TenantId` int NOT NULL,
  `RecNumber` varchar(50) DEFAULT NULL,
  `Name` varchar(100) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `IsDefault` tinyint NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `User1_Role_idx` (`CreatedBy`),
  KEY `User2_Role_idx` (`UpdatedBy`),
  KEY `Company_Role_idx` (`TenantId`),
  CONSTRAINT `Tenant_Role` FOREIGN KEY (`TenantId`) REFERENCES `ax_tenant` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User1_Role` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_Role` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=222 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msx_role`
--

LOCK TABLES `msx_role` WRITE;
/*!40000 ALTER TABLE `msx_role` DISABLE KEYS */;
INSERT INTO `msx_role` VALUES (1,'01978c42-bf6c-71bd-a917-cc22ab3dc89f',1,'00000001','Superuser','POS Superuser',0,1,'2025-01-02 10:45:36',NULL,NULL),(2,'01978c75-fbe8-762b-a877-114bba252175',1,'00000002','Administrator','An administrator is responsible for managing and coordinating administrative tasks within an organization.',0,1,'2025-01-21 09:11:48',NULL,NULL),(3,'019796b8-7488-741b-9bd7-07e2cd2663b2',1,'00000003','Cashier',' a personnel who processes sales transactions and keeps the business running accordingly while gaining valuable client service skills. He/she receives cash, checks, and credit cards from customers in exchange for goods and services.',0,1,'2025-01-21 09:12:15',NULL,NULL),(4,'019796c5-eaa6-7507-88bb-053e3c69e112',1,'00000004','Teller','acts as the customer representative of a store and is responsible for the accurate and safe handling of routine store transactions.',0,1,'2025-01-21 09:12:56',NULL,NULL);
/*!40000 ALTER TABLE `msx_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `msx_supplier`
--

DROP TABLE IF EXISTS `msx_supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msx_supplier` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(255) NOT NULL,
  `TenantId` int NOT NULL,
  `RecNumber` varchar(50) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `ContactNumber` varchar(50) DEFAULT NULL,
  `TermId` int NOT NULL,
  `TIN` varchar(50) DEFAULT NULL,
  `AccountId` int NOT NULL,
  `CreatedBy` int NOT NULL,
  `IsDefault` tinyint NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `SupplierAccount_idx` (`AccountId`),
  KEY `Term_Supplier_idx` (`TermId`),
  KEY `User2_Supplier_idx` (`UpdatedBy`),
  KEY `User1_Supplier_idx` (`CreatedBy`),
  KEY `Company_Supplier_idx` (`TenantId`),
  CONSTRAINT `Account_Supplier` FOREIGN KEY (`AccountId`) REFERENCES `msx_account` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `Tenant_Supplier` FOREIGN KEY (`TenantId`) REFERENCES `ax_tenant` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Term_Supplier` FOREIGN KEY (`TermId`) REFERENCES `ax_term` (`Id`),
  CONSTRAINT `User1_Supplier` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_Supplier` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=365 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msx_supplier`
--

LOCK TABLES `msx_supplier` WRITE;
/*!40000 ALTER TABLE `msx_supplier` DISABLE KEYS */;
INSERT INTO `msx_supplier` VALUES (1,'01978c42-bf6c-71bd-a917-cc22ab3dc89f',1,'00000001','Return from Customer',NULL,'NA',6,NULL,9,1,0,'2025-01-09 13:33:15',NULL,NULL);
/*!40000 ALTER TABLE `msx_supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `msx_table`
--

DROP TABLE IF EXISTS `msx_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msx_table` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `TableGroupId` int NOT NULL,
  `TableNumber` varchar(100) NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `TableGroup_Table_idx` (`TableGroupId`),
  KEY `User1_Table_idx` (`CreatedBy`),
  KEY `User2_Table_idx` (`UpdatedBy`),
  CONSTRAINT `TableGroup_Table` FOREIGN KEY (`TableGroupId`) REFERENCES `msx_table_group` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User1_Table` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_Table` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_table` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=210 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msx_table`
--

LOCK TABLES `msx_table` WRITE;
/*!40000 ALTER TABLE `msx_table` DISABLE KEYS */;
INSERT INTO `msx_table` VALUES (1,'0198c0f8-8dc5-77ed-b9f4-ead3a47f23f5',2,'Walk In',1,'2025-02-28 00:00:00',3,'2025-07-08 16:49:45'),(2,'0198c0f8-8dcb-7658-ac51-a62aa3237477',2,'Delivery',1,'2025-02-28 00:00:00',NULL,NULL),(3,'0198c0f8-8dcf-75e9-841a-fd1a8e594ebd',2,'Dine In',1,'2025-02-28 00:00:00',NULL,NULL),(4,'0198c0f8-8dd2-7502-8b32-895e8b20a611',2,'Table 01',1,'2025-02-28 00:00:00',NULL,NULL),(5,'0198c0f8-8dd5-76bb-84db-d7bb53ed465b',2,'Table 02',1,'2025-02-28 00:00:00',NULL,NULL),(6,'0198c0f8-8dd7-7675-9a70-6947d6008150',2,'Table 03',1,'2025-02-28 00:00:00',NULL,NULL),(7,'0198c0f8-8dda-71f9-b6d9-7828a2564173',2,'Table 04',1,'2025-02-28 00:00:00',NULL,NULL),(8,'0198c0f8-8ddd-7059-9a02-0dd8ac6c18b7',2,'Table 05',1,'2025-02-28 00:00:00',NULL,NULL),(9,'0198c0f8-8de0-754d-8583-2fa0747f2fa0',2,'Table 06',1,'2025-02-28 00:00:00',NULL,NULL),(10,'0198c0f8-8de2-70ef-ade8-111b91761a13',2,'Table 07',1,'2025-02-28 00:00:00',NULL,NULL),(11,'0198c0f8-8de5-749e-80eb-b57bae62092a',2,'Table 08',1,'2025-02-28 00:00:00',NULL,NULL),(12,'0198c0f8-8de7-71ae-bcb5-6bd77f319c51',2,'Table 09',1,'2025-02-28 00:00:00',NULL,NULL),(13,'0198c0f8-8dea-70e9-9ba0-344d92b587bb',2,'Table 10',1,'2025-02-28 00:00:00',NULL,NULL),(14,'0198c0f8-8ded-7590-b59b-a43a36e1460c',2,'Table 11',1,'2025-02-28 00:00:00',NULL,NULL),(15,'0198c0f8-8def-739d-b3ee-a14ebb3a29ee',2,'Table 12',1,'2025-02-28 00:00:00',NULL,NULL),(16,'0198c0f8-8df2-7219-bbc6-6ed7e9bab263',2,'Table 13',1,'2025-02-28 00:00:00',NULL,NULL),(17,'0198c0f8-8df6-763a-9ae0-1f22de7adc07',2,'Table 14',1,'2025-02-28 00:00:00',NULL,NULL),(18,'0198c0f8-8df9-77e0-9b0e-8cc20ec60842',2,'Table 15',1,'2025-02-28 00:00:00',NULL,NULL),(19,'0198c0f8-8dfc-731f-97d4-95c52c68ae0f',2,'Table 16',1,'2025-02-28 00:00:00',NULL,NULL),(20,'0198c0f8-8dfe-7550-b1df-23f59a77eebe',2,'Table 17',1,'2025-02-28 00:00:00',NULL,NULL),(21,'0198c0f8-8e00-7163-bccf-4d5979458111',2,'Table 18',1,'2025-02-28 00:00:00',NULL,NULL),(22,'0198c0f8-8e03-774e-a022-cdfb337cc97c',2,'Table 19',1,'2025-02-28 00:00:00',NULL,NULL),(23,'0198c0f8-8e06-75cf-93ba-61f5104e0d7a',2,'Table 20',1,'2025-02-28 00:00:00',NULL,NULL),(24,'0198c0f8-8e08-72ae-9507-e0e56682a0d9',2,'Table 21',1,'2025-02-28 00:00:00',NULL,NULL),(25,'0198c0f8-8e0b-76d7-b98f-028c70e73b2e',2,'Table 22',1,'2025-02-28 00:00:00',NULL,NULL),(26,'0198c0f8-8e0d-7260-8475-053629faca3b',2,'Table 23',1,'2025-02-28 00:00:00',NULL,NULL),(27,'0198c0f8-8e0f-7430-a821-05e0dc6d1c26',2,'Table 24',1,'2025-02-28 00:00:00',NULL,NULL),(28,'0198c0f8-8e12-70af-8b4a-56186e48a020',2,'Table 25',1,'2025-02-28 00:00:00',NULL,NULL),(29,'0198c0f8-8e16-712d-b135-d508cb13c9d5',2,'Table 26',1,'2025-02-28 00:00:00',NULL,NULL),(30,'0198c0f8-8e18-73da-8312-275a0b5d19f3',2,'Table 27',1,'2025-02-28 00:00:00',NULL,NULL),(31,'0198c0f8-8e1b-73d9-83b7-910768bd7fb8',2,'Table 28',1,'2025-02-28 00:00:00',NULL,NULL),(32,'0198c0f8-8e1e-770a-bea4-47fa3726b2b8',2,'Table 29',1,'2025-02-28 00:00:00',NULL,NULL),(33,'0198c0f8-8e21-772c-9eca-fef80c148870',2,'Table 3022',1,'2025-02-28 00:00:00',3,'2025-07-08 16:49:01'),(38,'0198c0f8-8e23-72fb-9a6a-629304e6ee75',2,'33',3,'2025-07-09 09:06:21',NULL,NULL),(40,'0198c0f8-8e26-73cc-8bdc-aa0d71e26f78',1,'test33',3,'2025-07-18 08:34:03',3,'2025-07-18 08:40:59'),(42,'0198c0f8-8e28-76d6-88ad-5fdfb79c494a',2,'Table01',1,'2025-07-28 16:32:56',NULL,NULL),(43,'0198c0f8-8e2a-7622-891f-0bb5a5b01fc9',2,'Table02',1,'2025-07-28 16:32:56',NULL,NULL),(44,'0198c0f8-8e2d-74ec-b727-a2098b0f5d1e',2,'Table03',1,'2025-07-28 16:32:56',NULL,NULL),(45,'0198c0f8-8e2f-722e-bcca-cc6fa4956cfa',2,'Table04',1,'2025-07-28 16:32:56',NULL,NULL),(46,'0198c0f8-8e31-774b-ab9e-a811e9b46763',2,'Table05',1,'2025-07-28 16:32:56',NULL,NULL),(47,'0198c0f8-8e33-707c-92c4-ac20bd62b28b',2,'Table06',1,'2025-07-28 16:32:56',NULL,NULL),(48,'0198c0f8-8e35-7349-8fcd-315276ee260b',2,'Table07',1,'2025-07-28 16:32:56',NULL,NULL),(49,'0198c0f8-8e38-758f-a7df-75409360374e',2,'Table08',1,'2025-07-28 16:32:56',NULL,NULL),(50,'0198c0f8-8e3b-739f-a5fa-f0f11fecc873',2,'Table09',1,'2025-07-28 16:32:56',NULL,NULL),(51,'0198c0f8-8e3d-768b-840f-2521bcdab0de',2,'Table10',1,'2025-07-28 16:32:56',NULL,NULL),(52,'0198c0f8-8e3f-7268-8bd0-5f4be113da02',2,'Table11',1,'2025-07-28 16:32:56',NULL,NULL),(53,'0198c0f8-8e40-72f9-9fa8-3bcb30097b05',2,'Table12',1,'2025-07-28 16:32:56',NULL,NULL),(54,'0198c0f8-8e42-76cd-92eb-8c8e13fed404',2,'Table13',1,'2025-07-28 16:32:56',NULL,NULL),(55,'0198c0f8-8e44-72ac-9658-5501ccc92c6b',2,'Table14',1,'2025-07-28 16:32:56',NULL,NULL),(56,'0198c0f8-8e47-771f-93e7-4ed21df0b62e',2,'Table15',1,'2025-07-28 16:32:56',NULL,NULL),(57,'0198c0f8-8e49-7108-9e64-89d38be892b4',2,'Table16',1,'2025-07-28 16:32:56',NULL,NULL),(58,'0198c0f8-8e4b-748d-8abc-ced8510b4777',2,'Table17',1,'2025-07-28 16:32:56',NULL,NULL),(59,'0198c0f8-8e4d-7308-96a6-ce3d5c33e04f',2,'Table18',1,'2025-07-28 16:32:56',NULL,NULL),(60,'0198c0f8-8e4f-713f-ba16-f367d8eb62b7',2,'Table19',1,'2025-07-28 16:32:56',NULL,NULL),(61,'0198c0f8-8e51-746c-bce1-3c54ad151803',2,'Table20',1,'2025-07-28 16:32:56',NULL,NULL),(62,'0198c0f8-8e53-754a-bdea-0e231e001221',2,'Table21',1,'2025-07-28 16:32:56',NULL,NULL),(63,'0198c0f8-8e55-749b-9f84-8cdd14148c01',2,'Table22',1,'2025-07-28 16:32:56',NULL,NULL),(64,'0198c0f8-8e57-75df-aef4-6945bb887469',2,'Table23',1,'2025-07-28 16:32:56',NULL,NULL),(65,'0198c0f8-8e59-70e1-9885-343fbc082426',2,'Table24',1,'2025-07-28 16:32:56',NULL,NULL),(66,'0198c0f8-8e5c-77e2-8698-8e47a5e1f29d',2,'Table01',1,'2025-07-28 16:33:30',NULL,NULL),(67,'0198c0f8-8e5e-774e-9558-7d2a0ab8e415',2,'Table02',1,'2025-07-28 16:33:30',NULL,NULL),(68,'0198c0f8-8e60-755b-a7cd-ae43c205f404',2,'Table03',1,'2025-07-28 16:33:30',NULL,NULL),(69,'0198c0f8-8e62-77bb-ac45-94a62ede0f9f',2,'Table04',1,'2025-07-28 16:33:30',NULL,NULL),(70,'0198c0f8-8e64-7408-964c-9bcbb99dcb81',2,'Table05',1,'2025-07-28 16:33:30',NULL,NULL),(71,'0198c0f8-8e66-7634-a8db-978572a937f8',2,'Table06',1,'2025-07-28 16:33:30',NULL,NULL),(72,'0198c0f8-8e69-74b9-ab39-c2c149099b26',2,'Table07',1,'2025-07-28 16:33:30',NULL,NULL),(73,'0198c0f8-8e6b-7790-a25b-67d88baa02bd',2,'Table08',1,'2025-07-28 16:33:30',NULL,NULL),(74,'0198c0f8-8e6d-70c8-a85d-ebe520943cad',2,'Table09',1,'2025-07-28 16:33:30',NULL,NULL),(75,'0198c0f8-8e6f-70fc-9d8c-385d16813678',2,'Table10',1,'2025-07-28 16:33:30',NULL,NULL),(76,'0198c0f8-8e71-72a6-93b4-7977cb74bbd0',2,'Table11',1,'2025-07-28 16:33:30',NULL,NULL),(77,'0198c0f8-8e73-76df-b44c-a665cd326378',2,'Table12',1,'2025-07-28 16:33:30',NULL,NULL),(78,'0198c0f8-8e76-72b5-82ea-b7d45cb93d64',2,'Table13',1,'2025-07-28 16:33:30',NULL,NULL),(79,'0198c0f8-8e78-71be-8bf5-9ddc10a40fb9',2,'Table14',1,'2025-07-28 16:33:30',NULL,NULL),(80,'0198c0f8-8e7a-7187-892d-410c837ed669',2,'Table15',1,'2025-07-28 16:33:30',NULL,NULL),(81,'0198c0f8-8e7c-77ca-aae4-27934cf3830c',2,'Table16',1,'2025-07-28 16:33:30',NULL,NULL),(82,'0198c0f8-8e7e-737e-b945-67eefaca70f0',2,'Table17',1,'2025-07-28 16:33:30',NULL,NULL),(83,'0198c0f8-8e80-7104-8e7c-9f12681e3409',2,'Table18',1,'2025-07-28 16:33:30',NULL,NULL),(84,'0198c0f8-8e82-756d-90ce-f90d861541ed',2,'Table19',1,'2025-07-28 16:33:30',NULL,NULL),(85,'0198c0f8-8e84-73d9-8939-b6a61842025e',2,'Table20',1,'2025-07-28 16:33:30',NULL,NULL),(86,'0198c0f8-8e86-70ed-9149-188d34bc83f2',2,'Table21',1,'2025-07-28 16:33:30',NULL,NULL),(87,'0198c0f8-8e88-75c3-9caf-577375aaa883',2,'Table22',1,'2025-07-28 16:33:30',NULL,NULL),(88,'0198c0f8-8e8b-7747-8ff5-defebe1b8c71',2,'Table23',1,'2025-07-28 16:33:30',NULL,NULL),(89,'0198c0f8-8e8d-76b7-97ae-224b0fd29e3c',2,'Table24',1,'2025-07-28 16:33:30',NULL,NULL),(90,'0198c0f8-8e8f-756f-82fd-60303e78903f',2,'Table01',1,'2025-07-28 16:33:32',NULL,NULL),(91,'0198c0f8-8e92-7656-8836-e51b627226a0',2,'Table02',1,'2025-07-28 16:33:32',NULL,NULL),(92,'0198c0f8-8e94-7647-a65d-7c5b4c255508',2,'Table03',1,'2025-07-28 16:33:32',NULL,NULL),(93,'0198c0f8-8e96-774a-a375-cf287cf6eb11',2,'Table04',1,'2025-07-28 16:33:32',NULL,NULL),(94,'0198c0f8-8e98-711d-a36f-97bba20523ba',2,'Table05',1,'2025-07-28 16:33:32',NULL,NULL),(95,'0198c0f8-8e9a-7476-a440-fe484514c6f1',2,'Table06',1,'2025-07-28 16:33:32',NULL,NULL),(96,'0198c0f8-8e9d-77f4-8993-a87802c8fd9f',2,'Table07',1,'2025-07-28 16:33:32',NULL,NULL),(97,'0198c0f8-8e9f-779e-8e78-6721abc926df',2,'Table08',1,'2025-07-28 16:33:32',NULL,NULL),(98,'0198c0f8-8ea0-7514-8216-c1c010083796',2,'Table09',1,'2025-07-28 16:33:32',NULL,NULL),(99,'0198c0f8-8ea2-73b5-bc53-4bc4929129a2',2,'Table10',1,'2025-07-28 16:33:32',NULL,NULL),(100,'0198c0f8-8ea4-72b8-bbf5-713f798e4883',2,'Table11',1,'2025-07-28 16:33:32',NULL,NULL),(101,'0198c0f8-8ea6-74ca-bdf2-909bcd432b98',2,'Table12',1,'2025-07-28 16:33:32',NULL,NULL),(102,'0198c0f8-8ea8-74f1-bf84-689e293e5b14',2,'Table13',1,'2025-07-28 16:33:32',NULL,NULL),(103,'0198c0f8-8eaa-70b1-85b0-f4ae2335cc13',2,'Table14',1,'2025-07-28 16:33:32',NULL,NULL),(104,'0198c0f8-8ead-7675-b10d-8148a4ca3436',2,'Table15',1,'2025-07-28 16:33:32',NULL,NULL),(105,'0198c0f8-8eaf-70dd-b816-58e31b0f9274',2,'Table16',1,'2025-07-28 16:33:32',NULL,NULL),(106,'0198c0f8-8eb1-756e-a0ab-977e33f62dba',2,'Table17',1,'2025-07-28 16:33:32',NULL,NULL),(107,'0198c0f8-8eb3-773b-8783-e2fe83c49215',2,'Table18',1,'2025-07-28 16:33:32',NULL,NULL),(108,'0198c0f8-8eb5-72aa-8115-0f09635f1f3a',2,'Table19',1,'2025-07-28 16:33:32',NULL,NULL),(109,'0198c0f8-8eb7-7549-b6a4-7f565d5ea667',2,'Table20',1,'2025-07-28 16:33:32',NULL,NULL),(110,'0198c0f8-8eb9-736a-b843-e184fd6f701f',2,'Table21',1,'2025-07-28 16:33:32',NULL,NULL),(111,'0198c0f8-8ebc-764a-932d-8d6cc0318a93',2,'Table22',1,'2025-07-28 16:33:32',NULL,NULL),(112,'0198c0f8-8ebe-7763-b095-1a5b00563436',2,'Table23',1,'2025-07-28 16:33:32',NULL,NULL),(113,'0198c0f8-8ec0-7620-a180-db3c71453c72',2,'Table24',1,'2025-07-28 16:33:32',NULL,NULL),(114,'0198c0f8-8ec2-77fb-b1d1-d2b86b9d723c',2,'Table01',1,'2025-07-28 16:33:32',NULL,NULL),(115,'0198c0f8-8ec5-7545-87d7-cddb0c613f92',2,'Table02',1,'2025-07-28 16:33:32',NULL,NULL),(116,'0198c0f8-8ec7-736e-9785-4dee39bc1cca',2,'Table03',1,'2025-07-28 16:33:32',NULL,NULL),(117,'0198c0f8-8ec9-7065-8c45-f94418134af9',2,'Table04',1,'2025-07-28 16:33:32',NULL,NULL),(118,'0198c0f8-8ecb-702a-9ea9-f549d5eb2f44',2,'Table05',1,'2025-07-28 16:33:32',NULL,NULL),(119,'0198c0f8-8ece-70f8-93e1-2233c2587d74',2,'Table06',1,'2025-07-28 16:33:32',NULL,NULL),(120,'0198c0f8-8ed0-70e7-8b7e-f151f6b0f126',2,'Table07',1,'2025-07-28 16:33:32',NULL,NULL),(121,'0198c0f8-8ed2-7559-b1f5-7126e1d06a44',2,'Table08',1,'2025-07-28 16:33:32',NULL,NULL),(122,'0198c0f8-8ed4-715c-9225-01cb64b27994',2,'Table09',1,'2025-07-28 16:33:32',NULL,NULL),(123,'0198c0f8-8ed5-73ff-8d57-9293966ea935',2,'Table10',1,'2025-07-28 16:33:32',NULL,NULL),(124,'0198c0f8-8ed7-71d7-877e-1b2250ddd105',2,'Table11',1,'2025-07-28 16:33:32',NULL,NULL),(125,'0198c0f8-8ed9-71cd-8d94-497c4a80e504',2,'Table12',1,'2025-07-28 16:33:32',NULL,NULL),(126,'0198c0f8-8edc-764e-8de1-616084ea69a4',2,'Table13',1,'2025-07-28 16:33:32',NULL,NULL),(127,'0198c0f8-8ede-7241-a844-e84eb83670f8',2,'Table14',1,'2025-07-28 16:33:32',NULL,NULL),(128,'0198c0f8-8ee0-7268-ae9b-17dd861231e3',2,'Table15',1,'2025-07-28 16:33:32',NULL,NULL),(129,'0198c0f8-8ee2-73ea-a50c-e21e3784b0d7',2,'Table16',1,'2025-07-28 16:33:32',NULL,NULL),(130,'0198c0f8-8ee5-712b-a5e7-1f5480815acb',2,'Table17',1,'2025-07-28 16:33:32',NULL,NULL),(131,'0198c0f8-8ee7-7599-a0c7-dbcab5609931',2,'Table18',1,'2025-07-28 16:33:32',NULL,NULL),(132,'0198c0f8-8eea-773f-bff1-ab92797d5d29',2,'Table19',1,'2025-07-28 16:33:32',NULL,NULL),(133,'0198c0f8-8eec-7708-a987-d56789f4a565',2,'Table20',1,'2025-07-28 16:33:32',NULL,NULL),(134,'0198c0f8-8eef-75f9-a3ca-4ecffe984a10',2,'Table21',1,'2025-07-28 16:33:32',NULL,NULL),(135,'0198c0f8-8ef2-71ac-80fa-73a07425d720',2,'Table22',1,'2025-07-28 16:33:32',NULL,NULL),(136,'0198c0f8-8ef4-7418-a44a-912b3b6606d0',2,'Table23',1,'2025-07-28 16:33:32',NULL,NULL),(137,'0198c0f8-8ef7-725e-ba3e-87cf0c8aa22d',2,'Table24',1,'2025-07-28 16:33:32',NULL,NULL),(138,'0198c0f8-8ef9-779e-942d-f07906ba8fe5',2,'Table01',1,'2025-07-28 16:33:37',NULL,NULL),(139,'0198c0f8-8efb-718f-8bc5-e72ad0eed901',2,'Table02',1,'2025-07-28 16:33:37',NULL,NULL),(140,'0198c0f8-8f03-70c2-8215-9d86fb517a23',2,'Table03',1,'2025-07-28 16:33:37',NULL,NULL),(141,'0198c0f8-8f05-70d6-8cda-0bff96ebfb49',2,'Table04',1,'2025-07-28 16:33:37',NULL,NULL),(142,'0198c0f8-8f08-7639-bd44-575568c04265',2,'Table05',1,'2025-07-28 16:33:37',NULL,NULL),(143,'0198c0f8-8f0a-721b-82cc-cd13440520cf',2,'Table06',1,'2025-07-28 16:33:37',NULL,NULL),(144,'0198c0f8-8f0c-7471-95cc-4bb1d6cec891',2,'Table07',1,'2025-07-28 16:33:37',NULL,NULL),(145,'0198c0f8-8f0e-750c-83f4-5f21cc3df216',2,'Table08',1,'2025-07-28 16:33:37',NULL,NULL),(146,'0198c0f8-8f10-743d-859a-a87a1cf858e1',2,'Table09',1,'2025-07-28 16:33:37',NULL,NULL),(147,'0198c0f8-8f12-721b-bce2-a31db67cf5e8',2,'Table10',1,'2025-07-28 16:33:37',NULL,NULL),(148,'0198c0f8-8f14-75a8-8032-5bcd58cbbacf',2,'Table11',1,'2025-07-28 16:33:37',NULL,NULL),(149,'0198c0f8-8f16-75ce-9e01-b45f5d84b006',2,'Table12',1,'2025-07-28 16:33:37',NULL,NULL),(150,'0198c0f8-8f18-75ef-89d9-79dfc9653ca4',2,'Table13',1,'2025-07-28 16:33:37',NULL,NULL),(151,'0198c0f8-8f1b-7709-9afa-33ce33a9ed02',2,'Table14',1,'2025-07-28 16:33:37',NULL,NULL),(152,'0198c0f8-8f1d-72d5-ad2d-9ec26e41b7fe',2,'Table15',1,'2025-07-28 16:33:37',NULL,NULL),(153,'0198c0f8-8f20-737f-bb48-165d51054396',2,'Table16',1,'2025-07-28 16:33:37',NULL,NULL),(154,'0198c0f8-8f22-7290-bcc4-8a155df64ec7',2,'Table17',1,'2025-07-28 16:33:37',NULL,NULL),(155,'0198c0f8-8f25-7402-9511-af7bcd5915a7',2,'Table18',1,'2025-07-28 16:33:37',NULL,NULL),(156,'0198c0f8-8f28-73ad-9d9e-cfaac2ddf345',2,'Table19',1,'2025-07-28 16:33:37',NULL,NULL),(157,'0198c0f8-8f29-753a-b618-4a2efd54f94f',2,'Table20',1,'2025-07-28 16:33:37',NULL,NULL),(158,'0198c0f8-8f2b-772d-bfa6-1be523cdf416',2,'Table21',1,'2025-07-28 16:33:37',NULL,NULL),(159,'0198c0f8-8f2d-7332-b8ad-ffe29cb44428',2,'Table22',1,'2025-07-28 16:33:37',NULL,NULL),(160,'0198c0f8-8f30-753d-9b02-cd13d0f44155',2,'Table23',1,'2025-07-28 16:33:37',NULL,NULL),(161,'0198c0f8-8f33-76ed-a2cc-b42478da65a8',2,'Table24',1,'2025-07-28 16:33:37',NULL,NULL),(162,'0198c0f8-8f35-77ed-ae3e-f36e57d12065',2,'Table01',1,'2025-07-28 16:33:38',NULL,NULL),(163,'0198c0f8-8f38-70ea-85eb-e3acfd502b72',2,'Table02',1,'2025-07-28 16:33:38',NULL,NULL),(164,'0198c0f8-8f3b-77b8-8e68-100d022d61b4',2,'Table03',1,'2025-07-28 16:33:38',NULL,NULL),(165,'0198c0f8-8f3f-778a-864c-389f2253206e',2,'Table04',1,'2025-07-28 16:33:38',NULL,NULL),(166,'0198c0f8-8f43-70fe-91d5-95e6c2ee370c',2,'Table05',1,'2025-07-28 16:33:38',NULL,NULL),(167,'0198c0f8-8f47-7522-afd6-d58bab250407',2,'Table06',1,'2025-07-28 16:33:38',NULL,NULL),(168,'0198c0f8-8f4b-773f-8b0a-500cf12fcb84',2,'Table07',1,'2025-07-28 16:33:38',NULL,NULL),(169,'0198c0f8-8f4e-7188-b594-75dde354ffa4',2,'Table08',1,'2025-07-28 16:33:38',NULL,NULL),(170,'0198c0f8-8f52-775d-a0ad-60193e8772ac',2,'Table09',1,'2025-07-28 16:33:38',NULL,NULL),(171,'0198c0f8-8f56-71fc-a57c-7540dd1eb258',2,'Table10',1,'2025-07-28 16:33:38',NULL,NULL),(172,'0198c0f8-8f59-742a-82cf-bcc13e50a44b',2,'Table11',1,'2025-07-28 16:33:38',NULL,NULL),(173,'0198c0f8-8f5d-745e-99cd-0bea1f675c6d',2,'Table12',1,'2025-07-28 16:33:38',NULL,NULL),(174,'0198c0f8-8f60-77fa-9121-1ef87fe90c6c',2,'Table13',1,'2025-07-28 16:33:38',NULL,NULL),(175,'0198c0f8-8f63-711d-ae9c-b97bb4cdf4a0',2,'Table14',1,'2025-07-28 16:33:38',NULL,NULL),(176,'0198c0f8-8f67-73dc-b253-093877199099',2,'Table15',1,'2025-07-28 16:33:38',NULL,NULL),(177,'0198c0f8-8f6a-71d1-9475-dc1acf92c300',2,'Table16',1,'2025-07-28 16:33:38',NULL,NULL),(178,'0198c0f8-8f6d-736c-9680-c91a3f0a26f2',2,'Table17',1,'2025-07-28 16:33:38',NULL,NULL),(179,'0198c0f8-8f6f-71c4-9850-a4b32d661322',2,'Table18',1,'2025-07-28 16:33:38',NULL,NULL),(180,'0198c0f8-8f73-718c-ba82-9a7af1629c4d',2,'Table19',1,'2025-07-28 16:33:38',NULL,NULL),(181,'0198c0f8-8f76-7460-a246-34c69b04e575',2,'Table20',1,'2025-07-28 16:33:38',NULL,NULL),(182,'0198c0f8-8f7a-709b-9c15-fb6c78652c74',2,'Table21',1,'2025-07-28 16:33:38',NULL,NULL),(183,'0198c0f8-8f7d-71f3-8c69-cb7539d5746a',2,'Table22',1,'2025-07-28 16:33:38',NULL,NULL),(184,'0198c0f8-8f80-703e-b7a2-3748bb15536a',2,'Table23',1,'2025-07-28 16:33:38',NULL,NULL),(185,'0198c0f8-8f83-7479-b60c-99002e6939ba',2,'Table24',1,'2025-07-28 16:33:38',NULL,NULL),(186,'0198c0f8-8f85-720b-9177-ac208f710d0f',2,'Table01',1,'2025-07-28 16:34:02',NULL,NULL),(187,'0198c0f8-8f89-708b-bc9f-8d6482a0bc69',2,'Table02',1,'2025-07-28 16:34:02',NULL,NULL),(188,'0198c0f8-8f8b-75e9-b3f0-22d584859f87',2,'Table03',1,'2025-07-28 16:34:02',NULL,NULL),(189,'0198c0f8-8f8e-721e-8ab2-5c51e7e51b09',2,'Table04',1,'2025-07-28 16:34:02',NULL,NULL),(190,'0198c0f8-8f90-7364-afe2-6ed7bf93c7c8',2,'Table05',1,'2025-07-28 16:34:02',NULL,NULL),(191,'0198c0f8-8f93-776e-8782-86cd056872ea',2,'Table06',1,'2025-07-28 16:34:02',NULL,NULL),(192,'0198c0f8-8f95-77e8-820c-eb9ef2ff661e',2,'Table07',1,'2025-07-28 16:34:02',NULL,NULL),(193,'0198c0f8-8f98-70c9-b247-55b93e0629ac',2,'Table08',1,'2025-07-28 16:34:02',NULL,NULL),(194,'0198c0f8-8f9b-74cf-b067-7825d156064f',2,'Table09',1,'2025-07-28 16:34:02',NULL,NULL),(195,'0198c0f8-8f9d-72d8-8f2d-cc4c4844c6e1',2,'Table10',1,'2025-07-28 16:34:02',NULL,NULL),(196,'0198c0f8-8f9f-77c4-b0a6-70c22d95dd10',2,'Table11',1,'2025-07-28 16:34:02',NULL,NULL),(197,'0198c0f8-8fa1-717d-a05f-d52b1e56451a',2,'Table12',1,'2025-07-28 16:34:02',NULL,NULL),(198,'0198c0f8-8fa3-743c-95e6-ff2f6f72d151',2,'Table13',1,'2025-07-28 16:34:02',NULL,NULL),(199,'0198c0f8-8fa6-710b-8c27-63e734bc045e',2,'Table14',1,'2025-07-28 16:34:02',NULL,NULL),(200,'0198c0f8-8fa8-72b2-918b-5cca69f18f3f',2,'Table15',1,'2025-07-28 16:34:02',NULL,NULL),(201,'0198c0f8-8faa-7219-a3f5-7b57cb6ea7a1',2,'Table16',1,'2025-07-28 16:34:02',NULL,NULL),(202,'0198c0f8-8fac-7429-be33-91f51a89de47',2,'Table17',1,'2025-07-28 16:34:02',NULL,NULL),(203,'0198c0f8-8fae-7079-9cbf-bf2f501caaa6',2,'Table18',1,'2025-07-28 16:34:02',NULL,NULL),(204,'0198c0f8-8fb1-74df-ba64-1556cbb6cdab',2,'Table19',1,'2025-07-28 16:34:02',NULL,NULL),(205,'0198c0f8-8fb3-754c-a047-43cda0af0851',2,'Table20',1,'2025-07-28 16:34:02',NULL,NULL),(206,'0198c0f8-8fb5-762b-abdf-5fecd3f4c895',2,'Table21',1,'2025-07-28 16:34:02',NULL,NULL),(207,'0198c0f8-8fb7-7459-91a4-a97b54d22201',2,'Table22',1,'2025-07-28 16:34:02',NULL,NULL),(208,'0198c0f8-8fb9-72c4-bfe1-86cb8dde2630',2,'Table23',1,'2025-07-28 16:34:02',NULL,NULL);
/*!40000 ALTER TABLE `msx_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `msx_table_group`
--

DROP TABLE IF EXISTS `msx_table_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msx_table_group` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `BranchId` int NOT NULL,
  `RecNumber` varchar(45) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `IsDefault` tinyint NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Branch_TableGroup_idx` (`BranchId`),
  KEY `User2_TableGroup_idx` (`UpdatedBy`),
  KEY `User1_TableGroup_idx` (`CreatedBy`),
  CONSTRAINT `Branch_TableGroup` FOREIGN KEY (`BranchId`) REFERENCES `msx_branch` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User1_TableGroup` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_TableGroup` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=262 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msx_table_group`
--

LOCK TABLES `msx_table_group` WRITE;
/*!40000 ALTER TABLE `msx_table_group` DISABLE KEYS */;
INSERT INTO `msx_table_group` VALUES (1,'01978c42-bf6c-71bd-a917-cc22ab3dc89f',1,'00000001','Walk-In',0,1,'2025-07-07 11:31:03',3,'2025-07-18 08:41:09'),(2,'01978c75-fbe8-762b-a877-114bba252175',1,'00000002','Dine-In',0,1,'2025-07-07 11:31:03',NULL,NULL),(3,'01979a88-b940-749c-9f86-9814c97501f9',1,'00000003','Delivery',0,1,'2025-07-07 11:31:03',3,'2025-07-09 08:44:24'),(94,'0199275a-0f4a-74da-940b-aabba189935d',1,'00000001','Walk-In',1,1,'2025-09-08 11:23:58',NULL,NULL),(95,'0199275a-0f4b-748c-81a5-e7854008c449',1,'00000002','Dine-In',1,1,'2025-09-08 11:23:58',NULL,NULL),(96,'0199275a-0f4b-748c-81a5-ebf9bc9fa0df',1,'00000003','Delivery',1,1,'2025-09-08 11:23:58',NULL,NULL),(244,'temp-dr-101978c42-bf6c-71bd-a917-cc22ab3dc89f',243,'00000001','Walk-In',1,1,'2025-10-01 16:21:13',NULL,NULL),(245,'temp-dr-201978c42-bf6c-71bd-a917-cc22ab3dc89f',243,'00000002','Dine-In',1,1,'2025-10-01 16:21:13',NULL,NULL),(246,'temp-dr-301978c42-bf6c-71bd-a917-cc22ab3dc89f',243,'00000003','Delivery',1,1,'2025-10-01 16:21:13',NULL,NULL),(247,'temp-dr-168d4bd11-3740-8333-a9ed-7e59dc3e3b04',254,'00000001','Walk-In',1,1,'2025-10-01 16:27:31',NULL,NULL),(248,'temp-dr-268d4bd11-3740-8333-a9ed-7e59dc3e3b04',254,'00000002','Dine-In',1,1,'2025-10-01 16:27:31',NULL,NULL),(249,'temp-dr-368d4bd11-3740-8333-a9ed-7e59dc3e3b04',254,'00000003','Delivery',1,1,'2025-10-01 16:27:31',NULL,NULL);
/*!40000 ALTER TABLE `msx_table_group` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `msx_table_group_BEFORE_UPDATE` BEFORE UPDATE ON `msx_table_group` FOR EACH ROW BEGIN
	IF NEW.`Name` = 'Dine-In' THEN
	INSERT INTO msx_table(`TableGroupId`,`RecNumber`,`TableNumber`,`CreatedBy`,`DateCreated`) VALUES
    (NEW.Id,'00000001','Table01',NEW.CreatedBy,NOW()),
    (NEW.Id,'00000002','Table02',NEW.CreatedBy,NOW()),
    (NEW.Id,'00000003','Table03',NEW.CreatedBy,NOW()),
    (NEW.Id,'00000004','Table04',NEW.CreatedBy,NOW()),
    (NEW.Id,'00000005','Table05',NEW.CreatedBy,NOW()),
    (NEW.Id,'00000006','Table06',NEW.CreatedBy,NOW()),
    (NEW.Id,'00000007','Table07',NEW.CreatedBy,NOW()),
    (NEW.Id,'00000008','Table08',NEW.CreatedBy,NOW()),
    (NEW.Id,'00000009','Table09',NEW.CreatedBy,NOW()),
    (NEW.Id,'00000010','Table10',NEW.CreatedBy,NOW()),
    (NEW.Id,'00000011','Table11',NEW.CreatedBy,NOW()),
    (NEW.Id,'00000012','Table12',NEW.CreatedBy,NOW()),
    (NEW.Id,'00000013','Table13',NEW.CreatedBy,NOW()),
    (NEW.Id,'00000014','Table14',NEW.CreatedBy,NOW()),
    (NEW.Id,'00000015','Table15',NEW.CreatedBy,NOW()),
    (NEW.Id,'00000016','Table16',NEW.CreatedBy,NOW()),
    (NEW.Id,'00000017','Table17',NEW.CreatedBy,NOW()),
    (NEW.Id,'00000018','Table18',NEW.CreatedBy,NOW()),
    (NEW.Id,'00000019','Table19',NEW.CreatedBy,NOW()),
    (NEW.Id,'00000020','Table20',NEW.CreatedBy,NOW()),
    (NEW.Id,'00000021','Table21',NEW.CreatedBy,NOW()),
    (NEW.Id,'00000022','Table22',NEW.CreatedBy,NOW()),
    (NEW.Id,'00000023','Table23',NEW.CreatedBy,NOW()),
    (NEW.Id,'00000024','Table24',NEW.CreatedBy,NOW());
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `msx_tax`
--

DROP TABLE IF EXISTS `msx_tax`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msx_tax` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `TenantId` int NOT NULL,
  `RecNumber` varchar(50) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `TaxCode` varchar(100) NOT NULL,
  `Rate` decimal(18,2) NOT NULL,
  `AccountId` int NOT NULL,
  `IsDefault` tinyint NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `TaxAccount_idx` (`AccountId`),
  KEY `TaxCompany_idx` (`TenantId`),
  KEY `User1_Tax_idx` (`CreatedBy`),
  KEY `User2_Tax_idx` (`UpdatedBy`),
  CONSTRAINT `Account_Tax` FOREIGN KEY (`AccountId`) REFERENCES `msx_account` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `Tenant_Tax` FOREIGN KEY (`TenantId`) REFERENCES `ax_tenant` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User1_Tax` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_Tax` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=514 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msx_tax`
--

LOCK TABLES `msx_tax` WRITE;
/*!40000 ALTER TABLE `msx_tax` DISABLE KEYS */;
INSERT INTO `msx_tax` VALUES (1,'0198c0f9-2ddc-7604-9258-541257d01a7a',1,'00000001','VAT','Value Added Tax','Inclusive',12.00,4,0,1,'2025-01-09 13:47:10',1,NULL),(2,'0198c0f9-2de4-77f4-aecd-57ac3822931c',1,'00000002','Non-VAT','Value Added Tax','Inclusive',0.00,4,0,1,'2025-01-09 13:47:47',1,NULL),(3,'0198c0f9-2de9-76be-ba7a-21a053353b4f',1,'00000003','Local','Local Tax','Exclusive',5.00,8,0,1,'2025-01-09 13:49:24',1,NULL),(4,'0198c0f9-2dec-7627-82e7-d8addb7a3d04',1,'00000004','VAT-Exclusive','Exclusive Value Added Tax','Exclusive',0.00,4,0,1,'2025-01-09 13:50:19',1,NULL),(5,'0198c0f9-2dee-7741-b86b-c3c3a1f3739c',1,'00000005','VAT-Exempt','Exempted to Value Added Tax','Inclusive',0.00,4,0,1,'2025-01-09 13:50:45',1,'2025-01-09 13:51:48'),(6,'0198c0f9-2df0-73b7-a459-92aaa184fbd0',1,'00000006','Zero','No tax','Inclusive',0.00,4,0,1,'2025-01-09 13:51:19',1,NULL),(15,'0198c0f9-2df2-754b-8623-dccb4b012c62',1,'00000007','test','','Inclusive',23.00,8,0,3,'2025-07-21 13:14:23',3,'2025-07-21 13:14:41');
/*!40000 ALTER TABLE `msx_tax` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `msx_terminal`
--

DROP TABLE IF EXISTS `msx_terminal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msx_terminal` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `BranchId` int NOT NULL,
  `RecNumber` varchar(50) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `PhysicalAddress` varchar(255) DEFAULT NULL,
  `IsDefault` tinyint NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `TerminalBranch_idx` (`BranchId`),
  KEY `User1_Terminal_idx` (`CreatedBy`),
  KEY `User2_Terminal_idx` (`UpdatedBy`),
  CONSTRAINT `Branch_Terminal` FOREIGN KEY (`BranchId`) REFERENCES `msx_branch` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User1_Terminal` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_Terminal` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=322 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msx_terminal`
--

LOCK TABLES `msx_terminal` WRITE;
/*!40000 ALTER TABLE `msx_terminal` DISABLE KEYS */;
INSERT INTO `msx_terminal` VALUES (1,'0198c0f9-8643-700f-84f5-34c13278e7ac',1,'00000001','01',NULL,0,1,'2025-01-08 00:00:00',1,'2025-01-11 14:04:07'),(2,'0198c0f9-864b-717c-a8e0-541238b5c164',1,'00000002','02',NULL,0,1,'2025-01-08 00:00:00',NULL,NULL),(3,'0198c0f9-864d-76c9-9ead-d7a6744503fb',1,'00000003','03',NULL,0,1,'2025-01-08 00:00:00',NULL,NULL),(4,'0198c0f9-8650-708e-a1aa-0f04290d7ac0',1,'00000004','04',NULL,0,1,'2025-01-08 00:00:00',NULL,NULL),(5,'0198c0f9-8652-76aa-9f3f-ef9378d6189b',1,'00000005','05',NULL,0,1,'2025-01-08 00:00:00',NULL,NULL);
/*!40000 ALTER TABLE `msx_terminal` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `msx_terminal_AFTER_INSERT` AFTER INSERT ON `msx_terminal` FOR EACH ROW BEGIN
	 INSERT INTO `stx_terminal` (
        `TerminalId`, 
        `IsPartialPrint`,
        `IsComponentEditing`, 
        `IsExcludeZeroAmountInOR`,
        `IsPrintTransferTable`,
        `IsTriggerQuantity`,
        `IsHideSalesAmount`,
        `IsChangePrice`,
        `IsEditSellingPrice`,
        `IsEditCost`,
        `IsAuditLogs`,
        `IsAutoServiceCharge`,
        `ServiceChargeRate`,
        `PeriodId`,
        `CustomerId`,
        `DiscountId`,
        `SupplierId`,
        `IsQuickInventory`,
        `IsNegativeInventory`,
        `IsDisableRealTimeInventory`,
        `SerialNumber`,
        `PermitNumber`,
        `AccreditationNumber`,
        `TIN`,
        `MachineNumber`,
        `ReturnReport`,
        `SalesReport`,
        `CollectionReport`,
        `IsPromptLogin`,
        `IsAliasPrinting`,
        `Tenant`,
        `IsSIVATAnalysis`,
        `IsORVATAnalysis`,
        `IsEjectDrawerOnPrint`,
        `IsCustomerDisplay`,
        `ORPrintTitle`,
        `IsAutoPrintKitchenReport`,
        `IsShowCollectedTab`,
        `RestaurantView`,
        `DateCreated`
    ) 
    VALUES (
        NEW.`Id`, -- TerminalId
        0, -- IsPartialPrint
        0, -- IsComponentEditing
        0, -- IsExcludeZeroAmountInOR
        0, -- IsPrintTransferTable
        0, -- IsTriggerQuantity
        0, -- IsHideSalesAmount
        0, -- IsChangePrice
        0, -- IsEditSellingPrice
        0, -- IsEditCost
        0, -- IsAuditLogs
        0, -- IsAutoServiceCharge
        0, -- ServiceChargeRate
        NULL, -- PeriodId
        NULL, -- CustomerId
        NULL, -- DiscountId
        0, -- SupplierId
        0, -- IsQuickInventory
        0, -- IsNegativeInventory
        0, -- IsDisableRealTimeInventory
        'NA', -- SerialNumber
        'NA', -- PermitNumber
        'NA', -- AccreditationNumber
        'NA', -- TIN
        'NA', -- MachineNumber
        'Return Report', -- ReturnReport
        'Sales Report', -- SalesReport
        'Collection Report', -- CollectionReport
        0, -- IsPromptLogin
        0, -- IsAliasPrinting
        'NA Tenant', -- Tenant
        0, -- IsSIVATAnalysis
        0, -- IsORVATAnalysis
        0, -- IsEjectDrawerOnPrint
        0, -- IsCustomerDisplay
        'OFFICIAL RECEIPT', -- ORPrintTitle
        0, -- IsAutoPrintKitchenReport
        0,  -- IsShowCollectedTab
        'Scroll', -- RestaurantView
        NOW() -- DateCreated
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `msx_unit`
--

DROP TABLE IF EXISTS `msx_unit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msx_unit` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `TenantId` int NOT NULL,
  `RecNumber` varchar(50) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `IsDefault` tinyint NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `UnitCompany_idx` (`TenantId`),
  KEY `User1_Unit_idx` (`CreatedBy`),
  KEY `User2_Unit_idx` (`UpdatedBy`),
  CONSTRAINT `Tenant_Unit` FOREIGN KEY (`TenantId`) REFERENCES `ax_tenant` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User1_Unit` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_Unit` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3363 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msx_unit`
--

LOCK TABLES `msx_unit` WRITE;
/*!40000 ALTER TABLE `msx_unit` DISABLE KEYS */;
INSERT INTO `msx_unit` VALUES (1,'0198c0fa-0ae1-757d-86ba-6f4a4465e235',1,'00000001','Pc(s)','Piece/Pieces',0,1,'2025-01-09 13:59:21',1,'2025-06-20 08:50:32'),(2,'0198c0fa-0ae8-7503-bf76-08776d720bcc',1,'00000002','Box(s)','Box(s)',0,1,'2025-01-09 13:59:37',NULL,NULL),(3,'0198c0fa-0aeb-72a1-9150-2fcb2e99fedc',1,'00000003','Pack(s)','Pack(s)',0,1,'2025-01-09 13:59:46',NULL,NULL),(4,'0198c0fa-0aed-7018-9b50-62c67c4a62f9',1,'00000004','Can(s)','Can(s)',0,1,'2025-01-09 13:59:57',NULL,NULL),(5,'0198c0fa-0af0-72ab-8fe1-e75f44f6aadb',1,'00000005','Gallon(s)','Gallon(s)',0,1,'2025-01-09 14:00:05',NULL,NULL),(6,'0198c0fa-0af2-76ba-9c49-b4c0ae2f1b61',1,'00000006','Gram(s)','Gram(s)',0,1,'2025-01-09 14:00:14',NULL,NULL),(7,'0198c0fa-0af4-7713-b7c1-3f61dbff4b97',1,'00000007','Kg(s)','Kg(s)',0,1,'2025-01-09 14:02:28',NULL,NULL),(8,'0198c0fa-0af7-71ff-b425-adef349973b3',1,'00000008','Liter(s)','Liter(s)',0,1,'2025-01-09 14:02:33',NULL,NULL),(9,'0198c0fa-0afa-746c-906a-e6707b51090b',1,'00000009','Order(s)','Order(s)',0,1,'2025-01-09 14:02:42',NULL,NULL),(10,'0198c0fa-0afd-75a6-b8fe-71b678ba961b',1,'00000010','Roll(s)','Roll(s)',0,1,'2025-01-09 14:02:49',NULL,NULL),(11,'0198c0fa-0b00-719d-a304-1fd39a854b55',1,'00000011','Sachet(s)','Sachet(s)',0,1,'2025-01-09 14:02:55',NULL,NULL),(12,'0198c0fa-0b02-701f-85e4-e6a3e17cc2e8',1,'00000012','Serving(s)','Serving(s)',0,1,'2025-01-09 14:03:03',NULL,NULL),(13,'0198c0fa-0b04-7558-ba97-87797bc85cb8',1,'00000013','Batch(s)','Batch(s)',0,1,'2025-01-09 14:03:13',NULL,NULL),(14,'0198c0fa-0b06-7147-921f-d76fb2590635',1,'00000014','Bar(s)','Bar(s)',0,1,'2025-01-09 14:03:29',NULL,NULL),(15,'0198c0fa-0b09-71de-ba12-d88922c73500',1,'00000015','Case(s)','Case(s)',0,1,'2025-01-09 14:03:38',NULL,NULL),(16,'0198c0fa-0b0b-770b-bd44-d5959d4e0161',1,'00000016','Container(s)','Container(s)',0,1,'2025-01-09 14:03:46',NULL,NULL),(17,'0198c0fa-0b0d-76ce-93bf-fb26e89ec25d',1,'00000017','Unit(s)','Unit(s)',0,1,'2025-01-09 14:03:53',NULL,NULL),(18,'0198c0fa-0b10-751d-90fa-26795c949403',1,'00000018','Bot(s)','Bot(s)',0,1,'2025-01-09 14:04:10',NULL,NULL),(19,'0198c0fa-0b13-77c9-8b56-a88279c42b90',1,'00000019','Bundle(s)','Bundle(s)',0,1,'2025-01-09 14:04:20',NULL,NULL),(20,'0198c0fa-0b15-7122-acf1-cbda76d0c456',1,'00000020','Cubic','Cubic',0,1,'2025-01-09 14:05:37',NULL,NULL),(21,'0198c0fa-0b18-701c-bbf7-1cdeff14056c',1,'00000021','Dozen','Dozen',0,1,'2025-01-09 14:05:43',NULL,NULL),(22,'0198c0fa-0b1a-72f5-a81b-245de52ad588',1,'00000022','Drum(s)','Drum(s)',0,1,'2025-01-09 14:05:47',NULL,NULL),(23,'0198c0fa-0b1c-7529-946c-02b268b0b7d3',1,'00000023','Ft','Feet',0,1,'2025-01-09 14:06:00',NULL,NULL),(24,'0198c0fa-0b1e-7388-af8f-42f218039fc1',1,'00000024','Hundred(s)','Hundred(s)',0,1,'2025-01-09 14:06:06',NULL,NULL),(25,'0198c0fa-0b21-752f-9954-8f0a9f63fd91',1,'00000025','In(s)','Inch(s)',0,1,'2025-01-09 14:06:16',NULL,NULL),(26,'0198c0fa-0b24-75dc-b5e3-623346a3a8a4',1,'00000026','Bag(s)','Bag(s)',0,1,'2025-01-09 14:06:23',NULL,NULL),(27,'0198c0fa-0b26-7289-8881-94ab6b61845d',1,'00000027','M(s)','Meter(s)',0,1,'2025-01-09 14:06:37',NULL,NULL),(28,'0198c0fa-0b28-7513-a7b8-d3b2131cd614',1,'00000028','Pad(s)','Pad(s)',0,1,'2025-01-09 14:06:45',NULL,NULL),(29,'0198c0fa-0b2a-7089-9fb0-de6c2d21f13e',1,'00000029','Pail(s)','Pail(s)',0,1,'2025-01-09 14:06:53',NULL,NULL),(30,'0198c0fa-0b2c-7387-8426-561c4f8ac9e5',1,'00000030','Pair(s)','Pair(s)',0,1,'2025-01-09 14:07:00',NULL,NULL),(31,'0198c0fa-0b2f-757e-80cc-341aad4b00f4',1,'00000031','Peso','Peso',0,1,'2025-01-09 14:07:07',NULL,NULL),(32,'0198c0fa-0b31-765d-850f-ccae644bf3a4',1,'00000032','Pint(s)','Pint(s)',0,1,'2025-01-09 14:07:15',NULL,NULL),(33,'0198c0fa-0b34-73ee-8fe1-308527ea26ac',1,'00000033','Quart(s)','Pint(s)',0,1,'2025-01-09 14:07:20',NULL,NULL),(34,'0198c0fa-0b37-73ef-b393-b46b108ff623',1,'00000034','Ream(s)','Ream(s)',0,1,'2025-01-09 14:07:30',NULL,NULL),(35,'0198c0fa-0b3a-7680-b7d7-8d314bf06f4a',1,'00000035','Sack(s)','Sack(s)',0,1,'2025-01-09 14:07:37',NULL,NULL),(36,'0198c0fa-0b3c-7189-97bc-4d5fba0854a7',1,'00000036','Set(s)','Set(s)',0,1,'2025-01-09 14:07:42',NULL,NULL),(37,'0198c0fa-0b3e-722d-a682-ac17d149b657',1,'00000037','Sheet(s)','Sheet(s)',0,1,'2025-01-09 14:07:52',NULL,NULL),(38,'0198c0fa-0b40-7498-95f6-79faaf24bf11',1,'00000038','SmallBox(s)','SmallBox(s)',0,1,'2025-01-09 14:07:59',NULL,NULL),(39,'0198c0fa-0b43-7179-b369-f4cadf8707e4',1,'00000039','Tank(s)','Tank(s)',0,1,'2025-01-09 14:08:03',1,'2025-01-09 14:08:39'),(40,'0198c0fa-0b46-71bb-a9b3-7a9ee38da1b4',1,'00000040','Trip(s)','Trip(s)',0,1,'2025-01-09 14:09:05',NULL,NULL),(41,'0198c0fa-0b48-76c8-a7ca-6fa33ad8a2ba',1,'00000041','Cup(s))','Cup(s)',0,1,'2025-01-09 14:09:13',NULL,NULL),(42,'0198c0fa-0b4a-73e3-a57e-46e214ed8fbf',1,'00000042','Gross','Gross',0,1,'2025-01-09 14:09:21',NULL,NULL),(44,'0198c0fa-0b4c-754a-833d-19058d02c1e0',1,'00000043','Glass(s)','Glass/Glasses',0,3,'2025-02-17 09:33:12',NULL,NULL);
/*!40000 ALTER TABLE `msx_unit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `msx_user`
--

DROP TABLE IF EXISTS `msx_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msx_user` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(255) NOT NULL,
  `TenantId` int DEFAULT NULL,
  `RecNumber` varchar(50) NOT NULL,
  `Username` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `CardNumber` varchar(255) DEFAULT NULL,
  `RoleId` int NOT NULL,
  `IsDefault` tinyint NOT NULL,
  `IsMerchant` tinyint NOT NULL,
  `Status` enum('Active','Suspended','Deactivated','Terminated') NOT NULL,
  `Image` text,
  `CreatedBy` int DEFAULT NULL,
  `DateCreated` datetime DEFAULT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  UNIQUE KEY `CardNumber_UNIQUE` (`CardNumber`),
  KEY `UserRole_idx` (`RoleId`),
  KEY `Company_UserFK_idx` (`TenantId`),
  KEY `User1_User_idx` (`CreatedBy`),
  KEY `User2_User_idx` (`UpdatedBy`),
  CONSTRAINT `Role_User` FOREIGN KEY (`RoleId`) REFERENCES `msx_role` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Tenant_User` FOREIGN KEY (`TenantId`) REFERENCES `ax_tenant` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User1_User` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_User` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msx_user`
--

LOCK TABLES `msx_user` WRITE;
/*!40000 ALTER TABLE `msx_user` DISABLE KEYS */;
INSERT INTO `msx_user` VALUES (1,'0198c0fa-8b02-77f9-88d7-f4890bd2f2c1',NULL,'00000001','superuser','$2b$10$fdvsA016f5RLdFlfAjTxPOnBtnyeEbiV/4ZOzYXZ3NPllGGZt1A.2','ryanmark.dinglasa@gmail.com','Mark Dinglasa',NULL,1,1,1,'Active','/mark-dinglasa.png',1,'2024-12-20 00:00:00',1,'2025-06-23 11:09:28'),(2,'0198c0fa-8b10-74ea-b80f-042df5c01dc0',1,'00000002','cashier','$2b$10$H5ExYUeRzB6WdTX5JNSsguJB0IqIjJyOED8tc/h2nrzsuYecHrAzC','innosoft.inquiry@gmail.com','Cashier',NULL,3,0,1,'Active',NULL,1,'2025-01-21 09:11:11',3,'2025-02-07 02:37:57'),(3,'0198c0fa-8b14-7192-94ce-c5c63dd20414',1,'00000003','admin','$2b$10$001gHzahgtA1wSfSaEOeVuGwM.rngfYst2Ssxyq8D.vvSfTWla./O','innosoft.inquiry@gmail.com','Administrator',NULL,2,0,1,'Active',NULL,1,'2025-01-21 09:15:47',1,'2025-01-26 00:36:58'),(4,'0198c0fa-8b17-77bb-8a6f-c4fd52a6af2b',1,'00000004','teller','$2b$10$SxhBg8XlXsexwnolbrDOj.C2o3W/449btaOV488A15Ej40PAkxbVS','innosoft.inquiry@gmail.com','Teller',NULL,4,0,1,'Active',NULL,1,'2025-01-21 09:16:11',1,'2025-06-23 11:09:21'),(8,'0198c0fa-8b19-7059-a024-d32804d117be',1,'00000006','aska3','$2b$10$vrEzH1wATgfiMVr.X4CirOBUPauxa/e3eK3t2T7dWnRHB4AMcmjZ2','nieraska@gmail.com','Aska Nier',NULL,2,0,0,'Active',NULL,1,'2025-02-24 13:58:42',1,'2025-06-17 16:59:06'),(9,'0198c0fa-8b1d-7245-9cd5-9abc80fab148',1,'00000007','mitchie','$2b$10$IY/5KgEYp4mENKcV29ZUfOPthkRa613mnwKmJdwPTecVNmmDgwCte','mitchtajos@gmail.com','Mitchie Tajos',NULL,2,0,0,'Active',NULL,1,'2025-02-24 14:00:05',NULL,NULL),(10,'0198c0fa-8b20-7772-9a44-e551afb27927',1,'00000008','jane','$2b$10$O7T9J9PzMDY6NSCUXX3yeOt04JEBHlstvjsgiYWFkJDPj8O/xudem','janebajas1234@gmail.com','Jane Bajas',NULL,2,0,0,'Active',NULL,1,'2025-02-24 14:15:47',NULL,NULL),(25,'019a7615-9cb0-75c9-94a6-3cec2c4595bf',1,'00000001','115601321199375784218','$2b$10$80WljFOurbJe9fys9JryGOsX5T1VqtgSRmY3/ACX0845JNEMZBy1i','ryanmarkmj@gmail.com','Emperor Kira','',2,0,0,'Active','https://lh3.googleusercontent.com/a/ACg8ocI3aUknUh39rs6wvsxIJ97ugvl1hK4t5JO6vgKdED7vyV2oWEUR=s96-c',1,'2025-11-12 11:21:59',NULL,NULL);
/*!40000 ALTER TABLE `msx_user` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `msx_user_BEFORE_INSERT` BEFORE INSERT ON `msx_user` FOR EACH ROW BEGIN
	-- Update the card number as unique VISA PH (4165 11XX XXXX XXXX)
    -- SET NEW.CardNumber = RPAD(CONCAT('4165511', NEW.Id), 16, '0');
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `stx_terminal`
--

DROP TABLE IF EXISTS `stx_terminal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stx_terminal` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TerminalId` int NOT NULL,
  `IsPartialPrint` tinyint NOT NULL,
  `IsComponentEditing` tinyint NOT NULL,
  `IsExcludeZeroAmountInOR` tinyint NOT NULL,
  `IsPrintTransferTable` tinyint NOT NULL,
  `IsTriggerQuantity` tinyint NOT NULL,
  `IsHideSalesAmount` tinyint NOT NULL,
  `IsChangePrice` tinyint NOT NULL,
  `IsEditSellingPrice` tinyint NOT NULL,
  `IsEditCost` tinyint NOT NULL,
  `IsAuditLogs` tinyint NOT NULL,
  `IsAutoServiceCharge` tinyint NOT NULL,
  `ServiceChargeRate` decimal(18,2) NOT NULL,
  `PeriodId` int DEFAULT NULL,
  `CustomerId` varchar(45) DEFAULT NULL,
  `DiscountId` int DEFAULT NULL,
  `SupplierId` int DEFAULT NULL,
  `TableId` int DEFAULT NULL,
  `ReturnReport` varchar(255) NOT NULL,
  `IsQuickInventory` tinyint NOT NULL,
  `IsNegativeInventory` tinyint NOT NULL,
  `IsDisableRealTimeInventory` tinyint NOT NULL,
  `SerialNumber` varchar(255) DEFAULT NULL,
  `PermitNumber` varchar(255) DEFAULT NULL,
  `AccreditationNumber` varchar(255) DEFAULT NULL,
  `TIN` varchar(255) DEFAULT NULL,
  `MachineNumber` varchar(255) DEFAULT NULL,
  `SalesReport` varchar(255) NOT NULL,
  `CollectionReport` varchar(255) NOT NULL,
  `IsPromptLogin` tinyint NOT NULL,
  `IsAliasPrinting` tinyint NOT NULL,
  `Tenant` varchar(255) NOT NULL,
  `IsSIVATAnalysis` tinyint NOT NULL,
  `IsORVATAnalysis` tinyint NOT NULL,
  `IsEjectDrawerOnPrint` tinyint NOT NULL,
  `IsCustomerDisplay` tinyint NOT NULL,
  `ORPrintTitle` varchar(255) NOT NULL,
  `IsAutoPrintKitchenReport` tinyint NOT NULL,
  `IsShowCollectedTab` tinyint NOT NULL,
  `RestaurantView` varchar(255) NOT NULL,
  `ReceiptFooter` text,
  `InvoiceFooter` text,
  `DateCreated` datetime NOT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `Terminal_TerminalSetting_idx` (`TerminalId`),
  CONSTRAINT `Terminal_TerminalSetting` FOREIGN KEY (`TerminalId`) REFERENCES `msx_terminal` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=155 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stx_terminal`
--

LOCK TABLES `stx_terminal` WRITE;
/*!40000 ALTER TABLE `stx_terminal` DISABLE KEYS */;
INSERT INTO `stx_terminal` VALUES (1,1,0,0,0,0,0,0,1,1,1,0,0,12.00,1,'1',1,1,1,'',1,0,0,'serial2','permit2','accreditation2','tin2','machine2','','',0,0,'',1,1,0,0,'OFFICIAL RECEIPT',0,0,'',NULL,NULL,'2025-01-08 00:00:00','2025-07-06 02:41:39');
/*!40000 ALTER TABLE `stx_terminal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stx_user`
--

DROP TABLE IF EXISTS `stx_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stx_user` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `UserId` int NOT NULL,
  `TerminalId` int DEFAULT NULL,
  `DateCreated` datetime NOT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Terminal_UserSetting_idx` (`TerminalId`),
  KEY `User_UserSetting_idx` (`UserId`),
  CONSTRAINT `Terminal_UserSetting` FOREIGN KEY (`TerminalId`) REFERENCES `msx_terminal` (`Id`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `User_UserSetting` FOREIGN KEY (`UserId`) REFERENCES `msx_user` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stx_user`
--

LOCK TABLES `stx_user` WRITE;
/*!40000 ALTER TABLE `stx_user` DISABLE KEYS */;
INSERT INTO `stx_user` VALUES (1,'0198c0fb-082f-71e4-ac92-00668e492fb3',1,1,'2025-06-11 11:52:55','2025-08-07 11:33:02'),(2,'0198c0fb-0834-7338-b7d3-ff966c735b02',3,1,'2025-06-25 01:32:22','2025-07-04 12:18:37');
/*!40000 ALTER TABLE `stx_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tx_card_memo`
--

DROP TABLE IF EXISTS `tx_card_memo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tx_card_memo` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(255) NOT NULL,
  `BranchId` int NOT NULL,
  `RecNumber` varchar(50) NOT NULL,
  `TxDate` datetime NOT NULL,
  `PeriodId` int NOT NULL,
  `Particulars` varchar(255) DEFAULT NULL,
  `PreparedBy` int NOT NULL,
  `CheckedBy` int NOT NULL,
  `ApprovedBy` int NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Branch_CardMemoFK_idx` (`BranchId`),
  KEY `Period_CardMemoFK_idx` (`PeriodId`),
  KEY `User1_CardMemo_idx` (`PreparedBy`),
  KEY `User2_CardMemo_idx` (`CheckedBy`),
  KEY `User4_CardMemo_idx` (`ApprovedBy`),
  KEY `User4_CardMemo_idx1` (`CreatedBy`),
  KEY `User5_CardMemo_idx` (`UpdatedBy`),
  CONSTRAINT `Branch_CardMemoFK` FOREIGN KEY (`BranchId`) REFERENCES `msx_branch` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Period_CardMemoFK` FOREIGN KEY (`PeriodId`) REFERENCES `ax_period` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `User1_CardMemo` FOREIGN KEY (`PreparedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_CardMemo` FOREIGN KEY (`CheckedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User3_CardMemo` FOREIGN KEY (`ApprovedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User4_CardMemo` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User5_CardMemo` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tx_card_memo`
--

LOCK TABLES `tx_card_memo` WRITE;
/*!40000 ALTER TABLE `tx_card_memo` DISABLE KEYS */;
INSERT INTO `tx_card_memo` VALUES (13,'0198301f-04e6-752f-8aad-80c9e1ff44c5',1,'00000001','2025-07-22 10:10:10',1,NULL,3,3,3,3,'2025-07-22 11:17:45',NULL,NULL);
/*!40000 ALTER TABLE `tx_card_memo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tx_card_memo_order`
--

DROP TABLE IF EXISTS `tx_card_memo_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tx_card_memo_order` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `CardMemoId` int NOT NULL,
  `OrderId` int DEFAULT NULL,
  `AccountId` int NOT NULL,
  `Particulars` varchar(255) DEFAULT NULL,
  `DebitAmount` decimal(18,2) NOT NULL,
  `CreditAmount` decimal(18,2) NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `CardMemoLine_idx` (`CardMemoId`),
  KEY `Sales_CardMemoFK_idx` (`OrderId`),
  KEY `Account_CardMemoLineFK_idx` (`AccountId`),
  KEY `User1_CardMemoSale_idx` (`CreatedBy`),
  KEY `User2_CardMemoSale_idx` (`UpdatedBy`),
  CONSTRAINT `Account_CardMemoSale` FOREIGN KEY (`AccountId`) REFERENCES `msx_account` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `CardMemo_CardMemoSale` FOREIGN KEY (`CardMemoId`) REFERENCES `tx_card_memo` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Order_CardMemoSale` FOREIGN KEY (`OrderId`) REFERENCES `tx_order` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User1_CardMemoSale` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_CardMemoSale` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tx_card_memo_order`
--

LOCK TABLES `tx_card_memo_order` WRITE;
/*!40000 ALTER TABLE `tx_card_memo_order` DISABLE KEYS */;
/*!40000 ALTER TABLE `tx_card_memo_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tx_collection`
--

DROP TABLE IF EXISTS `tx_collection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tx_collection` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(255) NOT NULL,
  `BranchId` int NOT NULL,
  `RecNumber` varchar(50) NOT NULL,
  `TxDate` datetime NOT NULL,
  `PeriodId` int NOT NULL,
  `TerminalId` int NOT NULL,
  `ORNumber` varchar(50) NOT NULL,
  `CustomerId` int NOT NULL,
  `OrderId` int DEFAULT NULL,
  `SalesBalanceAmount` decimal(18,2) NOT NULL,
  `Amount` decimal(18,2) NOT NULL,
  `TenderAmount` decimal(18,2) NOT NULL,
  `ChangeAmount` decimal(18,2) NOT NULL,
  `IsReturn` tinyint NOT NULL,
  `IsRefund` tinyint NOT NULL,
  `IsCancelled` tinyint NOT NULL,
  `PreparedBy` int NOT NULL,
  `CheckedBy` int NOT NULL,
  `ApprovedBy` int NOT NULL,
  `Remarks` varchar(255) DEFAULT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `SalesId_idx` (`OrderId`),
  KEY `Branch_CollectionFK_idx` (`BranchId`),
  KEY `Period_Collection_idx` (`PeriodId`),
  KEY `Terminal_Collection_idx` (`TerminalId`),
  KEY `User1_Collection_idx` (`PreparedBy`),
  KEY `User2_Collection_idx` (`CheckedBy`),
  KEY `User3_Collection_idx` (`ApprovedBy`),
  KEY `User4_Collection_idx` (`CreatedBy`),
  KEY `User5_Collection_idx` (`UpdatedBy`),
  KEY `Customer_Collection_idx` (`CustomerId`),
  CONSTRAINT `Branch_Collection` FOREIGN KEY (`BranchId`) REFERENCES `msx_branch` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Customer_Collection` FOREIGN KEY (`CustomerId`) REFERENCES `msx_customer` (`Id`),
  CONSTRAINT `Order_Collection` FOREIGN KEY (`OrderId`) REFERENCES `tx_order` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Period_Collection` FOREIGN KEY (`PeriodId`) REFERENCES `ax_period` (`Id`),
  CONSTRAINT `Terminal_Collection` FOREIGN KEY (`TerminalId`) REFERENCES `msx_terminal` (`Id`),
  CONSTRAINT `User1_Collection` FOREIGN KEY (`PreparedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_Collection` FOREIGN KEY (`CheckedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User3_Collection` FOREIGN KEY (`ApprovedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User4_Collection` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User5_Collection` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tx_collection`
--

LOCK TABLES `tx_collection` WRITE;
/*!40000 ALTER TABLE `tx_collection` DISABLE KEYS */;
INSERT INTO `tx_collection` VALUES (115,'0197f340-7eab-7295-8837-157611d36c1f',1,'00000001','2025-07-09 10:10:10',1,1,'3344',1,227,0.00,157.00,0.00,0.00,0,0,0,3,3,3,NULL,3,'2025-07-09 14:16:35',3,'2025-07-10 15:33:03'),(123,'01982feb-1801-71ff-aa82-e9b4cfa44993',1,'00000003','2025-07-22 10:10:10',1,1,'4445',1,NULL,0.00,4.00,0.00,0.00,0,0,0,3,3,3,NULL,3,'2025-07-22 09:57:25',3,'2025-07-22 10:16:35');
/*!40000 ALTER TABLE `tx_collection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tx_collection_method`
--

DROP TABLE IF EXISTS `tx_collection_method`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tx_collection_method` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `CollectionId` int NOT NULL,
  `Amount` decimal(18,2) NOT NULL,
  `PayTypeId` int NOT NULL,
  `StockInId` int DEFAULT NULL,
  `AccountId` int NOT NULL,
  `CheckNumber` varchar(50) DEFAULT NULL,
  `CheckDate` varchar(50) DEFAULT NULL,
  `CheckBank` varchar(50) DEFAULT NULL,
  `CreditCardVerificationCode` varchar(50) DEFAULT NULL,
  `CreditCardNumber` varchar(50) DEFAULT NULL,
  `CreditCardType` varchar(50) DEFAULT NULL,
  `CreditCardBank` varchar(50) DEFAULT NULL,
  `GiftCertificateNumber` varchar(50) DEFAULT NULL,
  `OtherInformation` varchar(255) DEFAULT NULL,
  `CreditCardReferenceNumber` varchar(50) DEFAULT NULL,
  `CreditCardHolderName` varchar(255) DEFAULT NULL,
  `CreditCardExpiry` varchar(50) DEFAULT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `CollectionLine_idx` (`CollectionId`),
  KEY `Account_CollectionMethod_idx` (`AccountId`),
  KEY `PayType_CollectionMethod_idx` (`PayTypeId`),
  KEY `StockIn_CollectionMethod_idx` (`StockInId`),
  KEY `User1_CollectionMethod_idx` (`CreatedBy`),
  KEY `User2_CollectionMethod_idx` (`UpdatedBy`),
  CONSTRAINT `Account_CollectionMethod` FOREIGN KEY (`AccountId`) REFERENCES `msx_account` (`Id`),
  CONSTRAINT `Collection_CollectionMethod` FOREIGN KEY (`CollectionId`) REFERENCES `tx_collection` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `PayType_CollectionMethod` FOREIGN KEY (`PayTypeId`) REFERENCES `msx_pay_type` (`Id`),
  CONSTRAINT `StockIn_CollectionMethod` FOREIGN KEY (`StockInId`) REFERENCES `tx_stock_in` (`Id`),
  CONSTRAINT `User1_CollectionMethod` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_CollectionMethod` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tx_collection_method`
--

LOCK TABLES `tx_collection_method` WRITE;
/*!40000 ALTER TABLE `tx_collection_method` DISABLE KEYS */;
/*!40000 ALTER TABLE `tx_collection_method` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tx_disbursement`
--

DROP TABLE IF EXISTS `tx_disbursement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tx_disbursement` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(255) NOT NULL,
  `BranchId` int NOT NULL,
  `RecNumber` varchar(50) NOT NULL,
  `TxDate` datetime NOT NULL,
  `PeriodId` int NOT NULL,
  `Type` varchar(50) NOT NULL,
  `Amount` decimal(18,2) NOT NULL,
  `AccountId` int NOT NULL,
  `PayTypeId` int NOT NULL,
  `TerminalId` int NOT NULL,
  `IsReturn` tinyint NOT NULL,
  `IsRefund` tinyint NOT NULL,
  `IsCancelled` tinyint NOT NULL,
  `StockInId` int DEFAULT NULL,
  `PreparedBy` int NOT NULL,
  `CheckedBy` int NOT NULL,
  `ApprovedBy` int NOT NULL,
  `Remarks` varchar(255) DEFAULT NULL,
  `Amount1000` int DEFAULT NULL,
  `Amount500` int DEFAULT NULL,
  `Amount200` int DEFAULT NULL,
  `Amount100` int DEFAULT NULL,
  `Amount50` int DEFAULT NULL,
  `Amount20` int DEFAULT NULL,
  `Amount10` int DEFAULT NULL,
  `Amount5` int DEFAULT NULL,
  `Amount1` int DEFAULT NULL,
  `Amount050` int DEFAULT NULL,
  `Amount025` int DEFAULT NULL,
  `Amount010` int DEFAULT NULL,
  `Amount005` int DEFAULT NULL,
  `Amount001` int DEFAULT NULL,
  `Payee` varchar(100) DEFAULT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Branch_DisbursementFK_idx` (`BranchId`),
  KEY `Period_DisbursementFK_idx` (`PeriodId`),
  KEY `Terminal_DisbursementFK_idx` (`TerminalId`),
  KEY `Account_DisbursementFK_idx` (`AccountId`),
  KEY `PayType_DisbursementFK_idx` (`PayTypeId`),
  KEY `User1_Disbursement_idx` (`PreparedBy`),
  KEY `User2_Disbursement_idx` (`CheckedBy`),
  KEY `User3_Disbursement_idx` (`ApprovedBy`),
  KEY `User4_Disbursment_idx` (`CreatedBy`),
  KEY `User5_Disbursment_idx` (`UpdatedBy`),
  KEY `StockIn_Disbursement_idx` (`StockInId`),
  CONSTRAINT `Account_DisbursementFK` FOREIGN KEY (`AccountId`) REFERENCES `msx_account` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `PayType_DisbursementFK` FOREIGN KEY (`PayTypeId`) REFERENCES `msx_pay_type` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `Period_DisbursementFK` FOREIGN KEY (`PeriodId`) REFERENCES `ax_period` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `StockIn_Disbursement` FOREIGN KEY (`StockInId`) REFERENCES `tx_stock_in` (`Id`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `Terminal_DisbursementFK` FOREIGN KEY (`TerminalId`) REFERENCES `msx_terminal` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `User1_Disbursement` FOREIGN KEY (`PreparedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_Disbursement` FOREIGN KEY (`CheckedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User3_Disbursement` FOREIGN KEY (`ApprovedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User4_Disbursment` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User5_Disbursment` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tx_disbursement`
--

LOCK TABLES `tx_disbursement` WRITE;
/*!40000 ALTER TABLE `tx_disbursement` DISABLE KEYS */;
INSERT INTO `tx_disbursement` VALUES (3,'0198081b-2e2f-75f1-a7ed-e6499021f748',1,'00000001','2025-07-14 10:10:10',1,'Debit',5554.00,1,1,1,0,0,0,NULL,3,3,3,NULL,0,0,0,0,NULL,0,0,0,0,NULL,0,0,0,0,NULL,3,'2025-07-14 16:44:21',3,'2025-07-15 09:30:27');
/*!40000 ALTER TABLE `tx_disbursement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tx_inventory`
--

DROP TABLE IF EXISTS `tx_inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tx_inventory` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ItemId` int NOT NULL,
  `InventoryDate` datetime NOT NULL,
  `Quantity` decimal(18,2) NOT NULL,
  `StockInItemId` int DEFAULT NULL,
  `StockOutItemId` int DEFAULT NULL,
  `SalesItemId` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `Inventory_idx` (`ItemId`),
  KEY `StockInItem_Inventory_idx` (`StockInItemId`),
  KEY `StockOutItem_Inventory_idx` (`StockOutItemId`),
  KEY `SalesItem_Inventory_idx` (`SalesItemId`),
  CONSTRAINT `Inventory` FOREIGN KEY (`ItemId`) REFERENCES `msx_item` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SalesItem_Inventory` FOREIGN KEY (`SalesItemId`) REFERENCES `tx_order_item` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `StockInItem_Inventory` FOREIGN KEY (`StockInItemId`) REFERENCES `tx_stock_in_item` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `StockOutItem_Inventory` FOREIGN KEY (`StockOutItemId`) REFERENCES `tx_stock_out_item` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tx_inventory`
--

LOCK TABLES `tx_inventory` WRITE;
/*!40000 ALTER TABLE `tx_inventory` DISABLE KEYS */;
INSERT INTO `tx_inventory` VALUES (6,1033,'2025-08-02 16:53:47',100.00,25,NULL,NULL),(7,1033,'2025-08-02 16:57:30',-10.00,NULL,9,NULL);
/*!40000 ALTER TABLE `tx_inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tx_journal`
--

DROP TABLE IF EXISTS `tx_journal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tx_journal` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `RefDocument` varchar(50) NOT NULL,
  `AccountId` int NOT NULL,
  `DebitAmount` decimal(18,2) NOT NULL,
  `CreditAmount` decimal(18,2) NOT NULL,
  `OrderId` int DEFAULT NULL,
  `StockInId` int DEFAULT NULL,
  `StockOutId` int DEFAULT NULL,
  `PaymentId` int DEFAULT NULL,
  `CardMemoId` int DEFAULT NULL,
  `DisbursementId` int DEFAULT NULL,
  `DateCreated` datetime NOT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `Sales_JournalFK_idx` (`OrderId`),
  KEY `StockIn_JournalFk_idx` (`StockInId`),
  KEY `StockOut_JournalFK_idx` (`StockOutId`),
  KEY `CollectionId_JournalFK_idx` (`PaymentId`),
  KEY `CardMemo_JournalFK_idx` (`CardMemoId`),
  KEY `Disbursement_JournalFK_idx` (`DisbursementId`),
  KEY `Account_Journal_idx` (`AccountId`),
  CONSTRAINT `Account_Journal` FOREIGN KEY (`AccountId`) REFERENCES `msx_account` (`Id`),
  CONSTRAINT `CardMemo_Journal` FOREIGN KEY (`CardMemoId`) REFERENCES `tx_card_memo` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Disbursement_Journal` FOREIGN KEY (`DisbursementId`) REFERENCES `tx_disbursement` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Order_Journal` FOREIGN KEY (`OrderId`) REFERENCES `tx_order` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Payment_Journal` FOREIGN KEY (`PaymentId`) REFERENCES `tx_collection` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `StockIn_Journal` FOREIGN KEY (`StockInId`) REFERENCES `tx_stock_in` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `StockOut_Journal` FOREIGN KEY (`StockOutId`) REFERENCES `tx_stock_out` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tx_journal`
--

LOCK TABLES `tx_journal` WRITE;
/*!40000 ALTER TABLE `tx_journal` DISABLE KEYS */;
/*!40000 ALTER TABLE `tx_journal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tx_order`
--

DROP TABLE IF EXISTS `tx_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tx_order` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(255) NOT NULL,
  `BranchId` int NOT NULL,
  `RecNumber` varchar(50) NOT NULL,
  `TxDate` datetime NOT NULL,
  `InvoiceNumber` varchar(50) NOT NULL,
  `Amount` decimal(18,2) NOT NULL,
  `PeriodId` int NOT NULL,
  `TerminalId` int NOT NULL,
  `TableId` int NOT NULL,
  `TermId` int NOT NULL,
  `DiscountId` int NOT NULL,
  `CustomerId` int NOT NULL,
  `CustomerIdNumber` varchar(255) DEFAULT NULL,
  `CustomerName` varchar(255) DEFAULT NULL,
  `CustomerAge` int DEFAULT NULL,
  `OrderAgent` int NOT NULL,
  `PreparedBy` int NOT NULL,
  `CheckedBy` int NOT NULL,
  `ApprovedBy` int NOT NULL,
  `IsReturn` tinyint NOT NULL,
  `IsRefund` tinyint NOT NULL,
  `IsCancelled` tinyint NOT NULL,
  `PaidAmount` decimal(18,2) NOT NULL,
  `CreditAmount` decimal(18,2) NOT NULL,
  `DebitAmount` decimal(18,2) NOT NULL,
  `BalanceAmount` decimal(18,2) DEFAULT NULL,
  `Pax` int DEFAULT NULL,
  `TableStatus` varchar(50) DEFAULT NULL,
  `Remarks` varchar(255) DEFAULT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Period_Sales_idx` (`PeriodId`),
  KEY `Branch_Sales_idx` (`BranchId`),
  KEY `Table_Sales_idx` (`TableId`),
  KEY `Term_Sales_idx` (`TermId`),
  KEY `Terminal_Sales_idx` (`TerminalId`),
  KEY `Customer_Sales_idx` (`CustomerId`),
  KEY `User1_Sales_idx` (`OrderAgent`),
  KEY `User1_Sales_idx1` (`PreparedBy`),
  KEY `User1_Sales_idx2` (`CheckedBy`),
  KEY `User4_Sales_idx` (`ApprovedBy`),
  KEY `User5_Sales_idx` (`CreatedBy`),
  KEY `User6_Sales_idx` (`UpdatedBy`),
  KEY `Discount_Sales_idx` (`DiscountId`),
  CONSTRAINT `Branch_Sales` FOREIGN KEY (`BranchId`) REFERENCES `ax_tenant` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Customer_Sales` FOREIGN KEY (`CustomerId`) REFERENCES `msx_customer` (`Id`),
  CONSTRAINT `Discount_Sales` FOREIGN KEY (`DiscountId`) REFERENCES `msx_discount` (`Id`),
  CONSTRAINT `Period_Sales` FOREIGN KEY (`PeriodId`) REFERENCES `ax_period` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `Table_Sales` FOREIGN KEY (`TableId`) REFERENCES `msx_table` (`Id`),
  CONSTRAINT `Term_Sales` FOREIGN KEY (`TermId`) REFERENCES `ax_term` (`Id`),
  CONSTRAINT `Terminal_Sales` FOREIGN KEY (`TerminalId`) REFERENCES `msx_terminal` (`Id`),
  CONSTRAINT `User1_Sales` FOREIGN KEY (`OrderAgent`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_Sales` FOREIGN KEY (`PreparedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User3_Sales` FOREIGN KEY (`CheckedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User4_Sales` FOREIGN KEY (`ApprovedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User5_Sales` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User6_Sales` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=229 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tx_order`
--

LOCK TABLES `tx_order` WRITE;
/*!40000 ALTER TABLE `tx_order` DISABLE KEYS */;
INSERT INTO `tx_order` VALUES (227,'0197f31c-8612-744f-8e8b-fc2910ebed10',1,'00000001','2025-06-27 10:10:10','test',618.00,1,1,1,6,1,1,NULL,NULL,NULL,1,1,1,1,0,0,0,0.00,0.00,0.00,0.00,1,NULL,NULL,1,'2025-06-27 14:03:41',NULL,NULL),(228,'0197cedd-9240-74db-9bf0-e5eb4cca6ac0',1,'00000002','2025-07-03 10:10:10','test',9251.00,1,1,1,6,1,1,NULL,NULL,NULL,1,1,1,1,0,0,0,0.00,0.00,0.00,0.00,1,NULL,NULL,1,'2025-07-03 13:58:58',NULL,NULL);
/*!40000 ALTER TABLE `tx_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tx_order_item`
--

DROP TABLE IF EXISTS `tx_order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tx_order_item` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `OrderId` int NOT NULL,
  `ItemId` int NOT NULL,
  `UnitId` int NOT NULL,
  `Price` decimal(18,2) NOT NULL,
  `DiscountId` int NOT NULL,
  `DiscountRate` decimal(18,2) NOT NULL,
  `DiscountAmount` decimal(18,2) NOT NULL,
  `NetPrice` decimal(18,2) NOT NULL,
  `Amount` decimal(18,2) NOT NULL,
  `Quantity` decimal(18,2) NOT NULL,
  `TaxId` int NOT NULL,
  `TaxRate` decimal(18,2) NOT NULL,
  `TaxAmount` decimal(18,2) NOT NULL,
  `SalesAccountId` int NOT NULL,
  `AssetAccountId` int NOT NULL,
  `CostAccountId` int NOT NULL,
  `TaxAccountId` int NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `SalesLine_idx` (`OrderId`),
  KEY `Item_SalesItem_idx` (`ItemId`),
  KEY `Unit_SalesItem_idx` (`UnitId`),
  KEY `Discount_SalesItem_idx` (`DiscountId`),
  KEY `Tax_SalesItem_idx` (`TaxId`),
  KEY `Account1_SalesItem_idx` (`SalesAccountId`),
  KEY `Account2_SalesItem_idx` (`AssetAccountId`),
  KEY `Account3_SalesItem_idx` (`CostAccountId`),
  KEY `Account4_SalesItem_idx` (`TaxAccountId`),
  KEY `User1_SalesItem_idx` (`CreatedBy`),
  KEY `User2_SalesItem_idx` (`UpdatedBy`),
  CONSTRAINT `Account1_SalesItem` FOREIGN KEY (`SalesAccountId`) REFERENCES `msx_account` (`Id`),
  CONSTRAINT `Account2_SalesItem` FOREIGN KEY (`AssetAccountId`) REFERENCES `msx_account` (`Id`),
  CONSTRAINT `Account3_SalesItem` FOREIGN KEY (`CostAccountId`) REFERENCES `msx_account` (`Id`),
  CONSTRAINT `Account4_SalesItem` FOREIGN KEY (`TaxAccountId`) REFERENCES `msx_account` (`Id`),
  CONSTRAINT `Discount_SalesItem` FOREIGN KEY (`DiscountId`) REFERENCES `msx_discount` (`Id`),
  CONSTRAINT `Item_SalesItem` FOREIGN KEY (`ItemId`) REFERENCES `msx_item` (`Id`),
  CONSTRAINT `Order_SalesItem` FOREIGN KEY (`OrderId`) REFERENCES `tx_order` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Tax_SalesItem` FOREIGN KEY (`TaxId`) REFERENCES `msx_tax` (`Id`),
  CONSTRAINT `Unit_SalesItem` FOREIGN KEY (`UnitId`) REFERENCES `msx_unit` (`Id`),
  CONSTRAINT `User1_SalesItem` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_SalesItem` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=180 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tx_order_item`
--

LOCK TABLES `tx_order_item` WRITE;
/*!40000 ALTER TABLE `tx_order_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `tx_order_item` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `tx_sales_item_AFTER_INSERT` AFTER INSERT ON `tx_order_item` FOR EACH ROW BEGIN
	INSERT INTO `tx_inventory` (`ItemId`,`InventoryDate`,`Quantity`,`SalesItemId`) VALUES(NEW.`ItemId`, NOW(), -NEW.`Quantity`,NEW.`Id`);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tx_purchase_order`
--

DROP TABLE IF EXISTS `tx_purchase_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tx_purchase_order` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(255) NOT NULL,
  `BranchId` int NOT NULL,
  `RecNumber` varchar(50) NOT NULL,
  `TxDate` datetime NOT NULL,
  `PeriodId` int NOT NULL,
  `Amount` decimal(18,2) NOT NULL,
  `SupplierId` int NOT NULL,
  `PreparedBy` int NOT NULL,
  `CheckedBy` int NOT NULL,
  `ApprovedBy` int NOT NULL,
  `RequestedBy` int DEFAULT NULL,
  `Remarks` varchar(255) DEFAULT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Period_PO_idx` (`PeriodId`),
  KEY `Branch_PO_idx` (`BranchId`),
  KEY `Supplier_PO_idx` (`SupplierId`),
  KEY `User1_PO_idx` (`PreparedBy`),
  KEY `User2_PO_idx` (`CheckedBy`),
  KEY `User3_PO_idx` (`ApprovedBy`),
  KEY `User4_PO_idx` (`RequestedBy`),
  KEY `User5_PO_idx` (`CreatedBy`),
  KEY `User6_PO_idx` (`UpdatedBy`),
  CONSTRAINT `Branch_PO` FOREIGN KEY (`BranchId`) REFERENCES `msx_branch` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Period_PO` FOREIGN KEY (`PeriodId`) REFERENCES `ax_period` (`Id`),
  CONSTRAINT `Supplier_PO` FOREIGN KEY (`SupplierId`) REFERENCES `msx_supplier` (`Id`),
  CONSTRAINT `User1_PO` FOREIGN KEY (`PreparedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_PO` FOREIGN KEY (`CheckedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User3_PO` FOREIGN KEY (`ApprovedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User4_PO` FOREIGN KEY (`RequestedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User5_PO` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User6_PO` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tx_purchase_order`
--

LOCK TABLES `tx_purchase_order` WRITE;
/*!40000 ALTER TABLE `tx_purchase_order` DISABLE KEYS */;
INSERT INTO `tx_purchase_order` VALUES (20,'0197fd61-f845-7086-95cb-1e323701ec8f',1,'00000001','2025-07-11 10:10:10',1,0.00,1,3,3,3,3,'test',3,'2025-07-12 14:45:48',3,'2025-07-14 16:40:11');
/*!40000 ALTER TABLE `tx_purchase_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tx_purchase_order_item`
--

DROP TABLE IF EXISTS `tx_purchase_order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tx_purchase_order_item` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `PurchaseOrderId` int NOT NULL,
  `ItemId` int NOT NULL,
  `UnitId` int NOT NULL,
  `Quantity` decimal(18,2) NOT NULL,
  `Cost` decimal(18,2) NOT NULL,
  `Amount` decimal(18,2) NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `PurchaseOrderLine_idx` (`PurchaseOrderId`),
  KEY `Item_PurchaseOrderLine_idx` (`ItemId`),
  KEY `Unit_PurchaseOrderLine_idx` (`UnitId`),
  KEY `User1_PurchaseOrderItem_idx` (`CreatedBy`),
  KEY `User2_PurchaseOrderItem_idx` (`UpdatedBy`),
  CONSTRAINT `Item_PurchaseOrderItem` FOREIGN KEY (`ItemId`) REFERENCES `msx_item` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `PurchaseOrderItem` FOREIGN KEY (`PurchaseOrderId`) REFERENCES `tx_purchase_order` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Unit_PurchaseOrderItem` FOREIGN KEY (`UnitId`) REFERENCES `msx_unit` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `User1_PurchaseOrderItem` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_PurchaseOrderItem` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tx_purchase_order_item`
--

LOCK TABLES `tx_purchase_order_item` WRITE;
/*!40000 ALTER TABLE `tx_purchase_order_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `tx_purchase_order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tx_queue`
--

DROP TABLE IF EXISTS `tx_queue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tx_queue` (
  `Id` int NOT NULL,
  `Uid` varchar(45) NOT NULL,
  `OrderId` int NOT NULL,
  `Status` varchar(50) NOT NULL,
  `DateCreated` datetime NOT NULL,
  `DateUpdate` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Sales_Queue_idx` (`OrderId`),
  CONSTRAINT `Order_Queue` FOREIGN KEY (`OrderId`) REFERENCES `tx_order` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tx_queue`
--

LOCK TABLES `tx_queue` WRITE;
/*!40000 ALTER TABLE `tx_queue` DISABLE KEYS */;
/*!40000 ALTER TABLE `tx_queue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tx_stock_count`
--

DROP TABLE IF EXISTS `tx_stock_count`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tx_stock_count` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(255) NOT NULL,
  `BranchId` int NOT NULL,
  `RecNumber` varchar(50) NOT NULL,
  `TxDate` datetime NOT NULL,
  `PeriodId` int NOT NULL,
  `PreparedBy` int NOT NULL,
  `CheckedBy` int NOT NULL,
  `ApprovedBy` int NOT NULL,
  `Remarks` varchar(255) DEFAULT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Branch_StockCount_idx` (`BranchId`),
  KEY `Period_StockCount_idx` (`PeriodId`),
  KEY `User1_StockCount_idx` (`PreparedBy`),
  KEY `User2_StockCount_idx` (`CheckedBy`),
  KEY `User3_StockCount_idx` (`ApprovedBy`),
  KEY `User4_StockCount_idx` (`CreatedBy`),
  KEY `User5_StockCount_idx` (`UpdatedBy`),
  CONSTRAINT `Branch_StockCount` FOREIGN KEY (`BranchId`) REFERENCES `msx_branch` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Period_StockCount` FOREIGN KEY (`PeriodId`) REFERENCES `ax_period` (`Id`),
  CONSTRAINT `User1_StockCount` FOREIGN KEY (`PreparedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_StockCount` FOREIGN KEY (`CheckedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User3_StockCount` FOREIGN KEY (`ApprovedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User4_StockCount` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User5_StockCount` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tx_stock_count`
--

LOCK TABLES `tx_stock_count` WRITE;
/*!40000 ALTER TABLE `tx_stock_count` DISABLE KEYS */;
INSERT INTO `tx_stock_count` VALUES (4,'01986351-26c8-72c2-be6d-43bc69a18fb1',1,'00000001','2025-07-31 10:10:10',1,3,3,3,NULL,3,'2025-08-01 09:48:42',NULL,NULL);
/*!40000 ALTER TABLE `tx_stock_count` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tx_stock_count_item`
--

DROP TABLE IF EXISTS `tx_stock_count_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tx_stock_count_item` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `StockCountId` int NOT NULL,
  `ItemId` int NOT NULL,
  `UnitId` int NOT NULL,
  `Quantity` decimal(18,2) NOT NULL,
  `Cost` decimal(18,2) NOT NULL,
  `Amount` decimal(18,2) NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `StockCount_idx` (`StockCountId`),
  KEY `Item_StockCount_idx` (`ItemId`),
  KEY `Unit_StockCountItem_idx` (`UnitId`),
  KEY `User1_StockCountItem_idx` (`CreatedBy`),
  KEY `User2_StockCountItem_idx` (`UpdatedBy`),
  CONSTRAINT `Item_StockCountItem` FOREIGN KEY (`ItemId`) REFERENCES `msx_item` (`Id`),
  CONSTRAINT `StockCount_StockCountItem` FOREIGN KEY (`StockCountId`) REFERENCES `tx_stock_count` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Unit_StockCountItem` FOREIGN KEY (`UnitId`) REFERENCES `msx_unit` (`Id`),
  CONSTRAINT `User1_StockCountItem` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`) ON UPDATE RESTRICT,
  CONSTRAINT `User2_StockCountItem` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tx_stock_count_item`
--

LOCK TABLES `tx_stock_count_item` WRITE;
/*!40000 ALTER TABLE `tx_stock_count_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `tx_stock_count_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tx_stock_in`
--

DROP TABLE IF EXISTS `tx_stock_in`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tx_stock_in` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(255) NOT NULL,
  `BranchId` int NOT NULL,
  `RecNumber` varchar(50) NOT NULL,
  `TxDate` datetime NOT NULL,
  `PeriodId` int NOT NULL,
  `SupplierId` int NOT NULL,
  `IsReturn` tinyint NOT NULL,
  `IsRefund` tinyint NOT NULL,
  `IsCancelled` tinyint NOT NULL,
  `OrderId` int DEFAULT NULL,
  `CollectionId` int DEFAULT NULL,
  `PurchaseOrderId` int DEFAULT NULL,
  `PreparedBy` int NOT NULL,
  `CheckedBy` int NOT NULL,
  `ApprovedBy` int NOT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  `Remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Branch_StockIn_idx` (`BranchId`),
  KEY `Period_StockIn_idx` (`PeriodId`),
  KEY `Supplier_StockIn_idx` (`SupplierId`),
  KEY `Sales_StockIn_idx` (`OrderId`),
  KEY `Collection_StockIn_idx` (`CollectionId`),
  KEY `PurchaseOrder_StockIn_idx` (`PurchaseOrderId`),
  KEY `User1_StockIn_idx` (`PreparedBy`),
  KEY `User2_StockIn_idx` (`CheckedBy`),
  KEY `User3_StockIn_idx` (`ApprovedBy`),
  KEY `User4_StockIn_idx` (`CreatedBy`),
  KEY `User5_StockIn_idx` (`UpdatedBy`),
  CONSTRAINT `Branch_StockIn` FOREIGN KEY (`BranchId`) REFERENCES `msx_branch` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Collection_StockIn` FOREIGN KEY (`CollectionId`) REFERENCES `tx_collection` (`Id`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `Order_StockIn` FOREIGN KEY (`OrderId`) REFERENCES `tx_order` (`Id`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `Period_StockIn` FOREIGN KEY (`PeriodId`) REFERENCES `ax_period` (`Id`),
  CONSTRAINT `PurchaseOrder_StockIn` FOREIGN KEY (`PurchaseOrderId`) REFERENCES `tx_purchase_order` (`Id`),
  CONSTRAINT `Supplier_StockIn` FOREIGN KEY (`SupplierId`) REFERENCES `msx_supplier` (`Id`),
  CONSTRAINT `User1_StockIn` FOREIGN KEY (`PreparedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_StockIn` FOREIGN KEY (`CheckedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User3_StockIn` FOREIGN KEY (`ApprovedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User4_StockIn` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User5_StockIn` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tx_stock_in`
--

LOCK TABLES `tx_stock_in` WRITE;
/*!40000 ALTER TABLE `tx_stock_in` DISABLE KEYS */;
INSERT INTO `tx_stock_in` VALUES (9,'019869fc-5ea0-76cd-81f8-c208d9494c10',1,'00000001','2025-08-02 10:10:10',1,1,0,0,0,NULL,NULL,20,3,3,3,3,'2025-08-02 16:53:30',NULL,NULL,NULL);
/*!40000 ALTER TABLE `tx_stock_in` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tx_stock_in_item`
--

DROP TABLE IF EXISTS `tx_stock_in_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tx_stock_in_item` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `StockInId` int NOT NULL,
  `ItemId` int NOT NULL,
  `UnitId` int NOT NULL,
  `Quantity` decimal(18,2) NOT NULL,
  `Cost` decimal(18,2) NOT NULL,
  `Amount` decimal(18,2) NOT NULL,
  `ExpiryDate` datetime DEFAULT NULL,
  `LotNumber` varchar(50) DEFAULT NULL,
  `AssetAccountId` int NOT NULL,
  `Price` decimal(18,2) DEFAULT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `StockIn_idx` (`StockInId`),
  KEY `Item_StockInItem_idx` (`ItemId`),
  KEY `Unit_StockInItem_idx` (`UnitId`),
  KEY `Account_StockInItem_idx` (`AssetAccountId`),
  KEY `User1_StockInItem_idx` (`CreatedBy`),
  KEY `User2_StockInItem_idx` (`UpdatedBy`),
  CONSTRAINT `Account_StockInItem` FOREIGN KEY (`AssetAccountId`) REFERENCES `msx_account` (`Id`),
  CONSTRAINT `Item_StockInItem` FOREIGN KEY (`ItemId`) REFERENCES `msx_item` (`Id`),
  CONSTRAINT `StockIn_StockInItem` FOREIGN KEY (`StockInId`) REFERENCES `tx_stock_in` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Unit_StockInItem` FOREIGN KEY (`UnitId`) REFERENCES `msx_unit` (`Id`),
  CONSTRAINT `User1_StockInItem` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_StockInItem` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tx_stock_in_item`
--

LOCK TABLES `tx_stock_in_item` WRITE;
/*!40000 ALTER TABLE `tx_stock_in_item` DISABLE KEYS */;
INSERT INTO `tx_stock_in_item` VALUES (25,'',9,1033,1,100.00,1.00,100.00,NULL,NULL,1,2.00,3,'2025-08-02 16:53:47',NULL,NULL);
/*!40000 ALTER TABLE `tx_stock_in_item` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `tx_stock_in_item_AFTER_INSERT` AFTER INSERT ON `tx_stock_in_item` FOR EACH ROW BEGIN
	INSERT INTO `tx_inventory`(`ItemId`,`InventoryDate`,`Quantity`,`StockInItemId`) VALUES (NEW.`ItemId`, NOW(), NEW.Quantity,NEW.`Id`);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tx_stock_out`
--

DROP TABLE IF EXISTS `tx_stock_out`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tx_stock_out` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(255) NOT NULL,
  `BranchId` int NOT NULL,
  `RecNumber` varchar(50) NOT NULL,
  `TxDate` datetime NOT NULL,
  `PeriodId` int NOT NULL,
  `AccountId` int NOT NULL,
  `PreparedBy` int NOT NULL,
  `CheckedBy` int NOT NULL,
  `ApprovedBy` int NOT NULL,
  `Remarks` varchar(255) DEFAULT NULL,
  `CreatedBy` int NOT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Branch_StockOut_idx` (`BranchId`),
  KEY `Account_StockOut_idx` (`AccountId`),
  KEY `User1_StockOut_idx` (`PreparedBy`),
  KEY `User2_StockOut_idx` (`CheckedBy`),
  KEY `User3_StockOut_idx` (`ApprovedBy`),
  KEY `User4_StockOut_idx` (`CreatedBy`),
  KEY `User5_StockOut_idx` (`UpdatedBy`),
  CONSTRAINT `Account_StockOut` FOREIGN KEY (`AccountId`) REFERENCES `msx_account` (`Id`),
  CONSTRAINT `Branch_StockOut` FOREIGN KEY (`BranchId`) REFERENCES `msx_branch` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Period_StockOut` FOREIGN KEY (`Id`) REFERENCES `ax_period` (`Id`),
  CONSTRAINT `User1_StockOut` FOREIGN KEY (`PreparedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_StockOut` FOREIGN KEY (`CheckedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User3_StockOut` FOREIGN KEY (`ApprovedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User4_StockOut` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User5_StockOut` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tx_stock_out`
--

LOCK TABLES `tx_stock_out` WRITE;
/*!40000 ALTER TABLE `tx_stock_out` DISABLE KEYS */;
INSERT INTO `tx_stock_out` VALUES (6,'019869fc-f6e3-77f6-a7ee-a4f73f7afc7f',1,'00000001','2025-08-02 10:10:10',1,1,3,3,3,NULL,3,'2025-08-02 16:54:07',NULL,NULL);
/*!40000 ALTER TABLE `tx_stock_out` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tx_stock_out_item`
--

DROP TABLE IF EXISTS `tx_stock_out_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tx_stock_out_item` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `StockOutId` int NOT NULL,
  `ItemId` int NOT NULL,
  `UnitId` int NOT NULL,
  `Quantity` decimal(18,2) NOT NULL,
  `Cost` decimal(18,2) NOT NULL,
  `Amount` decimal(18,2) NOT NULL,
  `AssetAccountId` int NOT NULL,
  `CreatedBy` int DEFAULT NULL,
  `DateCreated` datetime NOT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `StockOutLine_idx` (`StockOutId`),
  KEY `Item_StockOutItem_idx` (`ItemId`),
  KEY `Unit_StockOutItem_idx` (`UnitId`),
  KEY `Accout_StockOutItem_idx` (`AssetAccountId`),
  KEY `User1_StockOutItem_idx` (`CreatedBy`),
  KEY `User2_StockOutItem_idx` (`UpdatedBy`),
  CONSTRAINT `Accout_StockOutItem` FOREIGN KEY (`AssetAccountId`) REFERENCES `msx_account` (`Id`),
  CONSTRAINT `Item_StockOutItem` FOREIGN KEY (`ItemId`) REFERENCES `msx_item` (`Id`),
  CONSTRAINT `StockOut_StockOutItem` FOREIGN KEY (`StockOutId`) REFERENCES `tx_stock_out` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Unit_StockOutItem` FOREIGN KEY (`UnitId`) REFERENCES `msx_unit` (`Id`),
  CONSTRAINT `User1_StockOutItem` FOREIGN KEY (`CreatedBy`) REFERENCES `msx_user` (`Id`),
  CONSTRAINT `User2_StockOutItem` FOREIGN KEY (`UpdatedBy`) REFERENCES `msx_user` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tx_stock_out_item`
--

LOCK TABLES `tx_stock_out_item` WRITE;
/*!40000 ALTER TABLE `tx_stock_out_item` DISABLE KEYS */;
INSERT INTO `tx_stock_out_item` VALUES (9,'',6,1033,1,10.00,66.00,660.00,1,3,'2025-08-02 16:57:30',NULL,NULL);
/*!40000 ALTER TABLE `tx_stock_out_item` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `tx_stock_out_item_AFTER_INSERT` AFTER INSERT ON `tx_stock_out_item` FOR EACH ROW BEGIN
	INSERT INTO `tx_inventory`(`ItemId`,`InventoryDate`,`Quantity`,`StockOutItemId`) VALUES (NEW.`ItemId`, NOW(), -NEW.Quantity,NEW.`Id`);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `ux_audit_trail`
--

DROP TABLE IF EXISTS `ux_audit_trail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ux_audit_trail` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `UserId` int NOT NULL,
  `Table` varchar(50) NOT NULL,
  `Record` varchar(50) DEFAULT NULL,
  `Action` varchar(50) DEFAULT NULL,
  `DateCreated` datetime NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `User_AudiTrail_idx` (`UserId`),
  CONSTRAINT `User_AudiTrail` FOREIGN KEY (`UserId`) REFERENCES `stx_user` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ux_audit_trail`
--

LOCK TABLES `ux_audit_trail` WRITE;
/*!40000 ALTER TABLE `ux_audit_trail` DISABLE KEYS */;
/*!40000 ALTER TABLE `ux_audit_trail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ux_control_number`
--

DROP TABLE IF EXISTS `ux_control_number`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ux_control_number` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(45) NOT NULL,
  `BranchId` int NOT NULL,
  `TerminalId` int NOT NULL,
  `ReadingDate` datetime NOT NULL,
  `ControlNumber` int NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `Branch_ControlNumber_idx` (`BranchId`),
  KEY `Terminal_ControlNumber_idx` (`TerminalId`),
  CONSTRAINT `Branch_ControlNumber` FOREIGN KEY (`BranchId`) REFERENCES `msx_branch` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Terminal_ControlNumber` FOREIGN KEY (`TerminalId`) REFERENCES `msx_terminal` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ux_control_number`
--

LOCK TABLES `ux_control_number` WRITE;
/*!40000 ALTER TABLE `ux_control_number` DISABLE KEYS */;
INSERT INTO `ux_control_number` VALUES (1,'',1,1,'2025-08-09 09:10:19',1);
/*!40000 ALTER TABLE `ux_control_number` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ux_notification`
--

DROP TABLE IF EXISTS `ux_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ux_notification` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Uid` varchar(255) NOT NULL,
  `UserId` int NOT NULL,
  `Description` varchar(255) NOT NULL,
  `Link` text NOT NULL,
  `IsRead` tinyint NOT NULL,
  `DateCreated` datetime NOT NULL,
  `DateUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Uid_UNIQUE` (`Uid`),
  KEY `User_NotificationFK_idx` (`UserId`),
  CONSTRAINT `User_NotificationFK` FOREIGN KEY (`UserId`) REFERENCES `msx_user` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ux_notification`
--

LOCK TABLES `ux_notification` WRITE;
/*!40000 ALTER TABLE `ux_notification` DISABLE KEYS */;
INSERT INTO `ux_notification` VALUES (18,'019a245c-20a9-726b-92f0-56e6e5c66bba',1,'Cashier your online billing invoice for <b>September 2025</b> is now available ','/pos/billing/d/019a2384-53e4-76e3-8064-24faf0cdfe18',1,'2025-10-27 14:30:09',NULL),(20,'019a245c-20a9-726b-92f0-5df79dbf7043',1,'Teller your online billing invoice for <b>September 2025</b> is now available ','/pos/billing/d/019a2384-53e4-76e3-8064-24faf0cdfe18',1,'2025-10-27 14:30:09',NULL),(24,'019a5d82-e995-74ce-b18f-c953a3136ee1',1,'We got a new tenant to welcome! Xania Parfum','/pos/tenant',1,'2025-11-07 16:50:52',NULL),(25,'019a5d84-ad66-76ca-b78c-f72f5ee6f473',1,'We got a new tenant to welcome! testing','/pos/tenant',1,'2025-11-07 16:52:48',NULL),(26,'019a613d-c2e8-73c9-893c-6e213a2659c9',1,'We got a new tenant to welcome! testing','/pos/tenant',1,'2025-11-08 10:13:49',NULL),(27,'019a6155-b46e-77e0-9001-73b6786b7e4f',1,'We got a new tenant to welcome! testing','/pos/tenant',1,'2025-11-08 10:39:58',NULL),(28,'019a6159-842d-72d8-9fab-ba8a2ca1f64f',1,'We got a new tenant to welcome! testing','/pos/tenant',1,'2025-11-08 10:44:08',NULL),(29,'019a615c-8629-708f-a5b5-502a4805cf71',1,'We got a new tenant to welcome! testing','/pos/tenant',1,'2025-11-08 10:47:25',NULL),(30,'019a615c-8629-708f-a5b5-56c1683d10c7',1,'We got a new tenant to welcome! testing','/pos/tenant',0,'2025-11-08 10:47:25',NULL),(31,'019a615c-8629-708f-a5b5-5acd63413024',1,'We got a new tenant to welcome! testing','/pos/tenant',0,'2025-11-08 10:47:25',NULL),(32,'019a615c-8629-708f-a5b5-5c0b4964913c',1,'We got a new tenant to welcome! testing','/pos/tenant',0,'2025-11-08 10:47:25',NULL),(33,'019a6164-8fd5-749f-a658-3b4b88f096c7',1,'We got a new subscription to look for, test','/pos/subscription/d/019a6164-3128-7189-a5ce-cb24b28e4e0f',1,'2025-11-08 10:56:12',NULL),(34,'019a6164-8fd6-74b4-ac27-cd0daccf9149',1,'We got a new subscription to look for, test','/pos/subscription/d/019a6164-3128-7189-a5ce-cb24b28e4e0f',1,'2025-11-08 10:56:12',NULL),(35,'019a6164-8fd6-74b4-ac27-d0933c9e2b33',1,'We got a new subscription to look for, test','/pos/subscription/d/019a6164-3128-7189-a5ce-cb24b28e4e0f',1,'2025-11-08 10:56:12',NULL),(36,'019a6164-8fd6-74b4-ac27-d62bbfec0799',1,'We got a new subscription to look for, test','/pos/subscription/d/019a6164-3128-7189-a5ce-cb24b28e4e0f',1,'2025-11-08 10:56:12',NULL),(37,'019a694e-7315-73ee-b278-fb0f1f198eaf',1,'You got a new tenant to welcome! Xania Parfum','/pos/tenant/d/019a694d-7c2e-7717-887c-6d29b3f25027',0,'2025-11-09 23:49:00',NULL),(38,'019a694e-7315-73ee-b278-fc5f314a7bb2',2,'You got a new tenant to welcome! Xania Parfum','/pos/tenant/d/019a694d-7c2e-7717-887c-6d29b3f25027',0,'2025-11-09 23:49:00',NULL),(39,'019a694e-7315-73ee-b279-025c7dee1a78',3,'You got a new tenant to welcome! Xania Parfum','/pos/tenant/d/019a694d-7c2e-7717-887c-6d29b3f25027',0,'2025-11-09 23:49:00',NULL),(40,'019a694e-7315-73ee-b279-048005424f28',4,'You got a new tenant to welcome! Xania Parfum','/pos/tenant/d/019a694d-7c2e-7717-887c-6d29b3f25027',0,'2025-11-09 23:49:00',NULL),(41,'019a6952-323e-7495-9505-165524f88ab1',1,'You got a new tenant to welcome! emperor kira','/pos/tenant/d/019a6951-a3b2-7371-9665-7be072356432',0,'2025-11-09 23:53:06',NULL),(42,'019a6952-323e-7495-9505-1b50e5343d60',2,'You got a new tenant to welcome! emperor kira','/pos/tenant/d/019a6951-a3b2-7371-9665-7be072356432',0,'2025-11-09 23:53:06',NULL),(43,'019a6952-323e-7495-9505-1e2832712dab',3,'You got a new tenant to welcome! emperor kira','/pos/tenant/d/019a6951-a3b2-7371-9665-7be072356432',0,'2025-11-09 23:53:06',NULL),(44,'019a6952-323e-7495-9505-2369068bd420',4,'You got a new tenant to welcome! emperor kira','/pos/tenant/d/019a6951-a3b2-7371-9665-7be072356432',0,'2025-11-09 23:53:06',NULL),(45,'019a695f-de4a-777f-9b10-b5c06cc7aec4',1,'You got a new tenant to welcome! Xania Parfum','/pos/tenant/d/019a695f-7191-7457-839a-570250105739',0,'2025-11-10 00:08:02',NULL),(46,'019a695f-de4a-777f-9b10-bb6787a5f816',2,'You got a new tenant to welcome! Xania Parfum','/pos/tenant/d/019a695f-7191-7457-839a-570250105739',0,'2025-11-10 00:08:02',NULL),(47,'019a695f-de4a-777f-9b10-bc3c067e78fa',3,'You got a new tenant to welcome! Xania Parfum','/pos/tenant/d/019a695f-7191-7457-839a-570250105739',0,'2025-11-10 00:08:02',NULL),(48,'019a695f-de4a-777f-9b10-c322c78dba22',4,'You got a new tenant to welcome! Xania Parfum','/pos/tenant/d/019a695f-7191-7457-839a-570250105739',0,'2025-11-10 00:08:02',NULL),(49,'019a696b-31ba-7284-bba4-8981bb9e6711',1,'You got a new tenant to welcome! Mark D Dinglasa','/pos/tenant/d/019a696a-2267-719a-b924-0c1b43c3aa3e',1,'2025-11-10 00:20:24',NULL),(50,'019a696b-31ba-7284-bba4-8f92cf192f81',2,'You got a new tenant to welcome! Mark D Dinglasa','/pos/tenant/d/019a696a-2267-719a-b924-0c1b43c3aa3e',0,'2025-11-10 00:20:24',NULL),(51,'019a696b-31ba-7284-bba4-9039b3461d70',3,'You got a new tenant to welcome! Mark D Dinglasa','/pos/tenant/d/019a696a-2267-719a-b924-0c1b43c3aa3e',0,'2025-11-10 00:20:24',NULL),(52,'019a696b-31ba-7284-bba4-978da613348d',4,'You got a new tenant to welcome! Mark D Dinglasa','/pos/tenant/d/019a696a-2267-719a-b924-0c1b43c3aa3e',0,'2025-11-10 00:20:24',NULL);
/*!40000 ALTER TABLE `ux_notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ux_user_log`
--

DROP TABLE IF EXISTS `ux_user_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ux_user_log` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `DateLog` datetime NOT NULL,
  `Network` varchar(255) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `User_UserLog_idx` (`UserId`),
  CONSTRAINT `User_UserLog` FOREIGN KEY (`UserId`) REFERENCES `msx_user` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ux_user_log`
--

LOCK TABLES `ux_user_log` WRITE;
/*!40000 ALTER TABLE `ux_user_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `ux_user_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'ipos_myk'
--

--
-- Dumping routines for database 'ipos_myk'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-15 13:59:13
