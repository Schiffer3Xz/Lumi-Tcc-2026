#!/bin/sh
set -e

mkdir -p \
    /var/lib/lumi \
    storage/app/public \
    storage/app/private \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

touch /var/lib/lumi/database.sqlite

chown -R www-data:www-data \
    /var/lib/lumi \
    storage \
    bootstrap/cache

chmod -R ug+rwX \
    /var/lib/lumi \
    storage \
    bootstrap/cache

exec gosu www-data "$@"
