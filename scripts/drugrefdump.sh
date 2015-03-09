#!/bin/sh
#
DATE=`date +%Y%m%d_%H%M%S`
echo "Enter mysql admin password..."
mysqldump --compatible=ansi --skip-extended-insert --compact -u root -p --databases drugref > drugref-$DATE.sql
