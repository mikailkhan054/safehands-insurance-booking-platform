# Use official PHP image with CLI
FROM php:8.2-cli

# Install system dependencies and PHP extensions Laravel needs
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpq-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql zip \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Generate application key placeholder (real key set via env var on Render)
RUN php artisan config:clear

# Expose the port Render will route traffic to
EXPOSE 10000

# Start Laravel's built-in server, binding to Render's dynamic $PORT
CMD php artisan migrate --force && php artisan serve --host 0.0.0.0 --port ${PORT:-10000}
