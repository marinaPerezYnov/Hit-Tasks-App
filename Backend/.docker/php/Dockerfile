# Utilisation de l'image officielle PHP avec la version spécifiée
ARG PHP_VERSION=8.2.3
FROM php:${PHP_VERSION}-fpm

# Version Dockerize
ENV DOCKERIZE_VERSION v0.7.0

# Installation des dépendances
RUN apt-get update && apt-get install --no-install-recommends -y \
    acl \
    wget \
    git \
    vim \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Installation de Dockerize
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Installation de install-php-extensions
RUN curl -sSLf -o /usr/local/bin/install-php-extensions https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions \
    && chmod +x /usr/local/bin/install-php-extensions

# Installation des extensions PHP nécessaires
RUN install-php-extensions opcache apcu intl pdo_mysql http

# Installation de Composer
# ENV COMPOSER_ALLOW_SUPERUSER=1
# RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    # && composer clear-cache

# Création d'un utilisateur non-root pour le développement
RUN groupadd dev -g 999 \
    && useradd dev -g dev -d /home/dev -m

# Définition de l'utilisateur par défaut
USER dev

# Répertoire de travail
WORKDIR /var/www/html

# Commande par défaut
CMD ["php-fpm"]