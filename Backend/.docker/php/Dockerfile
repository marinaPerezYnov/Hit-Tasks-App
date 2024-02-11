ARG PHP_VERSION=8.0

FROM php:${PHP_VERSION}-fpm-alpine

RUN apk add --no-cache \
		acl \
		fcgi \
		file \
		gettext \
		git \
		gnu-libiconv \
    	ldb-dev \
    	curl-dev \
	;

# install gnu-libiconv and set LD_PRELOAD env to make iconv work fully on Alpine image.
# see https://github.com/docker-library/php/issues/240#issuecomment-763112749
ENV LD_PRELOAD /usr/lib/preloadable_libiconv.so
RUN docker-php-ext-install pdo_mysql

ARG APCU_VERSION=5.1.20
RUN set -eux; \
	apk add --no-cache --virtual .build-deps \
		$PHPIZE_DEPS \
		icu-dev \
		libzip-dev \
		zlib-dev \
    	libldap \
		openldap-dev \
		php-ldap \
	; \
	\
	docker-php-ext-configure zip; \
	docker-php-ext-install -j$(nproc) \
		intl \
        pdo \
		pdo_mysql \
		zip \
    	curl \
		ldap \
	; \
	pecl install \
		apcu-${APCU_VERSION} \
	; \
	pecl clear-cache; \
	docker-php-ext-enable \
		apcu \
		opcache \
	; \
	\
	runDeps="$( \
		scanelf --needed --nobanner --format '%n#p' --recursive /usr/local/lib/php/extensions \
			| tr ',' '\n' \
			| sort -u \
			| awk 'system("[ -e /usr/local/lib/" $1 " ]") == 0 { next } { print "so:" $1 }' \
	)"; \
	apk add --no-cache --virtual .api-phpexts-rundeps $runDeps; \
	\
	apk del .build-deps
COPY ./apiFolder/bin/console /app/bin/console
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# https://getcomposer.org/doc/03-cli.md#composer-allow-superuser
# ENV COMPOSER_ALLOW_SUPERUSER=1
ENV PATH="${PATH}:/root/.composer/vendor/bin"


# prevent the reinstallation of vendors at every changes in the source code
# COPY composer.json composer.lock ./
# RUN set -eux; \
# 	composer install --prefer-dist --no-dev --no-scripts --no-progress; \
# 	composer clear-cache
# COPY ./php.ini /usr/local/etc/php/
COPY ./.docker/php/php.ini /usr/local/etc/php/

EXPOSE 9000
CMD ["php-fpm"]

