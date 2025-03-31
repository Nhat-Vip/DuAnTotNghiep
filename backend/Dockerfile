# Sử dụng PHP 8.2
FROM php:8.2-cli

# Cập nhật hệ thống và cài đặt Composer
RUN apt-get update && apt-get install -y unzip
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Cài đặt MySQLi extension
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Đặt thư mục làm việc
WORKDIR /var/www/html
COPY . /var/www/html

# Cài đặt thư viện PHP bằng Composer
RUN composer install --no-dev --optimize-autoloader --ignore-platform-reqs

# Expose cổng 10000
EXPOSE 10000

# Chạy server PHP
CMD ["php", "-S", "0.0.0.0:10000", "-t", "/var/www/html"]
