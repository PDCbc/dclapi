# Dockerfile for the PDC's DCLAPI service
#
#
# Drug Class Lookup API used by the PDC's Hub API (HAPI).
#
# Example:
# sudo docker pull pdcbc/dclapi
# sudo docker run -d --name=dclapi -h dclapi --restart=always pdcbc/dclapi
#
# External port (for testing)
# - DCLAPI: -p <hostPort>:3007
#
# Releases
# - https://github.com/PDCbc/dclapi/releases
#
#
FROM phusion/passenger-nodejs
MAINTAINER derek.roberts@gmail.com
ENV RELEASE 0.1.2


# Packages
#
RUN apt-get update; \
    apt-get install \
      git; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*


# Prepare /app/ folder
#
WORKDIR /app/
RUN git clone https://github.com/pdcbc/dclapi.git -b ${RELEASE} .; \
    npm install; \
    chown -R app:app /app/


# Create startup script and make it executable
#
RUN mkdir -p /etc/service/app/; \
    ( \
      echo "#!/bin/bash"; \
      echo "#"; \
      echo "set -e -o nounset"; \
      echo ""; \
      echo ""; \
      echo "# Start service"; \
      echo "#"; \
      echo "cd /app/"; \
      echo "/sbin/setuser app npm start"; \
    )  \
      >> /etc/service/app/run; \
    chmod +x /etc/service/app/run


# Run Command
#
CMD ["/sbin/my_init"]
