# Dockerfile for the PDC's DCLAPI service
#
# Base image
#
FROM phusion/passenger-nodejs


# Update system
#
ENV DEBIAN_FRONTEND noninteractive
RUN echo 'Dpkg::Options{ "--force-confdef"; "--force-confold" }' \
      >> /etc/apt/apt.conf.d/local
RUN apt-get update; \
    apt-get upgrade -y


# Create startup script and make it executable
#
RUN mkdir -p /etc/service/app/
RUN ( \
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
      >> /etc/service/app/run
RUN chmod +x /etc/service/app/run


# Prepare /app/ folder
#
WORKDIR /app/
COPY . .
RUN npm install
RUN chown -R app:app /app/


# Run Command
#
CMD ["/sbin/my_init"]
