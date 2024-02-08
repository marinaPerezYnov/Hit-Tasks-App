ARG PHP_VERSION=8.2.3
FROM php:${PHP_VERSION}-fpm

ENV DOCKERIZE_VERSION v0.7.0

# xdebug
RUN pecl install xdebug-3.2.2 && docker-php-ext-enable xdebug
RUN echo 'xdebug.mode=coverage' >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

# Install requirements for standard builds.
RUN apt-get update && apt-get install --no-install-recommends -y \
    	acl \
        wget \
        git \
        vim \
        zip \
        unzip

# Install Dockerize
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Install install-php-extensions to install PHP extension very easily (see https://github.com/mlocati/docker-php-extension-installer).
RUN curl -sSLf -o /usr/local/bin/install-php-extensions https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions && chmod +x /usr/local/bin/install-php-extensions

# Install PHP extensions needed by project using install-php-extensions to avoid problem with `apt get` (missing libraries and so on).
# Be warare that `zip` is not a project requierement, it is a composer requierement to allow it to retrieve some depedencies.
RUN install-php-extensions opcache apcu intl pdo_mysql http

# Composer
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN curl -sS https://getcomposer.org/installer | php -- --check
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
# RUN composer diagnose
RUN composer clear-cache

RUN groupadd dev -g 999
RUN useradd dev -g dev -d /home/dev -m
