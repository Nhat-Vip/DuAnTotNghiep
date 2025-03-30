# Sử dụng image PHP chính thức làm base image
FROM php:7.4-cli

# Cài đặt các extension cần thiết
RUN apt-get update && apt-get install -y libxml2-dev libpng-dev libjpeg-dev libfreetype6-dev && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install gd xml

# Cài đặt Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Chép mã nguồn vào container
COPY . /var/www/html/

# Thiết lập thư mục làm việc
WORKDIR /var/www/html

# Chạy Composer để cài đặt các phụ thuộc PHP
RUN composer install

# Mở cổng 8000
EXPOSE 8000

# Chạy PHP built-in server
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
