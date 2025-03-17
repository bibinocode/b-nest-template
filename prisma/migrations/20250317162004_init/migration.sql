-- CreateTable
CREATE TABLE `b_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nickname` VARCHAR(45) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(120) NOT NULL,
    `avatar` VARCHAR(255) NULL,
    `sex` TINYINT NOT NULL DEFAULT 2,
    `signature` VARCHAR(255) NULL,
    `last_login_ip` VARCHAR(45) NULL,
    `is_active` TINYINT NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `b_users_username_key`(`username`),
    UNIQUE INDEX `b_users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `b_oauth_provider` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `provider_name` VARCHAR(45) NOT NULL,
    `provider_id` VARCHAR(255) NOT NULL,
    `access_token` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `b_users_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `b_user_login_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ip` VARCHAR(45) NOT NULL,
    `location` VARCHAR(120) NULL,
    `device` VARCHAR(255) NULL,
    `login_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `b_users_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `b_section` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `slug` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_featured` TINYINT NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `b_category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `b_section_id` INTEGER NULL,
    `parent_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `b_tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `b_article` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `cover` VARCHAR(255) NULL,
    `summary` VARCHAR(160) NULL DEFAULT '',
    `pv` INTEGER NOT NULL DEFAULT 0,
    `status` TINYINT NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `b_category_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `b_article_tag` (
    `article_id` INTEGER NOT NULL,
    `tag_id` INTEGER NOT NULL,

    PRIMARY KEY (`article_id`, `tag_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `b_article_content` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` LONGTEXT NOT NULL,
    `content_hash` VARCHAR(255) NOT NULL,
    `b_article_id` INTEGER NOT NULL,

    UNIQUE INDEX `b_article_content_b_article_id_key`(`b_article_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `b_comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `is_approved` TINYINT NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `b_users_id` INTEGER NOT NULL,
    `b_article_id` INTEGER NOT NULL,
    `parent_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `b_article_pv` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `ip` VARCHAR(45) NOT NULL,
    `user_agent` VARCHAR(500) NULL,
    `referer` VARCHAR(500) NULL,
    `region` VARCHAR(120) NULL,
    `device_type` TINYINT NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `b_users_id` INTEGER NULL,
    `b_article_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `b_knowledge_base` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `is_public` TINYINT NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `b_knowledge_base_article` (
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `b_article_id` INTEGER NOT NULL,
    `b_knowledge_base_id` INTEGER NOT NULL,

    PRIMARY KEY (`b_article_id`, `b_knowledge_base_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `b_subscription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `b_users_id` INTEGER NOT NULL,
    `b_knowledge_base_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `b_payment_order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_no` VARCHAR(50) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `payment_method` VARCHAR(20) NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `paid_at` DATETIME(3) NULL,
    `b_users_id` INTEGER NOT NULL,
    `b_article_id` INTEGER NULL,
    `b_knowledge_base_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `b_oauth_provider` ADD CONSTRAINT `b_oauth_provider_b_users_id_fkey` FOREIGN KEY (`b_users_id`) REFERENCES `b_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `b_user_login_history` ADD CONSTRAINT `b_user_login_history_b_users_id_fkey` FOREIGN KEY (`b_users_id`) REFERENCES `b_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `b_category` ADD CONSTRAINT `b_category_b_section_id_fkey` FOREIGN KEY (`b_section_id`) REFERENCES `b_section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `b_category` ADD CONSTRAINT `b_category_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `b_category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `b_article` ADD CONSTRAINT `b_article_b_category_id_fkey` FOREIGN KEY (`b_category_id`) REFERENCES `b_category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `b_article_tag` ADD CONSTRAINT `b_article_tag_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `b_article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `b_article_tag` ADD CONSTRAINT `b_article_tag_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `b_tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `b_article_content` ADD CONSTRAINT `b_article_content_b_article_id_fkey` FOREIGN KEY (`b_article_id`) REFERENCES `b_article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `b_comment` ADD CONSTRAINT `b_comment_b_users_id_fkey` FOREIGN KEY (`b_users_id`) REFERENCES `b_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `b_comment` ADD CONSTRAINT `b_comment_b_article_id_fkey` FOREIGN KEY (`b_article_id`) REFERENCES `b_article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `b_comment` ADD CONSTRAINT `b_comment_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `b_comment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `b_article_pv` ADD CONSTRAINT `b_article_pv_b_users_id_fkey` FOREIGN KEY (`b_users_id`) REFERENCES `b_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `b_article_pv` ADD CONSTRAINT `b_article_pv_b_article_id_fkey` FOREIGN KEY (`b_article_id`) REFERENCES `b_article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `b_knowledge_base_article` ADD CONSTRAINT `b_knowledge_base_article_b_article_id_fkey` FOREIGN KEY (`b_article_id`) REFERENCES `b_article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `b_knowledge_base_article` ADD CONSTRAINT `b_knowledge_base_article_b_knowledge_base_id_fkey` FOREIGN KEY (`b_knowledge_base_id`) REFERENCES `b_knowledge_base`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `b_subscription` ADD CONSTRAINT `b_subscription_b_users_id_fkey` FOREIGN KEY (`b_users_id`) REFERENCES `b_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `b_subscription` ADD CONSTRAINT `b_subscription_b_knowledge_base_id_fkey` FOREIGN KEY (`b_knowledge_base_id`) REFERENCES `b_knowledge_base`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `b_payment_order` ADD CONSTRAINT `b_payment_order_b_users_id_fkey` FOREIGN KEY (`b_users_id`) REFERENCES `b_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `b_payment_order` ADD CONSTRAINT `b_payment_order_b_article_id_fkey` FOREIGN KEY (`b_article_id`) REFERENCES `b_article`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `b_payment_order` ADD CONSTRAINT `b_payment_order_b_knowledge_base_id_fkey` FOREIGN KEY (`b_knowledge_base_id`) REFERENCES `b_knowledge_base`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
