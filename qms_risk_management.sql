-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 27, 2025 at 03:25 PM
-- Server version: 5.7.39
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `qms_risk_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `pkid` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `isbn` varchar(20) NOT NULL,
  `publication_date` date DEFAULT NULL,
  `available_copies` int(11) NOT NULL DEFAULT '0',
  `tenant_id` bigint(20) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `created_host` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_host` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT NULL,
  `deleted_by` varchar(255) DEFAULT NULL,
  `deleted_date` datetime DEFAULT NULL,
  `deleted_host` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `loans`
--

CREATE TABLE `loans` (
  `pkid` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `book_id` bigint(20) NOT NULL,
  `loan_date` date NOT NULL,
  `return_date` date DEFAULT NULL,
  `due_date` date NOT NULL,
  `status` enum('borrowed','returned','overdue') NOT NULL DEFAULT 'borrowed',
  `tenant_id` bigint(20) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `created_host` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_host` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT NULL,
  `deleted_by` varchar(255) DEFAULT NULL,
  `deleted_date` datetime DEFAULT NULL,
  `deleted_host` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `risk_base`
--

CREATE TABLE `risk_base` (
  `pkid` int(11) NOT NULL,
  `risk_name` varchar(255) NOT NULL,
  `risk_desc` varchar(255) NOT NULL,
  `risk_user` varchar(255) NOT NULL,
  `risk_group` varchar(255) NOT NULL,
  `risk_mitigation` varchar(255) NOT NULL,
  `tenant_id` bigint(20) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `created_host` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_host` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT NULL,
  `deleted_by` varchar(255) DEFAULT NULL,
  `deleted_date` datetime DEFAULT NULL,
  `deleted_host` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `risk_base`
--

INSERT INTO `risk_base` (`pkid`, `risk_name`, `risk_desc`, `risk_user`, `risk_group`, `risk_mitigation`, `tenant_id`, `created_by`, `created_date`, `created_host`, `updated_by`, `updated_date`, `updated_host`, `is_deleted`, `deleted_by`, `deleted_date`, `deleted_host`) VALUES
(1, 'Kekalahan pada proses RFQ', 'Kekalahan Supplier pada proses procurement (RFQ) yang diselenggarakan Industri', 'Supplier', 'Procurement', 'Peningkatan kualitas RFQ', 6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'Penurunan jumlah kontrak', 'Penurunan jumlah kontrak yang terjalin dengan Industri', 'Supplier', 'Contract', 'Peningkatan jumlah kontrak', 6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'Pengiriman terlambat', 'Ketidaktepatan waktu pengiriman bahan baku oleh Supplier', 'Supplier', 'Contract', 'Pengetatan jadwal pengiriman', 6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 'Jumlah dikirim tidak sesuai', 'Ketidaksesuaian jumlah bahan baku yang dikirim oleh Supplier', 'Supplier', 'Contract', 'Peningkatan inspeksi', 6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 'Penolakan LoR', 'Industri menolak Letter of Request dari Supplier', 'Retail', 'Requisition', 'Evaluasi ulang LoR', 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 'Penolakan LoA', 'Penolakan Letter of Agreements oleh Supplier', 'Retail', 'Requisition', 'Evaluasi ulang LoA', 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 'Penerimaan terlambat', 'Ketidaktepatan waktu penerimaan produk dari Industri', 'Retail', 'Contract', 'Pengetatan jadwal pengiriman', 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 'Jumlah diterima tidak sesuai', 'Ketidaksesuaian jumlah produk yang diterima dari Industri', 'Retail', 'Contract', 'Peningkatan inspeksi', 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(20, 'Ketidaksesuaian Jumlah (Received Items)', 'Ketidaksesuaian jumlah item yang diterima oleh Industri', 'Industry', 'Inventory', 'Verifikasi ulang jumlah saat penerimaan barang', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(21, 'Ketidaksesuaian Jumlah (Transferred Items)', 'Ketidaksesuaian jumlah item yang dikirimkan ke pembeli', 'Industry', 'Inventory', 'Verifikasi ulang jumlah saat pengiriman barang', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(22, 'Produk Cacat', 'Produk yang dihasilkan tidak sesuai dengan standar kualitas', 'Industry', 'Manufacturing', 'Peningkatan pengawasan kualitas produksi', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(23, 'Penolakan Direct RFQ', 'Penolakan Direct RFQ oleh Supplier dalam proses procurement', 'Industry', 'SRM Procurement', 'Evaluasi kriteria Direct RFQ dan komunikasi dengan supplier', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(24, 'Penerimaan terlambat', 'Ketidaktepatan waktu penerimaan bahan baku dari Supplier', 'Industry', 'SRM Contract', 'Pengetatan jadwal pengiriman', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(25, 'Jumlah diterima tidak sesuai', 'Ketidaksesuaian jumlah bahan baku yang diterima dari Supplier', 'Industry', 'SRM Contract', 'Peningkatan inspeksi', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(26, 'Penolakan LoR', 'Penolakan Letter of Requests oleh Industri', 'Industry', 'CRM Requisition', 'Evaluasi ulang LoR', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(27, 'Penolakan LoA', 'Supplier menolak Letter of Agreements dari Industri', 'Industry', 'CRM Requisition', 'Evaluasi ulang LoA', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(28, 'Penurunan jumlah kontrak', 'Penurunan jumlah kontrak yang terjalin dengan Retail', 'Industry', 'CRM Contract', 'Peningkatan jumlah kontrak', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(29, 'Pengiriman terlambat', 'Ketidaktepatan waktu pengiriman produk dari Industri', 'Industry', 'CRM Contract', 'Pengetatan jadwal pengiriman', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(30, 'Jumlah dikirim tidak sesuai', 'Ketidaksesuaian jumlah produk yang dikirim oleh Industri', 'Industry', 'CRM Contract', 'Peningkatan inspeksi', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `tenant_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `password`, `tenant_id`) VALUES
(1, 'IND-001', 'industry@example.com', '$2a$10$NrEIjB2WJrJtLJpnKg4hk.4eiahguGfDN5IcQb4kSvQrQJDGF8Hla', 1),
(2, 'SUP-001', 'supplier@example.com', '$2a$10$NrEIjB2WJrJtLJpnKg4hk.4eiahguGfDN5IcQb4kSvQrQJDGF8Hla', 2),
(3, 'RTL-001', 'retail@example.com', '$2a$10$NrEIjB2WJrJtLJpnKg4hk.4eiahguGfDN5IcQb4kSvQrQJDGF8Hla', 3);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `pkid` bigint(20) NOT NULL,
  `username` varchar(50) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('borrower','staff','admin') NOT NULL DEFAULT 'borrower',
  `password` varchar(255) NOT NULL,
  `tenant_id` bigint(20) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `created_host` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_host` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT NULL,
  `deleted_by` varchar(255) DEFAULT NULL,
  `deleted_date` datetime DEFAULT NULL,
  `deleted_host` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`pkid`, `username`, `full_name`, `email`, `role`, `password`, `tenant_id`, `created_by`, `created_date`, `created_host`, `updated_by`, `updated_date`, `updated_host`, `is_deleted`, `deleted_by`, `deleted_date`, `deleted_host`) VALUES
(1, 'IND-001', 'Industry User', 'industry@example.com', 'admin', '$2a$10$NrEIjB2WJrJtLJpnKg4hk.4eiahguGfDN5IcQb4kSvQrQJDGF8Hla', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'SUP-001', 'Supplier User', 'supplier@example.com', 'admin', '$2a$10$NrEIjB2WJrJtLJpnKg4hk.4eiahguGfDN5IcQb4kSvQrQJDGF8Hla', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'RTL-001', 'Retail User', 'retail@example.com', 'admin', '$2a$10$NrEIjB2WJrJtLJpnKg4hk.4eiahguGfDN5IcQb4kSvQrQJDGF8Hla', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`pkid`),
  ADD UNIQUE KEY `isbn` (`isbn`);

--
-- Indexes for table `loans`
--
ALTER TABLE `loans`
  ADD PRIMARY KEY (`pkid`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `book_id` (`book_id`);

--
-- Indexes for table `risk_base`
--
ALTER TABLE `risk_base`
  ADD PRIMARY KEY (`pkid`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`pkid`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `pkid` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `loans`
--
ALTER TABLE `loans`
  MODIFY `pkid` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `risk_base`
--
ALTER TABLE `risk_base`
  MODIFY `pkid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `pkid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `loans`
--
ALTER TABLE `loans`
  ADD CONSTRAINT `loans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`pkid`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `loans_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`pkid`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
